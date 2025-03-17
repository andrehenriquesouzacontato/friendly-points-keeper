
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Calendar, DollarSign, Award } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const ClienteDetalhe: React.FC = () => {
  const [valor, setValor] = useState('');
  
  const { clienteAtual, user, compras, registrarCompra } = useApp();
  const navigate = useNavigate();
  
  // Redirecionar se não estiver logado como admin ou não tiver cliente selecionado
  React.useEffect(() => {
    if (!user || user.tipo !== 'admin' || !clienteAtual) {
      navigate('/admin');
    }
  }, [user, clienteAtual, navigate]);
  
  // Filtrar compras do cliente
  const comprasCliente = compras.filter(compra => 
    compra.clienteId === clienteAtual?.id
  ).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  
  const handleRegistrarCompra = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clienteAtual) {
      toast.error('Cliente não selecionado');
      return;
    }
    
    const valorNumerico = parseFloat(valor);
    
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      toast.error('Informe um valor válido');
      return;
    }
    
    registrarCompra(clienteAtual.id, valorNumerico);
    toast.success(`Compra registrada! ${Math.floor(valorNumerico)} pontos adicionados.`);
    setValor('');
  };
  
  if (!clienteAtual) {
    return <div>Carregando...</div>;
  }
  
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
          <h2 className="text-2xl font-bold">Detalhes do Cliente</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{clienteAtual.nome}</CardTitle>
              <CardDescription>Cliente desde {format(new Date(clienteAtual.dataRegistro), 'dd/MM/yyyy')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">CPF</p>
                  <p>{clienteAtual.cpf}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">E-mail</p>
                  <p>{clienteAtual.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Telefone</p>
                  <p>{clienteAtual.telefone}</p>
                </div>
                <div className="pt-2">
                  <div className="flex items-center gap-2 bg-loyalty-green rounded-md p-3">
                    <Award className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total de Pontos</p>
                      <p className="text-xl font-bold text-green-700">{clienteAtual.pontos}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Registrar Nova Compra</CardTitle>
              <CardDescription>1 real = 1 ponto</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegistrarCompra} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor da Compra (R$)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="valor"
                      placeholder="0,00"
                      value={valor}
                      onChange={(e) => setValor(e.target.value)}
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                    />
                    <Button type="submit" className="bg-loyalty-pink hover:bg-pink-300 text-pink-900">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Registrar
                    </Button>
                  </div>
                </div>
              </form>
              
              <div className="mt-6">
                <h3 className="text-md font-semibold mb-3">Histórico de Compras</h3>
                {comprasCliente.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {comprasCliente.map((compra) => (
                      <div key={compra.id} className="flex justify-between p-3 bg-gray-50 rounded-md border border-gray-100">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{format(new Date(compra.data), 'dd/MM/yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-gray-600">R$ {compra.valor.toFixed(2)}</span>
                          <span className="text-green-600 font-medium">+{compra.pontosGanhos} pts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    Nenhuma compra registrada ainda
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ClienteDetalhe;
