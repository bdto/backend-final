import { useAuth } from '../hooks/useAuth';
import { LogOut, User, Menu } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Navbar({ onMenuToggle }) {
  const { user, logout, isAdmin } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Right side - User menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 p-1.5 pr-3 rounded-lg hover:bg-slate-50 transition-colors"
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
        >
          <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center">
            <User className="h-4 w-4 text-brand-700" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-slate-900">{user?.username}</p>
            <p className="text-xs text-slate-500">{isAdmin ? 'Administrador' : 'Usuario'}</p>
          </div>
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-50">
            <div className="px-3 py-2 border-b border-slate-100 sm:hidden">
              <p className="text-sm font-medium text-slate-900">{user?.username}</p>
              <p className="text-xs text-slate-500">{isAdmin ? 'Administrador' : 'Usuario'}</p>
            </div>
            <button
              onClick={() => {
                setDropdownOpen(false);
                logout();
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesion
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
