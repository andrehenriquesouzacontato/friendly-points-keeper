
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { validarCPF, formatarCPF } from '@/lib/utils';

const CadastroCliente: React.FC = () => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [cpfValido, setCpfValido] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const { addCliente, user } = useApp();
  const navigate = useNavigate();
  
  // Redirecionar se não estiver logado como admin
  React.useEffect(() => {
    if (!user || user.tipo !== 'admin') {
      navigate('/admin-login');
    }
  }, [user, navigate]);
  
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputCpf = e.target.value;
    const formattedCpf = formatarCPF(inputCpf);
    setCpf(formattedCpf);
    
    // Somente valida se o CPF tiver 11 dígitos (sem formatação)
    if (inputCpf.replace(/[^\d]/g, '').length === 11) {
      setCpfValido(validarCPF(inputCpf));
    } else {
      setCpfValido(true); // Não mostra erro enquanto o usuário está digitando
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verifica se o CPF é válido
    if (!validarCPF(cpf)) {
      toast.error('CPF inválido. Verifique o número informado.');
      setCpfValido(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Adicionar cliente ao contexto (armazenamento local)
      addCliente({
        nome,
        cpf: cpf.replace(/[^\d]/g, ''), // Envia apenas os números
        email,
        telefone,
        senha
      });
      
      toast.success('Cliente cadastrado com sucesso!');
      
      // Limpar o formulário
      setNome('');
      setCpf('');
      setEmail('');
      setTelefone('');
      setSenha('');
      setCpfValido(true);
      
      // Voltar para o dashboard
      navigate('/admin');
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      if (error instanceof Error) {
        toast.error(error.message || 'Erro ao cadastrar cliente');
      } else {
        toast.error('Erro ao cadastrar cliente');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            className="mr-2" 
            onClick={() => navigate('/admin')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
          <h2 className="text-2xl font-bold">Cadastrar Novo Cliente</h2>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Formulário de Cadastro</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo <span className="text-red-500">*</span></Label>
                <Input
                  id="nome"
                  placeholder="Nome do cliente"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF <span className="text-red-500">*</span></Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={handleCpfChange}
                  className={!cpfValido ? "border-red-500" : ""}
                  required
                />
                {!cpfValido && (
                  <p className="text-red-500 text-sm mt-1">CPF inválido. Verifique o número informado.</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone <span className="text-red-500">*</span></Label>
                <Input
                  id="telefone"
                  placeholder="(00) 00000-0000"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="senha">Senha (opcional)</Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="Senha para acesso do cliente"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Se não definir uma senha, o cliente precisará definir uma no primeiro acesso.
                </p>
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-loyalty-pink hover:bg-pink-300 text-pink-900"
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Cadastrando...' : 'Cadastrar Cliente'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CadastroCliente;
