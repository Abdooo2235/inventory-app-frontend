import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Edit, Trash2, MoreHorizontal, Loader2 } from 'lucide-react';
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
import { ProductForm } from '@/components/products/ProductForm';
import { toast } from '@/components/ui/sonner';
import { useDebounce } from '@/hooks/useDebounce';
import { useProducts, productApi } from '@/api/hooks/useProducts';
import { useCategories } from '@/api/hooks/useCategories';
import { useSuppliers } from '@/api/hooks/useSuppliers';
import type { Product } from '@/types';
import type { ProductFormData } from '@/schemas/productSchema';

export function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Fetch real data from API
  const { products, isLoading: productsLoading, mutate: mutateProducts } = useProducts({ search: debouncedSearch });
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { suppliers, isLoading: suppliersLoading } = useSuppliers();

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
    },
    {
      accessorKey: 'sku',
      header: 'SKU',
      cell: ({ row }) => <span className="text-muted-foreground">{row.getValue('sku')}</span>,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => {
        const product = row.original;
        // Handle both category object and categoryId
        const categoryName = product.category?.name ||
          categories.find(c => c.id === product.categoryId)?.name ||
          'N/A';
        return <Badge variant="secondary">{categoryName}</Badge>;
      },
    },
    {
      accessorKey: 'supplier',
      header: 'Supplier',
      cell: ({ row }) => {
        const product = row.original;
        const supplierName = product.supplier?.name ||
          suppliers.find(s => s.id === product.supplierId)?.name ||
          '-';
        return <span className="text-sm text-muted-foreground">{supplierName}</span>;
      },
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => `$${(row.getValue('price') as number).toFixed(2)}`,
    },
    {
      accessorKey: 'quantity',
      header: 'Stock',
      cell: ({ row }) => {
        const qty = row.getValue('quantity') as number;
        return (
          <Badge variant={qty < 10 ? 'destructive' : 'default'}>
            {qty}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const product = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(product)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handleDeleteClick(product)}
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
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      if (selectedProduct) {
        await productApi.update(selectedProduct.id, data);
        toast.success('Product updated successfully!');
      } else {
        await productApi.create(data);
        toast.success('Product created successfully!');
      }
      mutateProducts();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    setIsSubmitting(true);
    try {
      await productApi.delete(selectedProduct.id);
      toast.success(`"${selectedProduct.name}" deleted successfully!`);
      mutateProducts();
      setIsDeleteOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (productsLoading || categoriesLoading || suppliersLoading) {
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
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Products ({products.length})</CardTitle>
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search products..."
              className="w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={products} searchValue={debouncedSearch} />
        </CardContent>
      </Card>

      <ProductForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        product={selectedProduct}
        categories={categories}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
      />

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Product"
        description={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isSubmitting}
      />
    </div>
  );
}

export default ProductsPage;
