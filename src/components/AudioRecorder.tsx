import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Upload, FileAudio, Loader2 } from 'lucide-react';

interface AudioRecorderProps {
  onAudioReady: (audioBase64: string, mimeType: string, transcriptPrompt?: string) => void;
  onTranscribeDirectly?: (audioBase64: string, mimeType: string) => Promise<string | void>;
  isTranscribing?: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onAudioReady,
  onTranscribeDirectly,
  isTranscribing = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('audio/webm');
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      // Determine supported mime type
      let selectedMime = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        selectedMime = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        selectedMime = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        selectedMime = 'audio/ogg';
      }

      setMimeType(selectedMime);

      const recorder = new MediaRecorder(stream, { mimeType: selectedMime });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: selectedMime });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Convert blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const rawBase64 = reader.result as string;
          // Extract base64 payload without prefix
          const base64Pure = rawBase64.split(',')[1] || rawBase64;
          setBase64Data(base64Pure);
          setFileName('gravacao-reuniao.webm');
          onAudioReady(base64Pure, selectedMime);
        };

        // Stop all audio tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(250); // Slice every 250ms
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Erro ao acessar microfone:', err);
      setErrorMsg('Não foi possível acessar o microfone. Verifique as permissões do navegador.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resetRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setBase64Data(null);
    setRecordingSeconds(0);
    setIsPlaying(false);
    setFileName(null);
    setErrorMsg(null);
  };

  const togglePlayback = () => {
    if (!audioElementRef.current) return;
    if (isPlaying) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    } else {
      audioElementRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setFileName(file.name);
    const selectedMime = file.type || 'audio/mp3';
    setMimeType(selectedMime);

    const blobUrl = URL.createObjectURL(file);
    setAudioUrl(blobUrl);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const rawBase64 = reader.result as string;
      const base64Pure = rawBase64.split(',')[1] || rawBase64;
      setBase64Data(base64Pure);
      onAudioReady(base64Pure, selectedMime);
    };
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <Mic className="w-4 h-4 text-rose-400" />
            Gravar Áudio ou Enviar Reunião
          </h4>
          <p className="text-xs text-slate-400">
            Grave diretamente o alinhamento com o parceiro ou envie arquivo de áudio (MP3, WAV, WebM).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
          >
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            Upload Áudio
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg">
          {errorMsg}
        </div>
      )}

      {/* Recording or Playback State */}
      {!audioUrl ? (
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800 rounded-xl bg-slate-950/40">
          {isRecording ? (
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <span className="w-16 h-16 rounded-full bg-rose-500/20 animate-ping absolute inset-0" />
                <button
                  type="button"
                  onClick={stopRecording}
                  className="relative w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 transition transform hover:scale-105"
                  title="Parar gravação"
                >
                  <Square className="w-6 h-6 fill-current" />
                </button>
              </div>
              <div className="text-center">
                <span className="font-mono text-xl font-bold text-rose-400 tracking-wider">
                  {formatTimer(recordingSeconds)}
                </span>
                <p className="text-xs text-rose-300 animate-pulse mt-1">Gravando áudio do alinhamento...</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-center">
              <button
                type="button"
                onClick={startRecording}
                className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 transition transform hover:scale-105"
                title="Iniciar gravação"
              >
                <Mic className="w-6 h-6" />
              </button>
              <div>
                <p className="text-xs font-medium text-slate-300">Clique para iniciar gravação do microfone</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Ou use o botão &quot;Upload Áudio&quot; acima</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
          <audio
            ref={audioElementRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <FileAudio className="w-4 h-4 text-cyan-400" />
              <span className="font-medium truncate max-w-xs">{fileName || 'Áudio gravado'}</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                {mimeType.split(';')[0]}
              </span>
            </div>

            <button
              type="button"
              onClick={resetRecording}
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Gravar outro
            </button>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={togglePlayback}
              className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-md transition"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <div className="flex-1 bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all ${
                  isPlaying ? 'w-full animate-pulse' : 'w-1/3'
                }`}
              />
            </div>

            {onTranscribeDirectly && base64Data && (
              <button
                type="button"
                disabled={isTranscribing}
                onClick={() => onTranscribeDirectly(base64Data, mimeType)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white shadow-md transition"
              >
                {isTranscribing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Transcrevendo...
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 text-cyan-300" />
                    Transcrever com IA
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
