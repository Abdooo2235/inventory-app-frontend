import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Edit, Trash2, MoreHorizontal, Loader2, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SearchInput, DataTable, ConfirmDialog } from '@/components/common';
import { SupplierForm } from '@/components/suppliers/SupplierForm';
import { toast } from '@/components/ui/sonner';
import { useDebounce } from '@/hooks/useDebounce';
import { useSuppliers, supplierApi } from '@/api/hooks/useSuppliers';
import type { Supplier } from '@/types';
import type { SupplierFormData } from '@/schemas/supplierSchema';

export function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Fetch suppliers from API
  const { suppliers, isLoading, mutate } = useSuppliers({ search: debouncedSearch });

  const columns: ColumnDef<Supplier>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{row.getValue('email')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => {
        const phone = row.getValue('phone') as string;
        return phone ? (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{phone}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: 'address',
      header: 'Address',
      cell: ({ row }) => {
        const address = row.getValue('address') as string;
        return address ? (
          <div className="flex items-center gap-2 max-w-[200px]">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm truncate">{address}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: 'productsCount',
      header: 'Products',
      cell: ({ row }) => {
        const count = row.original.productsCount || 0;
        return (
          <Badge variant="secondary">
            {count} {count === 1 ? 'product' : 'products'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const supplier = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(supplier)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handleDeleteClick(supplier)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleAdd = () => {
    setSelectedSupplier(null);
    setIsFormOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: SupplierFormData) => {
    setIsSubmitting(true);
    try {
      if (selectedSupplier) {
        await supplierApi.update(selectedSupplier.id, data);
        toast.success('Supplier updated successfully!');
      } else {
        await supplierApi.create(data);
        toast.success('Supplier created successfully!');
      }
      mutate();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to save supplier:', error);
      toast.error('Failed to save supplier');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSupplier) return;
    setIsSubmitting(true);
    try {
      await supplierApi.delete(selectedSupplier.id);
      toast.success(`"${selectedSupplier.name}" deleted successfully!`);
      mutate();
      setIsDeleteOpen(false);
      setSelectedSupplier(null);
    } catch (error) {
      console.error('Failed to delete supplier:', error);
      toast.error('Failed to delete supplier');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <p className="text-muted-foreground">Manage your product suppliers</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Suppliers ({suppliers.length})</CardTitle>
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search suppliers..."
              className="w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={suppliers} searchValue={debouncedSearch} />
        </CardContent>
      </Card>

      <SupplierForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        supplier={selectedSupplier}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
      />

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Supplier"
        description={`Are you sure you want to delete "${selectedSupplier?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isSubmitting}
      />
    </div>
  );
}

export default SuppliersPage;
