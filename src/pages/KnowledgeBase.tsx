import { useState } from 'react';
import { BookOpen, GraduationCap, Lightbulb, Trophy, ChevronRight, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockArticles } from '../mockData';
import { motion } from 'motion/react';

export function KnowledgeBase() {
  const [searchTerm, setSearchTerm] = useState('');

  const levels = [
    { id: 'Básico', icon: <Lightbulb size={18} />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'Intermediário', icon: <GraduationCap size={18} />, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { id: 'Avançado', icon: <Trophy size={18} />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  const categories = Array.from(new Set(mockArticles.map(art => art.category)));

  const filteredArticles = mockArticles.filter(art => 
    (art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <BookOpen className="text-purple-500" />
          <h1 className="text-3xl font-bold tracking-tight text-white">Base de Conhecimento</h1>
        </div>
        <p className="text-zinc-400">Tudo o que você precisa saber para dominar a contabilidade e fiscalidade brasileira.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <Input 
            placeholder="O que você quer aprender hoje? (Ex: ST, DIFAL, Lucro Real...)" 
            className="pl-10 bg-zinc-900 border-zinc-800 text-white h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {categories.slice(0, 2).map(cat => (
            <Badge key={cat} variant="outline" className="border-zinc-800 text-zinc-400 whitespace-nowrap px-4 py-2 cursor-pointer hover:bg-zinc-800">
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      <Tabs defaultValue="Básico" className="space-y-8">
        <TabsList className="bg-zinc-900 border border-zinc-800 p-1 h-auto">
          {levels.map(level => (
            <TabsTrigger 
              key={level.id} 
              value={level.id}
              className="px-6 py-2.5 data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-500"
            >
              <div className="flex items-center gap-2">
                {level.icon}
                {level.id}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {levels.map(level => (
          <TabsContent key={level.id} value={level.id} className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles
                .filter(art => art.level === level.id)
                .map((art, i) => (
                  <motion.div
                    key={art.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="bg-zinc-900 border-zinc-800 text-white hover:border-zinc-700 transition-all cursor-pointer group h-full flex flex-col">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="border-zinc-800 text-zinc-500 text-[10px] uppercase tracking-wider">
                            {art.category}
                          </Badge>
                          <div className={`p-2 rounded-lg ${level.bg} ${level.color}`}>
                            {level.icon}
                          </div>
                        </div>
                        <CardTitle className="text-xl group-hover:text-orange-500 transition-colors">{art.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-between">
                        <p className="text-sm text-zinc-400 line-clamp-3 mb-4">
                          {art.content}
                        </p>
                        <div className="flex items-center text-xs font-bold text-zinc-500 group-hover:text-white transition-colors">
                          LER ARTIGO COMPLETO
                          <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
            {filteredArticles.filter(art => art.level === level.id).length === 0 && (
              <div className="text-center py-20 text-zinc-600">
                Nenhum artigo encontrado nesta categoria.
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
