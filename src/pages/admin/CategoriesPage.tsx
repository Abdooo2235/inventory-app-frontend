import { useState } from 'react';
import { Plus, Edit, Trash2, FolderTree, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchInput, ConfirmDialog, EmptyState } from '@/components/common';
import { CategoryForm } from '@/components/categories/CategoryForm';
import { toast } from '@/components/ui/sonner';
import { useDebounce } from '@/hooks/useDebounce';
import { useCategories, categoryApi } from '@/api/hooks/useCategories';
import type { Category } from '@/types';
import type { CategoryFormData } from '@/schemas/categorySchema';

export function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Fetch real data from API
  const { categories, isLoading, mutate: mutateCategories } = useCategories();

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      if (selectedCategory) {
        await categoryApi.update(selectedCategory.id, data);
        toast.success('Category updated successfully!');
      } else {
        await categoryApi.create(data);
        toast.success('Category created successfully!');
      }
      mutateCategories();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to save category:', error);
      toast.error('Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    setIsSubmitting(true);
    try {
      await categoryApi.delete(selectedCategory.id);
      toast.success(`"${selectedCategory.name}" deleted successfully!`);
      mutateCategories();
      setIsDeleteOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error('Failed to delete category');
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
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Organize your products into categories</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search categories..."
        className="max-w-sm"
      />

      {filteredCategories.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => (
            <Card key={category.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  {category.productsCount !== undefined && (
                    <Badge variant="secondary">{category.productsCount} products</Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(category)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {category.description || 'No description'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<FolderTree className="h-12 w-12" />}
          title="No categories found"
          description={searchTerm ? 'Try adjusting your search' : 'Get started by adding your first category'}
          action={
            !searchTerm && (
              <Button onClick={handleAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            )
          }
        />
      )}

      <CategoryForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        category={selectedCategory}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
      />

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Category"
        description={`Are you sure you want to delete "${selectedCategory?.name}"? Products in this category will need to be reassigned.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isSubmitting}
      />
    </div>
  );
}

export default CategoriesPage;
