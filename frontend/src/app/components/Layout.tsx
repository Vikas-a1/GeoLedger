import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export function Layout({ children, showSidebar = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {showSidebar && (
        <>
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <MobileNav />
          </div>
        </>
      )}

      <main className={showSidebar ? "lg:pl-64 pb-20 lg:pb-0" : ""}>
        {children}
      </main>
    </div>
  );
}
