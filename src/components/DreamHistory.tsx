import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, ChevronRight, BookOpen, Sparkles } from 'lucide-react';
import { Dream } from '../types';
import Markdown from 'react-markdown';

export default function DreamHistory() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dreams')
      .then(res => res.json())
      .then(data => {
        setDreams(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (dreams.length === 0) {
    return (
      <div className="text-center py-20 space-y-6">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
          <BookOpen className="w-10 h-10 text-gray-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif italic">The Journal is Empty</h2>
          <p className="text-gray-500 text-sm">You haven't woven any dreams yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <h1 className="text-4xl font-serif italic">Dream Journal</h1>
        <div className="h-px flex-1 bg-white/5" />
        <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">{dreams.length} Entries</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* List */}
        <div className="md:col-span-1 space-y-4">
          {dreams.map((dream) => (
            <button
              key={dream.id}
              onClick={() => setSelectedDream(dream)}
              className={`w-full text-left p-4 rounded-2xl border transition-all group ${
                selectedDream?.id === dream.id
                  ? 'bg-indigo-600/10 border-indigo-500/30'
                  : 'bg-white/5 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-tighter mb-2">
                <Calendar className="w-3 h-3" />
                {new Date(dream.created_at).toLocaleDateString()}
              </div>
              <p className="text-sm font-medium line-clamp-2 text-gray-300 group-hover:text-white transition-colors">
                {dream.content}
              </p>
              <div className="mt-4 flex justify-end">
                <ChevronRight className={`w-4 h-4 transition-transform ${selectedDream?.id === dream.id ? 'translate-x-1 text-indigo-400' : 'text-gray-600'}`} />
              </div>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className="md:col-span-2">
          {selectedDream ? (
            <motion.div
              key={selectedDream.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] sticky top-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <p className="text-xs font-mono text-indigo-400 uppercase tracking-widest">Dream Entry</p>
                  <p className="text-gray-500 text-xs">{new Date(selectedDream.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-8">
                <section>
                  <h4 className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.2em] mb-4">The Fragment</h4>
                  <p className="text-gray-400 italic text-sm border-l-2 border-indigo-500/30 pl-4">
                    "{selectedDream.content}"
                  </p>
                </section>

                <section>
                  <h4 className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.2em] mb-4">The Completion</h4>
                  <div className="markdown-body prose prose-invert prose-sm max-w-none text-gray-200 leading-relaxed">
                    <Markdown>{selectedDream.completed_text}</Markdown>
                  </div>
                </section>
              </div>
            </motion.div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-dashed border-white/5 rounded-[2rem] text-gray-600">
              <Sparkles className="w-8 h-8 mb-4 opacity-20" />
              <p className="text-sm italic">Select a dream to revisit its story</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
