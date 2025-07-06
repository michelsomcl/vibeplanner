
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, TrendingUp, Home, DollarSign } from "lucide-react";

const AssetAccumulation = () => {
  const { id } = useParams();
  const [client, setClient] = useState<any>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);

  useEffect(() => {
    const clients = JSON.parse(localStorage.getItem('vibeplanner_clients') || '[]');
    const foundClient = clients.find((c: any) => c.id === id);
    setClient(foundClient);

    // Mock assets data
    setAssets([
      {
        id: 1,
        type: "Imóvel",
        description: "Apartamento - Centro",
        currentValue: 350000,
        expectedReturn: 6.5,
        observations: "Imóvel próprio residencial"
      },
      {
        id: 2,
        type: "Reserva de Emergência",
        description: "Conta Poupança",
        currentValue: 25000,
        expectedReturn: 4.2,
        observations: "6 meses de gastos"
      },
      {
        id: 3,
        type: "Investimento",
        description: "Tesouro IPCA+",
        currentValue: 45000,
        expectedReturn: 9.8,
        observations: "Longo prazo"
      }
    ]);

    // Mock goals data
    setGoals([
      {
        id: 1,
        name: "Casa de Campo",
        targetValue: 500000,
        currentValue: 85000,
        monthlyContribution: 3500,
        deadline: "2028-12-31",
        progress: 17
      },
      {
        id: 2,
        name: "Carro Novo",
        targetValue: 80000,
        currentValue: 35000,
        monthlyContribution: 1200,
        deadline: "2025-06-30",
        progress: 43.75
      },
      {
        id: 3,
        name: "Viagem Europa",
        targetValue: 25000,
        currentValue: 12000,
        monthlyContribution: 800,
        deadline: "2024-12-15",
        progress: 48
      }
    ]);
  }, [id]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const totalAssets = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalGoalTargets = goals.reduce((sum, goal) => sum + goal.targetValue, 0);
  const totalCurrentGoals = goals.reduce((sum, goal) => sum + goal.currentValue, 0);

  const getAssetIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'imóvel': return Home;
      case 'investimento': return TrendingUp;
      case 'reserva de emergência': return DollarSign;
      default: return DollarSign;
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
          <h1 className="text-3xl font-bold text-primary">Acúmulo de Patrimônio</h1>
          <p className="text-gray-600 mt-2">Ativos e metas financeiras - {client.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <Plus className="mr-2 h-4 w-4" />
            Novo Ativo
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Target className="mr-2 h-4 w-4" />
            Nova Meta
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Patrimônio Total</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalAssets)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor das Metas</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalGoalTargets)}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Já Poupado</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalCurrentGoals)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progresso Médio</p>
                <p className="text-2xl font-bold text-primary">
                  {goals.length > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assets Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Ativos Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assets.map((asset) => {
              const IconComponent = getAssetIcon(asset.type);
              return (
                <Card key={asset.id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                          <IconComponent className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg">{asset.description}</h3>
                            <Badge variant="outline">{asset.type}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Valor Atual:</span>
                              <p className="font-medium text-green-600">{formatCurrency(asset.currentValue)}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Rentabilidade:</span>
                              <p className="font-medium">{asset.expectedReturn.toFixed(1)}% a.a.</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Observações:</span>
                              <p className="font-medium text-gray-700">{asset.observations}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Goals Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Metas Financeiras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {goals.map((goal) => (
              <Card key={goal.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{goal.name}</h3>
                        <p className="text-sm text-gray-600">
                          Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Valor Desejado:</span>
                        <p className="font-medium text-blue-600">{formatCurrency(goal.targetValue)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Valor Atual:</span>
                        <p className="font-medium text-green-600">{formatCurrency(goal.currentValue)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Aporte Mensal:</span>
                        <p className="font-medium">{formatCurrency(goal.monthlyContribution)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Faltam:</span>
                        <p className="font-medium text-orange-600">
                          {formatCurrency(goal.targetValue - goal.currentValue)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Progresso</span>
                        <span className="text-sm font-medium">{goal.progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetAccumulation;
