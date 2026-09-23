import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Upload,
  Mic,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Building2,
  Trash2,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Table,
  Eye,
  EyeOff
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { SAMPLE_BRIEFINGS, SampleBriefing } from '../data/sampleBriefings.ts';
import { AudioRecorder } from './AudioRecorder.tsx';

interface InputPanelProps {
  onExecuteMatchmaking: (payload: {
    inputContent?: string;
    fileAttachment?: { base64: string; mimeType: string; fileName: string };
    audioAttachment?: { base64: string; mimeType: string };
    formatType: 'Texto' | 'Planilha / Dados' | 'Áudio / Transcrição' | 'Documento / PDF' | 'Arquivo';
    partnerName?: string;
  }) => void;
  isLoading: boolean;
  onOpenKnowledgeBase: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  onExecuteMatchmaking,
  isLoading,
  onOpenKnowledgeBase,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'file' | 'audio'>('text');
  const [partnerName, setPartnerName] = useState('');
  const [textContent, setTextContent] = useState('');
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    base64: string;
    mimeType: string;
    previewText?: string;
    sheetNames?: string[];
    rowCount?: number;
    isSpreadsheet?: boolean;
  } | null>(null);

  const [audioData, setAudioData] = useState<{
    base64: string;
    mimeType: string;
  } | null>(null);

  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptNotice, setTranscriptNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Progressive loading steps for user reassurance
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const loadingSteps = [
    'Lendo briefing e interpretando requisitos do parceiro...',
    'Identificando iniciativas e separando desafios distintos...',
    'Mapeando múltiplas possibilidades de módulos e ementas do Inteli...',
    'Analisando prós, contras, trade-offs e gerando guia de decisão...',
  ];

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingStepIdx(0);
      interval = setInterval(() => {
        setLoadingStepIdx((prev) => (prev + 1) % loadingSteps.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleApplyPreset = (preset: SampleBriefing) => {
    setTextContent(preset.rawContent);
    setPartnerName(preset.companyName);
    setActiveTab('text');
    setSelectedFile(null);
    setAudioData(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const mimeType = file.type || 'application/octet-stream';
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.ods');
    const isCsvOrText = fileName.endsWith('.csv') || fileName.endsWith('.tsv') || fileName.endsWith('.txt') || fileName.endsWith('.md');

    if (isExcel) {
      const arrayReader = new FileReader();
      arrayReader.onload = () => {
        try {
          const arrayBuffer = arrayReader.result as ArrayBuffer;
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const sheetNames = workbook.SheetNames;
          const sheetTexts: string[] = [];
          let totalRows = 0;

          sheetNames.forEach((name) => {
            const sheet = workbook.Sheets[name];
            const csv = XLSX.utils.sheet_to_csv(sheet);
            if (csv && csv.trim()) {
              const rows = csv.trim().split('\n').length;
              totalRows += rows;
              sheetTexts.push(`--- Aba: ${name} (${rows} linhas) ---\n${csv.trim()}`);
            }
          });

          const fullExtractedText = sheetTexts.join('\n\n');

          // Read Base64 for the payload
          const b64Reader = new FileReader();
          b64Reader.onload = () => {
            const rawBase64 = b64Reader.result as string;
            const base64Pure = rawBase64.split(',')[1] || rawBase64;
            setSelectedFile({
              file,
              base64: base64Pure,
              mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              previewText: fullExtractedText,
              sheetNames,
              rowCount: totalRows,
              isSpreadsheet: true,
            });
          };
          b64Reader.readAsDataURL(file);
        } catch (parseErr) {
          console.warn('Erro ao processar planilha no navegador:', parseErr);
          // Fallback to standard base64
          const b64Reader = new FileReader();
          b64Reader.onload = () => {
            const raw = b64Reader.result as string;
            setSelectedFile({
              file,
              base64: raw.split(',')[1] || raw,
              mimeType,
            });
          };
          b64Reader.readAsDataURL(file);
        }
      };
      arrayReader.readAsArrayBuffer(file);
    } else if (isCsvOrText) {
      const textReader = new FileReader();
      textReader.onload = () => {
        const text = textReader.result as string;
        const b64Reader = new FileReader();
        b64Reader.onload = () => {
          const raw = b64Reader.result as string;
          setSelectedFile({
            file,
            base64: raw.split(',')[1] || raw,
            mimeType: 'text/plain',
            previewText: text,
            rowCount: text.split('\n').length,
            isSpreadsheet: fileName.endsWith('.csv'),
          });
        };
        b64Reader.readAsDataURL(file);
      };
      textReader.readAsText(file);
    } else {
      // PDF or binary
      const b64Reader = new FileReader();
      b64Reader.onload = () => {
        const raw = b64Reader.result as string;
        setSelectedFile({
          file,
          base64: raw.split(',')[1] || raw,
          mimeType: fileName.endsWith('.pdf') ? 'application/pdf' : mimeType,
        });
      };
      b64Reader.readAsDataURL(file);
    }
  };

  const handleAudioReady = (base64: string, mime: string) => {
    setAudioData({ base64, mimeType: mime });
  };

  const handleDirectTranscribe = async (base64: string, mime: string) => {
    setIsTranscribing(true);
    setTranscriptNotice(null);
    try {
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioBase64: base64, mimeType: mime }),
      });
      const data = await res.json();
      if (data.transcript) {
        setTextContent(data.transcript);
        setActiveTab('text');
        setTranscriptNotice('Áudio transcrito com sucesso e inserido na aba de Texto para conferência!');
      } else {
        throw new Error(data.error || 'Nenhum texto retornado');
      }
    } catch (err: any) {
      console.error(err);
      setTranscriptNotice('Erro na transcrição: ' + (err.message || 'Tente novamente.'));
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleSubmit = () => {
    if (activeTab === 'text') {
      if (!textContent.trim()) return;
      onExecuteMatchmaking({
        inputContent: textContent,
        formatType: 'Texto',
        partnerName: partnerName || undefined,
      });
    } else if (activeTab === 'file') {
      if (!selectedFile) return;
      const isSpreadsheet =
        selectedFile.file.name.endsWith('.csv') ||
        selectedFile.file.name.endsWith('.xlsx') ||
        selectedFile.mimeType.includes('csv') ||
        selectedFile.mimeType.includes('spreadsheet');

      const isPdf = selectedFile.file.name.endsWith('.pdf') || selectedFile.mimeType.includes('pdf');

      onExecuteMatchmaking({
        inputContent: selectedFile.previewText || textContent || undefined,
        fileAttachment: {
          base64: selectedFile.base64,
          mimeType: selectedFile.mimeType,
          fileName: selectedFile.file.name,
        },
        formatType: isSpreadsheet ? 'Planilha / Dados' : isPdf ? 'Documento / PDF' : 'Arquivo',
        partnerName: partnerName || undefined,
      });
    } else if (activeTab === 'audio') {
      if (!audioData) return;
      onExecuteMatchmaking({
        inputContent: textContent || undefined,
        audioAttachment: {
          base64: audioData.base64,
          mimeType: audioData.mimeType,
        },
        formatType: 'Áudio / Transcrição',
        partnerName: partnerName || undefined,
      });
    }
  };

  const hasContentToSubmit =
    (activeTab === 'text' && textContent.trim().length > 10) ||
    (activeTab === 'file' && selectedFile !== null) ||
    (activeTab === 'audio' && audioData !== null);

  return (
    <div className="bg-[#251f33] border border-[#3c3253] rounded-2xl shadow-xl overflow-hidden">
      {/* Top Bar with Mode Tabs */}
      <div className="bg-[#1f192c]/90 border-b border-[#3c3253] px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 sm:gap-2 bg-[#251f33] p-1 rounded-xl border border-[#3c3253]">
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
              activeTab === 'text'
                ? 'bg-[#ff4545] text-white shadow-sm shadow-[#ff4545]/30'
                : 'text-[#b2b6bf] hover:text-white hover:bg-[#2e2640]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Texto / Briefing</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
              activeTab === 'file'
                ? 'bg-[#ff4545] text-white shadow-sm shadow-[#ff4545]/30'
                : 'text-[#b2b6bf] hover:text-white hover:bg-[#2e2640]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Arquivo (PDF / Planilha)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audio')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
              activeTab === 'audio'
                ? 'bg-[#ff4545] text-white shadow-sm shadow-[#ff4545]/30'
                : 'text-[#b2b6bf] hover:text-white hover:bg-[#2e2640]'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-[#ff4545]" />
            <span>Gravação / Áudio</span>
          </button>
        </div>

        {/* Partner Name optional field */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Building2 className="w-4 h-4 text-[#b2b6bf] hidden sm:block" />
          <input
            type="text"
            placeholder="Nome da Empresa / Parceiro (ex: Hospital São Lucas)"
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
            className="w-full sm:w-72 bg-[#1f192c] border border-[#3c3253] rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-[#b2b6bf]/60 focus:outline-none focus:ring-1 focus:ring-[#ff4545] focus:border-[#ff4545]"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-6 space-y-4">
        {/* Presets Header */}
        <div className="bg-[#1f192c]/60 border border-[#3c3253] rounded-xl p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#b2b6bf] uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3 h-3 text-[#ff4545]" />
              Casos Reais para Demonstração:
            </span>
            <button
              onClick={onOpenKnowledgeBase}
              className="text-[11px] text-[#90a5e5] hover:text-white font-semibold flex items-center gap-1 transition"
            >
              <BookOpen className="w-3 h-3" />
              Ver Catálogo de Metaprojetos
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {SAMPLE_BRIEFINGS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#251f33] hover:bg-[#ff4545] hover:text-white text-[#e6eaeb] border border-[#3c3253] transition flex items-center gap-1.5"
                title={preset.description}
              >
                <span>{preset.title}</span>
                <span className="text-[10px] text-[#90a5e5] hover:text-white font-mono">({preset.category})</span>
              </button>
            ))}
          </div>
        </div>

        {transcriptNotice && (
          <div className="text-xs text-[#89cea5] bg-[#89cea5]/10 border border-[#89cea5]/20 px-3 py-2 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#89cea5]" />
            <span>{transcriptNotice}</span>
          </div>
        )}

        {/* Tab 1: Text */}
        {activeTab === 'text' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#b2b6bf]">
              <label htmlFor="briefing-textarea" className="font-semibold text-[#e6eaeb]">
                Cole o texto do desafio, e-mail do parceiro ou ata de reunião:
              </label>
              <span className="font-mono text-[11px]">{textContent.length} caracteres</span>
            </div>

            <textarea
              id="briefing-textarea"
              rows={9}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Exemplo: 'Temos 3 dores operacionais na nossa fábrica: 1) Precisamos monitorar a vibração de motores elétricos em tempo real com sensores IoT; 2) Prever quando uma máquina irá falhar com Machine Learning; 3) Um portal web para o operador registrar ordens de serviço...'"
              className="w-full bg-[#1f192c] border border-[#3c3253] rounded-xl p-4 text-sm text-[#e6eaeb] placeholder-[#b2b6bf]/50 focus:outline-none focus:ring-2 focus:ring-[#ff4545] focus:border-[#ff4545] font-sans resize-y leading-relaxed"
            />
          </div>
        )}

        {/* Tab 2: File Upload (PDF, CSV, Excel, TXT) */}
        {activeTab === 'file' && (
          <div className="space-y-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.csv,.xlsx,.xls,.txt,.doc,.docx"
              className="hidden"
            />

            {!selectedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#3c3253] hover:border-[#ff4545]/60 rounded-2xl bg-[#1f192c]/50 cursor-pointer transition group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#2e2640] group-hover:bg-[#ff4545]/20 flex items-center justify-center text-[#90a5e5] group-hover:text-[#ff4545] mb-3 transition">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-[#e6eaeb]">
                  Clique ou arraste um documento ou planilha corporativa aqui
                </p>
                <p className="text-xs text-[#b2b6bf] mt-1">
                  Formatos aceitos: PDF, Planilhas (CSV, XLSX), Documentos (DOCX, TXT)
                </p>
                <span className="mt-3 inline-flex items-center px-2.5 py-1 rounded text-[11px] font-medium bg-[#2e2640] text-[#90a5e5] border border-[#3c3253]">
                  O assistente multimodal lerá as iniciativas contidas no documento
                </span>
              </div>
            ) : (
              <div className="bg-[#1f192c] border border-[#3c3253] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#ff4545]/15 text-[#ff4545] flex items-center justify-center">
                      {selectedFile.isSpreadsheet ? (
                        <FileSpreadsheet className="w-5 h-5 text-[#89cea5]" />
                      ) : (
                        <FileText className="w-5 h-5 text-[#ff4545]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-white">{selectedFile.file.name}</p>
                        {selectedFile.isSpreadsheet && (
                          <span className="text-[10px] bg-[#89cea5]/20 text-[#89cea5] px-2 py-0.5 rounded font-medium border border-[#89cea5]/30">
                            Planilha Tabular
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#b2b6bf]">
                        {(selectedFile.file.size / 1024).toFixed(1)} KB • {selectedFile.rowCount ? `${selectedFile.rowCount} linhas detectadas` : selectedFile.mimeType}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedFile.previewText && (
                      <button
                        type="button"
                        onClick={() => setShowFilePreview(!showFilePreview)}
                        className="text-xs px-2.5 py-1 rounded bg-[#2e2640] hover:bg-[#3c3253] text-[#caced6] flex items-center gap-1.5 transition"
                      >
                        {showFilePreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{showFilePreview ? 'Ocultar Prévia' : 'Ver Conteúdo'}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setShowFilePreview(false);
                      }}
                      className="text-[#b2b6bf] hover:text-[#ff4545] p-1.5 transition"
                      title="Remover arquivo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {selectedFile.sheetNames && selectedFile.sheetNames.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-[#b2b6bf]">Abas identificadas:</span>
                    {selectedFile.sheetNames.map((name, i) => (
                      <span key={i} className="text-[11px] bg-[#2e2640] text-[#caced6] px-2 py-0.5 rounded border border-[#3c3253]">
                        {name}
                      </span>
                    ))}
                  </div>
                )}

                {selectedFile.previewText && showFilePreview && (
                  <div className="bg-[#1b1626] border border-[#3c3253] rounded-lg p-3 text-xs text-[#caced6] font-mono max-h-48 overflow-y-auto">
                    <p className="text-[10px] text-[#b2b6bf] uppercase tracking-wider mb-1">
                      Texto extraído para análise do modelo:
                    </p>
                    <pre className="whitespace-pre-wrap leading-relaxed">{selectedFile.previewText}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Audio Recording / File */}
        {activeTab === 'audio' && (
          <div className="space-y-3">
            <AudioRecorder
              onAudioReady={handleAudioReady}
              onTranscribeDirectly={handleDirectTranscribe}
              isTranscribing={isTranscribing}
            />

            {textContent && (
              <div className="bg-[#1f192c] border border-[#3c3253] rounded-xl p-3.5 text-xs text-[#e6eaeb] space-y-1">
                <span className="font-semibold text-[#b2b6bf]">Transcrição Associada:</span>
                <p className="text-[#caced6] line-clamp-3 italic">&quot;{textContent}&quot;</p>
              </div>
            )}
          </div>
        )}

        {/* Action Button & Instructions */}
        <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#3c3253]">
          <div className="text-xs text-[#b2b6bf] flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-[#ff4545] shrink-0" />
            <span>
              Mapeamento multi-cenários: traz <strong className="text-[#e6eaeb]">até 3 opções de módulos</strong> com prós, contras e guia de decisão.
            </span>
          </div>

          <button
            type="button"
            disabled={!hasContentToSubmit || isLoading}
            onClick={handleSubmit}
            className={`flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm tracking-wide transition shadow-lg ${
              hasContentToSubmit && !isLoading
                ? 'bg-[#ff4545] hover:bg-[#e03232] text-white shadow-[#ff4545]/25 transform hover:-translate-y-0.5 cursor-pointer'
                : 'bg-[#2e2640] text-[#b2b6bf]/50 cursor-not-allowed border border-[#3c3253]'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="animate-pulse">{loadingSteps[loadingStepIdx]}</span>
              </div>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>Executar Matchmaking Inteli</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
