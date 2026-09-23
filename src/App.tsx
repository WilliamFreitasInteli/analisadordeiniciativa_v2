import React, { useState } from 'react';
import { Header } from './components/Header.tsx';
import { InputPanel } from './components/InputPanel.tsx';
import { ResultsView } from './components/ResultsView.tsx';
import { KnowledgeBaseExplorer } from './components/KnowledgeBaseExplorer.tsx';
import { RefinementModal } from './components/RefinementModal.tsx';
import { InteliLogo, InteliPillarsGraphic, InteliSymbol } from './components/InteliBrand.tsx';
import { MatchmakingResult, InitiativeMatch } from './types.ts';
import { INTELI_MODULES_CATALOG } from './data/inteliKnowledgeBase.ts';
import {
  Sparkles,
  Layers,
  GraduationCap,
  Calendar,
  Users,
  Target,
  AlertCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Award,
  Compass
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'matchmaking' | 'catalog' | 'history'>('matchmaking');
  const [matchResult, setMatchResult] = useState<MatchmakingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastPayload, setLastPayload] = useState<any>(null);
  const [refinementInitiative, setRefinementInitiative] = useState<InitiativeMatch | null>(null);
  const [catalogFilterName, setCatalogFilterName] = useState<string | null>(null);

  const cleanErrorMessage = (raw: string): string => {
    if (!raw) return 'Ocorreu um erro ao conectar com o serviço de IA. Tente novamente.';
    try {
      if (raw.startsWith('{') || raw.includes('{"error"')) {
        const parsed = JSON.parse(raw);
        if (parsed?.error?.message) {
          if (parsed.error.message.includes('high demand') || parsed.error.code === 503) {
            return 'O serviço de Inteligência Artificial do Gemini está enfrentando uma alta demanda momentânea no Google Cloud. Por favor, aguarde alguns segundos e clique em "Tentar Novamente".';
          }
          return parsed.error.message;
        }
      }
    } catch {
      // Not JSON
    }
    if (
      raw.includes('Unexpected token') ||
      raw.includes('<!doctype') ||
      raw.includes('<!DOCTYPE') ||
      raw.includes('not valid JSON') ||
      raw.includes('504') ||
      raw.includes('502')
    ) {
      return 'O servidor demorou para responder à requisição (Gateway Timeout). O sistema já foi reconfigurado com modelos de resposta rápida. Por favor, clique em "Tentar Novamente".';
    }
    if (raw.toLowerCase().includes('high demand') || raw.includes('503')) {
      return 'O serviço de Inteligência Artificial do Gemini está enfrentando uma alta demanda momentânea no Google Cloud. Por favor, aguarde alguns segundos e clique em "Tentar Novamente".';
    }
    return raw;
  };

  const handleExecuteMatchmaking = async (payload: {
    inputContent?: string;
    fileAttachment?: { base64: string; mimeType: string; fileName: string };
    audioAttachment?: { base64: string; mimeType: string };
    formatType: 'Texto' | 'Planilha / Dados' | 'Áudio / Transcrição' | 'Documento / PDF' | 'Arquivo';
    partnerName?: string;
  }) => {
    setIsLoading(true);
    setErrorMsg(null);
    setLastPayload(payload);
    try {
      const response = await fetch('/api/matchmake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let data: any = null;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error('O servidor de IA demorou para responder ou retornou uma página de erro temporária (504/502). Clique em "Tentar Novamente".');
      }

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'Falha ao processar o matchmaking das iniciativas.');
      }

      setMatchResult(data.result);
      setActiveTab('matchmaking');
    } catch (err: any) {
      console.error('Erro na chamada de matchmaking:', err);
      setErrorMsg(cleanErrorMessage(err.message || ''));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastPayload) {
      handleExecuteMatchmaking(lastPayload);
    }
  };

  const handleResetAnalysis = () => {
    setMatchResult(null);
    setErrorMsg(null);
  };

  const handleSelectModuleForCatalog = (moduleName: string) => {
    setCatalogFilterName(moduleName);
    setActiveTab('catalog');
  };

  return (
    <div className="min-h-screen bg-[#1b1626] text-[#e6eaeb] flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        modulesCount={INTELI_MODULES_CATALOG.length}
      />

      {/* Inteli Academic DNA Bar */}
      <div className="bg-[#251f33]/80 border-b border-[#3c3253] py-2.5 px-4 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-[#b2b6bf]">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5 font-medium text-[#e6eaeb]">
              <Calendar className="w-3.5 h-3.5 text-[#ff4545]" />
              Módulos de 10 Semanas • 5 Sprints Quinzenais
            </span>
            <span className="flex items-center gap-1.5 font-medium text-[#e6eaeb]">
              <Users className="w-3.5 h-3.5 text-[#90a5e5]" />
              Times de 6 a 8 Alunos Multidisciplinares
            </span>
            <span className="flex items-center gap-1.5 font-medium text-[#e6eaeb]">
              <Target className="w-3.5 h-3.5 text-[#89cea5]" />
              100% Desafios Reais com Empresas Parceiras
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#89cea5] bg-[#89cea5]/10 px-2.5 py-0.5 rounded-full border border-[#89cea5]/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Fidelidade às Ementas do Inteli</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn shadow-lg shadow-rose-950/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-200">Atenção no Processamento da IA</h4>
                <p className="text-xs text-rose-300/90 mt-0.5 leading-relaxed max-w-2xl">{errorMsg}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              {lastPayload && (
                <button
                  onClick={handleRetry}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#ff4545] hover:bg-[#e03232] text-white transition shadow-sm disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Reenviando...' : 'Tentar Novamente'}
                </button>
              )}
              <button
                onClick={() => setErrorMsg(null)}
                className="text-xs text-rose-400 hover:text-white px-2 py-1 rounded hover:bg-rose-500/20 transition"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Studio Matchmaking */}
        {activeTab === 'matchmaking' && (
          <div className="space-y-6">
            {!matchResult ? (
              <div className="space-y-6">
                {/* Inteli Brand Hero Box with 3-Pillar Graphic */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#251f33] via-[#2e2640] to-[#1f192c] border border-[#3c3253] rounded-3xl p-6 sm:p-8 shadow-2xl">
                  {/* Subtle Brand Glows */}
                  <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#ff4545]/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-10 right-0 w-80 h-80 bg-[#90a5e5]/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative">
                    {/* Left: Inteli Narrative */}
                    <div className="max-w-2xl space-y-3.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ff4545]/15 text-[#ff4545] border border-[#ff4545]/30">
                          <Sparkles className="w-3.5 h-3.5" />
                          Assistente de Coordenação • Brandbook 2025
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#3c3253]/60 text-[#90a5e5] border border-[#3c3253]">
                          Tecnologia • Negócios • Liderança
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                        Formar a geração que vai transformar o futuro.
                      </h2>

                      <p className="text-sm sm:text-base text-[#caced6] leading-relaxed">
                        Analise desafios propostos por parceiros corporativos e realize o <strong className="text-white">matchmaking multi-cenários</strong> com os módulos e metaprojetos do Inteli. Avalie prós, contras e calibragens de escopo em qualquer formato (áudio, texto, planilhas ou PDFs).
                      </p>

                      <div className="pt-2 flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs text-[#b2b6bf]">
                          <CheckCircle2 className="w-4 h-4 text-[#ff4545]" />
                          <span>Múltiplas Possibilidades (NotebookLM Style)</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#b2b6bf]">
                          <CheckCircle2 className="w-4 h-4 text-[#89cea5]" />
                          <span>Prós, Contras & Trade-offs</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#b2b6bf]">
                          <CheckCircle2 className="w-4 h-4 text-[#90a5e5]" />
                          <span>Guia de Decisão para o Parceiro</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Graphic of 3 Pillars (Liderança, Tecnologia, Negócios) */}
                    <div className="hidden lg:flex flex-col items-center justify-center shrink-0 p-4 bg-[#1f192c]/60 rounded-2xl border border-[#3c3253] relative">
                      <InteliPillarsGraphic className="w-56 h-48 drop-shadow-2xl" />
                      <div className="flex items-center justify-between w-full px-2 pt-2 text-[10px] font-bold text-[#b2b6bf] uppercase tracking-wider font-mono">
                        <span className="text-[#90a5e5]">Liderança</span>
                        <span className="text-[#e6eaeb]">Tecnologia</span>
                        <span className="text-[#ff4545]">Negócios</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input Panel */}
                <InputPanel
                  onExecuteMatchmaking={handleExecuteMatchmaking}
                  isLoading={isLoading}
                  onOpenKnowledgeBase={() => setActiveTab('catalog')}
                />
              </div>
            ) : (
              /* Results View */
              <ResultsView
                result={matchResult}
                onOpenRefinement={(item) => setRefinementInitiative(item)}
                onSelectModule={handleSelectModuleForCatalog}
                onReset={handleResetAnalysis}
              />
            )}
          </div>
        )}

        {/* Tab 2: Catalog Explorer */}
        {activeTab === 'catalog' && (
          <KnowledgeBaseExplorer
            selectedModuleName={catalogFilterName}
            onSelectModuleForFilter={(name) => setCatalogFilterName(name)}
          />
        )}
      </main>

      {/* Scope Refinement Assistant Modal */}
      {refinementInitiative && (
        <RefinementModal
          initiative={refinementInitiative}
          onClose={() => setRefinementInitiative(null)}
        />
      )}

      {/* Footer - Brandbook Guidelines */}
      <footer className="border-t border-[#3c3253] bg-[#1f192c] py-6 text-xs text-[#b2b6bf]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <InteliLogo theme="dark" showSignature={false} size="sm" />
            <span className="text-[#b2b6bf]">
              • Coordenação de Projetos & Parcerias Corporativas
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono text-[#caced6]">
            <span className="hover:text-[#ff4545] transition">Engenharia de Software</span>
            <span>•</span>
            <span className="hover:text-[#90a5e5] transition">Ciência da Computação</span>
            <span>•</span>
            <span className="hover:text-[#89cea5] transition">Engenharia de Computação</span>
            <span>•</span>
            <span className="hover:text-[#ff4545] transition">Sistemas de Informação</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
