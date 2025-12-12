import React, { useState, useEffect } from 'react';
import { PosterGenerator } from './components/PosterGenerator';
import { HistoryList } from './components/HistoryList';
import { PosterResult } from './components/PosterResult';
import { GeneratedPoster, PosterConfig } from './types';
import { generatePosterImage } from './services/geminiService';

const STORAGE_KEY = 'eventcraft_history_v1';
const CREDITS_KEY = 'eventcraft_credits_v1';
const MAX_FREE_CREDITS = 5;

function App() {
  const [activeTab, setActiveTab] = useState<'create' | 'projects'>('create');
  const [history, setHistory] = useState<GeneratedPoster[]>([]);
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState<GeneratedPoster | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load history and credits on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    const savedCredits = localStorage.getItem(CREDITS_KEY);
    if (savedCredits) {
      setCreditsUsed(parseInt(savedCredits, 10));
    }
  }, []);

  // Save history on update
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  // Save credits on update
  useEffect(() => {
    localStorage.setItem(CREDITS_KEY, creditsUsed.toString());
  }, [creditsUsed]);

  const handleGenerate = async (config: PosterConfig) => {
    if (creditsUsed >= MAX_FREE_CREDITS) {
      setError("You have reached your free limit of 5 prompts. Please upgrade to Pro to continue creating.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const result = await generatePosterImage(config);
      setHistory(prev => [result, ...prev]);
      setSelectedPoster(result);
      // Increment credits used on success
      setCreditsUsed(prev => prev + 1);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while generating the poster.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this poster?")) {
      setHistory(prev => prev.filter(p => p.id !== id));
      if (selectedPoster?.id === id) {
        setSelectedPoster(null);
      }
    }
  };

  const handleClearHistory = () => {
    if (history.length === 0) return;
    if (window.confirm("Are you sure you want to delete ALL history? This cannot be undone.")) {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleExportHistory = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = `eventcraft-history-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
      
      {/* Sidebar Navigation (Desktop) */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex-col hidden md:flex">
        <div className="p-6">
          <div className="flex items-center gap-3 text-white mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center font-bold shadow-lg shadow-indigo-500/30">
              EC
            </div>
            <h1 className="text-xl font-bold tracking-tight">EventCraft</h1>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('create')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'create' ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </button>
            <button 
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'projects' ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Projects
            </button>
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-slate-800">
          {/* Credit Usage Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center text-xs mb-2">
               <span className="text-slate-400 font-semibold">Free Credits</span>
               <span className={`${creditsUsed >= MAX_FREE_CREDITS ? "text-red-400" : "text-white"}`}>{creditsUsed}/{MAX_FREE_CREDITS}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ease-out rounded-full ${creditsUsed >= MAX_FREE_CREDITS ? 'bg-red-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`} 
                style={{ width: `${Math.min((creditsUsed / MAX_FREE_CREDITS) * 100, 100)}%` }}
              />
            </div>
          </div>

           <div className={`p-4 rounded-xl border transition-colors ${creditsUsed >= MAX_FREE_CREDITS ? 'bg-red-500/10 border-red-500/30' : 'bg-indigo-900/20 border-indigo-500/20'}`}>
             <p className={`text-xs font-bold mb-1 ${creditsUsed >= MAX_FREE_CREDITS ? 'text-red-300' : 'text-indigo-300'}`}>
               {creditsUsed >= MAX_FREE_CREDITS ? 'Limit Reached' : 'Upgrade to Pro'}
             </p>
             <p className="text-[10px] text-slate-400">
               {creditsUsed >= MAX_FREE_CREDITS ? 'Upgrade now to unlock unlimited generations.' : 'Unlock 4K generation and unlimited prompts.'}
             </p>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-900 relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center font-bold text-xs shadow-lg">
              EC
            </div>
            <span className="font-bold text-lg">EventCraft</span>
          </div>
          <div className="flex items-center gap-3">
             {/* Mobile Credit Counter */}
            <div className={`text-[10px] font-mono px-2 py-1 rounded border ${creditsUsed >= MAX_FREE_CREDITS ? 'bg-red-900/20 border-red-500/30 text-red-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
              {creditsUsed}/{MAX_FREE_CREDITS} Used
            </div>
            <button onClick={() => setActiveTab('create')} className={`p-2 rounded transition-colors ${activeTab === 'create' ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400'}`}>
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </button>
            <button onClick={() => setActiveTab('projects')} className={`p-2 rounded transition-colors ${activeTab === 'projects' ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400'}`}>
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            </button>
          </div>
        </div>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
              <span className="text-xl">⚠️</span>
              <p>{error}</p>
              <button onClick={() => setError(null)} className="ml-auto hover:text-white">✕</button>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="flex flex-col gap-12 pt-4 md:pt-8">
              {/* Generator Section */}
              <section className="flex flex-col items-center justify-center min-h-[50vh]">
                <PosterGenerator 
                  onGenerate={handleGenerate} 
                  isGenerating={isGenerating} 
                  isLimitReached={creditsUsed >= MAX_FREE_CREDITS}
                />
              </section>

              {/* Recent Designs Section */}
              {history.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Recent Designs</h2>
                    <button 
                      onClick={() => setActiveTab('projects')} 
                      className="text-sm text-indigo-400 hover:text-indigo-300"
                    >
                      See all
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {history.slice(0, 5).map(h => (
                       <div 
                         key={h.id} 
                         onClick={() => setSelectedPoster(h)}
                         className="group relative aspect-[3/4] bg-slate-800 rounded-lg overflow-hidden cursor-pointer border border-slate-700 hover:border-indigo-500 transition-all"
                       >
                         <img src={h.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={h.eventName} />
                         <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-xs font-medium truncate">{h.eventName}</p>
                         </div>
                         {/* Delete button for recent items */}
                         <button 
                           type="button"
                           onClick={(e) => { e.stopPropagation(); handleDelete(h.id); }}
                           className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                           title="Delete"
                         >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                         </button>
                       </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="pt-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold text-white">All Projects</h2>
                {history.length > 0 && (
                  <div className="flex gap-3">
                    <button 
                      onClick={handleExportHistory}
                      className="px-4 py-2 text-sm font-medium text-indigo-300 border border-indigo-900/50 bg-indigo-900/20 hover:bg-indigo-900/40 rounded-lg transition-colors flex items-center gap-2"
                      title="Export all projects as JSON"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Export Data
                    </button>
                    <button 
                      onClick={handleClearHistory}
                      className="px-4 py-2 text-sm font-medium text-red-300 border border-red-900/50 bg-red-900/20 hover:bg-red-900/40 rounded-lg transition-colors"
                    >
                      Clear History
                    </button>
                  </div>
                )}
              </div>
              <HistoryList 
                history={history} 
                onSelect={setSelectedPoster}
                onDelete={handleDelete}
              />
            </div>
          )}
        </div>
      </main>

      {/* Modal Result View */}
      {selectedPoster && (
        <PosterResult 
          poster={selectedPoster} 
          onClose={() => setSelectedPoster(null)} 
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default App;