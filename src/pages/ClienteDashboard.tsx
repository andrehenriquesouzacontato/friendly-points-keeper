
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, ShoppingBag, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const ClienteDashboard: React.FC = () => {
  const { user, clientes, compras } = useApp();
  const navigate = useNavigate();
  
  // Redirecionar se não estiver logado como cliente
  React.useEffect(() => {
    if (!user || user.tipo !== 'cliente') {
      navigate('/');
    }
  }, [user, navigate]);
  
  // Encontrar o cliente logado
  const cliente = clientes.find(c => c.id === user?.clienteId);
  
  // Filtrar compras do cliente
  const comprasCliente = compras
    .filter(compra => compra.clienteId === user?.clienteId)
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  
  if (!cliente) {
    return <div>Carregando...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-6">Olá, {cliente.nome}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-loyalty-pink to-white shadow-md md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Seus Pontos de Fidelidade</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-10 w-10 text-pink-600" />
                </div>
                <h3 className="text-4xl font-bold text-pink-900">{cliente.pontos}</h3>
                <p className="text-gray-600 mt-2">pontos acumulados</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Suas Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Nome</p>
                <p>{cliente.nome}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">CPF</p>
                <p>{cliente.cpf}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">E-mail</p>
                <p>{cliente.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Telefone</p>
                <p>{cliente.telefone}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <h3 className="text-xl font-semibold mb-4">Histórico de Compras</h3>
        <Card>
          <CardContent className="py-6">
            {comprasCliente.length > 0 ? (
              <div className="space-y-4">
                {comprasCliente.map((compra) => (
                  <div key={compra.id} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="bg-loyalty-green p-2 rounded-full">
                        <ShoppingBag className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Compra</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{format(new Date(compra.data), 'dd/MM/yyyy')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">R$ {compra.valor.toFixed(2)}</p>
                      <p className="text-sm text-green-600 font-medium">+{compra.pontosGanhos} pontos</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>Você ainda não possui compras registradas</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ClienteDashboard;
