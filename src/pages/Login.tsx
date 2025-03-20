
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApi } from '../context/ApiContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, UserIcon, ShieldIcon } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login: React.FC = () => {
  // Campos para login de cliente
  const [clienteCpf, setClienteCpf] = useState('');
  const [clienteSenha, setClienteSenha] = useState('');
  
  // Estado para mostrar/esconder senha
  const [mostrarSenha, setMostrarSenha] = useState(false);
  
  const { loginCliente, isLoading } = useApi();
  const navigate = useNavigate();
  
  const handleClienteLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clienteCpf || !clienteSenha) {
      toast.error('Preencha todos os campos');
      return;
    }
    
    // Tentar fazer login usando a API
    const result = await loginCliente(clienteCpf, clienteSenha);
    
    if (result) {
      navigate('/cliente');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-loyalty-pink via-loyalty-white to-loyalty-green flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Sistema de Fidelidade</CardTitle>
          <CardDescription>Acesse sua conta para gerenciar pontos</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4 mt-2">
            <div className="flex items-center justify-center mb-4">
              <UserIcon className="text-loyalty-green mr-2" size={24} />
              <h2 className="text-xl font-semibold">Acesso do Cliente</h2>
            </div>
            
            <form onSubmit={handleClienteLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cliente-cpf">CPF</Label>
                <Input
                  id="cliente-cpf"
                  placeholder="Digite seu CPF (apenas números)"
                  value={clienteCpf}
                  onChange={(e) => setClienteCpf(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cliente-senha">Senha</Label>
                <div className="relative">
                  <Input
                    id="cliente-senha"
                    type={mostrarSenha ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={clienteSenha}
                    onChange={(e) => setClienteSenha(e.target.value)}
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
              
              <Button 
                type="submit" 
                className="w-full bg-loyalty-green hover:bg-green-300 text-green-900"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar como Cliente'}
              </Button>
            </form>
            
            <Alert className="bg-gray-50 border-gray-200">
              <AlertDescription className="text-sm">
                Se você for cliente cadastrado mas ainda não possui senha, entre em contato com o administrador.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2">
          <div className="w-full flex justify-center mt-2">
            <Link 
              to="/admin-login" 
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Área administrativa
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

export default Login;
