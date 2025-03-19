
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, ShieldIcon, KeyIcon, Store } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AdminLogin: React.FC = () => {
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [storeCode, setStoreCode] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const { adminLoginWithStoreCode } = useApp();
  const navigate = useNavigate();
  
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    
    try {
      const loginSuccess = adminLoginWithStoreCode(adminUsername, adminPassword, storeCode);
      
      if (loginSuccess) {
        toast.success('Login administrativo realizado com sucesso!');
        navigate('/admin');
      } else {
        toast.error('Falha no login. Verifique as credenciais e o código da loja.');
        setLoginError('Acesso negado. Verifique se suas credenciais e o código da loja estão corretos.');
      }
    } catch (error) {
      toast.error('Ocorreu um erro durante o login.');
      setLoginError('Erro ao realizar login. Tente novamente.');
    } finally {
      setLoading(false);
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
            
            {loginError && (
              <Alert variant="destructive" className="mb-4">
                <KeyIcon className="h-4 w-4" />
                <AlertTitle>Erro de Autenticação</AlertTitle>
                <AlertDescription>
                  {loginError}
                </AlertDescription>
              </Alert>
            )}

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
              
              <div className="space-y-2">
                <Label htmlFor="store-code">Código da Loja</Label>
                <Input
                  id="store-code"
                  placeholder="Digite o código da loja"
                  value={storeCode}
                  onChange={(e) => setStoreCode(e.target.value)}
                  required
                />
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-loyalty-pink hover:bg-pink-300 text-pink-900"
                  disabled={loading}
                >
                  {loading ? (
                    <>Verificando credenciais...</>
                  ) : (
                    <>
                      <KeyIcon className="mr-2 h-4 w-4" />
                      Entrar como Administrador
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-center p-2 mt-4 bg-gray-50 rounded-md">
                <Store className="text-gray-500 mr-2" size={16} />
                <p className="text-xs text-gray-500">
                  O código da loja é fornecido apenas para funcionários autorizados
                </p>
              </div>
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
