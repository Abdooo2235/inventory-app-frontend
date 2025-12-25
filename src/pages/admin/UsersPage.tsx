import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Trash2, Users as UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchInput, DataTable, ConfirmDialog, EmptyState } from '@/components/common';
import { UserForm } from '@/components/users/UserForm';
import { useDebounce } from '@/hooks/useDebounce';
import type { User } from '@/types';
import type { UserFormData } from '@/schemas/userSchema';

// Mock data - TODO: Replace with SWR hook
const mockUsers: User[] = [
  { id: '1', name: 'John Admin', email: 'admin@example.com', role: 'admin', createdAt: '2024-01-15', updatedAt: '' },
  { id: '2', name: 'Jane User', email: 'jane@example.com', role: 'user', createdAt: '2024-02-20', updatedAt: '' },
  { id: '3', name: 'Bob User', email: 'bob@example.com', role: 'user', createdAt: '2024-03-10', updatedAt: '' },
  { id: '4', name: 'Alice User', email: 'alice@example.com', role: 'user', createdAt: '2024-04-05', updatedAt: '' },
];

export function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);

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
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {new Date(row.getValue('createdAt')).toLocaleDateString()}
        </span>
      ),
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
    setIsLoading(true);
    try {
      // TODO: Call API via userApi.create
      console.log('Creating user:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setIsLoading(true);
    try {
      // TODO: Call API via userApi.delete
      console.log('Deleting:', selectedUser.id);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsDeleteOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

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
            <CardTitle>All Users</CardTitle>
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search users..."
              className="w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          {mockUsers.length > 0 ? (
            <DataTable columns={columns} data={mockUsers} searchValue={debouncedSearch} />
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
        isLoading={isLoading}
      />

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete User"
        description={`Are you sure you want to delete "${selectedUser?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}

export default UsersPage;
