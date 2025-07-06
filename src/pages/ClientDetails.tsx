
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Heart, 
  Briefcase, 
  DollarSign,
  FileText,
  TrendingUp,
  PiggyBank,
  Scale
} from "lucide-react";

const ClientDetails = () => {
  const { id } = useParams();
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    const clients = JSON.parse(localStorage.getItem('vibeplanner_clients') || '[]');
    const foundClient = clients.find((c: any) => c.id === id);
    setClient(foundClient);
  }, [id]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Não informado';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Cliente não encontrado</p>
      </div>
    );
  }

  const planningModules = [
    {
      title: "Reestruturação Financeira",
      description: "Gestão de dívidas e plano de quitação",
      icon: TrendingUp,
      path: `/client/${id}/debts`,
      color: "text-red-600"
    },
    {
      title: "Acúmulo de Patrimônio",
      description: "Ativos, investimentos e metas financeiras",
      icon: DollarSign,
      path: `/client/${id}/assets`,
      color: "text-green-600"
    },
    {
      title: "Orçamento Mensal",
      description: "Controle de receitas e despesas",
      icon: Calendar,
      path: `/client/${id}/budget`,
      color: "text-blue-600"
    },
    {
      title: "Previdência",
      description: "Planejamento para aposentadoria",
      icon: PiggyBank,
      path: `/client/${id}/retirement`,
      color: "text-purple-600"
    },
    {
      title: "Planejamento Sucessório",
      description: "Gestão de bens e herança",
      icon: Scale,
      path: `/client/${id}/succession`,
      color: "text-indigo-600"
    },
    {
      title: "Relatório Final",
      description: "Resumo completo do planejamento",
      icon: FileText,
      path: `/client/${id}/report`,
      color: "text-gray-600"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Client Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="p-8">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
                  <Badge variant={client.hasPlanning ? "default" : "secondary"} className="mt-2">
                    {client.hasPlanning ? "Com Planejamento Ativo" : "Sem plano definido"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  {client.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  {client.email}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  {formatDate(client.birthDate)}
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  {client.maritalStatus || 'Não informado'}
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  {client.profession || 'Não informado'}
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  {formatCurrency(client.monthlyIncome)}
                </div>
              </div>

              {client.observations && (
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium text-gray-900 mb-2">Observações:</h4>
                  <p className="text-gray-600">{client.observations}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Renda Mensal</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(client.monthlyIncome)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Capital Disponível</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(client.availableCapital)}
                </p>
              </div>
              <PiggyBank className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className="text-2xl font-bold text-primary">
                  {client.hasPlanning ? "Ativo" : "Pendente"}
                </p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Planning Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Módulos de Planejamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {planningModules.map((module) => (
              <Link key={module.title} to={module.path}>
                <Card className="h-full hover:shadow-md transition-shadow border-l-4 border-l-primary/20 hover:border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <module.icon className={`h-8 w-8 ${module.color}`} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{module.title}</h3>
                        <p className="text-sm text-gray-600">{module.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDetails;
