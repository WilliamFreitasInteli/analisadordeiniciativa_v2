import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Download,
  Printer,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Layers,
  Award,
  AlertTriangle,
  Lightbulb,
  Building,
  Calendar,
  FileText,
  Clock,
  ArrowRight,
  CheckCircle2,
  Scale,
  Compass,
  Wrench,
  HelpCircle,
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react';
import { MatchmakingResult, InitiativeMatch, AdherenceLevel, ModuleOption } from '../types.ts';
import { InteliSymbol } from './InteliBrand.tsx';

interface ResultsViewProps {
  result: MatchmakingResult;
  onOpenRefinement: (initiative: InitiativeMatch) => void;
  onSelectModule: (moduleName: string) => void;
  onReset: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  onOpenRefinement,
  onSelectModule,
  onReset,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'raw'>('cards');

  const handleCopyFullReport = () => {
    navigator.clipboard.writeText(result.rawMarkdownOutput);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleCopySingleInitiative = (item: InitiativeMatch) => {
    let text = `## 🎯 Iniciativa: ${item.title}\n*   **Resumo do Desafio:** ${item.challengeSummary}\n*   **Metaprojeto Principal Recomendado:** ${item.recommendedMetaproject}\n*   **Grau de Aderência:** ${item.adherenceLevel} - ${item.adherenceJustification}\n`;

    if (item.options && item.options.length > 0) {
      text += `\n### 🧭 Possibilidades de Módulos & Análise de Trade-offs:\n`;
      item.options.forEach((opt) => {
        text += `\n#### ${opt.isPrimary ? '🔹' : '🔸'} ${opt.label}: ${opt.moduleName}\n`;
        text += `*   **Curso/Ano:** ${opt.course} • ${opt.year ? `${opt.year}º Ano` : ''}\n`;
        text += `*   **Grau de Aderência:** ${opt.adherenceLevel} - ${opt.adherenceJustification}\n`;
        if (opt.pros?.length) {
          text += `*   ✅ **Pontos Positivos (Prós):**\n${opt.pros.map((p) => `    * ${p}`).join('\n')}\n`;
        }
        if (opt.cons?.length) {
          text += `*   ⚠️ **Pontos Negativos / Trade-offs (Contras):**\n${opt.cons.map((c) => `    * ${c}`).join('\n')}\n`;
        }
        if (opt.scopeAdjustment) {
          text += `*   🔧 **Ajuste de Escopo Recomendado:** ${opt.scopeAdjustment}\n`;
        }
      });
    }

    if (item.decisionGuidance) {
      text += `\n💡 **Guia de Decisão para a Reunião com o Parceiro:** ${item.decisionGuidance}\n`;
    }

    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([result.rawMarkdownOutput], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `matchmaking-inteli-${(result.partnerName || 'parceiro').toLowerCase().replace(/\s+/g, '-')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const getAdherenceBadge = (level: AdherenceLevel) => {
    switch (level) {
      case 'Alto':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#89cea5]/15 text-[#89cea5] border border-[#89cea5]/30">
            <span className="w-2 h-2 rounded-full bg-[#89cea5] animate-pulse" />
            Aderência Alta
          </span>
        );
      case 'Médio':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#90a5e5]/15 text-[#90a5e5] border border-[#90a5e5]/30">
            <span className="w-2 h-2 rounded-full bg-[#90a5e5]" />
            Aderência Média
          </span>
        );
      case 'Baixo':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#ff4545]/15 text-[#ff4545] border border-[#ff4545]/30">
            <span className="w-2 h-2 rounded-full bg-[#ff4545]" />
            Aderência Baixa
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Overview Header & Action Bar (Brandbook 2025) */}
      <div className="bg-[#251f33] border border-[#3c3253] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#ff4545]/15 text-[#ff4545] border border-[#ff4545]/30">
              {result.extractedFromFormat}
            </span>
            {result.partnerName && (
              <span className="flex items-center gap-1.5 text-xs text-[#e6eaeb] font-semibold bg-[#1f192c] px-3 py-0.5 rounded-lg border border-[#3c3253]">
                <Building className="w-3.5 h-3.5 text-[#ff4545]" />
                {result.partnerName}
              </span>
            )}
            <span className="text-xs text-[#b2b6bf] flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-[#90a5e5]" />
              {new Date(result.processedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Matchmaking Concluído:
            <span className="text-[#ff4545]">{result.initiatives.length} Iniciativa(s) Analisada(s)</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#caced6] mt-1">
            Cada iniciativa foi destrinchada em múltiplos cenários e possibilidades de módulos, com análise de prós, contras e guia de decisão.
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View mode toggle */}
          <div className="bg-[#1f192c] p-1 rounded-xl border border-[#3c3253] flex items-center">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'cards'
                  ? 'bg-[#ff4545] text-white shadow-sm shadow-[#ff4545]/25'
                  : 'text-[#b2b6bf] hover:text-white'
              }`}
            >
              Cards Interativos
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'raw'
                  ? 'bg-[#ff4545] text-white shadow-sm shadow-[#ff4545]/25'
                  : 'text-[#b2b6bf] hover:text-white'
              }`}
            >
              Texto Formatado
            </button>
          </div>

          <button
            onClick={handleCopyFullReport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#2e2640] hover:bg-[#3c3253] text-[#e6eaeb] border border-[#3c3253] transition"
            title="Copiar relatório completo em Markdown"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-[#89cea5]" /> : <Copy className="w-3.5 h-3.5 text-[#ff4545]" />}
            <span>{copiedAll ? 'Copiado!' : 'Copiar Relatório'}</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#2e2640] hover:bg-[#3c3253] text-[#e6eaeb] border border-[#3c3253] transition"
            title="Baixar arquivo .md"
          >
            <Download className="w-3.5 h-3.5 text-[#90a5e5]" />
            <span className="hidden sm:inline">Baixar .MD</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#2e2640] hover:bg-[#3c3253] text-[#e6eaeb] border border-[#3c3253] transition"
            title="Imprimir / Exportar PDF"
          >
            <Printer className="w-3.5 h-3.5 text-[#89cea5]" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#ff4545]/15 hover:bg-[#ff4545]/25 text-[#ff4545] border border-[#ff4545]/30 transition"
          >
            Nova Análise
          </button>
        </div>
      </div>

      {/* Content: Cards View or Raw Text View */}
      {viewMode === 'cards' ? (
        <div className="space-y-8">
          {result.initiatives.map((item, idx) => {
            const options = item.options && item.options.length > 0 ? item.options : [
              {
                id: `opt-${idx + 1}-1`,
                isPrimary: true,
                label: 'Opção Principal (Recomendada)',
                moduleName: item.matchedModule || item.recommendedMetaproject,
                metaprojectName: item.recommendedMetaproject,
                course: item.matchedCourse,
                year: item.matchedYear,
                moduleNumber: item.matchedModule,
                adherenceLevel: item.adherenceLevel,
                adherenceJustification: item.adherenceJustification,
                pros: item.matchJustification || ['Aderência natural aos critérios do módulo'],
                cons: item.potentialRisksOrGaps || ['Alinhar escopo de dados nas primeiras sprints'],
                scopeAdjustment: 'Calibrar os entregáveis para o ciclo de 10 semanas (5 sprints quinzenais).',
                keyTechnologies: item.keyTechnologies || [],
              } as ModuleOption
            ];

            const hasMultipleOptions = options.length > 1;

            return (
              <div
                key={item.id || idx}
                className="bg-[#251f33] border border-[#3c3253] hover:border-[#ff4545]/40 rounded-2xl p-5 sm:p-7 shadow-xl transition space-y-6"
              >
                {/* 1. Header da Iniciativa */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#3c3253]">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#ff4545]/20 text-[#ff4545] text-xs font-bold flex items-center justify-center border border-[#ff4545]/40 font-mono">
                        {idx + 1}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        🎯 {item.title}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {item.code && (
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#ff4545]/20 text-[#ff4545] border border-[#ff4545]/40 font-mono">
                          {item.code}
                        </span>
                      )}
                      {item.controlCode && (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#90a5e5]/15 text-[#90a5e5] border border-[#90a5e5]/30 font-mono">
                          {item.controlCode}
                        </span>
                      )}
                      {item.quarter && (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#1f192c] text-[#89cea5] border border-[#3c3253] font-mono">
                          {item.quarter}
                        </span>
                      )}

                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-[#1f192c] text-[#caced6] border border-[#3c3253]">
                        <span className="text-white font-semibold">{item.matchedCourse}: </span>
                        {item.recommendedMetaproject}
                      </span>

                      {hasMultipleOptions && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#90a5e5]/15 text-[#90a5e5] border border-[#90a5e5]/30 flex items-center gap-1.5 font-mono">
                          <Scale className="w-3.5 h-3.5" />
                          {options.length} Possibilidades
                        </span>
                      )}

                      {item.pdfUrl && (
                        <a
                          href={item.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#89cea5] hover:underline bg-[#89cea5]/10 px-2 py-0.5 rounded border border-[#89cea5]/20 font-mono"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Ementa Oficial (PDF)
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {getAdherenceBadge(item.adherenceLevel)}
                    <button
                      onClick={() => handleCopySingleInitiative(item)}
                      className="p-2 rounded-lg bg-[#2e2640] hover:bg-[#3c3253] text-[#b2b6bf] hover:text-white transition"
                      title="Copiar análise completa desta iniciativa"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-[#89cea5]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 2. Resumo do Desafio */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-[#b2b6bf] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <FileText className="w-3.5 h-3.5 text-[#ff4545]" />
                    Resumo do Desafio (Demanda do Parceiro):
                  </h4>
                  <p className="text-sm text-[#e6eaeb] leading-relaxed bg-[#1f192c] p-4 rounded-xl border border-[#3c3253]">
                    {item.challengeSummary}
                  </p>
                </div>

                {/* 3. Guia de Decisão para a Reunião com o Parceiro (Decision Guidance) */}
                {item.decisionGuidance && (
                  <div className="bg-gradient-to-r from-[#2e2640] via-[#251f33] to-[#1f192c] border border-[#90a5e5]/40 rounded-xl p-4 sm:p-5 relative overflow-hidden">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#90a5e5]/20 text-[#90a5e5] flex items-center justify-center shrink-0 border border-[#90a5e5]/30 mt-0.5">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm font-bold text-[#90a5e5] flex items-center gap-1.5 font-mono">
                          🧭 Guia de Tomada de Decisão para a Coordenação:
                        </h4>
                        <p className="text-xs sm:text-sm text-[#e6eaeb] leading-relaxed">
                          {item.decisionGuidance}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Sessão Comparativa: Possibilidades de Módulos & Análise de Trade-offs */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                      <Scale className="w-4 h-4 text-[#ff4545]" />
                      Possibilidades de Módulos & Análise de Trade-offs:
                    </h4>
                    <span className="text-[11px] text-[#b2b6bf] hidden sm:inline font-mono">
                      Avalie os prós e contras de cada módulo para a reunião
                    </span>
                  </div>

                  {/* Grid de Opções (1 ou mais lado a lado) */}
                  <div
                    className={`grid gap-4 ${
                      options.length === 1
                        ? 'grid-cols-1'
                        : options.length === 2
                        ? 'grid-cols-1 lg:grid-cols-2'
                        : 'grid-cols-1 lg:grid-cols-3'
                    }`}
                  >
                    {options.map((opt, optIdx) => (
                      <div
                        key={opt.id || optIdx}
                        className={`rounded-xl p-4 sm:p-5 border transition flex flex-col justify-between space-y-4 ${
                          opt.isPrimary
                            ? 'bg-[#2e2640] border-[#ff4545]/40 shadow-lg shadow-[#ff4545]/10'
                            : 'bg-[#1f192c] border-[#3c3253] hover:border-[#90a5e5]/40'
                        }`}
                      >
                        {/* Option Header */}
                        <div className="space-y-2.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide border font-mono ${
                                  opt.isPrimary
                                    ? 'bg-[#ff4545]/20 text-[#ff4545] border-[#ff4545]/40'
                                    : 'bg-[#90a5e5]/20 text-[#90a5e5] border-[#90a5e5]/30'
                                }`}
                              >
                                {opt.label || (opt.isPrimary ? 'Opção 1 (Principal Recomendada)' : `Opção ${optIdx + 1} (Alternativa Viável)`)}
                              </span>
                              {opt.code && (
                                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#ff4545]/15 text-[#ff4545] border border-[#ff4545]/30 font-mono">
                                  {opt.code}
                                </span>
                              )}
                              {opt.controlCode && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#90a5e5]/15 text-[#90a5e5] border border-[#90a5e5]/30 font-mono">
                                  {opt.controlCode}
                                </span>
                              )}
                              {opt.quarter && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#1f192c] text-[#89cea5] border border-[#3c3253] font-mono">
                                  {opt.quarter}
                                </span>
                              )}
                            </div>
                            {getAdherenceBadge(opt.adherenceLevel)}
                          </div>

                          <div>
                            <span className="text-[11px] font-semibold text-[#90a5e5] block mb-0.5 font-mono">
                              {opt.course} • {opt.year ? `${opt.year}º Ano` : ''}
                            </span>
                            <h5 className="text-sm sm:text-base font-bold text-white leading-snug">
                              {opt.metaprojectName || opt.moduleName}
                            </h5>
                          </div>

                          <div className="text-[11px] text-[#caced6] bg-[#1b1626] p-2.5 rounded-lg border border-[#3c3253] leading-relaxed">
                            <span className="font-semibold text-white">Encaixe Pedagógico: </span>
                            {opt.adherenceJustification}
                          </div>

                          {/* Direct Links to Ementa PDF & Portal de Parcerias */}
                          {(opt.pdfUrl || opt.partnerPortalUrl) && (
                            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                              {opt.pdfUrl && (
                                <a
                                  href={opt.pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#89cea5] hover:underline bg-[#89cea5]/10 px-2 py-0.5 rounded border border-[#89cea5]/20 font-mono"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  Ementa PDF
                                </a>
                              )}
                              {opt.partnerPortalUrl && (
                                <a
                                  href={opt.partnerPortalUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#90a5e5] hover:underline bg-[#90a5e5]/10 px-2 py-0.5 rounded border border-[#90a5e5]/20 font-mono"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  Portal Inteli
                                </a>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Pontos Positivos (Prós) */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-[#89cea5] uppercase tracking-wider flex items-center gap-1 font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Pontos Positivos (Prós):
                          </span>
                          <ul className="space-y-1.5">
                            {opt.pros && opt.pros.length > 0 ? (
                              opt.pros.map((p, pIdx) => (
                                <li
                                  key={pIdx}
                                  className="text-xs text-[#e6eaeb] bg-[#89cea5]/10 border border-[#89cea5]/20 p-2 rounded-lg flex items-start gap-2"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#89cea5] mt-1.5 shrink-0" />
                                  <span className="leading-relaxed">{p}</span>
                                </li>
                              ))
                            ) : (
                              <li className="text-xs text-[#b2b6bf] italic">Alta afinidade com as competências do ciclo.</li>
                            )}
                          </ul>
                        </div>

                        {/* Pontos Negativos / Trade-offs (Contras) */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-[#ff4545] uppercase tracking-wider flex items-center gap-1 font-mono">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Trade-offs & Limitações (Contras):
                          </span>
                          <ul className="space-y-1.5">
                            {opt.cons && opt.cons.length > 0 ? (
                              opt.cons.map((c, cIdx) => (
                                <li
                                  key={cIdx}
                                  className="text-xs text-[#e6eaeb] bg-[#ff4545]/10 border border-[#ff4545]/20 p-2 rounded-lg flex items-start gap-2"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff4545] mt-1.5 shrink-0" />
                                  <span className="leading-relaxed">{c}</span>
                                </li>
                              ))
                            ) : (
                              <li className="text-xs text-[#b2b6bf] italic">Nenhum trade-off impeditivo detectado.</li>
                            )}
                          </ul>
                        </div>

                        {/* Ajuste de Escopo Recomendado */}
                        {opt.scopeAdjustment && (
                          <div className="text-xs bg-[#1b1626] border border-[#3c3253] rounded-lg p-2.5 space-y-1">
                            <span className="font-semibold text-[#90a5e5] flex items-center gap-1 text-[11px] font-mono">
                              <Wrench className="w-3 h-3 text-[#90a5e5]" />
                              Ajuste de Escopo para 10 Semanas:
                            </span>
                            <p className="text-[#caced6] text-[11px] leading-relaxed">
                              {opt.scopeAdjustment}
                            </p>
                          </div>
                        )}

                        {/* Action: Ver Ementa deste Módulo */}
                        <div className="pt-2 border-t border-[#3c3253]">
                          <button
                            type="button"
                            onClick={() => onSelectModule(opt.moduleName || opt.metaprojectName)}
                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-[#251f33] hover:bg-[#3c3253] text-[#e6eaeb] border border-[#3c3253] transition"
                          >
                            <span>Consultar Ementa & Competências</span>
                            <ExternalLink className="w-3.5 h-3.5 text-[#ff4545]" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Rodapé da Iniciativa: Ações do Coordenador */}
                <div className="pt-4 border-t border-[#3c3253] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-[#b2b6bf]">
                    💡 <span className="font-medium text-[#e6eaeb]">Deseja refinar o escopo ou negociar trade-offs?</span> Use o assistente interativo para simular alinhamentos.
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopySingleInitiative(item)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#1f192c] hover:bg-[#2e2640] text-[#e6eaeb] border border-[#3c3253] transition"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#90a5e5]" />
                      <span>{copiedId === item.id ? 'Copiado!' : 'Copiar Iniciativa'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenRefinement(item)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-[#ff4545] hover:bg-[#e03232] text-white shadow-sm shadow-[#ff4545]/20 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Refinar Escopo / Simular Negociação</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Raw Formatted Output Box */
        <div className="bg-[#251f33] border border-[#3c3253] rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#3c3253]">
            <span className="text-xs font-bold text-[#b2b6bf] uppercase tracking-wider font-mono">
              Relatório Completo em Formato Markdown (NotebookLM Multi-Cenários)
            </span>
            <button
              onClick={handleCopyFullReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#ff4545] hover:bg-[#e03232] text-white transition"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? 'Copiado!' : 'Copiar Texto Completo'}</span>
            </button>
          </div>

          <pre className="font-mono text-xs sm:text-sm text-[#e6eaeb] bg-[#1f192c] p-5 rounded-xl border border-[#3c3253] overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {result.rawMarkdownOutput}
          </pre>
        </div>
      )}

      {/* Final Section: Próximo Passo Sugerido para o Coordenador */}
      <div className="bg-gradient-to-br from-[#2e2640] via-[#251f33] to-[#1f192c] border-2 border-[#ff4545]/30 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff4545]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#ff4545]/20 border border-[#ff4545]/30 text-[#ff4545] flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-[#ff4545]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                💡 Próximo Passo Sugerido para a Coordenação:
              </h3>
              <p className="text-xs text-[#b2b6bf]">
                Ação recomendada para validação e fechamento de escopo com o parceiro corporativo
              </p>
            </div>
          </div>

          <div className="bg-[#1f192c] border border-[#3c3253] rounded-xl p-4 sm:p-5 text-sm text-[#e6eaeb] leading-relaxed font-sans shadow-inner">
            {result.coordinatorNextStep}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => onOpenRefinement(result.initiatives[0] || ({} as any))}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#ff4545] hover:bg-[#e03232] text-white shadow-md shadow-[#ff4545]/30 transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Gerar Rascunho de E-mail de Refinamento</span>
            </button>

            <button
              onClick={handleCopyFullReport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#2e2640] hover:bg-[#3c3253] text-[#e6eaeb] border border-[#3c3253] transition"
            >
              <Copy className="w-3.5 h-3.5 text-[#90a5e5]" />
              <span>Copiar Análise Completa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
