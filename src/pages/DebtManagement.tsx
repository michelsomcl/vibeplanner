
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Calculator } from "lucide-react";

export default function DebtManagement() {
  const { id: clientId } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    institution: "",
    total_amount: "",
    remaining_installments: "",
    installment_value: "",
    interest_rate: "",
    due_date: "",
    status: "active",
    payoff_method: "snowball",
    observations: "",
  });

  const { data: debts, isLoading } = useQuery({
    queryKey: ['debts', clientId],
    queryFn: async () => {
      if (!clientId) throw new Error('ID do cliente não fornecido');
      
      const { data, error } = await supabase
        .from('debts')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!clientId,
  });

  const createDebtMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!clientId) throw new Error('ID do cliente não fornecido');
      
      const { data: debt, error } = await supabase
        .from('debts')
        .insert([{
          client_id: clientId,
          name: data.name,
          institution: data.institution,
          total_amount: parseFloat(data.total_amount),
          remaining_installments: parseInt(data.remaining_installments),
          installment_value: parseFloat(data.installment_value),
          interest_rate: parseFloat(data.interest_rate),
          due_date: data.due_date,
          status: data.status,
          payoff_method: data.payoff_method,
          observations: data.observations || null,
        }])
        .select()
        .single();

      if (error) throw error;
      return debt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts', clientId] });
      toast({
        title: "Dívida cadastrada com sucesso!",
        description: "A dívida foi adicionada ao planejamento.",
      });
      setShowForm(false);
      setFormData({
        name: "",
        institution: "",
        total_amount: "",
        remaining_installments: "",
        installment_value: "",
        interest_rate: "",
        due_date: "",
        status: "active",
        payoff_method: "snowball",
        observations: "",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar dívida:', error);
      toast({
        title: "Erro ao cadastrar dívida",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  const deleteDebtMutation = useMutation({
    mutationFn: async (debtId: string) => {
      const { error } = await supabase
        .from('debts')
        .delete()
        .eq('id', debtId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts', clientId] });
      toast({
        title: "Dívida removida",
        description: "A dívida foi removida do planejamento.",
      });
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDebtMutation.mutate(formData);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateDate('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-500';
      case 'negotiated': return 'bg-yellow-500';
      case 'paid': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'negotiated': return 'Negociada';
      case 'paid': return 'Quitada';
      default: return status;
    }
  };

  const totalDebts = debts?.reduce((sum, debt) => sum + debt.total_amount, 0) || 0;
  const activeDebts = debts?.filter(debt => debt.status === 'active') || [];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reestruturação Financeira</h1>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Dívida
          </Button>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Calculator className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDebts)}</div>
                <div className="text-sm text-gray-600">Total das Dívidas</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{activeDebts.length}</div>
                <div className="text-sm text-gray-600">Dívidas Ativas</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(activeDebts.reduce((sum, debt) => sum + debt.installment_value, 0))}
                </div>
                <div className="text-sm text-gray-600">Total Mensal</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formulário */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Nova Dívida</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Dívida</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Ex: Cartão de Crédito"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institution">Instituição</Label>
                    <Input
                      id="institution"
                      value={formData.institution}
                      onChange={(e) => handleInputChange("institution", e.target.value)}
                      placeholder="Ex: Banco do Brasil"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="total_amount">Valor Total (R$)</Label>
                    <Input
                      id="total_amount"
                      type="number"
                      step="0.01"
                      value={formData.total_amount}
                      onChange={(e) => handleInputChange("total_amount", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="remaining_installments">Parcelas Restantes</Label>
                    <Input
                      id="remaining_installments"
                      type="number"
                      value={formData.remaining_installments}
                      onChange={(e) => handleInputChange("remaining_installments", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="installment_value">Valor da Parcela (R$)</Label>
                    <Input
                      id="installment_value"
                      type="number"
                      step="0.01"
                      value={formData.installment_value}
                      onChange={(e) => handleInputChange("installment_value", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interest_rate">Taxa de Juros (%)</Label>
                    <Input
                      id="interest_rate"
                      type="number"
                      step="0.01"
                      value={formData.interest_rate}
                      onChange={(e) => handleInputChange("interest_rate", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="due_date">Data de Vencimento</Label>
                    <Input
                      id="due_date"
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => handleInputChange("due_date", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payoff_method">Método de Quitação</Label>
                    <Select value={formData.payoff_method} onValueChange={(value) => handleInputChange("payoff_method", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="snowball">Bola de Neve</SelectItem>
                        <SelectItem value="avalanche">Avalanche</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observations">Observações</Label>
                  <Textarea
                    id="observations"
                    value={formData.observations}
                    onChange={(e) => handleInputChange("observations", e.target.value)}
                    placeholder="Informações adicionais..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createDebtMutation.isPending}>
                    {createDebtMutation.isPending ? "Salvando..." : "Salvar Dívida"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de Dívidas */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : debts?.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhuma dívida cadastrada
                </h3>
                <p className="text-gray-600 mb-6">
                  Comece cadastrando as dívidas do cliente para criar um plano de quitação.
                </p>
                <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar Primeira Dívida
                </Button>
              </CardContent>
            </Card>
          ) : (
            debts?.map((debt) => (
              <Card key={debt.id} className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{debt.name}</h3>
                        <Badge className={`${getStatusColor(debt.status)} text-white`}>
                          {getStatusText(debt.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Instituição:</span> {debt.institution}
                        </div>
                        <div>
                          <span className="font-medium">Valor Total:</span> {formatCurrency(debt.total_amount)}
                        </div>
                        <div>
                          <span className="font-medium">Parcela:</span> {formatCurrency(debt.installment_value)}
                        </div>
                        <div>
                          <span className="font-medium">Parcelas Restantes:</span> {debt.remaining_installments}
                        </div>
                        <div>
                          <span className="font-medium">Taxa de Juros:</span> {debt.interest_rate}%
                        </div>
                        <div>
                          <span className="font-medium">Vencimento:</span> {formatDate(debt.due_date)}
                        </div>
                      </div>
                      
                      {debt.observations && (
                        <div className="mt-3 text-sm text-gray-600">
                          <span className="font-medium">Observações:</span> {debt.observations}
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteDebtMutation.mutate(debt.id)}
                      className="ml-4 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
