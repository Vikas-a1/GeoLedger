import { Link, useLocation } from 'react-router-dom';
import { Home, Search, FileText, Bell, User, Map, Shield } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Search, label: 'Property Search', path: '/search' },
  { icon: FileText, label: 'Register Property', path: '/register' },
  { icon: Map, label: 'GIS Map', path: '/map' },
  { icon: Shield, label: 'Verify Documents', path: '/verify' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0F172A] text-white flex flex-col">
      <div className="p-6 border-b border-[#334155]">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0F766E] rounded-lg flex items-center justify-center">
            <Map className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-semibold">GeoLedger</h1>
            <p className="text-xs text-[#64748B]">Land Registry</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#0F766E] text-white'
                  : 'text-[#E2E8F0] hover:bg-[#334155]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
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
