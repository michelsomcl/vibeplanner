
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, User, Phone, Briefcase, FileText } from "lucide-react";

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  profession: string;
  monthlyIncome: number;
  hasPlanning: boolean;
}

const Dashboard = () => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const savedClients = localStorage.getItem('vibeplanner_clients');
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    }
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-4">VibePlanner</h1>
          <p className="text-xl text-gray-600 mb-8">
            Sistema Profissional de Planejamento Financeiro
          </p>
          
          <Link to="/client/new">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg">
              <Plus className="mr-2 h-5 w-5" />
              Novo Cliente
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
                  <p className="text-3xl font-bold text-primary">{clients.length}</p>
                </div>
                <User className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Com Planejamento</p>
                  <p className="text-3xl font-bold text-green-600">
                    {clients.filter(c => c.hasPlanning).length}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {clients.filter(c => !c.hasPlanning).length}
                  </p>
                </div>
                <Briefcase className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clients List */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Clientes Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            {clients.length === 0 ? (
              <div className="text-center py-12">
                <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-4">Nenhum cliente cadastrado ainda</p>
                <Link to="/client/new">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Cadastrar Primeiro Cliente
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clients.map((client) => (
                  <Card key={client.id} className="border border-gray-200 hover:border-primary/50 hover:shadow-md transition-all">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg text-gray-900">{client.name}</h3>
                          <Badge variant={client.hasPlanning ? "default" : "secondary"} className={client.hasPlanning ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                            {client.hasPlanning ? "Com Plano" : "Sem plano definido"}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            {client.phone}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Briefcase className="h-4 w-4 mr-2" />
                            {client.profession}
                          </div>
                          <div className="text-primary font-medium">
                            Renda: {formatCurrency(client.monthlyIncome)}
                          </div>
                        </div>

                        <Link to={`/client/${client.id}`}>
                          <Button className="w-full bg-primary hover:bg-primary/90 mt-4">
                            <FileText className="mr-2 h-4 w-4" />
                            Acessar Planejamento
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
