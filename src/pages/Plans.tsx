
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CreditCard, 
  Bot, 
  Phone, 
  Check, 
  Star, 
  AlertTriangle,
  Plus,
  ShoppingCart
} from "lucide-react";
import { toast } from "sonner";

const Plans = () => {
  const [loading, setLoading] = useState(false);
  
  // Dados simulados do plano atual
  const currentPlan = {
    extensions: 24,
    maxExtensions: 50,
    aiMinutes: 4250,
    maxAiMinutes: 5000,
    monthlyPrice: 549,
    nextBilling: '2025-01-15'
  };

  const aiUsage = (currentPlan.aiMinutes / currentPlan.maxAiMinutes) * 100;

  // Planos disponíveis
  const extensionPlans = [
    {
      name: "Básico",
      extensions: 20,
      price: 200,
      features: ["20 ramais inclusos", "Suporte por email", "URA básica"]
    },
    {
      name: "Profissional",
      extensions: 50,
      price: 500,
      features: ["50 ramais inclusos", "Suporte prioritário", "URA avançada", "Relatórios detalhados"],
      recommended: true
    },
    {
      name: "Empresarial",
      extensions: 100,
      price: 950,
      features: ["100 ramais inclusos", "Suporte 24/7", "URA personalizada", "API completa", "Gerente dedicado"]
    }
  ];

  const aiPlans = [
    {
      name: "Starter IA",
      minutes: 1000,
      price: 99,
      features: ["1.000 minutos IA/mês", "Processamento básico", "Idioma português"]
    },
    {
      name: "Professional IA",
      minutes: 5000,
      price: 399,
      features: ["5.000 minutos IA/mês", "Processamento avançado", "Múltiplos idiomas", "Análise de sentimentos"],
      recommended: true
    },
    {
      name: "Enterprise IA",
      minutes: 10000,
      price: 699,
      features: ["10.000 minutos IA/mês", "Processamento premium", "IA personalizada", "Integrações avançadas"]
    }
  ];

  const additionalMinutes = [
    { minutes: 1000, price: 79 },
    { minutes: 2500, price: 189 },
    { minutes: 5000, price: 349 }
  ];

  const handleUpgrade = async (planType: string, planData: any) => {
    setLoading(true);
    
    // Simulação de integração com Stripe
    try {
      // Aqui seria feita a chamada para criar o checkout do Stripe
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Plano ${planData.name} selecionado! Redirecionando para pagamento...`);
      
      // Simular redirecionamento para Stripe
      console.log('Redirecting to Stripe checkout for:', planData);
      
    } catch (error) {
      toast.error('Erro ao processar o plano. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyMinutes = async (minutesPack: any) => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`${minutesPack.minutes} minutos adicionais adquiridos!`);
    } catch (error) {
      toast.error('Erro ao comprar minutos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-dohoo-primary" />
          Planos & Minutos
        </h1>
        <p className="text-gray-600">
          Gerencie sua assinatura, upgrade de planos e compre minutos adicionais
        </p>
      </div>

      {/* Status Atual */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-600" />
              Plano de Ramais Atual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Ramais utilizados</span>
              <span className="text-sm text-gray-600">
                {currentPlan.extensions} / {currentPlan.maxExtensions}
              </span>
            </div>
            <Progress value={(currentPlan.extensions / currentPlan.maxExtensions) * 100} className="h-2" />
            <div className="flex items-center justify-between">
              <Badge variant="outline">Plano Profissional</Badge>
              <span className="text-lg font-bold text-dohoo-primary">
                R$ {currentPlan.monthlyPrice}/mês
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Próxima cobrança: {new Date(currentPlan.nextBilling).toLocaleDateString('pt-BR')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-dohoo-primary" />
              Minutos IA Atual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Minutos utilizados</span>
              <span className="text-sm text-gray-600">
                {currentPlan.aiMinutes.toLocaleString()} / {currentPlan.maxAiMinutes.toLocaleString()}
              </span>
            </div>
            <Progress value={aiUsage} className="h-2" />
            <div className="flex items-center justify-between">
              <Badge variant={aiUsage >= 90 ? "destructive" : "outline"}>
                Professional IA
              </Badge>
              <span className="text-lg font-bold text-dohoo-primary">
                {aiUsage.toFixed(1)}% usado
              </span>
            </div>
            {aiUsage >= 90 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Você está próximo do limite. Considere comprar minutos adicionais.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upgrade de Planos de Ramais */}
      <Card>
        <CardHeader>
          <CardTitle>Upgrade Plano de Ramais</CardTitle>
          <CardDescription>
            Aumente sua capacidade de ramais conforme sua empresa cresce
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {extensionPlans.map((plan) => (
              <div 
                key={plan.name}
                className={`relative border rounded-lg p-6 ${
                  plan.recommended ? 'border-dohoo-primary bg-dohoo-light/20' : 'border-gray-200'
                }`}
              >
                {plan.recommended && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-dohoo-primary">
                    <Star className="w-3 h-3 mr-1" />
                    Recomendado
                  </Badge>
                )}
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div>
                    <span className="text-3xl font-bold text-dohoo-primary">R$ {plan.price}</span>
                    <span className="text-gray-600">/mês</span>
                  </div>
                  <p className="text-lg font-medium">{plan.extensions} ramais</p>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.recommended ? "default" : "outline"}
                    onClick={() => handleUpgrade('extensions', plan)}
                    disabled={loading}
                  >
                    {currentPlan.maxExtensions === plan.extensions ? 'Plano Atual' : 'Escolher Plano'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade de Planos de IA */}
      <Card>
        <CardHeader>
          <CardTitle>Upgrade Plano de Minutos IA</CardTitle>
          <CardDescription>
            Escolha o pacote de minutos de IA que melhor atende sua demanda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiPlans.map((plan) => (
              <div 
                key={plan.name}
                className={`relative border rounded-lg p-6 ${
                  plan.recommended ? 'border-dohoo-primary bg-dohoo-light/20' : 'border-gray-200'
                }`}
              >
                {plan.recommended && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-dohoo-primary">
                    <Star className="w-3 h-3 mr-1" />
                    Recomendado
                  </Badge>
                )}
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div>
                    <span className="text-3xl font-bold text-dohoo-primary">R$ {plan.price}</span>
                    <span className="text-gray-600">/mês</span>
                  </div>
                  <p className="text-lg font-medium">{plan.minutes.toLocaleString()} minutos</p>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.recommended ? "default" : "outline"}
                    onClick={() => handleUpgrade('ai', plan)}
                    disabled={loading}
                  >
                    {currentPlan.maxAiMinutes === plan.minutes ? 'Plano Atual' : 'Escolher Plano'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compra Avulsa de Minutos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Minutos Adicionais
          </CardTitle>
          <CardDescription>
            Compre pacotes extras de minutos IA para usar quando precisar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {additionalMinutes.map((pack, index) => (
              <div key={index} className="border rounded-lg p-4 text-center space-y-3">
                <h4 className="font-semibold text-lg">{pack.minutes.toLocaleString()} minutos</h4>
                <p className="text-2xl font-bold text-dohoo-primary">R$ {pack.price}</p>
                <p className="text-sm text-gray-600">Uso único • Não expira</p>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => handleBuyMinutes(pack)}
                  disabled={loading}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Comprar Agora
                </Button>
              </div>
            ))}
          </div>
          
          <Alert className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Importante:</strong> Os minutos adicionais são cobrados separadamente e não possuem recorrência. 
              Eles complementam seu plano mensal atual.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Histórico de Pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
          <CardDescription>
            Visualize suas últimas transações e faturas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: '2024-12-15', description: 'Plano Profissional + Professional IA', amount: 'R$ 899,00', status: 'Pago' },
              { date: '2024-11-15', description: 'Plano Profissional + Professional IA', amount: 'R$ 899,00', status: 'Pago' },
              { date: '2024-11-08', description: 'Minutos Adicionais - 1.000 min', amount: 'R$ 79,00', status: 'Pago' },
              { date: '2024-10-15', description: 'Plano Profissional + Professional IA', amount: 'R$ 899,00', status: 'Pago' }
            ].map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{payment.description}</p>
                  <p className="text-sm text-gray-600">{new Date(payment.date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{payment.amount}</p>
                  <Badge variant="secondary">{payment.status}</Badge>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            Ver Histórico Completo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Plans;
