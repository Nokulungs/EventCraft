import React, { useState } from 'react';
import { ASPECT_RATIOS, STYLES, EXPLORE_TILES } from '../constants';
import { PosterConfig } from '../types';
import { Button } from './Button';

interface PosterGeneratorProps {
  onGenerate: (config: PosterConfig) => Promise<void>;
  isGenerating: boolean;
  isLimitReached: boolean;
}

export const PosterGenerator: React.FC<PosterGeneratorProps> = ({ onGenerate, isGenerating, isLimitReached }) => {
  const [title, setTitle] = useState('');
  // New structured state fields
  const [purpose, setPurpose] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [audience, setAudience] = useState('');
  const [format, setFormat] = useState('');
  
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [colorPalette, setColorPalette] = useState('');

  // Check if all required fields have content
  const isValid = 
    title.trim().length > 0 && 
    purpose.trim().length > 0 && 
    dateTime.trim().length > 0 && 
    location.trim().length > 0 && 
    audience.trim().length > 0 && 
    format.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && !isLimitReached) {
      // Construct structured prompt part
      const details = [
        purpose && `Purpose: ${purpose}`,
        dateTime && `Date & Time: ${dateTime}`,
        location && `Location: ${location}`,
        audience && `Audience: ${audience}`,
        format && `Format: ${format}`,
      ].filter(Boolean).join('\n');

      const fullPrompt = `
Event Name: "${title || 'Untitled Event'}"

${details ? `Details to Include:\n${details}` : ''}

Design Requirements:
${prompt}
      `.trim();

      onGenerate({
        prompt: fullPrompt,
        title: title || "Untitled Poster",
        style,
        aspectRatio,
        colorPalette,
        // Default placeholders for legacy types
        eventName: title || "Untitled Poster",
        category: undefined,
        tone: '',
      } as PosterConfig);
    }
  };

  const handleTileClick = (tilePrompt: string) => {
    setPrompt(tilePrompt);
  };

  const inputBaseClasses = "w-full bg-slate-800/50 text-white text-sm rounded-lg px-3 py-2 border border-slate-700 focus:border-indigo-500 focus:outline-none transition-colors placeholder-slate-500";

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          What will you design today?
        </h1>
        <p className="text-slate-400 text-lg">
          Fill in the event details and let AI bring your poster to life.
        </p>
      </div>

      {isLimitReached && (
        <div className="mb-8 p-4 bg-gradient-to-r from-red-900/40 to-red-800/40 border border-red-500/50 rounded-xl text-center shadow-lg">
          <p className="text-red-200 font-semibold flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            You've used all 5 free credits. Upgrade to Pro to keep designing.
          </p>
        </div>
      )}

      <div className={`bg-slate-800 rounded-2xl p-1 shadow-2xl border ${isLimitReached ? 'border-red-500/30 opacity-75' : 'border-slate-700'} mb-12 transition-all`}>
        <form onSubmit={handleSubmit} className="flex flex-col">
          
          {/* Main Input Area */}
          <div className="p-6 bg-slate-900 rounded-xl m-1 border border-slate-700/50">
            
            {/* Title */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event Name (e.g. Tech Innovations Conference)"
              className="w-full bg-transparent text-white text-2xl font-bold placeholder-slate-600 focus:outline-none mb-6 border-b border-transparent focus:border-indigo-500/50 transition-all pb-2"
              disabled={isLimitReached}
            />

            {/* Structured Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Purpose *</label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Networking & Education"
                  className={inputBaseClasses}
                  required
                  disabled={isLimitReached}
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Format *</label>
                <input
                  type="text"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  placeholder="e.g. Workshop, Concert, Webinar"
                  className={inputBaseClasses}
                  required
                  disabled={isLimitReached}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Date & Time *</label>
                <input
                  type="text"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  placeholder="e.g. Jan 15, 2026, 9:00 AM"
                  className={inputBaseClasses}
                  required
                  disabled={isLimitReached}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Location *</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Grand Convention Center / Online"
                  className={inputBaseClasses}
                  required
                  disabled={isLimitReached}
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Target Audience *</label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g. Tech professionals, Students, Families"
                  className={inputBaseClasses}
                  required
                  disabled={isLimitReached}
                />
              </div>
            </div>

            {/* Freeform Prompt / Design Requirements */}
            <div className="space-y-1">
               <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Design Requirements (Optional)</label>
               <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the visual style, specific imagery, or mood (e.g. 'A futuristic cyberpunk aesthetic with neon blue lights...')"
                className="w-full bg-slate-800/30 text-white text-base placeholder-slate-600 focus:outline-none resize-none h-24 rounded-lg p-3 border border-slate-700/50 focus:border-indigo-500"
                disabled={isGenerating || isLimitReached}
              />
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row gap-4 p-4 items-center">
            
            {/* Aspect Ratio Selector */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.value}
                  type="button"
                  onClick={() => setAspectRatio(ratio.value)}
                  disabled={isLimitReached}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all min-w-[60px] ${
                    aspectRatio === ratio.value 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                      : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white'
                  } ${isLimitReached ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={ratio.label}
                >
                  <svg className="w-5 h-5 mb-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d={ratio.icon} />
                  </svg>
                  <span className="text-[10px] font-medium">{ratio.value}</span>
                </button>
              ))}
            </div>

            <div className="h-8 w-px bg-slate-700 hidden md:block"></div>

            {/* Style Selector */}
            <div className="relative w-full md:w-48 flex flex-col justify-center">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 ml-1">Visual Style</label>
              <div className="relative">
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  disabled={isLimitReached}
                  className={`w-full appearance-none bg-slate-700/50 text-white rounded-lg px-4 py-2.5 pr-8 border border-slate-600 focus:border-indigo-500 focus:outline-none text-sm font-medium ${isLimitReached ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="" disabled>Select()</option>
                  {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="w-full md:w-auto md:ml-auto flex items-end">
              <Button 
                type="submit" 
                className={`w-full md:w-auto px-8 border-0 h-[46px] ${isLimitReached ? 'bg-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'}`}
                isLoading={isGenerating}
                disabled={!isValid || isLimitReached}
                title={isLimitReached ? "Usage limit reached" : !isValid ? "Please fill in all event details" : "Generate Poster"}
              >
                {isLimitReached ? "Limit Reached - Upgrade" : "Generate Poster"}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Explore Categories (Wild Cards) */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>✨</span> Prompt Templates
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {EXPLORE_TILES.map((tile) => (
            <button
              key={tile.label}
              onClick={() => handleTileClick(tile.prompt)}
              disabled={isLimitReached}
              className={`group relative overflow-hidden rounded-xl p-4 h-32 text-left transition-all ${isLimitReached ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-xl'}`}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tile.gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
              
              {/* Content */}
              <div className="relative z-10 flex flex-col justify-between h-full text-white">
                <span className="text-2xl bg-white/20 w-10 h-10 flex items-center justify-center rounded-lg backdrop-blur-sm">
                  {tile.icon}
                </span>
                <span className="font-bold text-sm leading-tight">
                  {tile.label}
                </span>
              </div>

              {/* Decorative Circle */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};