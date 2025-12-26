import { useState } from 'react';
import { Search, ShoppingCart, Package, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { useDebounce } from '@/hooks/useDebounce';
import { useProducts } from '@/api/hooks/useProducts';
import { useCategories } from '@/api/hooks/useCategories';
import { orderApi } from '@/api/hooks/useOrders';
import { OrderRequestDialog } from '@/components/orders/OrderRequestDialog';
import type { Product } from '@/types';

export function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Fetch real data from API
  const { products, isLoading: productsLoading, mutate: mutateProducts } = useProducts({ search: debouncedSearch });
  const { categories, isLoading: categoriesLoading } = useCategories();

  const isLoading = productsLoading || categoriesLoading;

  // Filter products by category (search is handled by API)
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => {
      const categoryName = product.category?.name ||
        categories.find(c => c.id === product.categoryId)?.name;
      return categoryName === selectedCategory;
    });

  const handleOpenOrderDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleOrderSubmit = async (productId: string, quantity: number, notes?: string) => {
    const product = products.find(p => p.id === productId);
    try {
      await orderApi.create({
        items: [{ productId, quantity }],
        notes: notes || undefined,
      });
      // Show success toast
      toast.success('Order placed successfully!', {
        description: `Ordered ${quantity}x ${product?.name || 'product'}`,
      });
      // Refresh products to update stock numbers
      mutateProducts();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to place order');
      throw error; // Re-throw to let dialog know it failed
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Build category list for filter
  const categoryOptions = ['All', ...categories.map(c => c.name)];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-muted-foreground">Browse and request products</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => {
          const inStock = product.quantity > 0;
          const lowStock = product.quantity > 0 && product.quantity < 10;
          const categoryName = product.category?.name ||
            categories.find(c => c.id === product.categoryId)?.name ||
            'Uncategorized';

          return (
            <Card key={product.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{product.sku}</p>
                  </div>
                  <Badge variant="secondary">{categoryName}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">{product.description || 'No description available'}</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
                  <Badge
                    variant={!inStock ? 'destructive' : lowStock ? 'secondary' : 'default'}
                  >
                    {!inStock ? 'Out of Stock' : lowStock ? `Low: ${product.quantity}` : `In Stock: ${product.quantity}`}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  disabled={!inStock}
                  onClick={() => handleOpenOrderDialog(product)}
                >
                  {inStock ? (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Request Order
                    </>
                  ) : (
                    <>
                      <Package className="mr-2 h-4 w-4" />
                      Unavailable
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-lg font-medium">No products found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filter</p>
        </div>
      )}

      {/* Order Request Dialog */}
      <OrderRequestDialog
        product={selectedProduct}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleOrderSubmit}
      />
    </div>
  );
}

export default ProductsPage;
