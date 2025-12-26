import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Trash2, Users as UsersIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchInput, DataTable, ConfirmDialog, EmptyState } from '@/components/common';
import { UserForm } from '@/components/users/UserForm';
import { toast } from '@/components/ui/sonner';
import { useDebounce } from '@/hooks/useDebounce';
import { useUsers, userApi } from '@/api/hooks/useUsers';
import type { User } from '@/types';
import type { UserFormData } from '@/schemas/userSchema';

export function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Fetch real data from API
  const { users, isLoading, mutate: mutateUsers } = useUsers(debouncedSearch);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <span className="text-muted-foreground">{row.getValue('email')}</span>,
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        return (
          <Badge variant={role === 'admin' ? 'default' : 'secondary'}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as string;
        return (
          <span className="text-muted-foreground">
            {date ? new Date(date).toLocaleDateString() : 'N/A'}
          </span>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteClick(user)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        );
      },
    },
  ];

  const handleAdd = () => {
    setIsFormOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: UserFormData) => {
    setIsSubmitting(true);
    try {
      await userApi.create(data);
      toast.success('User created successfully!');
      mutateUsers();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to create user:', error);
      toast.error('Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      await userApi.delete(selectedUser.id);
      toast.success(`"${selectedUser.name}" deleted successfully!`);
      mutateUsers();
      setIsDeleteOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
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
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage system users</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Users ({users.length})</CardTitle>
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search users..."
              className="w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <DataTable columns={columns} data={users} searchValue={debouncedSearch} />
          ) : (
            <EmptyState
              icon={<UsersIcon className="h-12 w-12" />}
              title="No users yet"
              description="Add your first user to get started"
              action={
                <Button onClick={handleAdd}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>

      <UserForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
      />

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete User"
        description={`Are you sure you want to delete "${selectedUser?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isSubmitting}
      />
    </div>
  );
}

export default UsersPage;
