import React from 'react';
import { GeneratedPoster } from '../types';

interface HistoryListProps {
  history: GeneratedPoster[];
  onSelect: (poster: GeneratedPoster) => void;
  onDelete: (id: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onDelete }) => {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl">
        <svg className="w-16 h-16 mb-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-xl font-semibold mb-2">No designs yet</p>
        <p className="text-sm">Start by creating your first poster from the Home tab.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {history.map((poster) => (
        <div key={poster.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-indigo-500 transition-all hover:shadow-xl hover:shadow-indigo-500/10 group flex flex-col">
          <div className="relative aspect-[3/4] overflow-hidden bg-slate-900 cursor-pointer" onClick={() => onSelect(poster)}>
            <img 
              src={poster.imageUrl} 
              alt={poster.eventName} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
               <button 
                 type="button"
                 onClick={(e) => { e.stopPropagation(); onSelect(poster); }}
                 className="bg-white/90 text-slate-900 p-2 rounded-full hover:bg-white transition-colors shadow-lg"
                 title="View"
               >
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                 </svg>
               </button>
               <button 
                 type="button"
                 onClick={(e) => { e.stopPropagation(); onDelete(poster.id); }}
                 className="bg-red-500/90 text-white p-2 rounded-full hover:bg-red-500 transition-colors shadow-lg"
                 title="Delete"
               >
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                 </svg>
               </button>
            </div>
          </div>
          
          <div className="p-3 bg-slate-800">
            <h3 className="font-semibold text-white truncate text-sm mb-1">{poster.eventName}</h3>
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span className="uppercase tracking-wider">{poster.aspectRatio}</span>
              <span>{new Date(poster.generatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};