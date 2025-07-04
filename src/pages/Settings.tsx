
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Database,
  Key,
  Save,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Configurações da empresa
  const [companySettings, setCompanySettings] = useState({
    name: 'Empresa Demo Ltda',
    domain: 'empresa.dohoo.com.br',
    timezone: 'America/Sao_Paulo',
    language: 'pt-BR',
    maxExtensions: 50,
    maxConcurrentCalls: 30
  });

  // Configurações de notificação
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    aiUsageWarning: true,
    systemMaintenance: true,
    weeklyReports: true,
    callFailures: true
  });

  // Configurações de segurança
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiry: 90,
    sessionTimeout: 30,
    ipWhitelist: '',
    auditLog: true
  });

  // Configurações de integração
  const [integrationSettings, setIntegrationSettings] = useState({
    webhookUrl: '',
    apiKey: '',
    crmIntegration: false,
    googleCalendar: false,
    slackNotifications: false
  });

  const handleSaveCompany = async () => {
    setLoading(true);
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configurações da empresa atualizadas!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configurações de notificação atualizadas!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSecurity = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configurações de segurança atualizadas!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveIntegrations = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configurações de integração atualizadas!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleTestWebhook = () => {
    if (!integrationSettings.webhookUrl) {
      toast.error('Informe a URL do webhook primeiro');
      return;
    }
    
    toast.info('Testando webhook...');
    setTimeout(() => {
      toast.success('Webhook testado com sucesso!');
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-dohoo-primary" />
          Configurações
        </h1>
        <p className="text-gray-600">
          Gerencie as configurações do sistema, segurança e integrações
        </p>
      </div>

      {/* Informações da Conta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações da Conta
          </CardTitle>
          <CardDescription>
            Informações básicas da sua conta e empresa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome do Usuário</Label>
              <Input value={user?.name || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Conta</Label>
              <Badge variant="outline" className="w-fit capitalize">
                {user?.role}
              </Badge>
            </div>
            <div className="space-y-2">
              <Label>Domínio</Label>
              <Input value={user?.domain || ''} disabled />
            </div>
          </div>
          
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Para alterar informações da conta, entre em contato com o suporte.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Configurações da Empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Configurações da Empresa
          </CardTitle>
          <CardDescription>
            Configure informações básicas da sua empresa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nome da Empresa</Label>
              <Input
                id="companyName"
                value={companySettings.name}
                onChange={(e) => setCompanySettings({
                  ...companySettings,
                  name: e.target.value
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain">Domínio</Label>
              <Input
                id="domain"
                value={companySettings.domain}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuso Horário</Label>
              <Select
                value={companySettings.timezone}
                onValueChange={(value) => setCompanySettings({
                  ...companySettings,
                  timezone: value
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                  <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                  <SelectItem value="America/Rio_Branco">Rio Branco (GMT-5)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select
                value={companySettings.language}
                onValueChange={(value) => setCompanySettings({
                  ...companySettings,
                  language: value
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxExtensions">Limite de Ramais</Label>
              <Input
                id="maxExtensions"
                type="number"
                value={companySettings.maxExtensions}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxCalls">Chamadas Simultâneas</Label>
              <Input
                id="maxCalls"
                type="number"
                value={companySettings.maxConcurrentCalls}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>

          <Button onClick={handleSaveCompany} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificações
          </CardTitle>
          <CardDescription>
            Configure como e quando receber notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailAlerts">Alertas por Email</Label>
                <p className="text-sm text-gray-600">Receber notificações importantes por email</p>
              </div>
              <Switch
                id="emailAlerts"
                checked={notificationSettings.emailAlerts}
                onCheckedChange={(checked) => setNotificationSettings({
                  ...notificationSettings,
                  emailAlerts: checked
                })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsAlerts">Alertas por SMS</Label>
                <p className="text-sm text-gray-600">Receber notificações críticas por SMS</p>
              </div>
              <Switch
                id="smsAlerts"
                checked={notificationSettings.smsAlerts}
                onCheckedChange={(checked) => setNotificationSettings({
                  ...notificationSettings,
                  smsAlerts: checked
                })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="aiUsageWarning">Aviso de Consumo IA</Label>
                <p className="text-sm text-gray-600">Alertar quando atingir 90% dos minutos IA</p>
              </div>
              <Switch
                id="aiUsageWarning"
                checked={notificationSettings.aiUsageWarning}
                onCheckedChange={(checked) => setNotificationSettings({
                  ...notificationSettings,
                  aiUsageWarning: checked
                })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="callFailures">Falhas de Chamada</Label>
                <p className="text-sm text-gray-600">Notificar sobre falhas no sistema</p>
              </div>
              <Switch
                id="callFailures"
                checked={notificationSettings.callFailures}
                onCheckedChange={(checked) => setNotificationSettings({
                  ...notificationSettings,
                  callFailures: checked
                })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weeklyReports">Relatórios Semanais</Label>
                <p className="text-sm text-gray-600">Receber resumo semanal por email</p>
              </div>
              <Switch
                id="weeklyReports"
                checked={notificationSettings.weeklyReports}
                onCheckedChange={(checked) => setNotificationSettings({
                  ...notificationSettings,
                  weeklyReports: checked
                })}
              />
            </div>
          </div>

          <Button onClick={handleSaveNotifications} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Notificações
          </Button>
        </CardContent>
      </Card>

      {/* Segurança */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Segurança
          </CardTitle>
          <CardDescription>
            Configure políticas de segurança e acesso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="twoFactor">Autenticação de Dois Fatores</Label>
                <p className="text-sm text-gray-600">Adiciona uma camada extra de segurança</p>
              </div>
              <Switch
                id="twoFactor"
                checked={securitySettings.twoFactorAuth}
                onCheckedChange={(checked) => setSecuritySettings({
                  ...securitySettings,
                  twoFactorAuth: checked
                })}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="passwordExpiry">Expiração de Senha (dias)</Label>
                <Input
                  id="passwordExpiry"
                  type="number"
                  min="30"
                  max="365"
                  value={securitySettings.passwordExpiry}
                  onChange={(e) => setSecuritySettings({
                    ...securitySettings,
                    passwordExpiry: parseInt(e.target.value)
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Timeout de Sessão (min)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="5"
                  max="480"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings({
                    ...securitySettings,
                    sessionTimeout: parseInt(e.target.value)
                  })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ipWhitelist">Lista de IPs Permitidos</Label>
              <Textarea
                id="ipWhitelist"
                placeholder="Digite os IPs permitidos, um por linha"
                value={securitySettings.ipWhitelist}
                onChange={(e) => setSecuritySettings({
                  ...securitySettings,
                  ipWhitelist: e.target.value
                })}
                rows={3}
              />
              <p className="text-sm text-gray-600">
                Deixe vazio para permitir acesso de qualquer IP
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auditLog">Log de Auditoria</Label>
                <p className="text-sm text-gray-600">Registrar todas as ações dos usuários</p>
              </div>
              <Switch
                id="auditLog"
                checked={securitySettings.auditLog}
                onCheckedChange={(checked) => setSecuritySettings({
                  ...securitySettings,
                  auditLog: checked
                })}
              />
            </div>
          </div>

          <Button onClick={handleSaveSecurity} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Segurança
          </Button>
        </CardContent>
      </Card>

      {/* Integrações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Integrações
          </CardTitle>
          <CardDescription>
            Configure integrações com sistemas externos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">URL do Webhook</Label>
              <div className="flex gap-2">
                <Input
                  id="webhookUrl"
                  placeholder="https://api.seusite.com/webhook"
                  value={integrationSettings.webhookUrl}
                  onChange={(e) => setIntegrationSettings({
                    ...integrationSettings,
                    webhookUrl: e.target.value
                  })}
                />
                <Button variant="outline" onClick={handleTestWebhook}>
                  Testar
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apiKey">Chave da API</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Sua chave de API"
                value={integrationSettings.apiKey}
                onChange={(e) => setIntegrationSettings({
                  ...integrationSettings,
                  apiKey: e.target.value
                })}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h4 className="font-medium">Integrações Disponíveis</h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="crmIntegration">Integração CRM</Label>
                  <p className="text-sm text-gray-600">Sincronizar contatos e histórico</p>
                </div>
                <Switch
                  id="crmIntegration"
                  checked={integrationSettings.crmIntegration}
                  onCheckedChange={(checked) => setIntegrationSettings({
                    ...integrationSettings,
                    crmIntegration: checked
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="googleCalendar">Google Calendar</Label>
                  <p className="text-sm text-gray-600">Criar eventos automáticos</p>
                </div>
                <Switch
                  id="googleCalendar"
                  checked={integrationSettings.googleCalendar}
                  onCheckedChange={(checked) => setIntegrationSettings({
                    ...integrationSettings,
                    googleCalendar: checked
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="slackNotifications">Notificações Slack</Label>
                  <p className="text-sm text-gray-600">Enviar alertas para o Slack</p>
                </div>
                <Switch
                  id="slackNotifications"
                  checked={integrationSettings.slackNotifications}
                  onCheckedChange={(checked) => setIntegrationSettings({
                    ...integrationSettings,
                    slackNotifications: checked
                  })}
                />
              </div>
            </div>
          </div>

          <Button onClick={handleSaveIntegrations} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Integrações
          </Button>
        </CardContent>
      </Card>

      {/* Informações do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Informações do Sistema
          </CardTitle>
          <CardDescription>
            Detalhes técnicos e versão do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Versão do Sistema</Label>
                <p className="text-sm text-gray-600">Dohoo IABX v2.1.0</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Última Atualização</Label>
                <p className="text-sm text-gray-600">15 de dezembro de 2024</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Servidor</Label>
                <p className="text-sm text-gray-600">AWS São Paulo (sa-east-1)</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">ID da Conta</Label>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {user?.id || 'N/A'}
                </code>
              </div>
              <div>
                <Label className="text-sm font-medium">Domínio Técnico</Label>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  pbx-{user?.domain?.split('.')[0] || 'demo'}.dohoo.cloud
                </code>
              </div>
              <div>
                <Label className="text-sm font-medium">Status API</Label>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Operacional
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
