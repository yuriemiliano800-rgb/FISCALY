import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { 
  MessageSquareText, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  RefreshCw,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Image as ImageIcon,
  X,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

const SYSTEM_INSTRUCTION = `
Você é o Fiscaly AI, um arquiteto fiscal sênior e assistente inteligente especializado em tributação brasileira.
Seu objetivo é ajudar profissionais a interpretar operações fiscais, sugerir enquadramentos (CFOP, CST, NCM) e analisar documentos.

COMPORTAMENTO OBRIGATÓRIO:
1. Você NÃO deve dar respostas definitivas sem antes ter o contexto completo da operação.
2. Antes de sugerir qualquer enquadramento, você DEVE perguntar (se ainda não souber):
   - UF de origem e destino.
   - Regime tributário da empresa (Simples Nacional, Lucro Real/Presumido).
   - Tipo de operação (Venda, Compra, Devolução, etc).
   - Se é Entrada ou Saída.
   - Tipo de destinatário (Contribuinte, Não Contribuinte, Consumidor Final).
   - Finalidade da nota (Revenda, Uso e Consumo, Ativo Imobilizado).
   - NCM do produto (se houver).
3. Se o usuário enviar uma IMAGEM (como um DANFE ou nota fiscal), analise os dados presentes (CNPJ, CFOP, NCM, Valores) e use-os para contextualizar sua resposta.
4. Sempre indique que sua análise é PRELIMINAR e deve ser validada por um contador.
5. Use uma linguagem profissional, técnica e clara.
6. Formate suas respostas usando Markdown (use tabelas para impostos e códigos).

PENSAMENTO CRÍTICO:
Você deve usar seu raciocínio lógico para detectar inconsistências entre o NCM e o CFOP sugerido, alertando o usuário sobre possíveis erros de emissão.
`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

export function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Olá! Eu sou o Fiscaly AI, seu consultor fiscal de alta performance. Posso analisar suas operações ou até mesmo ler imagens de notas fiscais para te ajudar. O que vamos analisar hoje?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || loading) return;

    const userMessage = input.trim();
    const currentImage = selectedImage;
    
    setInput('');
    setSelectedImage(null);
    setMessages(prev => [...prev, { role: 'user', content: userMessage, image: currentImage || undefined }]);
    setLoading(true);

    try {
      const parts: any[] = [];
      
      // Add history
      messages.forEach(m => {
        parts.push({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] });
      });

      // Add current message
      const currentParts: any[] = [{ text: userMessage || "Analise esta imagem fiscal." }];
      if (currentImage) {
        currentParts.push({
          inlineData: {
            data: currentImage.split(',')[1],
            mimeType: "image/jpeg"
          }
        });
      }
      parts.push({ role: 'user', parts: currentParts });

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: parts,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
          temperature: 0.2, // Lower temperature for technical accuracy
        }
      });

      const text = response.text || "Desculpe, não consegui processar sua solicitação.";
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      console.error("AI Error:", error);
      toast.error("Erro ao conectar com a IA de alta performance.");
      setMessages(prev => [...prev, { role: 'assistant', content: "Houve um erro técnico. Por favor, tente novamente." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Sparkles className="text-orange-500 animate-pulse" />
            <h1 className="text-3xl font-bold tracking-tight text-white">Assistente IA Pro</h1>
          </div>
          <p className="text-zinc-400">Consultoria fiscal de alto nível com análise de documentos.</p>
        </div>
        <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-400" onClick={() => setMessages([{ role: 'assistant', content: 'Chat reiniciado. Como posso ajudar?' }])}>
          <RefreshCw size={14} className="mr-2" /> Reiniciar
        </Button>
      </div>

      <Card className="flex-1 bg-zinc-900 border-zinc-800 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6 max-w-4xl mx-auto">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  m.role === 'assistant' ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {m.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
                </div>
                <div className={`flex flex-col gap-2 max-w-[85%] ${m.role === 'user' ? 'items-end' : ''}`}>
                  {m.image && (
                    <div className="relative group">
                      <img src={m.image} alt="Upload" className="max-w-xs rounded-lg border border-zinc-700 shadow-lg" />
                    </div>
                  )}
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'assistant' 
                      ? 'bg-zinc-800 text-zinc-200 rounded-tl-none border border-zinc-700/50' 
                      : 'bg-orange-600 text-white rounded-tr-none shadow-lg shadow-orange-900/20'
                  }`}>
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0">
                  <Bot size={18} />
                </div>
                <div className="bg-zinc-800 p-4 rounded-2xl rounded-tl-none flex items-center gap-3 border border-zinc-700/50">
                  <Loader2 size={16} className="animate-spin text-orange-500" />
                  <span className="text-xs text-zinc-400 italic">Fiscaly está processando com raciocínio avançado...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 bg-zinc-950 border-t border-zinc-800">
          <div className="max-w-4xl mx-auto space-y-4">
            {selectedImage && (
              <div className="relative inline-block">
                <img src={selectedImage} alt="Preview" className="h-20 w-20 object-cover rounded-lg border border-orange-500" />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            
            <div className="relative flex gap-2">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleImageSelect}
              />
              <Button 
                variant="outline" 
                size="icon" 
                className="shrink-0 border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white h-14 w-14"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon size={20} />
              </Button>
              
              <div className="relative flex-1">
                <Input 
                  placeholder="Descreva sua dúvida ou envie uma nota fiscal..." 
                  className="bg-zinc-900 border-zinc-800 text-white h-14 pr-14 focus-visible:ring-orange-600"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button 
                  size="icon" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-600 hover:bg-orange-700 h-10 w-10 transition-transform active:scale-95"
                  onClick={handleSend}
                  disabled={loading || (!input.trim() && !selectedImage)}
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto mt-3 flex items-center justify-center gap-6 text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
            <div className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-green-500" /> Análise Técnica</div>
            <div className="flex items-center gap-1.5"><Sparkles size={12} className="text-orange-500" /> Raciocínio Avançado</div>
            <div className="flex items-center gap-1.5"><AlertCircle size={12} className="text-yellow-500" /> Validação Obrigatória</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
