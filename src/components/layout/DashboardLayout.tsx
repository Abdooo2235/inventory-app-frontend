import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './sidebar/AdminSidebar';
import { UserSidebar } from './sidebar/UserSidebar';

interface DashboardLayoutProps {
  role: 'admin' | 'user';
}

export function DashboardLayout({ role }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      {role === 'admin' ? <AdminSidebar /> : <UserSidebar />}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
