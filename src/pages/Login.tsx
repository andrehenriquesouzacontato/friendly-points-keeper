
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  const [clienteCpf, setClienteCpf] = useState('');
  const [clienteSenha, setClienteSenha] = useState('');
  
  const { login } = useApp();
  const navigate = useNavigate();
  
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (login(adminUsername, adminPassword, 'admin')) {
      toast.success('Login realizado com sucesso!');
      navigate('/admin');
    } else {
      toast.error('Usuário ou senha incorretos');
    }
  };
  
  const handleClienteLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (login(clienteCpf, clienteSenha, 'cliente')) {
      toast.success('Login realizado com sucesso!');
      navigate('/cliente');
    } else {
      toast.error('CPF ou senha incorretos');
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
          <Tabs defaultValue="admin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="admin">Administrador</TabsTrigger>
              <TabsTrigger value="cliente">Cliente</TabsTrigger>
            </TabsList>
            
            <TabsContent value="admin">
              <form onSubmit={handleAdminLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-username">Usuário</Label>
                  <Input
                    id="admin-username"
                    placeholder="Digite seu usuário"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Senha</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Digite sua senha"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full bg-loyalty-pink hover:bg-pink-300 text-pink-900">
                  Entrar como Administrador
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="cliente">
              <form onSubmit={handleClienteLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente-cpf">CPF</Label>
                  <Input
                    id="cliente-cpf"
                    placeholder="Digite seu CPF"
                    value={clienteCpf}
                    onChange={(e) => setClienteCpf(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cliente-senha">Senha</Label>
                  <Input
                    id="cliente-senha"
                    type="password"
                    placeholder="Digite sua senha"
                    value={clienteSenha}
                    onChange={(e) => setClienteSenha(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full bg-loyalty-green hover:bg-green-300 text-green-900">
                  Entrar como Cliente
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="justify-center">
          <p className="text-xs text-center text-gray-500">
            Sistema de Fidelidade por Pontos - Versão 1.0
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
