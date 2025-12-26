import { NavLink, useNavigate } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const userMenuItems = [
  { icon: Package, label: 'Products', path: '/user/products' },
  { icon: ShoppingCart, label: 'Orders', path: '/user/orders' },
];

export function UserSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!isCollapsed && (
          <span className="text-lg font-semibold text-sidebar-foreground">
            Inventory
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {userMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
                'transition-all duration-150 ease-out active:scale-[0.97]',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )
            }
            onClick={() => setIsMobileOpen(false)}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-2">
        {/* Settings Link */}
        <NavLink
          to="/user/settings"
          onClick={() => setIsMobileOpen(false)}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
              'transition-all duration-150 ease-out active:scale-[0.97]',
              isActive
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            )
          }
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </NavLink>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
            'transition-all duration-150 ease-out active:scale-[0.97]',
            'text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground'
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>

        {/* User Info */}
        {!isCollapsed && user && (
          <NavLink
            to="/user/settings"
            onClick={() => setIsMobileOpen(false)}
            className="mt-2 block rounded-lg bg-sidebar-accent p-3 transition-all duration-150 ease-out hover:bg-sidebar-accent/80 active:scale-[0.98]"
          >
            <p className="text-sm font-medium text-sidebar-accent-foreground">
              {user.name}
            </p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </NavLink>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 transform bg-sidebar transition-transform lg:hidden',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden h-full border-r border-sidebar-border bg-sidebar transition-all lg:block',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
