
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  BarChart3, 
  Download, 
  Filter, 
  Phone, 
  Clock, 
  TrendingUp,
  Users,
  Bot,
  Calendar
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Reports = () => {
  const [dateRange, setDateRange] = useState<any>(null);
  const [filterType, setFilterType] = useState('all');
  const [filterValue, setFilterValue] = useState('');

  // Dados simulados para gráficos
  const callVolumeData = [
    { day: 'Seg', calls: 45, minutes: 120 },
    { day: 'Ter', calls: 52, minutes: 156 },
    { day: 'Qua', calls: 38, minutes: 89 },
    { day: 'Qui', calls: 61, minutes: 203 },
    { day: 'Sex', calls: 73, minutes: 267 },
    { day: 'Sab', calls: 29, minutes: 78 },
    { day: 'Dom', calls: 18, minutes: 45 }
  ];

  const aiUsageData = [
    { hour: '08:00', minutes: 45 },
    { hour: '09:00', minutes: 78 },
    { hour: '10:00', minutes: 92 },
    { hour: '11:00', minutes: 65 },
    { hour: '12:00', minutes: 34 },
    { hour: '13:00', minutes: 23 },
    { hour: '14:00', minutes: 89 },
    { hour: '15:00', minutes: 112 },
    { hour: '16:00', minutes: 98 },
    { hour: '17:00', minutes: 67 },
    { hour: '18:00', minutes: 34 }
  ];

  const callsByDestination = [
    { name: 'URA Comercial', calls: 142, color: '#7C45D0' },
    { name: 'Suporte Técnico', calls: 98, color: '#9D6FE8' },
    { name: 'Ramais Diretos', calls: 76, color: '#B998F0' },
    { name: 'Grupo Vendas', calls: 54, color: '#E8D8FF' }
  ];

  // Dados de chamadas detalhadas
  const callDetails = [
    {
      id: '1',
      datetime: '2024-12-30 09:15:32',
      from: '11987654321',
      to: 'URA Principal',
      duration: '03:24',
      status: 'Atendida',
      aiMinutes: 2.5,
      destination: 'Transferida para 1001'
    },
    {
      id: '2',
      datetime: '2024-12-30 09:12:15',
      from: '11976543210',
      to: 'Ramal 1002',
      duration: '01:45',
      status: 'Atendida',
      aiMinutes: 0,
      destination: 'Chamada direta'
    },
    {
      id: '3',
      datetime: '2024-12-30 09:08:44',
      from: '11965432109',
      to: 'Grupo Suporte',
      duration: '00:00',
      status: 'Não Atendida',
      aiMinutes: 1.2,
      destination: 'Timeout'
    },
    {
      id: '4',
      datetime: '2024-12-30 09:05:21',
      from: '11954321098',
      to: 'URA Comercial',
      duration: '05:18',
      status: 'Atendida',
      aiMinutes: 3.8,
      destination: 'Transferida para 2000'
    },
    {
      id: '5',
      datetime: '2024-12-30 09:01:12',
      from: '11943210987',
      to: 'Ramal 1005',
      duration: '02:33',
      status: 'Atendida',
      aiMinutes: 0,
      destination: 'Chamada direta'
    }
  ];

  const handleExport = (type: 'pdf' | 'csv' | 'excel') => {
    console.log(`Exportando relatório como ${type.toUpperCase()}`);
    // Aqui seria implementada a lógica de exportação
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Atendida': return 'bg-green-100 text-green-800';
      case 'Não Atendida': return 'bg-red-100 text-red-800';
      case 'Ocupado': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalCalls = callDetails.length;
  const totalDuration = callDetails.reduce((acc, call) => {
    const [min, sec] = call.duration.split(':').map(Number);
    return acc + min + (sec / 60);
  }, 0);
  const totalAIMinutes = callDetails.reduce((acc, call) => acc + call.aiMinutes, 0);
  const avgDuration = totalDuration / totalCalls;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-dohoo-primary" />
            Relatórios
          </h1>
          <p className="text-gray-600">
            Analise o desempenho do seu sistema de telefonia e consumo de IA
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <Download className="w-4 h-4 mr-2" />
            Excel
          </Button>
          <Button onClick={() => handleExport('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Relatório
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Período</Label>
              <DatePickerWithRange
                date={dateRange}
                onDateChange={setDateRange}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Filtro</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as chamadas</SelectItem>
                  <SelectItem value="extension">Por ramal</SelectItem>
                  <SelectItem value="group">Por grupo</SelectItem>
                  <SelectItem value="ura">Por URA</SelectItem>
                  <SelectItem value="external">Número externo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Valor do Filtro</Label>
              <Input
                placeholder="Digite o valor..."
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                disabled={filterType === 'all'}
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Chamadas</p>
                <p className="text-2xl font-bold text-gray-900">{totalCalls}</p>
                <p className="text-sm text-green-600">+12% vs ontem</p>
              </div>
              <Phone className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tempo Total</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(totalDuration)}min</p>
                <p className="text-sm text-green-600">+8% vs ontem</p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Minutos IA Usados</p>
                <p className="text-2xl font-bold text-gray-900">{totalAIMinutes.toFixed(1)}</p>
                <p className="text-sm text-orange-600">+25% vs ontem</p>
              </div>
              <Bot className="w-8 h-8 text-dohoo-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                <p className="text-2xl font-bold text-gray-900">{avgDuration.toFixed(1)}min</p>
                <p className="text-sm text-blue-600">-5% vs ontem</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume de Chamadas */}
        <Card>
          <CardHeader>
            <CardTitle>Volume de Chamadas por Dia</CardTitle>
            <CardDescription>
              Chamadas e minutos dos últimos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={callVolumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calls" fill="#7C45D0" name="Chamadas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Uso de IA por Hora */}
        <Card>
          <CardHeader>
            <CardTitle>Consumo de IA por Hora</CardTitle>
            <CardDescription>
              Minutos de IA utilizados durante o dia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={aiUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="minutes" 
                  stroke="#7C45D0" 
                  strokeWidth={2}
                  name="Minutos IA"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição por Destino */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Chamadas por Destino</CardTitle>
          <CardDescription>
            Como as chamadas estão sendo distribuídas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={callsByDestination}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="calls"
                >
                  {callsByDestination.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-4">
              {callsByDestination.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{item.calls}</div>
                    <div className="text-sm text-gray-600">chamadas</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalhes das Chamadas */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes das Chamadas</CardTitle>
          <CardDescription>
            Registro detalhado das últimas chamadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Min. IA</TableHead>
                <TableHead>Resultado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {callDetails.map((call) => (
                <TableRow key={call.id}>
                  <TableCell className="font-mono text-sm">
                    {new Date(call.datetime).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>{call.from}</TableCell>
                  <TableCell>{call.to}</TableCell>
                  <TableCell className="font-mono">{call.duration}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(call.status)}>
                      {call.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {call.aiMinutes > 0 ? (
                      <span className="text-dohoo-primary font-medium">
                        {call.aiMinutes.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {call.destination}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
