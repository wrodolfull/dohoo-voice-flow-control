
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
import { PhoneIncoming, Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

interface InboundRoute {
  id: string;
  did: string;
  description: string;
  destination: string;
  destinationType: 'extension' | 'group' | 'ura';
  enabled: boolean;
}

const Inbound = () => {
  const [routes, setRoutes] = useState<InboundRoute[]>([
    {
      id: '1',
      did: '1133334444',
      description: 'Número principal',
      destination: '1',
      destinationType: 'ura',
      enabled: true
    },
    {
      id: '2',
      did: '1133335555',
      description: 'Linha direta vendas',
      destination: '2000',
      destinationType: 'group',
      enabled: true
    },
    {
      id: '3',
      did: '1133336666',
      description: 'Suporte técnico',
      destination: '1005',
      destinationType: 'extension',
      enabled: false
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<InboundRoute | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    did: '',
    description: '',
    destination: '',
    destinationType: 'ura' as InboundRoute['destinationType'],
    enabled: true
  });

  // Dados simulados
  const availableExtensions = [
    { number: '1001', name: 'João Silva' },
    { number: '1002', name: 'Maria Santos' },
    { number: '1003', name: 'Pedro Costa' }
  ];

  const availableGroups = [
    { number: '2000', name: 'Atendimento Comercial' },
    { number: '2001', name: 'Suporte Técnico' },
    { number: '2002', name: 'Gerência' }
  ];

  const availableURAs = [
    { id: '1', name: 'Atendimento Principal' },
    { id: '2', name: 'URA Comercial' },
    { id: '3', name: 'URA Suporte' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRoute: InboundRoute = {
      id: editingRoute?.id || Date.now().toString(),
      did: formData.did,
      description: formData.description,
      destination: formData.destination,
      destinationType: formData.destinationType,
      enabled: formData.enabled
    };

    if (editingRoute) {
      setRoutes(routes.map(route => 
        route.id === editingRoute.id ? newRoute : route
      ));
      toast.success('Rota de entrada atualizada com sucesso!');
    } else {
      setRoutes([...routes, newRoute]);
      toast.success('Rota de entrada criada com sucesso!');
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      did: '',
      description: '',
      destination: '',
      destinationType: 'ura',
      enabled: true
    });
    setEditingRoute(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (route: InboundRoute) => {
    setEditingRoute(route);
    setFormData({
      did: route.did,
      description: route.description,
      destination: route.destination,
      destinationType: route.destinationType,
      enabled: route.enabled
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setRoutes(routes.filter(route => route.id !== id));
    toast.success('Rota de entrada removida com sucesso!');
  };

  const getDestinationName = (route: InboundRoute) => {
    switch (route.destinationType) {
      case 'extension':
        const ext = availableExtensions.find(e => e.number === route.destination);
        return ext ? `${ext.number} - ${ext.name}` : route.destination;
      case 'group':
        const group = availableGroups.find(g => g.number === route.destination);
        return group ? `${group.number} - ${group.name}` : route.destination;
      case 'ura':
        const ura = availableURAs.find(u => u.id === route.destination);
        return ura ? ura.name : route.destination;
      default:
        return route.destination;
    }
  };

  const getDestinationOptions = () => {
    switch (formData.destinationType) {
      case 'extension':
        return availableExtensions.map(ext => ({
          value: ext.number,
          label: `${ext.number} - ${ext.name}`
        }));
      case 'group':
        return availableGroups.map(group => ({
          value: group.number,
          label: `${group.number} - ${group.name}`
        }));
      case 'ura':
        return availableURAs.map(ura => ({
          value: ura.id,
          label: ura.name
        }));
      default:
        return [];
    }
  };

  const filteredRoutes = routes.filter(route =>
    route.did.includes(searchTerm) ||
    route.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <PhoneIncoming className="w-8 h-8 text-dohoo-primary" />
            Rotas de Entrada
          </h1>
          <p className="text-gray-600">
            Configure números de entrada (DIDs) e seus destinos no sistema
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Rota
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingRoute ? 'Editar Rota' : 'Nova Rota de Entrada'}
              </DialogTitle>
              <DialogDescription>
                Configure um número de entrada e seu destino
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="did">Número DID</Label>
                <Input
                  id="did"
                  placeholder="Ex: 1133334444"
                  value={formData.did}
                  onChange={(e) => setFormData({ ...formData, did: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  placeholder="Ex: Número principal da empresa"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destinationType">Tipo de Destino</Label>
                <Select
                  value={formData.destinationType}
                  onValueChange={(value: InboundRoute['destinationType']) => {
                    setFormData({ ...formData, destinationType: value, destination: '' });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ura">URA Inteligente</SelectItem>
                    <SelectItem value="group">Grupo de Atendimento</SelectItem>
                    <SelectItem value="extension">Ramal Direto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">Destino</Label>
                <Select
                  value={formData.destination}
                  onValueChange={(value) => setFormData({ ...formData, destination: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o destino" />
                  </SelectTrigger>
                  <SelectContent>
                    {getDestinationOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

      {/* Busca */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por número ou descrição..."
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
            Gerencie os números de entrada e seus destinos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número DID</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo de Destino</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoutes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-medium">
                    <code className="bg-gray-100 px-2 py-1 rounded">
                      {route.did}
                    </code>
                  </TableCell>
                  <TableCell>{route.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {route.destinationType === 'ura' ? 'URA' : 
                       route.destinationType === 'group' ? 'Grupo' : 'Ramal'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {getDestinationName(route)}
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

      {/* Informações */}
      <Card>
        <CardHeader>
          <CardTitle>Como Funciona</CardTitle>
          <CardDescription>
            Entenda como configurar suas rotas de entrada
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">URA Inteligente</h4>
              <p className="text-sm text-blue-700">
                Direciona para uma URA com processamento de IA que entende comandos de voz naturais
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Grupo de Atendimento</h4>
              <p className="text-sm text-green-700">
                Direciona para um grupo de ramais com estratégia configurável (simultâneo, sequencial, etc.)
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Ramal Direto</h4>
              <p className="text-sm text-purple-700">
                Direciona diretamente para um ramal específico, sem passar por URA ou grupo
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inbound;
