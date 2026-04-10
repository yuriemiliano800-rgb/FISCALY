import { useState, useMemo } from 'react';
import { Search, FileText, Database, ShieldCheck, Filter, Info, BookOpen, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockCFOPs, mockNCMs, mockCSTs } from '../mockData';
import { motion, AnimatePresence } from 'motion/react';
import { CFOP, NCM } from '../types';

interface ConsultationProps {
  type: 'cfop' | 'ncm' | 'cst';
}

export function Consultation({ type }: ConsultationProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'entrada' | 'saida'>('all');
  const [selectedNcmForValidation, setSelectedNcmForValidation] = useState<string | null>(null);

  const getTitle = () => {
    switch (type) {
      case 'cfop': return 'Consulta CFOP';
      case 'ncm': return 'Consulta NCM';
      case 'cst': return 'Consulta CST/CSOSN';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'cfop': return <FileText className="text-orange-500" />;
      case 'ncm': return <Database className="text-blue-500" />;
      case 'cst': return <ShieldCheck className="text-green-500" />;
    }
  };

  const getData = () => {
    switch (type) {
      case 'cfop': 
        return mockCFOPs.filter(item => 
          (item.code.includes(searchTerm) || item.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (filter === 'all' || item.type === filter)
        );
      case 'ncm':
        return mockNCMs.filter(item => 
          item.code.includes(searchTerm) || item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'cst':
        return mockCSTs.filter(item => 
          item.code.includes(searchTerm) || item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
  };

  const results = getData();

  const validateCfopWithNcm = (cfop: CFOP, ncmCode: string) => {
    const ncm = mockNCMs.find(n => n.code === ncmCode);
    if (!ncm) return null;

    // Lógica de validação cruzada (Exemplos comuns)
    const isStNcm = ncm.taxNotes.toLowerCase().includes('st') || ncm.taxNotes.toLowerCase().includes('substituição');
    const isStCfop = ['5405', '5403', '5401', '1403', '2403'].includes(cfop.code);
    const isVendaCfop = cfop.code.startsWith('51') || cfop.code.startsWith('61');
    const isCompraCfop = cfop.code.startsWith('11') || cfop.code.startsWith('21');

    if (isStNcm && !isStCfop && (isVendaCfop || isCompraCfop)) {
      return {
        status: 'warning',
        message: `Atenção: Este NCM (${ncmCode}) costuma estar sujeito a Substituição Tributária, mas o CFOP ${cfop.code} é de operação normal. Verifique se não deveria usar um CFOP de ST (ex: 5405).`
      };
    }

    if (!isStNcm && isStCfop) {
      return {
        status: 'warning',
        message: `Inconsistência: O CFOP ${cfop.code} é para Substituição Tributária, mas o NCM ${ncmCode} não indica ST em nossa base. Verifique o enquadramento.`
      };
    }

    return {
      status: 'success',
      message: `Compatibilidade: O CFOP ${cfop.code} parece consistente com o NCM ${ncmCode} para esta operação.`
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          {getIcon()}
          <h1 className="text-3xl font-bold tracking-tight text-white">{getTitle()}</h1>
        </div>
        <p className="text-zinc-400">Busque por código ou descrição para obter detalhes técnicos.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <Input 
            placeholder={`Buscar ${type.toUpperCase()}...`} 
            className="pl-10 bg-zinc-900 border-zinc-800 text-white h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {type === 'cfop' && (
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex gap-2">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'} 
                onClick={() => setFilter('all')}
                className={filter === 'all' ? "bg-orange-600 hover:bg-orange-700" : "border-zinc-800 text-zinc-400"}
              >
                Todos
              </Button>
              <Button 
                variant={filter === 'entrada' ? 'default' : 'outline'} 
                onClick={() => setFilter('entrada')}
                className={filter === 'entrada' ? "bg-orange-600 hover:bg-orange-700" : "border-zinc-800 text-zinc-400"}
              >
                Entrada
              </Button>
              <Button 
                variant={filter === 'saida' ? 'default' : 'outline'} 
                onClick={() => setFilter('saida')}
                className={filter === 'saida' ? "bg-orange-600 hover:bg-orange-700" : "border-zinc-800 text-zinc-400"}
              >
                Saída
              </Button>
            </div>
            
            <div className="w-full md:w-64">
              <Select onValueChange={setSelectedNcmForValidation}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-300 h-12">
                  <SelectValue placeholder="Validar com NCM..." />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  {mockNCMs.map(ncm => (
                    <SelectItem key={ncm.code} value={ncm.code}>
                      {ncm.code} - {ncm.description.substring(0, 30)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {results.map((item, i) => (
              <motion.div
                key={item.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="bg-zinc-900 border-zinc-800 text-white overflow-hidden group hover:border-zinc-700 transition-all">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 bg-zinc-800 rounded font-mono text-lg font-bold text-orange-500">
                        {item.code}
                      </div>
                      <CardTitle className="text-lg font-semibold leading-tight">
                        {item.description}
                      </CardTitle>
                    </div>
                    {type === 'cfop' && (
                      <Badge className={item.type === 'entrada' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"}>
                        {item.type.toUpperCase()}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    {type === 'cfop' && (
                      <>
                        {selectedNcmForValidation && (
                          <div className={`p-3 rounded-lg border flex gap-3 items-start ${
                            validateCfopWithNcm(item as CFOP, selectedNcmForValidation)?.status === 'warning'
                              ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-200'
                              : 'bg-green-500/10 border-green-500/30 text-green-200'
                          }`}>
                            <div className="shrink-0 mt-0.5">
                              {validateCfopWithNcm(item as CFOP, selectedNcmForValidation)?.status === 'warning' 
                                ? <AlertTriangle size={16} className="text-yellow-500" />
                                : <CheckCircle2 size={16} className="text-green-500" />
                              }
                            </div>
                            <p className="text-xs font-medium">
                              {validateCfopWithNcm(item as CFOP, selectedNcmForValidation)?.message}
                            </p>
                          </div>
                        )}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-1">
                              <Info size={12} /> Explicação
                            </h4>
                            <p className="text-sm text-zinc-300">{(item as any).explanation}</p>
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-1">
                              <BookOpen size={12} /> Aplicação
                            </h4>
                            <p className="text-sm text-zinc-300">{(item as any).application}</p>
                          </div>
                        </div>
                        <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                          <h4 className="text-xs font-bold text-zinc-500 uppercase mb-1">Exemplo Real</h4>
                          <p className="text-sm italic text-zinc-400">"{(item as any).examples}"</p>
                        </div>
                      </>
                    )}
                    {type === 'ncm' && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-zinc-500 uppercase">Observações Tributárias</h4>
                        <p className="text-sm text-zinc-300">{(item as any).taxNotes}</p>
                      </div>
                    )}
                    {type === 'cst' && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-zinc-500 uppercase">Regime</h4>
                          <Badge variant="outline" className="border-zinc-700 text-zinc-300">{(item as any).regime}</Badge>
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-zinc-500 uppercase">Quando Usar</h4>
                          <p className="text-sm text-zinc-300">{(item as any).usage}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          {results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
              <Search size={48} className="mb-4 opacity-20" />
              <p>Nenhum resultado encontrado para "{searchTerm}"</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
