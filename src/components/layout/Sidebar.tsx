import { useState } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Calculator, 
  MessageSquareText, 
  BookOpen, 
  History, 
  Star, 
  Building2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Database,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'consultations', label: 'Consultas', icon: Search, subItems: [
    { id: 'cfop', label: 'CFOP', icon: FileText },
    { id: 'ncm', label: 'NCM', icon: Database },
    { id: 'cst', label: 'CST/CSOSN', icon: ShieldCheck },
  ]},
  { id: 'simulator', label: 'Simulador Fiscal', icon: Calculator },
  { id: 'assistant', label: 'Assistente IA', icon: MessageSquareText },
  { id: 'knowledge', label: 'Base de Conhecimento', icon: BookOpen },
  { id: 'history', label: 'Histórico', icon: History },
  { id: 'favorites', label: 'Favoritos', icon: Star },
  { id: 'companies', label: 'Empresas', icon: Building2 },
];

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['consultations']);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className={cn(
      "flex flex-col h-screen bg-zinc-950 text-zinc-400 border-r border-zinc-800 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
              F
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Fiscaly</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="text-zinc-400 hover:text-white hover:bg-zinc-900"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 px-3 h-10 transition-all",
                  activeTab === item.id ? "bg-zinc-900 text-white" : "hover:bg-zinc-900/50 hover:text-zinc-200",
                  collapsed && "justify-center px-0"
                )}
                onClick={() => {
                  if (item.subItems) {
                    toggleExpand(item.id);
                  } else {
                    setActiveTab(item.id);
                  }
                }}
              >
                <item.icon size={18} className={cn(activeTab === item.id ? "text-orange-500" : "")} />
                {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
                {!collapsed && item.subItems && (
                  <ChevronRight size={14} className={cn("transition-transform", expandedItems.includes(item.id) && "rotate-90")} />
                )}
              </Button>

              {!collapsed && item.subItems && expandedItems.includes(item.id) && (
                <div className="ml-4 mt-1 space-y-1 border-l border-zinc-800 pl-2">
                  {item.subItems.map((sub) => (
                    <Button
                      key={sub.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 px-3 h-9 text-sm",
                        activeTab === sub.id ? "bg-zinc-900 text-white" : "hover:bg-zinc-900/50 hover:text-zinc-200"
                      )}
                      onClick={() => setActiveTab(sub.id)}
                    >
                      <sub.icon size={14} className={cn(activeTab === sub.id ? "text-orange-500" : "")} />
                      <span>{sub.label}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-top border-zinc-800">
        <Separator className="bg-zinc-800 mb-4" />
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-300">
            YU
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-white truncate">Yuri Emiliano</span>
              <span className="text-xs text-zinc-500 truncate">Sócio Diretor</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
