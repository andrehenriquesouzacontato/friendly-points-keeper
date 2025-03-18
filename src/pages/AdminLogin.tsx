
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, ShieldIcon, KeyIcon } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  
  const { login } = useApp();
  const navigate = useNavigate();
  
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (login(adminUsername, adminPassword, 'admin')) {
      toast.success('Login administrativo realizado com sucesso!');
      navigate('/admin');
    } else {
      toast.error('Usuário ou senha administrativos incorretos');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-loyalty-pink via-loyalty-white to-loyalty-green flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-loyalty-pink">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Área Administrativa</CardTitle>
          <CardDescription>Acesso restrito a administradores do sistema</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4 mt-2">
            <div className="flex items-center justify-center mb-4">
              <ShieldIcon className="text-loyalty-pink mr-2" size={24} />
              <h2 className="text-xl font-semibold">Acesso Administrativo</h2>
            </div>
            
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-username">Usuário</Label>
                <Input
                  id="admin-username"
                  placeholder="Digite o usuário administrador"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-password">Senha</Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={mostrarSenha ? "text" : "password"}
                    placeholder="Digite a senha"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                  >
                    {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-loyalty-pink hover:bg-pink-300 text-pink-900">
                <KeyIcon className="mr-2 h-4 w-4" />
                Entrar como Administrador
              </Button>
            </form>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2">
          <div className="w-full flex justify-center mt-2">
            <Link 
              to="/" 
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Voltar para a área de clientes
            </Link>
          </div>
          <p className="text-xs text-center text-gray-500">
            Sistema de Fidelidade por Pontos - Versão 1.0
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
