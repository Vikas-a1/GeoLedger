import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Building2,
  Search,
  FileText,
  ClipboardList,
  Shield,
  ArrowLeftRight,
  Map,
  Bell,
  User,
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Building2, label: 'My Properties', path: '/properties' },
  { icon: Search, label: 'Property Search', path: '/search' },
  { icon: FileText, label: 'Register Property', path: '/register' },
  { icon: ClipboardList, label: 'Applications', path: '/applications' },
  { icon: Shield, label: 'Verify Documents', path: '/verify' },
  { icon: ArrowLeftRight, label: 'Transactions', path: '/transactions' },
  { icon: Map, label: 'GIS Map', path: '/map' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function Sidebar() {
  const location = useLocation();

  const isItemActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    if (path === '/register') return location.pathname === '/register' || location.pathname === '/applications/new';
    if (path === '/properties') return location.pathname === '/properties' || (location.pathname.startsWith('/properties/') && location.pathname !== '/properties');
    if (path === '/applications') return location.pathname === '/applications' || (location.pathname.startsWith('/applications/') && location.pathname !== '/applications/new');
    return location.pathname === path;
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0F172A] text-white flex flex-col">
      <div className="p-6 border-b border-[#334155]">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0F766E] rounded-lg flex items-center justify-center">
            <Map className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-semibold">GeoLedger</h1>
            <p className="text-xs text-[#64748B]">Land Registry</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#0F766E] text-white'
                  : 'text-[#E2E8F0] hover:bg-[#334155]'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#334155]">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 bg-[#334155] rounded-full flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium">User Account</p>
            <p className="text-xs text-[#64748B]">0x7a3f...9b2c</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
