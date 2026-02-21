import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Trash2 } from 'lucide-react';

interface AudioRecorderProps {
  onRecordingComplete: (base64: string) => void;
}

export default function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          onRecordingComplete(base64data);
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const clearRecording = () => {
    setAudioUrl(null);
    onRecordingComplete("");
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border border-white/10 rounded-2xl bg-black/20 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="p-4 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Mic className="w-6 h-6 text-white" />
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="p-4 rounded-full bg-red-600 animate-pulse hover:bg-red-500 transition-colors shadow-lg shadow-red-500/20"
          >
            <Square className="w-6 h-6 text-white" />
          </button>
        )}

        {audioUrl && !isRecording && (
          <div className="flex items-center gap-2">
            <audio src={audioUrl} controls className="h-8 w-48" />
            <button
              onClick={clearRecording}
              className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-400 uppercase tracking-widest font-mono">
        {isRecording ? "Recording Dream..." : audioUrl ? "Voice Captured" : "Record Voice"}
      </p>
    </div>
  );
}
