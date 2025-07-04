
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { 
  Phone, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  QrCode, 
  Copy,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "sonner";

interface Extension {
  id: string;
  number: string;
  name: string;
  password: string;
  domain: string;
  port: string;
  status: 'active' | 'inactive';
  lastSeen?: string;
}

const Extensions = () => {
  const [extensions, setExtensions] = useState<Extension[]>([
    {
      id: '1',
      number: '1001',
      name: 'João Silva',
      password: 'A8x9K2m5',
      domain: 'empresa.dohoo.com.br',
      port: '5060',
      status: 'active',
      lastSeen: '2 min atrás'
    },
    {
      id: '2',
      number: '1002',
      name: 'Maria Santos',
      password: 'P3n7L9q4',
      domain: 'empresa.dohoo.com.br',
      port: '5060',
      status: 'active',
      lastSeen: '5 min atrás'
    },
    {
      id: '3',
      number: '1003',
      name: 'Pedro Costa',
      password: 'M6t4R8w2',
      domain: 'empresa.dohoo.com.br',
      port: '5060',
      status: 'inactive',
      lastSeen: '1 dia atrás'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExtension, setEditingExtension] = useState<Extension | null>(null);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    password: ''
  });

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const generateNextNumber = () => {
    const numbers = extensions.map(ext => parseInt(ext.number));
    const lastNumber = Math.max(...numbers, 1000);
    return (lastNumber + 1).toString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newExtension: Extension = {
      id: editingExtension?.id || Date.now().toString(),
      number: formData.number || generateNextNumber(),
      name: formData.name,
      password: formData.password || generatePassword(),
      domain: 'empresa.dohoo.com.br',
      port: '5060',
      status: 'active',
      lastSeen: 'Agora'
    };

    if (editingExtension) {
      setExtensions(extensions.map(ext => 
        ext.id === editingExtension.id ? newExtension : ext
      ));
      toast.success('Ramal atualizado com sucesso!');
    } else {
      setExtensions([...extensions, newExtension]);
      toast.success('Ramal criado com sucesso!');
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', number: '', password: '' });
    setEditingExtension(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (extension: Extension) => {
    setEditingExtension(extension);
    setFormData({
      name: extension.name,
      number: extension.number,
      password: extension.password
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setExtensions(extensions.filter(ext => ext.id !== id));
    toast.success('Ramal removido com sucesso!');
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência!');
  };

  const generateSipUri = (extension: Extension) => {
    return `sip:${extension.number}@${extension.domain}:${extension.port}`;
  };

  const generateQRCode = (extension: Extension) => {
    const sipUri = generateSipUri(extension);
    const qrData = `${sipUri}?password=${extension.password}`;
    
    // Simulação - em um app real, você usaria uma biblioteca de QR Code
    toast.info(`QR Code gerado para ${extension.name}`);
  };

  const filteredExtensions = extensions.filter(ext =>
    ext.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ext.number.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Phone className="w-8 h-8 text-dohoo-primary" />
            Ramais
          </h1>
          <p className="text-gray-600">
            Gerencie os ramais do seu sistema de telefonia
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              resetForm();
              setFormData({ ...formData, number: generateNextNumber(), password: generatePassword() });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Ramal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingExtension ? 'Editar Ramal' : 'Novo Ramal'}
              </DialogTitle>
              <DialogDescription>
                {editingExtension ? 'Atualize as informações do ramal' : 'Preencha os dados para criar um novo ramal'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Usuário</Label>
                <Input
                  id="name"
                  placeholder="Ex: João Silva"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="number">Número do Ramal</Label>
                <Input
                  id="number"
                  placeholder="Ex: 1001"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha SIP</Label>
                <div className="flex gap-2">
                  <Input
                    id="password"
                    type="text"
                    placeholder="Senha gerada automaticamente"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData({ ...formData, password: generatePassword() })}
                  >
                    Gerar
                  </Button>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingExtension ? 'Atualizar' : 'Criar Ramal'}
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
              placeholder="Buscar por nome ou número do ramal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Ramais */}
      <Card>
        <CardHeader>
          <CardTitle>Ramais Cadastrados ({filteredExtensions.length})</CardTitle>
          <CardDescription>
            Gerencie seus ramais, visualize configurações SIP e gere QR codes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ramal</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Configuração SIP</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Atividade</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExtensions.map((extension) => (
                <TableRow key={extension.id}>
                  <TableCell className="font-medium">{extension.number}</TableCell>
                  <TableCell>{extension.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Usuário:</span>
                        <code className="bg-gray-100 px-1 rounded">{extension.number}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(extension.number)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Senha:</span>
                        <code className="bg-gray-100 px-1 rounded">
                          {showPasswords[extension.id] ? extension.password : '••••••••'}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePasswordVisibility(extension.id)}
                        >
                          {showPasswords[extension.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(extension.password)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Servidor:</span>
                        <code className="bg-gray-100 px-1 rounded">{extension.domain}:{extension.port}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(`${extension.domain}:${extension.port}`)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={extension.status === 'active' ? 'default' : 'secondary'}>
                      {extension.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {extension.lastSeen}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => generateQRCode(extension)}
                        title="Gerar QR Code"
                      >
                        <QrCode className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(extension)}
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(extension.id)}
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

export default Extensions;
