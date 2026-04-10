import { motion } from 'motion/react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  FileSearch,
  Zap,
  BookOpen,
  Database
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { seedDatabase } from '../lib/seed';
import { toast } from 'sonner';
import { auth } from '../lib/firebase';

export function Dashboard() {
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    if (!auth.currentUser) {
      toast.error("Você precisa estar logado para popular o banco de dados.");
      return;
    }
    setSeeding(true);
    const result = await seedDatabase();
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setSeeding(false);
  };
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">Bem-vindo ao Fiscaly</h1>
          <p className="text-zinc-400">Sua central de inteligência fiscal e contábil.</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-zinc-800 text-zinc-400 hover:text-orange-500"
          onClick={handleSeed}
          disabled={seeding}
        >
          <Database size={14} className={`mr-2 ${seeding ? 'animate-spin' : ''}`} />
          {seeding ? 'Populando...' : 'Popular Banco Real'}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultas Hoje</CardTitle>
            <FileSearch className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-zinc-500">+12% em relação a ontem</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Simulações Realizadas</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-zinc-500">85% de assertividade</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Fiscais</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-zinc-500">Novas atualizações do SEFAZ</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas Ativas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-zinc-500">Gerenciamento centralizado</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-zinc-900 border-zinc-800 text-white">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription className="text-zinc-500">Suas últimas consultas e simulações.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'consult', title: 'Consulta CFOP 5102', time: 'Há 10 min', status: 'success' },
                { type: 'sim', title: 'Simulação Venda Interestadual (SP -> RJ)', time: 'Há 45 min', status: 'warning' },
                { type: 'consult', title: 'Consulta NCM 61091000', time: 'Há 2 horas', status: 'success' },
                { type: 'sim', title: 'Simulação Devolução de Compra', time: 'Há 3 horas', status: 'success' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-800/50 transition-colors">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    item.type === 'consult' ? "bg-blue-500/10 text-blue-500" : "bg-orange-500/10 text-orange-500"
                  )}>
                    {item.type === 'consult' ? <FileSearch size={18} /> : <Zap size={18} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={12} className="text-zinc-500" />
                      <span className="text-xs text-zinc-500">{item.time}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={cn(
                    "border-zinc-700",
                    item.status === 'success' ? "text-green-500" : "text-yellow-500"
                  )}>
                    {item.status === 'success' ? 'Concluído' : 'Atenção'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-zinc-900 border-zinc-800 text-white">
          <CardHeader>
            <CardTitle>Insights e Atualizações</CardTitle>
            <CardDescription className="text-zinc-500">Fique por dentro das mudanças na legislação e dicas técnicas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-orange-600/10 border border-orange-600/20 space-y-2">
              <h3 className="font-semibold text-orange-500 flex items-center gap-2">
                <BookOpen size={16} />
                Guia: Substituição Tributária
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Entenda como funciona o recolhimento antecipado do ICMS e evite a bitributação em suas operações.
              </p>
              <Button variant="link" className="p-0 h-auto text-orange-500 text-xs">Ler artigo completo →</Button>
            </div>
            
            <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 space-y-2">
              <h3 className="font-semibold text-zinc-200 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" />
                Novidade: DIFAL 2024
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Confira as novas alíquotas e regras para o Diferencial de Alíquota em operações interestaduais para consumidores finais.
              </p>
              <Button variant="link" className="p-0 h-auto text-zinc-400 text-xs">Ver detalhes →</Button>
            </div>

            <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-600/20 space-y-2">
              <h3 className="font-semibold text-blue-500 flex items-center gap-2">
                <Zap size={16} />
                Dica: Malha Fiscal
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Como evitar inconsistências entre o EFD Reinf e a DCTFWeb no fechamento mensal.
              </p>
              <Button variant="link" className="p-0 h-auto text-blue-500 text-xs">Ver dica técnica →</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
