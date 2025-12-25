import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Edit, Trash2, MoreHorizontal } from 'lucide-react';
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
import { useDebounce } from '@/hooks/useDebounce';
import type { Product, Category } from '@/types';
import type { ProductFormData } from '@/schemas/productSchema';

// Mock data - TODO: Replace with SWR hooks
const mockProducts: Product[] = [
  { id: '1', name: 'Laptop Pro', sku: 'LAP-001', price: 999.99, quantity: 25, categoryId: '1', createdAt: '', updatedAt: '' },
  { id: '2', name: 'Wireless Keyboard', sku: 'KEY-001', price: 79.99, quantity: 50, categoryId: '2', createdAt: '', updatedAt: '' },
  { id: '3', name: 'Gaming Mouse', sku: 'MOU-001', price: 29.99, quantity: 5, categoryId: '2', createdAt: '', updatedAt: '' },
  { id: '4', name: '4K Monitor', sku: 'MON-001', price: 299.99, quantity: 15, categoryId: '1', createdAt: '', updatedAt: '' },
];

const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', createdAt: '', updatedAt: '' },
  { id: '2', name: 'Accessories', createdAt: '', updatedAt: '' },
];

export function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);

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
      accessorKey: 'categoryId',
      header: 'Category',
      cell: ({ row }) => {
        const category = mockCategories.find(c => c.id === row.getValue('categoryId'));
        return <Badge variant="secondary">{category?.name || 'N/A'}</Badge>;
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
    setIsLoading(true);
    try {
      // TODO: Call API via productApi.create or productApi.update
      console.log('Submitting:', data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    setIsLoading(true);
    try {
      // TODO: Call API via productApi.delete
      console.log('Deleting:', selectedProduct.id);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API
      setIsDeleteOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

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
            <CardTitle>All Products</CardTitle>
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search products..."
              className="w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={mockProducts} searchValue={debouncedSearch} />
        </CardContent>
      </Card>

      <ProductForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        product={selectedProduct}
        categories={mockCategories}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
      />

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Product"
        description={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}

export default ProductsPage;
