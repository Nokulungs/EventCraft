import React from 'react';
import { GeneratedPoster } from '../types';
import { Button } from './Button';

interface PosterResultProps {
  poster: GeneratedPoster;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const PosterResult: React.FC<PosterResultProps> = ({ poster, onClose, onDelete }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = poster.imageUrl;
    link.download = `eventcraft-${poster.eventName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(poster, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = `eventcraft-data-${poster.eventName.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl">
        
        {/* Image Side */}
        <div className="md:w-1/2 bg-slate-900 flex items-center justify-center p-4 md:p-8 border-b md:border-b-0 md:border-r border-slate-700 relative">
          <img 
            src={poster.imageUrl} 
            alt={poster.eventName} 
            className="max-h-[60vh] md:max-h-[75vh] w-auto rounded-lg shadow-2xl border border-slate-700"
          />
        </div>

        {/* Details Side */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{poster.eventName}</h2>
              <span className="inline-block px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded text-xs font-semibold tracking-wide uppercase">
                {poster.category || 'Event Poster'}
              </span>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6 flex-1">
            <div className="bg-slate-700/30 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Generation Settings</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-slate-500">Style</span>
                  <span className="text-white">{poster.style || 'None'}</span>
                </div>
                <div>
                  <span className="block text-slate-500">Palette</span>
                  <span className="text-white">{poster.colorPalette || 'Default'}</span>
                </div>
                <div>
                  <span className="block text-slate-500">Tone</span>
                  <span className="text-white">{poster.tone || 'Neutral'}</span>
                </div>
              </div>
            </div>

            {poster.additionalInfo && (
              <div className="bg-slate-700/30 rounded-xl p-4 space-y-2">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Additional Context</h3>
                <p className="text-sm text-slate-300 italic">"{poster.additionalInfo}"</p>
              </div>
            )}

            <div className="bg-slate-700/30 rounded-xl p-4 space-y-2">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Performance & Usage</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500 block">Time</span>
                  <span className="text-green-400 font-mono">{(poster.generationTimeMs / 1000).toFixed(2)}s</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Status</span>
                  <span className="text-green-400 font-mono">Success</span>
                </div>
                {poster.tokenUsage && (
                  <>
                    <div>
                      <span className="text-slate-500 block">Input Tokens</span>
                      <span className="text-indigo-300 font-mono">{poster.tokenUsage.inputTokens}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Est. Cost</span>
                      <span className="text-emerald-400 font-mono">~$0.004</span>
                    </div>
                  </>
                )}
              </div>
               <div className="mt-3 text-[10px] text-slate-500 border-t border-slate-600/50 pt-2 flex flex-col gap-1">
                <div className="flex justify-between">
                  <span>Rate Limit:</span>
                  <span className="text-slate-400">15 RPM (Gemini Flash Image)</span>
                </div>
                <div className="flex justify-between">
                   <span>Cost Model:</span>
                   <span className="text-slate-400">Per Image Generated</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-xl p-4 space-y-2">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Prompt Used</h3>
              <p className="text-xs text-slate-400 font-mono leading-relaxed line-clamp-4 hover:line-clamp-none cursor-pointer transition-all">
                {poster.promptUsed}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
             <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleDownload} className="flex-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Save Image
                </Button>
                <Button onClick={handleExportJSON} variant="secondary" className="flex-1" title="Export details as JSON">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                   </svg>
                   Export JSON
                </Button>
             </div>
             
             <div className="flex justify-between items-center pt-2 gap-3">
                <Button type="button" onClick={() => onDelete(poster.id)} variant="danger" className="px-4">
                   Delete
                </Button>
                <Button onClick={onClose} variant="ghost" className="px-4 ml-auto">
                   Close
                </Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};