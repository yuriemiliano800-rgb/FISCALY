import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Consultation } from './pages/Consultation';
import { Simulator } from './pages/Simulator';
import { Assistant } from './pages/Assistant';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { Toaster } from 'sonner';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'cfop':
        return <Consultation type="cfop" />;
      case 'ncm':
        return <Consultation type="ncm" />;
      case 'cst':
        return <Consultation type="cst" />;
      case 'simulator':
        return <Simulator />;
      case 'assistant':
        return <Assistant />;
      case 'knowledge':
        return <KnowledgeBase />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans antialiased">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto bg-zinc-950 p-8">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>

      <Toaster theme="dark" position="top-right" />
    </div>
  );
}
