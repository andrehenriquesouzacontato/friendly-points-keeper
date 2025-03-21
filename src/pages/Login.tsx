
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, UserIcon, Lock } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login: React.FC = () => {
  // Campos para login de cliente
  const [clienteCpf, setClienteCpf] = useState('');
  const [clienteSenha, setClienteSenha] = useState('');
  
  // Estado para mostrar/esconder senha
  const [mostrarSenha, setMostrarSenha] = useState(false);
  
  // Estado para o modo de criação de senha
  const [modoCriarSenha, setModoCriarSenha] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [clienteEncontrado, setClienteEncontrado] = useState<any>(null);
  
  const { login, getClienteByCpf, clientes } = useApp();
  const navigate = useNavigate();
  
  const verificarClienteExistente = () => {
    if (!clienteCpf) {
      toast.error('Digite o CPF para continuar');
      return null;
    }
    
    // Verifica se o CPF contém apenas números
    const cpfLimpo = clienteCpf.replace(/\D/g, '');
    
    // Verifica se o cliente existe pelo CPF
    const cliente = getClienteByCpf(cpfLimpo);
    
    if (!cliente) {
      toast.error('CPF não cadastrado. Entre em contato com o administrador.');
      return null;
    }
    
    return cliente;
  };
  
  const handleVerificarCliente = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cliente = verificarClienteExistente();
    if (!cliente) return;
    
    // Se o cliente existe mas não tem senha, mostrar modo de criar senha
    if (!cliente.senha) {
      setClienteEncontrado(cliente);
      setModoCriarSenha(true);
      toast.info('Primeiro acesso detectado! Por favor, crie uma senha.');
    } else {
      // Se já tem senha, continua com o login normal
      setModoCriarSenha(false);
    }
  };
  
  const handleCriarSenha = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (novaSenha.length < 4) {
      toast.error('A senha deve ter pelo menos 4 caracteres');
      return;
    }
    
    if (novaSenha !== confirmarSenha) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    if (!clienteEncontrado) {
      toast.error('Cliente não encontrado');
      return;
    }
    
    // Atualiza a senha do cliente
    const clientesAtualizados = clientes.map(c => {
      if (c.id === clienteEncontrado.id) {
        return { ...c, senha: novaSenha };
      }
      return c;
    });
    
    // Salva no localStorage
    localStorage.setItem('clientes', JSON.stringify(clientesAtualizados));
    
    // Faz login automático
    const success = login(clienteEncontrado.cpf, novaSenha, 'cliente');
    
    if (success) {
      toast.success('Senha criada com sucesso!');
      navigate('/cliente');
    } else {
      toast.error('Erro ao fazer login automático. Tente novamente.');
      setModoCriarSenha(false);
      setNovaSenha('');
      setConfirmarSenha('');
    }
  };
  
  const handleClienteLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clienteCpf || !clienteSenha) {
      toast.error('Preencha todos os campos');
      return;
    }
    
    // Verifica se o CPF contém apenas números
    const cpfLimpo = clienteCpf.replace(/\D/g, '');
    
    try {
      const success = await login(cpfLimpo, clienteSenha, 'cliente');
      
      if (success) {
        navigate('/cliente');
      } else {
        toast.error('CPF ou senha inválidos');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Ocorreu um erro ao tentar fazer login');
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
          {!modoCriarSenha ? (
            <div className="space-y-4 mt-2">
              <div className="flex items-center justify-center mb-4">
                <UserIcon className="text-loyalty-green mr-2" size={24} />
                <h2 className="text-xl font-semibold">Acesso do Cliente</h2>
              </div>
              
              <form onSubmit={clienteSenha ? handleClienteLogin : handleVerificarCliente} className="space-y-4">
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
                >
                  {clienteSenha ? "Entrar como Cliente" : "Continuar"}
                </Button>
              </form>
              
              <Alert className="bg-gray-50 border-gray-200">
                <AlertDescription className="text-sm">
                  Para o primeiro acesso, digite apenas seu CPF e clique em Continuar para cadastrar sua senha.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="space-y-4 mt-2">
              <div className="flex items-center justify-center mb-4">
                <Lock className="text-loyalty-green mr-2" size={24} />
                <h2 className="text-xl font-semibold">Criar Senha</h2>
              </div>
              
              <form onSubmit={handleCriarSenha} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nova-senha">Nova Senha</Label>
                  <div className="relative">
                    <Input
                      id="nova-senha"
                      type={mostrarSenha ? "text" : "password"}
                      placeholder="Digite sua nova senha"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
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
                  <Label htmlFor="confirmar-senha">Confirmar Senha</Label>
                  <Input
                    id="confirmar-senha"
                    type={mostrarSenha ? "text" : "password"}
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
                      setModoCriarSenha(false);
                      setNovaSenha('');
                      setConfirmarSenha('');
                    }}
                  >
                    Voltar
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-loyalty-green hover:bg-green-300 text-green-900"
                  >
                    Criar Senha
                  </Button>
                </div>
              </form>
            </div>
          )}
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
