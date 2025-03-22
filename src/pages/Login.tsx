
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, UserIcon, Lock, KeyRound, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CpfInput } from '@/components/CpfInput';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

  // Estado para esqueci minha senha
  const [modoEsqueciSenha, setModoEsqueciSenha] = useState(false);
  const [cpfRecuperacao, setCpfRecuperacao] = useState('');
  const [dialogRecuperacaoAberto, setDialogRecuperacaoAberto] = useState(false);
  
  const { login, getClienteByCpf, clientes } = useApp();
  const navigate = useNavigate();
  
  const verificarClienteExistente = (cpf: string) => {
    if (!cpf) {
      toast.error('Digite o CPF para continuar');
      return null;
    }
    
    // Verifica se o cliente existe pelo CPF
    const cliente = getClienteByCpf(cpf);
    
    if (!cliente) {
      toast.error('CPF não cadastrado. Entre em contato com o administrador.');
      return null;
    }
    
    return cliente;
  };
  
  const handleVerificarCliente = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cliente = verificarClienteExistente(clienteCpf);
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
    
    try {
      const success = await login(clienteCpf, clienteSenha, 'cliente');
      
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

  const handleRecuperarSenha = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cliente = verificarClienteExistente(cpfRecuperacao);
    if (!cliente) return;
    
    // Se o cliente existe, mostrar dialog para criar nova senha
    setClienteEncontrado(cliente);
    setDialogRecuperacaoAberto(true);
  };

  const handleResetarSenha = (e: React.FormEvent) => {
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
    
    toast.success('Senha redefinida com sucesso! Faça login com sua nova senha.');
    setDialogRecuperacaoAberto(false);
    setModoEsqueciSenha(false);
    setCpfRecuperacao('');
    setNovaSenha('');
    setConfirmarSenha('');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-loyalty-pink via-loyalty-white to-loyalty-green flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Sistema de Fidelidade</CardTitle>
          <CardDescription>Acesse sua conta para gerenciar pontos</CardDescription>
        </CardHeader>
        
        <CardContent>
          {!modoCriarSenha && !modoEsqueciSenha ? (
            // Modo Login
            <div className="space-y-4 mt-2">
              <div className="flex items-center justify-center mb-4">
                <UserIcon className="text-loyalty-green mr-2" size={24} />
                <h2 className="text-xl font-semibold">Acesso do Cliente</h2>
              </div>
              
              <form onSubmit={clienteSenha ? handleClienteLogin : handleVerificarCliente} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente-cpf">CPF</Label>
                  <CpfInput
                    id="cliente-cpf"
                    value={clienteCpf}
                    onChange={(value) => setClienteCpf(value)}
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
                
                <div className="flex flex-col gap-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-loyalty-green hover:bg-green-300 text-green-900"
                  >
                    {clienteSenha ? "Entrar como Cliente" : "Continuar"}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-dashed border-loyalty-green text-loyalty-green"
                    onClick={() => {
                      setClienteCpf('');
                      setClienteSenha('');
                      handleVerificarCliente({ preventDefault: () => {} } as React.FormEvent);
                    }}
                  >
                    <Info className="mr-2 h-4 w-4" />
                    Primeiro acesso? Crie sua senha
                  </Button>
                </div>
              </form>
              
              <div className="flex items-center justify-between">
                <Button 
                  variant="link" 
                  className="text-xs text-gray-600 hover:text-gray-800 px-0"
                  onClick={() => {
                    setModoEsqueciSenha(true);
                    setModoCriarSenha(false);
                    setCpfRecuperacao('');
                  }}
                >
                  Esqueci minha senha
                </Button>
              </div>
              
              <Alert className="bg-gray-50 border-gray-200">
                <AlertTitle className="text-sm font-medium">Instruções para o primeiro acesso</AlertTitle>
                <AlertDescription className="text-sm">
                  Se este é seu primeiro acesso, digite seu CPF ou clique no botão "Primeiro acesso" para cadastrar sua senha.
                </AlertDescription>
              </Alert>
            </div>
          ) : modoEsqueciSenha ? (
            // Modo Esqueci Minha Senha
            <div className="space-y-4 mt-2">
              <div className="flex items-center justify-center mb-4">
                <KeyRound className="text-loyalty-green mr-2" size={24} />
                <h2 className="text-xl font-semibold">Recuperar Senha</h2>
              </div>
              
              <Alert className="mb-4">
                <AlertDescription>
                  Para recuperar sua senha, informe seu CPF cadastrado no sistema. Por segurança, seu CPF será validado antes de permitir a redefinição.
                </AlertDescription>
              </Alert>
              
              <form onSubmit={handleRecuperarSenha} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf-recuperacao">Digite seu CPF</Label>
                  <CpfInput
                    id="cpf-recuperacao"
                    value={cpfRecuperacao}
                    onChange={(value) => setCpfRecuperacao(value)}
                    required
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setModoEsqueciSenha(false);
                      setCpfRecuperacao('');
                    }}
                  >
                    Voltar
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-loyalty-green hover:bg-green-300 text-green-900"
                  >
                    Verificar CPF
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            // Modo Criar Senha (primeiro acesso)
            <div className="space-y-4 mt-2">
              <div className="flex items-center justify-center mb-4">
                <Lock className="text-loyalty-green mr-2" size={24} />
                <h2 className="text-xl font-semibold">Criar Senha</h2>
              </div>
              
              <Alert>
                <AlertDescription>
                  Bem-vindo ao seu primeiro acesso! Por favor, crie uma senha para acessar sua conta.
                </AlertDescription>
              </Alert>
              
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

      {/* Dialog para redefinição de senha */}
      <Dialog open={dialogRecuperacaoAberto} onOpenChange={setDialogRecuperacaoAberto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Redefinir Senha</DialogTitle>
            <DialogDescription>
              Digite sua nova senha para recuperar o acesso à sua conta.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetarSenha} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-nova-senha">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="reset-nova-senha"
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
              <Label htmlFor="reset-confirmar-senha">Confirmar Senha</Label>
              <Input
                id="reset-confirmar-senha"
                type={mostrarSenha ? "text" : "password"}
                placeholder="Confirme sua nova senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setDialogRecuperacaoAberto(false);
                  setNovaSenha('');
                  setConfirmarSenha('');
                }}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="bg-loyalty-green hover:bg-green-300 text-green-900"
              >
                Salvar Nova Senha
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
