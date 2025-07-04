
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
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
import { Wifi, Plus, Edit, Trash2, Search, TestTube, Activity } from "lucide-react";
import { toast } from "sonner";

interface Trunk {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  transport: 'udp' | 'tcp' | 'tls';
  codecs: string[];
  maxChannels: number;
  status: 'online' | 'offline' | 'error';
  enabled: boolean;
  description?: string;
}

const Trunks = () => {
  const [trunks, setTrunks] = useState<Trunk[]>([
    {
      id: '1',
      name: 'Operadora Principal',
      host: 'sip.operadora.com.br',
      port: 5060,
      username: 'empresa123',
      password: 'senha_secreta',
      transport: 'udp',
      codecs: ['PCMU', 'PCMA', 'G729'],
      maxChannels: 30,
      status: 'online',
      enabled: true,
      description: 'Tronco principal para chamadas locais'
    },
    {
      id: '2',
      name: 'Backup Celular',
      host: '200.150.100.50',
      port: 5060,
      username: 'backup_user',
      password: 'backup_pass',
      transport: 'tcp',
      codecs: ['PCMU', 'PCMA'],
      maxChannels: 10,
      status: 'offline',
      enabled: true,
      description: 'Tronco backup para celulares'
    },
    {
      id: '3',
      name: 'Internacional',
      host: 'intl.voipprovider.com',
      port: 5061,
      username: 'intl_account',
      password: 'intl_secret',
      transport: 'tls',
      codecs: ['G722', 'PCMU'],
      maxChannels: 5,
      status: 'error',
      enabled: false,
      description: 'Tronco para chamadas internacionais'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTrunk, setEditingTrunk] = useState<Trunk | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    host: '',
    port: 5060,
    username: '',
    password: '',
    transport: 'udp' as Trunk['transport'],
    codecs: [] as string[],
    maxChannels: 30,
    enabled: true,
    description: ''
  });

  const availableCodecs = [
    { value: 'PCMU', label: 'PCMU (G.711 μ-law)' },
    { value: 'PCMA', label: 'PCMA (G.711 A-law)' },
    { value: 'G722', label: 'G.722 (HD Audio)' },
    { value: 'G729', label: 'G.729 (Comprimido)' },
    { value: 'GSM', label: 'GSM' },
    { value: 'OPUS', label: 'OPUS (HD)' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.codecs.length === 0) {
      toast.error('Selecione pelo menos um codec');
      return;
    }

    const newTrunk: Trunk = {
      id: editingTrunk?.id || Date.now().toString(),
      name: formData.name,
      host: formData.host,
      port: formData.port,
      username: formData.username,
      password: formData.password,
      transport: formData.transport,
      codecs: formData.codecs,
      maxChannels: formData.maxChannels,
      status: 'offline', // Status inicial
      enabled: formData.enabled,
      description: formData.description
    };

    if (editingTrunk) {
      setTrunks(trunks.map(trunk => 
        trunk.id === editingTrunk.id ? { ...newTrunk, status: editingTrunk.status } : trunk
      ));
      toast.success('Tronco atualizado com sucesso!');
    } else {
      setTrunks([...trunks, newTrunk]);
      toast.success('Tronco criado com sucesso!');
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      host: '',
      port: 5060,
      username: '',
      password: '',
      transport: 'udp',
      codecs: [],
      maxChannels: 30,
      enabled: true,
      description: ''
    });
    setEditingTrunk(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (trunk: Trunk) => {
    setEditingTrunk(trunk);
    setFormData({
      name: trunk.name,
      host: trunk.host,
      port: trunk.port,
      username: trunk.username,
      password: trunk.password,
      transport: trunk.transport,
      codecs: trunk.codecs,
      maxChannels: trunk.maxChannels,
      enabled: trunk.enabled,
      description: trunk.description || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setTrunks(trunks.filter(trunk => trunk.id !== id));
    toast.success('Tronco removido com sucesso!');
  };

  const handleTest = (trunk: Trunk) => {
    toast.info(`Testando conectividade do tronco ${trunk.name}...`);
    
    // Simular teste de conectividade
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // 70% de chance de sucesso
      if (isSuccess) {
        toast.success(`Tronco ${trunk.name} conectado com sucesso!`);
        setTrunks(trunks.map(t => 
          t.id === trunk.id ? { ...t, status: 'online' } : t
        ));
      } else {
        toast.error(`Falha na conexão com ${trunk.name}`);
        setTrunks(trunks.map(t => 
          t.id === trunk.id ? { ...t, status: 'error' } : t
        ));
      }
    }, 2000);
  };

  const toggleCodec = (codecValue: string) => {
    const updatedCodecs = formData.codecs.includes(codecValue)
      ? formData.codecs.filter(codec => codec !== codecValue)
      : [...formData.codecs, codecValue];
    
    setFormData({ ...formData, codecs: updatedCodecs });
  };

  const getStatusColor = (status: Trunk['status']) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800 border-green-300';
      case 'offline': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'error': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: Trunk['status']) => {
    switch (status) {
      case 'online': return <Activity className="w-3 h-3 text-green-600" />;
      case 'offline': return <div className="w-3 h-3 rounded-full bg-gray-400" />;
      case 'error': return <div className="w-3 h-3 rounded-full bg-red-500" />;
      default: return <div className="w-3 h-3 rounded-full bg-gray-400" />;
    }
  };

  const filteredTrunks = trunks.filter(trunk =>
    trunk.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trunk.host.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Wifi className="w-8 h-8 text-dohoo-primary" />
            Troncos SIP
          </h1>
          <p className="text-gray-600">
            Configure e gerencie as conexões com operadoras e provedores VoIP
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Tronco
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTrunk ? 'Editar Tronco' : 'Novo Tronco SIP'}
              </DialogTitle>
              <DialogDescription>
                Configure as informações de conexão com a operadora
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Tronco</Label>
                <Input
                  id="name"
                  placeholder="Ex: Operadora Principal"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="host">Servidor (IP ou Domínio)</Label>
                <Input
                  id="host"
                  placeholder="Ex: sip.operadora.com ou 192.168.1.100"
                  value={formData.host}
                  onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="port">Porta</Label>
                  <Input
                    id="port"
                    type="number"
                    min="1"
                    max="65535"
                    value={formData.port}
                    onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="transport">Transporte</Label>
                  <Select
                    value={formData.transport}
                    onValueChange={(value: Trunk['transport']) => 
                      setFormData({ ...formData, transport: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="udp">UDP</SelectItem>
                      <SelectItem value="tcp">TCP</SelectItem>
                      <SelectItem value="tls">TLS (Seguro)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Usuário</Label>
                  <Input
                    id="username"
                    placeholder="Nome de usuário"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Senha de autenticação"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Codecs Suportados</Label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-md p-3">
                  {availableCodecs.map((codec) => (
                    <div key={codec.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={codec.value}
                        checked={formData.codecs.includes(codec.value)}
                        onCheckedChange={() => toggleCodec(codec.value)}
                      />
                      <Label htmlFor={codec.value} className="text-sm cursor-pointer">
                        {codec.label}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  {formData.codecs.length} codec(s) selecionado(s)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxChannels">Canais Simultâneos</Label>
                <Input
                  id="maxChannels"
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.maxChannels}
                  onChange={(e) => setFormData({ ...formData, maxChannels: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Descrição ou observações sobre este tronco"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enabled"
                  checked={formData.enabled}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, enabled: checked as boolean })
                  }
                />
                <Label htmlFor="enabled">Tronco ativo</Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingTrunk ? 'Atualizar' : 'Criar Tronco'}
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
              placeholder="Buscar por nome ou servidor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Troncos */}
      <Card>
        <CardHeader>
          <CardTitle>Troncos Configurados ({filteredTrunks.length})</CardTitle>
          <CardDescription>
            Gerencie suas conexões SIP com operadoras e provedores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Servidor</TableHead>
                <TableHead>Transporte</TableHead>
                <TableHead>Codecs</TableHead>
                <TableHead>Canais</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrunks.map((trunk) => (
                <TableRow key={trunk.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(trunk.status)}
                      <Badge className={`text-xs ${getStatusColor(trunk.status)}`}>
                        {trunk.status === 'online' ? 'Online' : 
                         trunk.status === 'offline' ? 'Offline' : 'Erro'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{trunk.name}</div>
                      {trunk.description && (
                        <div className="text-sm text-gray-500">{trunk.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-sm">
                      <div>{trunk.host}</div>
                      <div className="text-gray-500">:{trunk.port}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="uppercase">
                      {trunk.transport}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {trunk.codecs.slice(0, 3).map((codec) => (
                        <Badge key={codec} variant="secondary" className="text-xs">
                          {codec}
                        </Badge>
                      ))}
                      {trunk.codecs.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{trunk.codecs.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className="font-medium">{trunk.maxChannels}</span>
                      <div className="text-gray-500">canais</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTest(trunk)}
                        title="Testar Conexão"
                        disabled={!trunk.enabled}
                      >
                        <TestTube className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(trunk)}
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(trunk.id)}
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

      {/* Guia de Configuração */}
      <Card>
        <CardHeader>
          <CardTitle>Guia de Configuração</CardTitle>
          <CardDescription>
            Informações importantes para configurar troncos SIP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Tipos de Transporte</h4>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-900">UDP</div>
                  <div className="text-blue-700">Mais rápido, padrão para VoIP</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-900">TCP</div>
                  <div className="text-green-700">Mais confiável, atravessa NAT</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="font-medium text-purple-900">TLS</div>
                  <div className="text-purple-700">Criptografado, mais seguro</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Codecs Recomendados</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="font-mono">PCMU/PCMA</span>
                  <span className="text-gray-600">Qualidade padrão</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="font-mono">G722</span>
                  <span className="text-gray-600">HD Audio</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="font-mono">G729</span>
                  <span className="text-gray-600">Banda otimizada</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="font-mono">OPUS</span>
                  <span className="text-gray-600">Moderno, eficiente</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Trunks;
