
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApi } from '../context/ApiContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Eye, EyeOff, ShieldIcon } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [storeCode, setStoreCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('admin');
  
  const { loginAdmin, loginAdminLoja, isLoading } = useApi();
  const navigate = useNavigate();
  
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Preencha todos os campos');
      return;
    }
    
    try {
      let success;
      
      if (activeTab === 'admin') {
        success = await loginAdmin(username, password);
      } else {
        if (!storeCode) {
          toast.error('Informe o código da loja');
          return;
        }
        success = await loginAdminLoja(username, password, storeCode);
      }
      
      if (success) {
        navigate('/admin');
      }
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-loyalty-pink via-loyalty-white to-loyalty-green flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Área Administrativa</CardTitle>
          <CardDescription>Acesse o painel de controle</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="admin" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="admin">Admin Central</TabsTrigger>
              <TabsTrigger value="loja">Admin Loja</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="flex items-center justify-center mb-4">
                <ShieldIcon className="text-loyalty-pink mr-2" size={24} />
                <h2 className="text-xl font-semibold">
                  {activeTab === 'admin' ? 'Administrador Central' : 'Administrador de Loja'}
                </h2>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Nome de Usuário</Label>
                <Input
                  id="username"
                  placeholder="Digite seu nome de usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              
              {activeTab === 'loja' && (
                <div className="space-y-2">
                  <Label htmlFor="store-code">Código da Loja</Label>
                  <Input
                    id="store-code"
                    placeholder="Digite o código da loja"
                    value={storeCode}
                    onChange={(e) => setStoreCode(e.target.value)}
                    required={activeTab === 'loja'}
                  />
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-loyalty-pink hover:bg-pink-300 text-pink-900"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Acessar Painel'}
              </Button>
            </form>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2">
          <div className="w-full flex justify-center mt-2">
            <Link to="/" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
              Área de Clientes
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
