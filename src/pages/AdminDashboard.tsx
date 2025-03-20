
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UserPlus, Search, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { formatarNumero } from '@/lib/utils';

const AdminDashboard: React.FC = () => {
  const { clientes, getClienteByCpf, setClienteAtual } = useApp();
  const [searchCpf, setSearchCpf] = useState('');
  const navigate = useNavigate();
  
  const handleSearch = () => {
    if (!searchCpf.trim()) {
      toast.error('Digite um CPF para buscar');
      return;
    }
    
    const cliente = getClienteByCpf(searchCpf);
    
    if (cliente) {
      setClienteAtual(cliente);
      navigate('/admin/cliente');
    } else {
      toast.error('Cliente não encontrado');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-6">Painel do Administrador</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Buscar Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input 
                  placeholder="Digite o CPF do cliente" 
                  value={searchCpf}
                  onChange={(e) => setSearchCpf(e.target.value)}
                />
                <Button onClick={handleSearch} className="bg-loyalty-pink text-pink-900 hover:bg-pink-300">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full bg-loyalty-green text-green-900 hover:bg-green-300 justify-start"
                onClick={() => navigate('/admin/cadastro')}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Cadastrar Novo Cliente
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <h3 className="text-xl font-semibold mb-4">Clientes Recentes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clientes.slice(0, 6).map((cliente) => (
            <Card key={cliente.id} className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setClienteAtual(cliente);
                    navigate('/admin/cliente');
                  }}>
              <CardContent className="p-4">
                <div className="font-medium">{cliente.nome}</div>
                <div className="text-sm text-gray-500">CPF: {cliente.cpf}</div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm bg-loyalty-green px-2 py-0.5 rounded text-green-900">
                    {formatarNumero(cliente.pontos)} pontos
                  </span>
                  <Button variant="ghost" size="sm" className="text-gray-600 p-0">
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
