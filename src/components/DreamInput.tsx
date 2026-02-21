import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Image as ImageIcon, Sparkles, Loader2, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import AudioRecorder from './AudioRecorder';
import { completeDream, generateDreamVoice } from '../services/geminiService';
import Markdown from 'react-markdown';

export default function DreamInput() {
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [audio, setAudio] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    if (!text && !audio && images.length === 0) return;
    setLoading(true);
    setResult(null);
    setVoiceUrl(null);

    try {
      const completedText = await completeDream(text, images, audio);
      if (completedText) {
        setResult(completedText);
        
        // Save to DB
        await fetch('/api/dreams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: text || "Voice/Image Dream", completed_text: completedText }),
        });

        // Generate Voice
        const voiceBase64 = await generateDreamVoice(completedText);
        if (voiceBase64) {
          const blob = await (await fetch(`data:audio/mp3;base64,${voiceBase64}`)).blob();
          setVoiceUrl(URL.createObjectURL(blob));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoice = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const reset = () => {
    setResult(null);
    setVoiceUrl(null);
    setText('');
    setImages([]);
    setAudio('');
  };

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-serif italic">Your Dream, Completed</h2>
          <div className="flex gap-2">
            {voiceUrl && (
              <button
                onClick={toggleVoice}
                className="p-3 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/30 transition-all"
              >
                {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            )}
            <button
              onClick={reset}
              className="p-3 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {voiceUrl && <audio ref={audioRef} src={voiceUrl} onEnded={() => setIsPlaying(false)} className="hidden" />}

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl leading-relaxed">
          <div className="markdown-body prose prose-invert max-w-none">
            <Markdown>{result}</Markdown>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <button
            onClick={reset}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-400 transition-colors uppercase tracking-widest font-mono"
          >
            <Sparkles className="w-4 h-4" />
            <span>Weave another dream</span>
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-12"
    >
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-serif italic tracking-tight">What did you see?</h1>
        <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
          Describe the fragments of your dream. A feeling, a face, a fleeting shadow. We'll weave the rest.
        </p>
      </div>

      <div className="space-y-8">
        {/* Text Input */}
        <div className="relative group">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="I was standing on a bridge made of glass..."
            className="w-full h-48 bg-white/5 border border-white/10 rounded-[2rem] p-8 text-lg placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all resize-none"
          />
          <div className="absolute bottom-6 right-8 flex items-center gap-4">
            <label className="cursor-pointer p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
              <ImageIcon className="w-6 h-6" />
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Media Inputs Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AudioRecorder onRecordingComplete={setAudio} />
          
          <div className="p-4 border border-white/10 rounded-2xl bg-black/20 backdrop-blur-sm">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-mono mb-4 px-2">Visual Fragments</p>
            <div className="flex flex-wrap gap-2">
              {images.length === 0 && (
                <div className="w-full h-12 flex items-center justify-center border border-dashed border-white/10 rounded-xl text-gray-600 text-xs italic">
                  No images uploaded
                </div>
              )}
              {images.map((img, i) => (
                <div key={i} className="relative group w-16 h-16">
                  <img src={img} className="w-full h-full object-cover rounded-xl border border-white/10" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <RefreshCw className="w-3 h-3 rotate-45" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleComplete}
            disabled={loading || (!text && !audio && images.length === 0)}
            className="px-12 py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-full flex items-center gap-3 transition-all shadow-xl shadow-indigo-500/20 group"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-medium tracking-wide">Weaving the Dream...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium tracking-wide">Complete My Dream</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
