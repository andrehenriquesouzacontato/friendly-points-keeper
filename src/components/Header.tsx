
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <header className="bg-white shadow-sm border-b py-3">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-green-500 bg-clip-text text-transparent">
            Sistema de Fidelidade
          </h1>
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {user.username} ({user.tipo === 'admin' ? 'Administrador' : 'Cliente'})
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
            >
              <LogOut size={16} />
              <span>Sair</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
