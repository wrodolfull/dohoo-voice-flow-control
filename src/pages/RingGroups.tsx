
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Users, Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

interface RingGroup {
  id: string;
  name: string;
  number: string;
  strategy: 'simultaneous' | 'sequential' | 'round_robin';
  timeout: number;
  extensions: string[];
  enabled: boolean;
}

const RingGroups = () => {
  const [groups, setGroups] = useState<RingGroup[]>([
    {
      id: '1',
      name: 'Atendimento Comercial',
      number: '2000',
      strategy: 'simultaneous',
      timeout: 30,
      extensions: ['1001', '1002', '1003'],
      enabled: true
    },
    {
      id: '2',
      name: 'Suporte Técnico',
      number: '2001',
      strategy: 'sequential',
      timeout: 20,
      extensions: ['1004', '1005'],
      enabled: true
    },
    {
      id: '3',
      name: 'Gerência',
      number: '2002',
      strategy: 'round_robin',
      timeout: 45,
      extensions: ['1001', '1006'],
      enabled: false
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<RingGroup | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    strategy: 'simultaneous' as RingGroup['strategy'],
    timeout: 30,
    extensions: [] as string[],
    enabled: true
  });

  // Ramais disponíveis (simulado)
  const availableExtensions = [
    { number: '1001', name: 'João Silva' },
    { number: '1002', name: 'Maria Santos' },
    { number: '1003', name: 'Pedro Costa' },
    { number: '1004', name: 'Ana Oliveira' },
    { number: '1005', name: 'Carlos Lima' },
    { number: '1006', name: 'Fernanda Rocha' }
  ];

  const strategies = [
    { value: 'simultaneous', label: 'Simultâneo - Todos tocam ao mesmo tempo' },
    { value: 'sequential', label: 'Sequencial - Um por vez na ordem' },
    { value: 'round_robin', label: 'Rotativo - Distribui as chamadas' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.extensions.length === 0) {
      toast.error('Selecione pelo menos um ramal para o grupo');
      return;
    }

    const newGroup: RingGroup = {
      id: editingGroup?.id || Date.now().toString(),
      name: formData.name,
      number: formData.number,
      strategy: formData.strategy,
      timeout: formData.timeout,
      extensions: formData.extensions,
      enabled: formData.enabled
    };

    if (editingGroup) {
      setGroups(groups.map(group => 
        group.id === editingGroup.id ? newGroup : group
      ));
      toast.success('Grupo de atendimento atualizado com sucesso!');
    } else {
      setGroups([...groups, newGroup]);
      toast.success('Grupo de atendimento criado com sucesso!');
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      number: '',
      strategy: 'simultaneous',
      timeout: 30,
      extensions: [],
      enabled: true
    });
    setEditingGroup(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (group: RingGroup) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      number: group.number,
      strategy: group.strategy,
      timeout: group.timeout,
      extensions: group.extensions,
      enabled: group.enabled
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setGroups(groups.filter(group => group.id !== id));
    toast.success('Grupo de atendimento removido com sucesso!');
  };

  const toggleExtension = (extensionNumber: string) => {
    const updatedExtensions = formData.extensions.includes(extensionNumber)
      ? formData.extensions.filter(ext => ext !== extensionNumber)
      : [...formData.extensions, extensionNumber];
    
    setFormData({ ...formData, extensions: updatedExtensions });
  };

  const getExtensionName = (number: string) => {
    const extension = availableExtensions.find(ext => ext.number === number);
    return extension ? extension.name : number;
  };

  const getStrategyLabel = (strategy: string) => {
    const strategyObj = strategies.find(s => s.value === strategy);
    return strategyObj ? strategyObj.label.split(' - ')[0] : strategy;
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.number.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-dohoo-primary" />
            Grupos de Atendimento
          </h1>
          <p className="text-gray-600">
            Configure grupos de ramais para distribuir chamadas de forma inteligente
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Grupo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingGroup ? 'Editar Grupo' : 'Novo Grupo de Atendimento'}
              </DialogTitle>
              <DialogDescription>
                Configure um grupo de ramais para distribuir chamadas
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Grupo</Label>
                <Input
                  id="name"
                  placeholder="Ex: Atendimento Comercial"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="number">Número do Grupo</Label>
                <Input
                  id="number"
                  placeholder="Ex: 2000"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="strategy">Estratégia de Chamada</Label>
                <Select
                  value={formData.strategy}
                  onValueChange={(value: RingGroup['strategy']) => 
                    setFormData({ ...formData, strategy: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {strategies.map((strategy) => (
                      <SelectItem key={strategy.value} value={strategy.value}>
                        {strategy.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeout">Timeout (segundos)</Label>
                <Input
                  id="timeout"
                  type="number"
                  min="10"
                  max="120"
                  value={formData.timeout}
                  onChange={(e) => setFormData({ ...formData, timeout: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Ramais do Grupo</Label>
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                  {availableExtensions.map((extension) => (
                    <div key={extension.number} className="flex items-center space-x-2">
                      <Checkbox
                        id={extension.number}
                        checked={formData.extensions.includes(extension.number)}
                        onCheckedChange={() => toggleExtension(extension.number)}
                      />
                      <Label htmlFor={extension.number} className="flex-1 cursor-pointer">
                        {extension.number} - {extension.name}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  {formData.extensions.length} ramal(is) selecionado(s)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enabled"
                  checked={formData.enabled}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, enabled: checked as boolean })
                  }
                />
                <Label htmlFor="enabled">Grupo ativo</Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingGroup ? 'Atualizar' : 'Criar Grupo'}
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
              placeholder="Buscar grupos por nome ou número..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Grupos */}
      <Card>
        <CardHeader>
          <CardTitle>Grupos Configurados ({filteredGroups.length})</CardTitle>
          <CardDescription>
            Gerencie seus grupos de atendimento e suas configurações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Grupo</TableHead>
                <TableHead>Número</TableHead>
                <TableHead>Estratégia</TableHead>
                <TableHead>Ramais</TableHead>
                <TableHead>Timeout</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGroups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="font-medium">{group.name}</TableCell>
                  <TableCell>
                    <code className="bg-gray-100 px-2 py-1 rounded">{group.number}</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getStrategyLabel(group.strategy)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {group.extensions.slice(0, 3).map((ext) => (
                        <Badge key={ext} variant="secondary" className="text-xs">
                          {ext}
                        </Badge>
                      ))}
                      {group.extensions.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{group.extensions.length - 3}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {group.extensions.length} ramal(is)
                    </p>
                  </TableCell>
                  <TableCell>{group.timeout}s</TableCell>
                  <TableCell>
                    <Badge variant={group.enabled ? 'default' : 'secondary'}>
                      {group.enabled ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(group)}
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(group.id)}
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
    </div>
  );
};

export default RingGroups;
