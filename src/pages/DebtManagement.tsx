
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Plus, TrendingDown } from "lucide-react";

const DebtManagement = () => {
  const { id } = useParams();
  const [client, setClient] = useState<any>(null);
  const [debts, setDebts] = useState<any[]>([]);

  useEffect(() => {
    const clients = JSON.parse(localStorage.getItem('vibeplanner_clients') || '[]');
    const foundClient = clients.find((c: any) => c.id === id);
    setClient(foundClient);

    // Mock debts data for demonstration
    setDebts([
      {
        id: 1,
        name: "Financiamento Imóvel",
        institution: "Banco do Brasil",
        totalAmount: 180000,
        remainingInstallments: 180,
        installmentValue: 1200,
        interestRate: 8.5,
        dueDate: "2024-01-15",
        status: "active",
        payoffMethod: "avalanche"
      },
      {
        id: 2,
        name: "Cartão de Crédito",
        institution: "Nubank",
        totalAmount: 8500,
        remainingInstallments: 24,
        installmentValue: 450,
        interestRate: 15.2,
        dueDate: "2024-01-10",
        status: "active",
        payoffMethod: "snowball"
      }
    ]);
  }, [id]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const totalDebt = debts.reduce((sum, debt) => sum + debt.totalAmount, 0);
  const monthlyCommitment = debts.reduce((sum, debt) => sum + debt.installmentValue, 0);
  const incomeCommitment = client ? (monthlyCommitment / client.monthlyIncome) * 100 : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'negotiated': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'negotiated': return 'Negociada';
      case 'paid': return 'Quitada';
      default: return 'Indefinido';
    }
  };

  if (!client) {
    return <div className="flex items-center justify-center h-64">Carregando...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Reestruturação Financeira</h1>
          <p className="text-gray-600 mt-2">Gestão de dívidas - {client.name}</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Nova Dívida
        </Button>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total das Dívidas</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDebt)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Parcelas Mensais</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(monthlyCommitment)}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm font-medium text-gray-600">% da Renda Comprometida</p>
              <p className="text-2xl font-bold text-red-600">{incomeCommitment.toFixed(1)}%</p>
              <Progress value={incomeCommitment} className="mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quantidade</p>
                <p className="text-2xl font-bold text-primary">{debts.length}</p>
                <p className="text-xs text-gray-500">dívidas ativas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert for high commitment */}
      {incomeCommitment > 30 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
              <div>
                <h3 className="font-semibold text-red-800">Atenção: Alto Comprometimento de Renda</h3>
                <p className="text-red-700 text-sm mt-1">
                  O comprometimento da renda com dívidas está acima de 30%. Recomenda-se revisar o orçamento e considerar estratégias de quitação.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debts List */}
      <Card>
        <CardHeader>
          <CardTitle>Dívidas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {debts.map((debt) => (
              <Card key={debt.id} className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{debt.name}</h3>
                        <Badge className={getStatusColor(debt.status)}>
                          {getStatusText(debt.status)}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600">{debt.institution}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Valor Total:</span>
                          <p className="font-medium">{formatCurrency(debt.totalAmount)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Parcela:</span>
                          <p className="font-medium">{formatCurrency(debt.installmentValue)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Juros:</span>
                          <p className="font-medium">{debt.interestRate}% a.a.</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Parcelas Restantes:</span>
                          <p className="font-medium">{debt.remainingInstallments}x</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <span className="text-sm text-gray-500">Método de quitação:</span>
                        <Badge variant="outline">
                          {debt.payoffMethod === 'snowball' ? 'Bola de Neve' : 
                           debt.payoffMethod === 'avalanche' ? 'Avalanche' : 'Outro'}
                        </Badge>
                      </div>
                    </div>

                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payoff Strategy */}
      <Card>
        <CardHeader>
          <CardTitle>Estratégia de Quitação Recomendada</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Método Avalanche</h4>
              <p className="text-blue-700 text-sm">
                Priorize o pagamento das dívidas com maior taxa de juros primeiro. 
                Neste caso, recomenda-se focar no Cartão de Crédito (15.2% a.a.) antes do Financiamento Imóvel (8.5% a.a.).
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-medium text-green-800">Economia Projetada</h5>
                <p className="text-2xl font-bold text-green-600 mt-1">R$ 12.450</p>
                <p className="text-green-600 text-sm">em juros ao seguir a estratégia</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h5 className="font-medium text-purple-800">Tempo de Quitação</h5>
                <p className="text-2xl font-bold text-purple-600 mt-1">4.2 anos</p>
                <p className="text-purple-600 text-sm">mais rápido que o método atual</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebtManagement;
