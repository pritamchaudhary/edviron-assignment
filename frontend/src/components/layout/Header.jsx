import React from 'react';
import useAuth from '../../hooks/useAuth';
import Button from '../ui/Button';
import { LogOut } from 'lucide-react';

const Header = () => {
  const { logout } = useAuth();
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b-2 border-gray-200">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <Button onClick={logout} className="w-auto flex items-center gap-2">
        <LogOut size={16} />
        Logout
      </Button>
    </header>
  );
};

export default Header;