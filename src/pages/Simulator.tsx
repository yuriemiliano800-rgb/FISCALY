import { useState } from 'react';
import { 
  Calculator, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  RefreshCw,
  FileText,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

export function Simulator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    originUF: 'SP',
    destUF: 'RJ',
    regime: 'Regime Normal',
    operationType: 'Venda',
    isEntry: false,
    clientType: 'Contribuinte',
    ncm: '',
  });

  const handleSimulate = () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const isInterestadual = formData.originUF !== formData.destUF;
      
      let cfop = '5102';
      if (isInterestadual) cfop = '6102';
      if (formData.operationType === 'Devolução') cfop = isInterestadual ? '6202' : '5202';

      setResult({
        cfop,
        cst: formData.regime === 'Simples Nacional' ? '102' : '00',
        taxes: {
          icms: isInterestadual ? '12% (Interestadual)' : '18% (Interna)',
          ipi: '0% (Não incidente)',
          pis: '1.65%',
          cofins: '7.6%',
          difal: isInterestadual && formData.clientType === 'Consumidor Final' ? 'Sim (DIFAL devido)' : 'Não'
        },
        observations: [
          'Operação sujeita ao regime de tributação normal.',
          'Verificar se há Protocolo de ICMS entre os estados para ST.',
          'Destaque de ICMS obrigatório no campo próprio.'
        ],
        alerts: [
          'Certifique-se que o NCM informado possui alíquota de IPI zero.',
          'O destinatário deve estar com a Inscrição Estadual ativa.'
        ]
      });
      setLoading(false);
      toast.success('Simulação concluída com sucesso!');
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Calculator className="text-yellow-500" />
          <h1 className="text-3xl font-bold tracking-tight text-white">Simulador Fiscal</h1>
        </div>
        <p className="text-zinc-400">Simule cenários tributários e descubra o enquadramento provável da sua operação.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader>
            <CardTitle>Dados da Operação</CardTitle>
            <CardDescription className="text-zinc-500">Preencha as informações básicas para simular.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Origem (UF)</label>
                <Select value={formData.originUF} onValueChange={(v) => setFormData({...formData, originUF: v})}>
                  <SelectTrigger className="bg-zinc-950 border-zinc-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    {UFS.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Destino (UF)</label>
                <Select value={formData.destUF} onValueChange={(v) => setFormData({...formData, destUF: v})}>
                  <SelectTrigger className="bg-zinc-950 border-zinc-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    {UFS.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Regime Tributário</label>
              <Select value={formData.regime} onValueChange={(v) => setFormData({...formData, regime: v})}>
                <SelectTrigger className="bg-zinc-950 border-zinc-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value="Regime Normal">Regime Normal (Lucro Real/Presumido)</SelectItem>
                  <SelectItem value="Simples Nacional">Simples Nacional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Tipo de Operação</label>
                <Select value={formData.operationType} onValueChange={(v) => setFormData({...formData, operationType: v})}>
                  <SelectTrigger className="bg-zinc-950 border-zinc-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectItem value="Venda">Venda</SelectItem>
                    <SelectItem value="Compra">Compra</SelectItem>
                    <SelectItem value="Devolução">Devolução</SelectItem>
                    <SelectItem value="Remessa">Remessa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Destinatário</label>
                <Select value={formData.clientType} onValueChange={(v) => setFormData({...formData, clientType: v})}>
                  <SelectTrigger className="bg-zinc-950 border-zinc-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectItem value="Contribuinte">Contribuinte</SelectItem>
                    <SelectItem value="Não Contribuinte">Não Contribuinte</SelectItem>
                    <SelectItem value="Consumidor Final">Consumidor Final</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">NCM do Produto (Opcional)</label>
              <Input 
                placeholder="Ex: 61091000" 
                className="bg-zinc-950 border-zinc-800"
                value={formData.ncm}
                onChange={(e) => setFormData({...formData, ncm: e.target.value})}
              />
            </div>

            <Button 
              className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 font-bold"
              onClick={handleSimulate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-4 w-4" />
                  Simular Operação
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-zinc-600 border-2 border-dashed border-zinc-800 rounded-xl p-12 text-center"
              >
                <Calculator size={48} className="mb-4 opacity-20" />
                <h3 className="text-lg font-medium">Aguardando Simulação</h3>
                <p className="text-sm max-w-[250px] mt-2">Preencha os dados ao lado para ver o enquadramento fiscal sugerido.</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <Card className="bg-zinc-900 border-zinc-800 text-white border-l-4 border-l-orange-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-500" />
                      Resultado da Simulação
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                        <span className="text-xs font-bold text-zinc-500 uppercase block mb-1">CFOP Sugerido</span>
                        <span className="text-2xl font-mono font-bold text-orange-500">{result.cfop}</span>
                      </div>
                      <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                        <span className="text-xs font-bold text-zinc-500 uppercase block mb-1">CST/CSOSN</span>
                        <span className="text-2xl font-mono font-bold text-blue-500">{result.cst}</span>
                      </div>
                    </div>

                    <Separator className="bg-zinc-800" />

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-zinc-400 flex items-center gap-2">
                        <TrendingUp size={16} /> Impostos Envolvidos
                      </h4>
                      <div className="grid grid-cols-2 gap-y-3 text-sm">
                        <div className="text-zinc-500">ICMS:</div>
                        <div className="text-zinc-200 text-right">{result.taxes.icms}</div>
                        <div className="text-zinc-500">IPI:</div>
                        <div className="text-zinc-200 text-right">{result.taxes.ipi}</div>
                        <div className="text-zinc-500">PIS/COFINS:</div>
                        <div className="text-zinc-200 text-right">{result.taxes.pis} / {result.taxes.cofins}</div>
                        <div className="text-zinc-500">DIFAL:</div>
                        <div className="text-zinc-200 text-right">{result.taxes.difal}</div>
                      </div>
                    </div>

                    <Separator className="bg-zinc-800" />

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-zinc-400 flex items-center gap-2">
                        <Info size={16} /> Observações
                      </h4>
                      <ul className="space-y-2">
                        {result.observations.map((obs: string, i: number) => (
                          <li key={i} className="text-xs text-zinc-400 flex gap-2">
                            <span className="text-orange-500">•</span> {obs}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg space-y-2">
                      <h4 className="text-xs font-bold text-red-500 flex items-center gap-2 uppercase">
                        <AlertTriangle size={14} /> Alertas de Validação
                      </h4>
                      <ul className="space-y-1">
                        {result.alerts.map((alert: string, i: number) => (
                          <li key={i} className="text-[10px] text-red-400 leading-tight">• {alert}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 border-zinc-800 text-zinc-400 hover:text-white" onClick={() => setResult(null)}>
                    Nova Simulação
                  </Button>
                  <Button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white">
                    Salvar no Histórico
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
