
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Phone, 
  Users, 
  Bot, 
  TrendingUp, 
  AlertTriangle, 
  CreditCard,
  PhoneCall,
  Clock,
  Activity
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  
  // Dados simulados
  const aiUsage = 85; // 85% dos minutos utilizados
  const totalMinutes = 5000;
  const usedMinutes = 4250;
  const remainingMinutes = totalMinutes - usedMinutes;

  const stats = [
    {
      title: "Ramais Ativos",
      value: "24",
      change: "+2",
      icon: Phone,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Grupos de Atendimento",
      value: "5",
      change: "+1",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Chamadas Hoje",
      value: "127",
      change: "+15%",
      icon: PhoneCall,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Tempo Médio",
      value: "2:45",
      change: "-30s",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const recentCalls = [
    { time: "09:45", from: "11987654321", to: "Ramal 1001", duration: "3:24", status: "Atendida" },
    { time: "09:42", from: "11976543210", to: "URA Comercial", duration: "1:15", status: "Transferida" },
    { time: "09:38", from: "11965432109", to: "Ramal 1003", duration: "0:45", status: "Não Atendida" },
    { time: "09:35", from: "11954321098", to: "Grupo Suporte", duration: "5:32", status: "Atendida" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Bem-vindo de volta, {user?.name}! Aqui está um resumo do seu sistema.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-dohoo-primary border-dohoo-primary">
            {user?.domain}
          </Badge>
          <Activity className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-600 font-medium">Sistema Online</span>
        </div>
      </div>

      {/* Alerta de Consumo de IA */}
      {aiUsage >= 90 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Atenção:</strong> Você está próximo do limite de minutos de IA ({aiUsage}% utilizado).
            <Button variant="link" className="p-0 ml-2 text-red-600 underline">
              Comprar mais minutos
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consumo de Minutos IA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-dohoo-primary" />
              Consumo de Minutos IA
            </CardTitle>
            <CardDescription>
              Acompanhe o uso dos seus minutos de inteligência artificial
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Minutos utilizados</span>
              <span className="text-sm text-gray-600">
                {usedMinutes.toLocaleString()} / {totalMinutes.toLocaleString()}
              </span>
            </div>
            <Progress value={aiUsage} className="h-3" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Restam {remainingMinutes.toLocaleString()} minutos
              </span>
              <Badge 
                variant={aiUsage >= 90 ? "destructive" : aiUsage >= 75 ? "default" : "secondary"}
              >
                {aiUsage}% usado
              </Badge>
            </div>
            {aiUsage >= 75 && (
              <Button className="w-full mt-4" variant="outline">
                <CreditCard className="w-4 h-4 mr-2" />
                Comprar Mais Minutos
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Atividade Recente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Chamadas Recentes
            </CardTitle>
            <CardDescription>
              Últimas atividades do seu sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCalls.map((call, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{call.from}</span>
                      <span className="text-xs text-gray-500">→ {call.to}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{call.time}</span>
                      <span>•</span>
                      <span>{call.duration}</span>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      call.status === "Atendida" ? "default" : 
                      call.status === "Transferida" ? "secondary" : 
                      "destructive"
                    }
                    className="text-xs"
                  >
                    {call.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver Todos os Relatórios
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Planos e Assinatura */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-dohoo-primary" />
            Seu Plano Atual
          </CardTitle>
          <CardDescription>
            Gerencie sua assinatura e recursos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">Ramais</h4>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-dohoo-primary">24/50</span>
                <Badge variant="outline">Plano Premium</Badge>
              </div>
              <p className="text-sm text-gray-600">26 ramais disponíveis</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Minutos IA</h4>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-dohoo-primary">5.000</span>
                <Badge variant="outline">Mensal</Badge>
              </div>
              <p className="text-sm text-gray-600">Renovação em 15 dias</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Próxima Cobrança</h4>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-dohoo-primary">R$ 549</span>
                <Badge variant="secondary">15/01/2025</Badge>
              </div>
              <p className="text-sm text-gray-600">Cobrança automática</p>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="outline">Alterar Plano</Button>
            <Button variant="outline">Histórico de Pagamentos</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
