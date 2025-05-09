import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, DollarSign, Award, Gift, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const ClienteDetalhe: React.FC = () => {
  const [valor, setValor] = useState('');
  const [pontosResgatar, setPontosResgatar] = useState<number>(0);
  const [descricaoResgate, setDescricaoResgate] = useState('');
  const [mostrarResgate, setMostrarResgate] = useState(false);
  const [excluirDialogAberto, setExcluirDialogAberto] = useState(false);
  
  const { clienteAtual, user, compras, resgates, registrarCompra, resgatarPontos, excluirCliente } = useApp();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!user || user.tipo !== 'admin' || !clienteAtual) {
      navigate('/admin');
    }
  }, [user, clienteAtual, navigate]);
  
  const comprasCliente = compras.filter(compra => 
    compra.clienteId === clienteAtual?.id
  ).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  
  const resgatesCliente = resgates ? resgates.filter(resgate => 
    resgate.clienteId === clienteAtual?.id
  ).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()) : [];
  
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^\d.,]/g, '');
    let numericValue = inputValue.replace(/[.,]/g, '');
    
    if (!numericValue) {
      setValor('');
      return;
    }
    
    const number = parseInt(numericValue) / 100;
    const formattedValue = number.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    setValor(formattedValue);
  };
  
  const handlePontosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.replace(/[^\d]/g, '');
    const pontos = valor ? parseInt(valor) : 0;
    
    if (clienteAtual && pontos > clienteAtual.pontos) {
      setPontosResgatar(clienteAtual.pontos);
    } else {
      setPontosResgatar(pontos);
    }
  };
  
  const handleRegistrarCompra = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clienteAtual) {
      toast.error('Cliente não selecionado');
      return;
    }
    
    const valorNumerico = parseFloat(valor.replace(/\./g, '').replace(',', '.'));
    
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      toast.error('Informe um valor válido');
      return;
    }
    
    registrarCompra(clienteAtual.id, valorNumerico);
    toast.success(`Compra registrada! ${Math.floor(valorNumerico)} pontos adicionados.`);
    setValor('');
  };
  
  const handleResgatarPontos = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clienteAtual) {
      toast.error('Cliente não selecionado');
      return;
    }
    
    if (!pontosResgatar || pontosResgatar <= 0) {
      toast.error('Selecione a quantidade de pontos para resgatar');
      return;
    }
    
    if (!descricaoResgate.trim()) {
      toast.error('Informe uma descrição para o resgate');
      return;
    }
    
    const sucesso = resgatarPontos(clienteAtual.id, pontosResgatar, descricaoResgate);
    
    if (sucesso) {
      toast.success(`${pontosResgatar} pontos resgatados com sucesso!`);
      setPontosResgatar(0);
      setDescricaoResgate('');
      setMostrarResgate(false);
    } else {
      toast.error('Não foi possível resgatar os pontos. Verifique se o cliente possui saldo suficiente.');
    }
  };
  
  const handleExcluirCliente = () => {
    if (!clienteAtual) return;
    
    const sucesso = excluirCliente(clienteAtual.id);
    
    if (sucesso) {
      toast.success("Cliente excluído com sucesso!");
      navigate('/admin');
    } else {
      toast.error("Não é possível excluir um cliente que possui compras ou resgates registrados.");
    }
    
    setExcluirDialogAberto(false);
  };
  
  if (!clienteAtual) {
    return <div>Carregando...</div>;
  }
  
  const formatarNumero = (numero: number): string => {
    return numero.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
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
          
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => setExcluirDialogAberto(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir Cliente
          </Button>
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
                  <p>{clienteAtual.email || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Telefone</p>
                  <p>{clienteAtual.telefone || "-"}</p>
                </div>
                <div className="pt-2">
                  <div className="flex items-center gap-2 bg-loyalty-green rounded-md p-3">
                    <Award className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total de Pontos</p>
                      <p className="text-xl font-bold text-green-700">{formatarNumero(clienteAtual.pontos)}</p>
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
                      onChange={handleValorChange}
                      className="text-right"
                      autoComplete="off"
                      required
                    />
                    <Button type="submit" className="bg-loyalty-pink hover:bg-pink-300 text-pink-900">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Registrar
                    </Button>
                  </div>
                </div>
              </form>
              
              <div className="mt-6 flex justify-between items-center">
                <h3 className="text-md font-semibold">Gerenciar Pontos</h3>
                <Button 
                  variant="outline" 
                  className="bg-loyalty-green/10 text-green-900 hover:bg-loyalty-green/20 border-loyalty-green/30"
                  onClick={() => setMostrarResgate(!mostrarResgate)}
                >
                  <Gift className="h-4 w-4 mr-2" />
                  {mostrarResgate ? 'Cancelar' : 'Resgatar Pontos'}
                </Button>
              </div>
              
              {mostrarResgate && (
                <div className="mt-4 p-4 border border-loyalty-green/30 rounded-md bg-loyalty-green/5">
                  <form onSubmit={handleResgatarPontos} className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="pontos">Pontos a Resgatar</Label>
                        <span className="text-green-700 font-medium">{formatarNumero(pontosResgatar)} pontos</span>
                      </div>
                      <Input
                        id="pontos"
                        type="text"
                        inputMode="numeric"
                        placeholder="Digite a quantidade de pontos"
                        value={pontosResgatar || ''}
                        onChange={handlePontosChange}
                        className="text-right"
                        max={clienteAtual.pontos}
                      />
                      <div className="text-xs text-gray-500 flex justify-end">
                        <span>Disponível: {formatarNumero(clienteAtual.pontos)} pontos</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="descricao">Descrição do Resgate</Label>
                      <Input
                        id="descricao"
                        placeholder="Ex: Vale desconto, brinde, etc."
                        value={descricaoResgate}
                        onChange={(e) => setDescricaoResgate(e.target.value)}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-loyalty-green hover:bg-green-400 text-green-900"
                      disabled={pontosResgatar <= 0 || pontosResgatar > clienteAtual.pontos}
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      Confirmar Resgate
                    </Button>
                  </form>
                </div>
              )}
              
              <Separator className="my-6" />
              
              <div className="mt-4">
                <h3 className="text-md font-semibold mb-3">Histórico</h3>
                
                {comprasCliente.length > 0 || resgatesCliente.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {[...comprasCliente, ...resgatesCliente]
                      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                      .map((item) => {
                        if ('valor' in item) {
                          return (
                            <div key={item.id} className="flex justify-between p-3 bg-gray-50 rounded-md border border-gray-100">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span>{format(new Date(item.data), 'dd/MM/yyyy')}</span>
                                <span className="text-gray-500">Compra</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-gray-600">R$ {item.valor.toFixed(2)}</span>
                                <span className="text-green-600 font-medium">+{formatarNumero(item.pontosGanhos)} pts</span>
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <div key={item.id} className="flex justify-between p-3 bg-pink-50 rounded-md border border-pink-100">
                              <div className="flex items-center gap-2">
                                <Gift className="h-4 w-4 text-pink-500" />
                                <span>{format(new Date(item.data), 'dd/MM/yyyy')}</span>
                                <span className="text-pink-500">Resgate: {item.descricao}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-pink-600 font-medium">-{formatarNumero(item.pontos)} pts</span>
                              </div>
                            </div>
                          );
                        }
                      })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    Nenhum histórico de atividade
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <AlertDialog open={excluirDialogAberto} onOpenChange={setExcluirDialogAberto}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o cliente <strong>{clienteAtual.nome}</strong>? 
                <br /><br />
                Esta ação não poderá ser desfeita. Clientes que possuem histórico de compras ou resgates não podem ser excluídos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleExcluirCliente}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Sim, excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default ClienteDetalhe;
