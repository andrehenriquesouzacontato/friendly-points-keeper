
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

const Login: React.FC = () => {
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  const [clienteCpf, setClienteCpf] = useState('');
  const [clienteSenha, setClienteSenha] = useState('');
  
  // Campos para cadastro de senha
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  // Estado para controlar a exibição do formulário de cadastro de senha
  const [mostrarCadastroSenha, setMostrarCadastroSenha] = useState(false);
  const [clienteSemSenha, setClienteSemSenha] = useState<string | null>(null);
  
  const { login, clientes, getClienteByCpf } = useApp();
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
    
    // Verificar se o cliente existe pelo CPF
    const cliente = getClienteByCpf(clienteCpf);
    
    if (!cliente) {
      toast.error('CPF não cadastrado');
      return;
    }
    
    // Verificar se o cliente já tem senha cadastrada
    if (!cliente.senha) {
      toast.info('Por favor, cadastre uma senha para acessar sua conta');
      setClienteSemSenha(cliente.id);
      setMostrarCadastroSenha(true);
      return;
    }
    
    // Tentar fazer login
    if (login(clienteCpf, clienteSenha, 'cliente')) {
      toast.success('Login realizado com sucesso!');
      navigate('/cliente');
    } else {
      toast.error('CPF ou senha incorretos');
    }
  };
  
  const handleCadastrarSenha = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (novaSenha !== confirmarSenha) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    if (novaSenha.length < 4) {
      toast.error('A senha deve ter pelo menos 4 caracteres');
      return;
    }
    
    // Atualizar a senha do cliente
    if (clienteSemSenha) {
      // Encontrar o cliente e atualizar
      const clientesAtualizados = clientes.map(cliente => 
        cliente.id === clienteSemSenha 
          ? { ...cliente, senha: novaSenha } 
          : cliente
      );
      
      // Atualizar o localStorage
      localStorage.setItem('clientes', JSON.stringify(clientesAtualizados));
      
      toast.success('Senha cadastrada com sucesso!');
      
      // Fazer login automaticamente
      if (login(clienteCpf, novaSenha, 'cliente')) {
        navigate('/cliente');
      } else {
        // Limpar o formulário e voltar para a tela de login
        setMostrarCadastroSenha(false);
        setClienteSemSenha(null);
        setNovaSenha('');
        setConfirmarSenha('');
      }
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
          {mostrarCadastroSenha ? (
            // Formulário de cadastro de senha
            <div className="space-y-4 mt-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">Cadastrar Senha</h3>
                <p className="text-sm text-gray-500">Você precisa cadastrar uma senha para acessar sua conta</p>
              </div>
              
              <form onSubmit={handleCadastrarSenha} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nova-senha">Nova Senha</Label>
                  <Input
                    id="nova-senha"
                    type="password"
                    placeholder="Digite sua nova senha"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmar-senha">Confirmar Senha</Label>
                  <Input
                    id="confirmar-senha"
                    type="password"
                    placeholder="Confirme sua nova senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setMostrarCadastroSenha(false);
                      setClienteSemSenha(null);
                    }}
                  >
                    Voltar
                  </Button>
                  <Button type="submit" className="flex-1 bg-loyalty-green hover:bg-green-300 text-green-900">
                    Cadastrar Senha
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            // Tabs de login normal
            <Tabs defaultValue="cliente" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cliente">Cliente</TabsTrigger>
                <TabsTrigger value="admin">Administrador</TabsTrigger>
              </TabsList>
              
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
            </Tabs>
          )}
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
