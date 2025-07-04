
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PhoneOutgoing, Plus, Edit, Trash2, Search, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface OutboundRoute {
  id: string;
  name: string;
  pattern: string;
  prepend: string;
  trunk: string;
  priority: number;
  enabled: boolean;
}

const Outbound = () => {
  const [routes, setRoutes] = useState<OutboundRoute[]>([
    {
      id: '1',
      name: 'Chamadas Locais São Paulo',
      pattern: '11XXXXXXXX',
      prepend: '',
      trunk: 'trunk_local',
      priority: 1,
      enabled: true
    },
    {
      id: '2',
      name: 'Celulares São Paulo',
      pattern: '119XXXXXXXX',
      prepend: '0',
      trunk: 'trunk_cel',
      priority: 2,
      enabled: true
    },
    {
      id: '3',
      name: 'DDD Nacional',
      pattern: 'XNXXXXXXXX',
      prepend: '0',
      trunk: 'trunk_longa',
      priority: 3,
      enabled: true
    },
    {
      id: '4',
      name: 'Internacional',
      pattern: '00XXXXXXXXXXX',
      prepend: '',
      trunk: 'trunk_internacional',
      priority: 4,
      enabled: false
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<OutboundRoute | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    pattern: '',
    prepend: '',
    trunk: '',
    priority: 1,
    enabled: true
  });

  // Troncos disponíveis (simulado)
  const availableTrunks = [
    { id: 'trunk_local', name: 'Operadora Local - Fixo' },
    { id: 'trunk_cel', name: 'Operadora Celular' },
    { id: 'trunk_longa', name: 'Operadora Longa Distância' },
    { id: 'trunk_internacional', name: 'Operadora Internacional' },
    { id: 'trunk_voip', name: 'Provedor VoIP Principal' }
  ];

  const patternExamples = [
    { pattern: '11XXXXXXXX', description: 'Números fixos de São Paulo (11 + 8 dígitos)' },
    { pattern: '119XXXXXXXX', description: 'Celulares de São Paulo (11 + 9 + 8 dígitos)' },
    { pattern: 'XNXXXXXXXX', description: 'DDD Nacional (qualquer DDD + 8/9 dígitos)' },
    { pattern: '0800XXXXXX', description: 'Números 0800' },
    { pattern: '00XXXXXXXXXXX', description: 'Chamadas internacionais (00 + código país + número)' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar conflitos de padrão
    const existingRoute = routes.find(route => 
      route.pattern === formData.pattern && route.id !== editingRoute?.id
    );
    
    if (existingRoute) {
      toast.error('Já existe uma rota com este padrão!');
      return;
    }

    const newRoute: OutboundRoute = {
      id: editingRoute?.id || Date.now().toString(),
      name: formData.name,
      pattern: formData.pattern,
      prepend: formData.prepend,
      trunk: formData.trunk,
      priority: formData.priority,
      enabled: formData.enabled
    };

    if (editingRoute) {
      setRoutes(routes.map(route => 
        route.id === editingRoute.id ? newRoute : route
      ));
      toast.success('Rota de saída atualizada com sucesso!');
    } else {
      setRoutes([...routes, newRoute]);
      toast.success('Rota de saída criada com sucesso!');
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      pattern: '',
      prepend: '',
      trunk: '',
      priority: getNextPriority(),
      enabled: true
    });
    setEditingRoute(null);
    setIsDialogOpen(false);
  };

  const getNextPriority = () => {
    const maxPriority = Math.max(...routes.map(r => r.priority), 0);
    return maxPriority + 1;
  };

  const handleEdit = (route: OutboundRoute) => {
    setEditingRoute(route);
    setFormData({
      name: route.name,
      pattern: route.pattern,
      prepend: route.prepend,
      trunk: route.trunk,
      priority: route.priority,
      enabled: route.enabled
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setRoutes(routes.filter(route => route.id !== id));
    toast.success('Rota de saída removida com sucesso!');
  };

  const getTrunkName = (trunkId: string) => {
    const trunk = availableTrunks.find(t => t.id === trunkId);
    return trunk ? trunk.name : trunkId;
  };

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.pattern.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedRoutes = filteredRoutes.sort((a, b) => a.priority - b.priority);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <PhoneOutgoing className="w-8 h-8 text-dohoo-primary" />
            Rotas de Saída
          </h1>
          <p className="text-gray-600">
            Configure as regras de discagem externa e troncos utilizados
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Rota
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRoute ? 'Editar Rota' : 'Nova Rota de Saída'}
              </DialogTitle>
              <DialogDescription>
                Configure uma regra de discagem externa
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Rota</Label>
                <Input
                  id="name"
                  placeholder="Ex: Chamadas Locais São Paulo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pattern">Padrão de Discagem</Label>
                <Input
                  id="pattern"
                  placeholder="Ex: 11XXXXXXXX"
                  value={formData.pattern}
                  onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                  required
                />
                <div className="text-sm text-gray-600">
                  Use X para qualquer dígito, N para 2-9, Z para 1-9
                </div>
              </div>

              <div className="space-y-2">
                <Label>Exemplos de Padrões</Label>
                <div className="max-h-32 overflow-y-auto border rounded-md p-3 space-y-2">
                  {patternExamples.map((example, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
                      onClick={() => setFormData({ ...formData, pattern: example.pattern })}
                    >
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {example.pattern}
                      </code>
                      <span className="text-xs text-gray-600 ml-2">
                        {example.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prepend">Prefixo (opcional)</Label>
                <Input
                  id="prepend"
                  placeholder="Ex: 0 (para operadora)"
                  value={formData.prepend}
                  onChange={(e) => setFormData({ ...formData, prepend: e.target.value })}
                />
                <div className="text-sm text-gray-600">
                  Número adicionado antes da discagem
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trunk">Tronco</Label>
                <Select
                  value={formData.trunk}
                  onValueChange={(value) => setFormData({ ...formData, trunk: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tronco" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTrunks.map((trunk) => (
                      <SelectItem key={trunk.id} value={trunk.id}>
                        {trunk.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Input
                  id="priority"
                  type="number"
                  min="1"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  required
                />
                <div className="text-sm text-gray-600">
                  Menor número = maior prioridade
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="enabled">Rota ativa</Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingRoute ? 'Atualizar' : 'Criar Rota'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alerta de Configuração */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Importante:</strong> As rotas são processadas em ordem de prioridade. 
          Certifique-se de que os padrões não conflitem entre si.
        </AlertDescription>
      </Alert>

      {/* Busca */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nome ou padrão..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Rotas */}
      <Card>
        <CardHeader>
          <CardTitle>Rotas Configuradas ({filteredRoutes.length})</CardTitle>
          <CardDescription>
            Rotas ordenadas por prioridade (processamento de cima para baixo)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prioridade</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Padrão</TableHead>
                <TableHead>Prefixo</TableHead>
                <TableHead>Tronco</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRoutes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {route.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{route.name}</TableCell>
                  <TableCell>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {route.pattern}
                    </code>
                  </TableCell>
                  <TableCell>
                    {route.prepend ? (
                      <code className="bg-blue-100 px-2 py-1 rounded text-sm">
                        {route.prepend}
                      </code>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {getTrunkName(route.trunk)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={route.enabled ? 'default' : 'secondary'}>
                      {route.enabled ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(route)}
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(route.id)}
                        title="Excluir"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Guia de Padrões */}
      <Card>
        <CardHeader>
          <CardTitle>Guia de Padrões de Discagem</CardTitle>
          <CardDescription>
            Entenda como criar padrões eficientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Caracteres Especiais</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <code className="bg-gray-100 px-2 py-1 rounded font-mono">X</code>
                  <span>Qualquer dígito (0-9)</span>
                </div>
                <div className="flex items-center gap-3">
                  <code className="bg-gray-100 px-2 py-1 rounded font-mono">N</code>
                  <span>Dígitos 2-9</span>
                </div>
                <div className="flex items-center gap-3">
                  <code className="bg-gray-100 px-2 py-1 rounded font-mono">Z</code>
                  <span>Dígitos 1-9</span>
                </div>
                <div className="flex items-center gap-3">
                  <code className="bg-gray-100 px-2 py-1 rounded font-mono">.</code>
                  <span>Qualquer caractere</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Exemplos Práticos</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <code className="bg-blue-100 px-2 py-1 rounded font-mono">11XXXXXXXX</code>
                  <p className="text-gray-600 mt-1">Números fixos de São Paulo</p>
                </div>
                <div>
                  <code className="bg-green-100 px-2 py-1 rounded font-mono">119XXXXXXXX</code>
                  <p className="text-gray-600 mt-1">Celulares de São Paulo</p>
                </div>
                <div>
                  <code className="bg-purple-100 px-2 py-1 rounded font-mono">NXXXXXXXXX</code>
                  <p className="text-gray-600 mt-1">DDD nacional (10 dígitos)</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Outbound;
