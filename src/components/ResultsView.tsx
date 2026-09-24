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
  SlidersHorizontal,
  Table as TableIcon,
  FileSpreadsheet,
  FileType2,
  Search,
  Filter,
  Eye,
  ChevronDown,
  ChevronUp,
  XCircle,
  PieChart
} from 'lucide-react';
import { MatchmakingResult, InitiativeMatch, AdherenceLevel, ModuleOption, ViabilityStatus } from '../types.ts';
import { InteliSymbol } from './InteliBrand.tsx';
import { exportToExcel, exportToWord } from '../utils/exportReports.ts';

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
  const [viewMode, setViewMode] = useState<'cards' | 'table' | 'raw'>('cards');
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [showAllInitiatives, setShowAllInitiatives] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Aderente' | 'Ajuste' | 'Fora'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInitiativeModal, setSelectedInitiativeModal] = useState<InitiativeMatch | null>(null);

  const totalInitiatives = result.initiatives.length;
  const isLargePortfolio = totalInitiatives > 3;

  // Derive metrics
  const directMatchCount =
    result.portfolioSummary?.directMatchCount ??
    result.initiatives.filter(
      (i) => i.viabilityStatus === 'Aderente (Match Direto)' || i.adherenceLevel === 'Alto'
    ).length;

  const scopeAdjustmentCount =
    result.portfolioSummary?.scopeAdjustmentCount ??
    result.initiatives.filter(
      (i) => i.viabilityStatus === 'Ajuste de Escopo Necessário' || i.adherenceLevel === 'Médio'
    ).length;

  const outOfScopeCount =
    result.portfolioSummary?.outOfScopeCount ??
    result.initiatives.filter(
      (i) => i.viabilityStatus === 'Fora de Escopo Computacional' || i.adherenceLevel === 'Baixo'
    ).length;

  const directMatchPct = Math.round((directMatchCount / (totalInitiatives || 1)) * 100);
  const scopeAdjustmentPct = Math.round((scopeAdjustmentCount / (totalInitiatives || 1)) * 100);
  const outOfScopePct = Math.round((outOfScopeCount / (totalInitiatives || 1)) * 100);

  const handleExportWord = async () => {
    try {
      setIsExportingWord(true);
      await exportToWord(result);
    } catch (err) {
      console.error('Erro ao exportar Word:', err);
    } finally {
      setIsExportingWord(false);
    }
  };

  const handleExportExcel = () => {
    try {
      setIsExportingExcel(true);
      exportToExcel(result);
    } catch (err) {
      console.error('Erro ao exportar Excel:', err);
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleCopyFullReport = () => {
    navigator.clipboard.writeText(result.rawMarkdownOutput);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleCopySingleInitiative = (item: InitiativeMatch) => {
    let text = `## 🎯 Iniciativa: ${item.title}\n*   **Status de Viabilidade:** ${item.viabilityStatus || item.adherenceLevel}\n*   **Resumo do Desafio:** ${item.challengeSummary}\n*   **Metaprojeto Principal Recomendado:** ${item.recommendedMetaproject}\n*   **Grau de Aderência:** ${item.adherenceLevel} - ${item.adherenceJustification}\n`;

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

  const handlePrint = () => {
    window.print();
  };

  const getAdherenceBadge = (level: AdherenceLevel) => {
    switch (level) {
      case 'Alto':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#89cea5]/20 text-[#066d73] border border-[#89cea5]/40 font-mono">
            <span className="w-2 h-2 rounded-full bg-[#066d73]" />
            Aderência Alta
          </span>
        );
      case 'Médio':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#90a5e5]/20 text-[#364f99] border border-[#90a5e5]/40 font-mono">
            <span className="w-2 h-2 rounded-full bg-[#364f99]" />
            Aderência Média
          </span>
        );
      case 'Baixo':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#ff4545]/15 text-[#e03232] border border-[#ff4545]/30 font-mono">
            <span className="w-2 h-2 rounded-full bg-[#ff4545]" />
            Aderência Baixa
          </span>
        );
    }
  };

  const getViabilityBadge = (status?: ViabilityStatus | string, level?: AdherenceLevel) => {
    const s = status || (level === 'Alto' ? 'Aderente (Match Direto)' : level === 'Médio' ? 'Ajuste de Escopo Necessário' : 'Fora de Escopo Computacional');
    if (s.includes('Aderente') || s.includes('Match Direto')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#89cea5]/25 text-[#066d73] border border-[#89cea5]/50 font-mono">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#066d73]" />
          Aderente (Match Direto)
        </span>
      );
    }
    if (s.includes('Ajuste')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#90a5e5]/25 text-[#2b4182] border border-[#90a5e5]/50 font-mono">
          <Wrench className="w-3.5 h-3.5 text-[#364f99]" />
          Ajuste de Escopo Necessário
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#ff4545]/20 text-[#c82323] border border-[#ff4545]/40 font-mono">
        <XCircle className="w-3.5 h-3.5 text-[#ff4545]" />
        Fora de Escopo Computacional
      </span>
    );
  };

  // Filter initiatives for table/cards
  const filteredInitiatives = result.initiatives.filter((item) => {
    // Status filter
    if (statusFilter === 'Aderente') {
      const match = item.viabilityStatus === 'Aderente (Match Direto)' || item.adherenceLevel === 'Alto';
      if (!match) return false;
    } else if (statusFilter === 'Ajuste') {
      const match = item.viabilityStatus === 'Ajuste de Escopo Necessário' || item.adherenceLevel === 'Médio';
      if (!match) return false;
    } else if (statusFilter === 'Fora') {
      const match = item.viabilityStatus === 'Fora de Escopo Computacional' || item.adherenceLevel === 'Baixo';
      if (!match) return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(q);
      const challengeMatch = item.challengeSummary.toLowerCase().includes(q);
      const metaprojectMatch = item.recommendedMetaproject.toLowerCase().includes(q);
      const courseMatch = item.matchedCourse.toLowerCase().includes(q);
      const codeMatch = (item.code || '').toLowerCase().includes(q);
      if (!titleMatch && !challengeMatch && !metaprojectMatch && !courseMatch && !codeMatch) {
        return false;
      }
    }

    return true;
  });

  // Displayed initiatives in cards view:
  // If large portfolio and user hasn't clicked "show all", show top 3
  const displayedCards = (isLargePortfolio && !showAllInitiatives)
    ? filteredInitiatives.slice(0, 3)
    : filteredInitiatives;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Header Principal & Action Bar (Brandbook 2025) */}
      <div className="bg-white border border-[#d8dce6] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#ff4545]/10 text-[#e03232] border border-[#ff4545]/25">
              {result.extractedFromFormat}
            </span>
            {result.partnerName && (
              <span className="flex items-center gap-1.5 text-xs text-[#2e2640] font-semibold bg-[#f8f9fc] px-3 py-0.5 rounded-lg border border-[#d8dce6]">
                <Building className="w-3.5 h-3.5 text-[#ff4545]" />
                {result.partnerName}
              </span>
            )}
            <span className="text-xs text-[#6c657e] flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-[#364f99]" />
              {new Date(result.processedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#2e2640] flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Matchmaking Concluído:
            <span className="text-[#ff4545]">{totalInitiatives} Iniciativa(s) Catalogada(s)</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#555065] mt-1">
            Enquadramento técnico e pedagógico com a matriz de graduação do Inteli e limites de laboratório.
          </p>
        </div>

        {/* Global Toolbar & Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View mode toggle */}
          <div className="bg-[#edeef4] p-1 rounded-xl border border-[#d8dce6] flex items-center">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'cards'
                  ? 'bg-[#ff4545] text-white shadow-sm shadow-[#ff4545]/20'
                  : 'text-[#555065] hover:text-[#2e2640]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-[#ff4545] text-white shadow-sm shadow-[#ff4545]/20'
                  : 'text-[#555065] hover:text-[#2e2640]'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Tabela Geral ({totalInitiatives})</span>
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'raw'
                  ? 'bg-[#ff4545] text-white shadow-sm shadow-[#ff4545]/20'
                  : 'text-[#555065] hover:text-[#2e2640]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Markdown</span>
            </button>
          </div>

          {/* Export to Word Button */}
          <button
            onClick={handleExportWord}
            disabled={isExportingWord}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#364f99] hover:bg-[#2b4182] text-white transition shadow-sm disabled:opacity-50"
            title="Baixar relatório executivo em Word (.docx)"
          >
            <FileType2 className="w-3.5 h-3.5 text-[#90a5e5]" />
            <span>{isExportingWord ? 'Gerando...' : 'Baixar .DOCX'}</span>
          </button>

          {/* Export to Excel Button */}
          <button
            onClick={handleExportExcel}
            disabled={isExportingExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#066d73] hover:bg-[#045054] text-white transition shadow-sm disabled:opacity-50"
            title="Baixar matriz completa de iniciativas em Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#89cea5]" />
            <span>{isExportingExcel ? 'Gerando...' : 'Baixar .XLSX'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-[#edeef4] text-[#2e2640] border border-[#d8dce6] transition shadow-2xs"
            title="Imprimir ou Salvar em PDF"
          >
            <Printer className="w-3.5 h-3.5 text-[#555065]" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 transition shadow-2xs"
          >
            Nova Análise
          </button>
        </div>
      </div>

      {/* 2. Executive Dashboard (NotebookLM Page 1 Style): Big Numbers & Portfolio Health */}
      <div className="bg-white border border-[#d8dce6] rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#e2e5ec]">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#ff4545]" />
            <h3 className="text-base sm:text-lg font-bold text-[#2e2640]" style={{ fontFamily: 'var(--font-heading)' }}>
              Painel de Enquadramento Executivo do Portfólio
            </h3>
          </div>
          <span className="text-xs text-[#6c657e] font-mono">
            {result.partnerName || 'Parceiro'} • Classificação segundo a Matriz Curricular Inteli
          </span>
        </div>

        {/* Big Numbers Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Total Initiatives */}
          <div className="bg-[#fafbfc] border border-[#d8dce6] rounded-xl p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-xs font-bold text-[#6c657e] uppercase tracking-wider font-mono">
              Total de Iniciativas
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#2e2640] font-mono">
                {totalInitiatives}
              </span>
              <span className="text-xs text-[#6c657e]">catalogadas</span>
            </div>
            <div className="mt-3 text-[11px] text-[#555065]">
              Documento: <span className="font-semibold text-[#2e2640]">{result.extractedFromFormat}</span>
            </div>
          </div>

          {/* Direct Match (Aderente) */}
          <div className="bg-[#f0f9f4] border border-[#89cea5]/50 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#066d73] uppercase tracking-wider font-mono">
                Match Direto
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#89cea5]/30 text-[#066d73] font-mono">
                {directMatchPct}%
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#066d73] font-mono">
                {directMatchCount}
              </span>
              <span className="text-xs text-[#066d73]/80">iniciativas</span>
            </div>
            <div className="mt-3 text-[11px] text-[#066d73] font-medium">
              Aderência natural à ementa oficial
            </div>
          </div>

          {/* Scope Adjustment Needed */}
          <div className="bg-[#f0f3fa] border border-[#90a5e5]/50 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#364f99] uppercase tracking-wider font-mono">
                Ajuste de Escopo
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#90a5e5]/30 text-[#364f99] font-mono">
                {scopeAdjustmentPct}%
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#364f99] font-mono">
                {scopeAdjustmentCount}
              </span>
              <span className="text-xs text-[#364f99]/80">iniciativas</span>
            </div>
            <div className="mt-3 text-[11px] text-[#364f99] font-medium">
              Requer bancada/simulação ou 10 semanas
            </div>
          </div>

          {/* Out of Scope */}
          <div className="bg-[#fff5f5] border border-[#ff4545]/30 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#e03232] uppercase tracking-wider font-mono">
                Fora de Escopo
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#ff4545]/20 text-[#e03232] font-mono">
                {outOfScopePct}%
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#e03232] font-mono">
                {outOfScopeCount}
              </span>
              <span className="text-xs text-[#e03232]/80">iniciativas</span>
            </div>
            <div className="mt-3 text-[11px] text-[#e03232] font-medium">
              Viola fronteiras de SLA ou campo
            </div>
          </div>
        </div>

        {/* Course Distribution Bars */}
        {result.portfolioSummary?.courseDistribution && result.portfolioSummary.courseDistribution.length > 0 && (
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-[#555065] uppercase tracking-wider font-mono block">
              Distribuição por Frentes de Graduação do Inteli:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {result.portfolioSummary.courseDistribution.map((item, idx) => (
                <div key={idx} className="bg-[#f8f9fc] border border-[#e2e5ec] rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2e2640]">{item.course}</span>
                    <span className="text-xs font-extrabold text-[#ff4545] font-mono bg-[#ff4545]/10 px-2 py-0.5 rounded">
                      {item.count} {item.count === 1 ? 'demanda' : 'demandas'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6c657e] line-clamp-2 leading-relaxed">
                    {item.frentes}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Callout Inteligente para Portfólio com Múltiplas Iniciativas (Sugestão do Usuário) */}
        {isLargePortfolio && (
          <div className="bg-gradient-to-r from-[#251f33] via-[#2f2740] to-[#251f33] border-2 border-[#ff4545]/40 rounded-xl p-5 text-white shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#ff4545]/20 border border-[#ff4545]/40 flex items-center justify-center shrink-0 text-[#ff4545]">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    Portfólio com {totalInitiatives} Iniciativas Detectadas
                  </h4>
                  <p className="text-xs text-[#d8dce6] mt-0.5 leading-relaxed max-w-3xl">
                    Por padrão de experiência executiva, exibimos em tela os <strong>3 principais destaques prioritários</strong>. Para consultar todas as {totalInitiatives} demandas, utilize a <strong>Tabela Geral</strong>, expanda na tela ou baixe o <strong>Dossiê Completo (.DOCX)</strong> ou a <strong>Planilha Tabulada (.XLSX)</strong>.
                  </p>
                </div>
              </div>

              {/* Action Buttons in Banner */}
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
                <button
                  onClick={handleExportWord}
                  disabled={isExportingWord}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-[#ff4545] hover:bg-[#e03232] text-white shadow-sm transition disabled:opacity-50"
                >
                  <FileType2 className="w-3.5 h-3.5" />
                  <span>{isExportingWord ? 'Gerando...' : 'Baixar Dossiê (.DOCX)'}</span>
                </button>

                <button
                  onClick={handleExportExcel}
                  disabled={isExportingExcel}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-[#066d73] hover:bg-[#045054] text-white shadow-sm transition disabled:opacity-50"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>{isExportingExcel ? 'Gerando...' : 'Baixar Planilha (.XLSX)'}</span>
                </button>

                <button
                  onClick={() => setShowAllInitiatives(!showAllInitiatives)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-[#3c3253] hover:bg-[#4a3e66] text-white border border-[#4d3f6a] transition"
                >
                  <Eye className="w-3.5 h-3.5 text-[#90a5e5]" />
                  <span>{showAllInitiatives ? 'Focar nas Top 3' : `Exibir Todas as ${totalInitiatives} na Tela`}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Filter and Search Bar for Initiatives */}
      <div className="bg-white border border-[#d8dce6] rounded-xl p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs font-bold text-[#555065] mr-1 flex items-center gap-1 font-mono">
            <Filter className="w-3.5 h-3.5 text-[#ff4545]" />
            Filtrar:
          </span>
          {(['Todos', 'Aderente', 'Ajuste', 'Fora'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                statusFilter === filter
                  ? 'bg-[#2e2640] text-white shadow-xs'
                  : 'bg-[#edeef4] text-[#555065] hover:text-[#2e2640]'
              }`}
            >
              {filter === 'Todos' && `Todos (${totalInitiatives})`}
              {filter === 'Aderente' && `Match Direto (${directMatchCount})`}
              {filter === 'Ajuste' && `Ajuste (${scopeAdjustmentCount})`}
              {filter === 'Fora' && `Fora de Escopo (${outOfScopeCount})`}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-[#6c657e] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar iniciativa, módulo ou curso..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#d8dce6] bg-[#f8f9fc] focus:bg-white focus:outline-hidden focus:border-[#ff4545] transition text-[#2e2640]"
          />
        </div>
      </div>

      {/* 4. MAIN CONTENT AREA: CARDS VIEW, TABLE VIEW, OR RAW TEXT VIEW */}

      {/* MODE 1: CARDS INTERATIVOS (Top 3 ou Todas) */}
      {viewMode === 'cards' && (
        <div className="space-y-8">
          {displayedCards.map((item, idx) => {
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
                id={`card-${item.id || idx}`}
                className="bg-white border border-[#d8dce6] hover:border-[#ff4545]/40 rounded-2xl p-5 sm:p-7 shadow-sm transition space-y-6"
              >
                {/* 1. Header da Iniciativa */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#e2e5ec]">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#ff4545]/10 text-[#ff4545] text-xs font-bold flex items-center justify-center border border-[#ff4545]/25 font-mono">
                        {idx + 1}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-[#2e2640] tracking-tight flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        🎯 {item.title}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {item.code && (
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#ff4545]/10 text-[#e03232] border border-[#ff4545]/25 font-mono">
                          {item.code}
                        </span>
                      )}
                      {item.controlCode && (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#edeef4] text-[#364f99] border border-[#d8dce6] font-mono">
                          {item.controlCode}
                        </span>
                      )}
                      {item.quarter && (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#89cea5]/20 text-[#066d73] border border-[#89cea5]/40 font-mono">
                          {item.quarter}
                        </span>
                      )}

                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-[#f8f9fc] text-[#555065] border border-[#d8dce6]">
                        <span className="text-[#2e2640] font-semibold">{item.matchedCourse}: </span>
                        {item.recommendedMetaproject}
                      </span>

                      {hasMultipleOptions && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#edeef4] text-[#364f99] border border-[#d8dce6] flex items-center gap-1.5 font-mono">
                          <Scale className="w-3.5 h-3.5" />
                          {options.length} Possibilidades
                        </span>
                      )}

                      {item.pdfUrl && (
                        <a
                          href={item.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#066d73] hover:underline bg-[#89cea5]/20 px-2 py-0.5 rounded border border-[#89cea5]/40 font-mono"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Ementa Oficial (PDF)
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {getViabilityBadge(item.viabilityStatus, item.adherenceLevel)}
                    <button
                      onClick={() => handleCopySingleInitiative(item)}
                      className="p-2 rounded-lg bg-white hover:bg-[#edeef4] text-[#555065] hover:text-[#2e2640] border border-[#d8dce6] transition shadow-2xs"
                      title="Copiar análise completa desta iniciativa"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-[#066d73]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 2. Resumo do Desafio */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-[#555065] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <FileText className="w-3.5 h-3.5 text-[#ff4545]" />
                    Resumo do Desafio (Demanda do Parceiro):
                  </h4>
                  <p className="text-sm text-[#2e2640] leading-relaxed bg-[#f8f9fc] p-4 rounded-xl border border-[#e2e5ec]">
                    {item.challengeSummary}
                  </p>
                </div>

                {/* 3. Guia de Decisão para a Reunião com o Parceiro (Decision Guidance) */}
                {item.decisionGuidance && (
                  <div className="bg-gradient-to-r from-[#f0f2fb] via-[#f8f9fc] to-[#f4f8f5] border border-[#90a5e5]/40 rounded-xl p-4 sm:p-5 relative overflow-hidden">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#90a5e5]/20 text-[#364f99] flex items-center justify-center shrink-0 border border-[#90a5e5]/40 mt-0.5">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm font-bold text-[#364f99] flex items-center gap-1.5 font-mono">
                          🧭 Guia de Tomada de Decisão para a Coordenação:
                        </h4>
                        <p className="text-xs sm:text-sm text-[#2e2640] leading-relaxed">
                          {item.decisionGuidance}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Sessão Comparativa: Possibilidades de Módulos & Análise de Trade-offs */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-[#2e2640] uppercase tracking-wider flex items-center gap-2 font-mono">
                      <Scale className="w-4 h-4 text-[#ff4545]" />
                      Possibilidades de Módulos & Análise de Trade-offs:
                    </h4>
                    <span className="text-[11px] text-[#6c657e] hidden sm:inline font-mono">
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
                            ? 'bg-[#fafbfc] border-2 border-[#ff4545]/40 shadow-sm'
                            : 'bg-white border border-[#d8dce6] hover:border-[#90a5e5]/60'
                        }`}
                      >
                        {/* Option Header */}
                        <div className="space-y-2.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide border font-mono ${
                                  opt.isPrimary
                                    ? 'bg-[#ff4545]/10 text-[#e03232] border-[#ff4545]/25'
                                    : 'bg-[#edeef4] text-[#364f99] border-[#d8dce6]'
                                }`}
                              >
                                {opt.label || (opt.isPrimary ? 'Opção 1 (Principal Recomendada)' : `Opção ${optIdx + 1} (Alternativa Viável)`)}
                              </span>
                              {opt.code && (
                                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#ff4545]/10 text-[#e03232] border border-[#ff4545]/25 font-mono">
                                  {opt.code}
                                </span>
                              )}
                              {opt.controlCode && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#edeef4] text-[#364f99] border border-[#d8dce6] font-mono">
                                  {opt.controlCode}
                                </span>
                              )}
                              {opt.quarter && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#89cea5]/20 text-[#066d73] border border-[#89cea5]/40 font-mono">
                                  {opt.quarter}
                                </span>
                              )}
                            </div>
                            {getAdherenceBadge(opt.adherenceLevel)}
                          </div>

                          <div>
                            <span className="text-[11px] font-semibold text-[#364f99] block mb-0.5 font-mono">
                              {opt.course} • {opt.year ? `${opt.year}º Ano` : ''}
                            </span>
                            <h5 className="text-sm sm:text-base font-bold text-[#2e2640] leading-snug">
                              {opt.metaprojectName || opt.moduleName}
                            </h5>
                          </div>

                          <div className="text-[11px] text-[#332e3d] bg-[#f8f9fc] p-2.5 rounded-lg border border-[#e2e5ec] leading-relaxed">
                            <span className="font-semibold text-[#2e2640]">Encaixe Pedagógico: </span>
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
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#066d73] hover:underline bg-[#89cea5]/20 px-2 py-0.5 rounded border border-[#89cea5]/40 font-mono"
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
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#364f99] hover:underline bg-[#90a5e5]/15 px-2 py-0.5 rounded border border-[#90a5e5]/30 font-mono"
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
                          <span className="text-[11px] font-bold text-[#066d73] uppercase tracking-wider flex items-center gap-1 font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#066d73]" />
                            Pontos Positivos (Prós):
                          </span>
                          <ul className="space-y-1.5">
                            {opt.pros && opt.pros.length > 0 ? (
                              opt.pros.map((p, pIdx) => (
                                <li
                                  key={pIdx}
                                  className="text-xs text-[#066d73] bg-[#f0f9f4] border border-[#89cea5]/40 p-2 rounded-lg flex items-start gap-2"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#066d73] mt-1.5 shrink-0" />
                                  <span className="leading-relaxed text-[#144238] font-medium">{p}</span>
                                </li>
                              ))
                            ) : (
                              <li className="text-xs text-[#6c657e] italic">Alta afinidade com as competências do ciclo.</li>
                            )}
                          </ul>
                        </div>

                        {/* Pontos Negativos / Trade-offs (Contras) */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-[#e03232] uppercase tracking-wider flex items-center gap-1 font-mono">
                            <AlertTriangle className="w-3.5 h-3.5 text-[#e03232]" />
                            Trade-offs & Limitações (Contras):
                          </span>
                          <ul className="space-y-1.5">
                            {opt.cons && opt.cons.length > 0 ? (
                              opt.cons.map((c, cIdx) => (
                                <li
                                  key={cIdx}
                                  className="text-xs bg-[#fff5f5] border border-[#ff4545]/25 p-2 rounded-lg flex items-start gap-2"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#e03232] mt-1.5 shrink-0" />
                                  <span className="leading-relaxed text-[#8a1c1c] font-medium">{c}</span>
                                </li>
                              ))
                            ) : (
                              <li className="text-xs text-[#6c657e] italic">Nenhum trade-off impeditivo detectado.</li>
                            )}
                          </ul>
                        </div>

                        {/* Ajuste de Escopo Recomendado */}
                        {opt.scopeAdjustment && (
                          <div className="text-xs bg-[#f4f5fa] border border-[#d8dce6] rounded-lg p-2.5 space-y-1">
                            <span className="font-semibold text-[#364f99] flex items-center gap-1 text-[11px] font-mono">
                              <Wrench className="w-3 h-3 text-[#364f99]" />
                              Ajuste de Escopo para 10 Semanas:
                            </span>
                            <p className="text-[#3c364c] text-[11px] leading-relaxed">
                              {opt.scopeAdjustment}
                            </p>
                          </div>
                        )}

                        {/* Action: Ver Ementa deste Módulo */}
                        <div className="pt-2 border-t border-[#e2e5ec]">
                          <button
                            type="button"
                            onClick={() => onSelectModule(opt.moduleName || opt.metaprojectName)}
                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-[#edeef4] text-[#2e2640] border border-[#d8dce6] transition shadow-2xs"
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
                <div className="pt-4 border-t border-[#e2e5ec] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-[#555065]">
                    💡 <span className="font-semibold text-[#2e2640]">Deseja refinar o escopo ou negociar trade-offs?</span> Use o assistente interativo para simular alinhamentos.
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopySingleInitiative(item)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-[#edeef4] text-[#2e2640] border border-[#d8dce6] transition shadow-2xs"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#364f99]" />
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

          {/* Banner no final dos cards se houver mais e não estiver exibindo todas */}
          {isLargePortfolio && !showAllInitiatives && (
            <div className="bg-white border-2 border-dashed border-[#d8dce6] rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#ff4545]/10 text-[#ff4545] flex items-center justify-center mx-auto">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#2e2640]">
                Mais {totalInitiatives - 3} Iniciativas Catalogadas neste Documento
              </h4>
              <p className="text-xs text-[#555065] max-w-md mx-auto">
                Para consultar a análise individualizada de todas as {totalInitiatives} demandas, alterne para a Tabela Geral ou baixe o Dossiê Executivo completo.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <button
                  onClick={() => setShowAllInitiatives(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2e2640] hover:bg-[#1b1626] text-white transition shadow-sm"
                >
                  Exibir Todas as {totalInitiatives} Iniciativas na Tela
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#edeef4] hover:bg-[#d8dce6] text-[#2e2640] transition"
                >
                  Ver Tabela Geral de Portfólio
                </button>
                <button
                  onClick={handleExportWord}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#ff4545] hover:bg-[#e03232] text-white transition shadow-sm"
                >
                  Baixar Dossiê (.DOCX)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: TABELA GERAL DE PORTFÓLIO & GOVERNANÇA */}
      {viewMode === 'table' && (
        <div className="bg-white border border-[#d8dce6] rounded-2xl shadow-sm overflow-hidden space-y-0">
          <div className="p-4 sm:p-5 border-b border-[#e2e5ec] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fafbfc]">
            <div>
              <h3 className="text-base font-bold text-[#2e2640] flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                <TableIcon className="w-4 h-4 text-[#ff4545]" />
                Tabela Consolidada de Enquadramento ({filteredInitiatives.length} de {totalInitiatives} iniciativas)
              </h3>
              <p className="text-xs text-[#6c657e] mt-0.5">
                Clique em qualquer linha ou no botão de detalhes para consultar a análise de trade-offs completa.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#066d73] hover:bg-[#045054] text-white transition shadow-2xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Exportar Planilha (.XLSX)</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#d8dce6] bg-[#f4f5fa] text-[#555065] font-mono">
                  <th className="py-3 px-3 w-10 text-center">#</th>
                  <th className="py-3 px-4 min-w-[220px]">Iniciativa / Demanda</th>
                  <th className="py-3 px-3 min-w-[170px]">Status de Viabilidade</th>
                  <th className="py-3 px-3 min-w-[200px]">Metaprojeto Recomendado</th>
                  <th className="py-3 px-3 min-w-[90px]">Trimestre</th>
                  <th className="py-3 px-3 min-w-[150px]">Curso</th>
                  <th className="py-3 px-3 min-w-[200px]">Ação Recomendada</th>
                  <th className="py-3 px-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e5ec]">
                {filteredInitiatives.map((item, idx) => {
                  const primaryOpt = item.options?.[0];
                  return (
                    <tr
                      key={item.id || idx}
                      className="hover:bg-[#f8f9fc] transition cursor-pointer"
                      onClick={() => setSelectedInitiativeModal(item)}
                    >
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-[#6c657e]">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#2e2640] block">{item.title}</span>
                        <span className="text-[11px] text-[#6c657e] line-clamp-1 mt-0.5">
                          {item.challengeSummary}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        {getViabilityBadge(item.viabilityStatus, item.adherenceLevel)}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="space-y-0.5">
                          {item.code && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#ff4545]/10 text-[#e03232] border border-[#ff4545]/25 font-mono mr-1.5">
                              {item.code}
                            </span>
                          )}
                          <span className="font-semibold text-[#2e2640]">
                            {item.recommendedMetaproject}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[#066d73] font-semibold">
                        {item.quarter || primaryOpt?.quarter || '-'}
                      </td>
                      <td className="py-3.5 px-3 font-medium text-[#555065]">
                        {item.matchedCourse}
                      </td>
                      <td className="py-3.5 px-3 text-[#332e3d]">
                        {item.recommendedAction || 'Avançar para desenho de escopo'}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInitiativeModal(item);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-[#edeef4] text-[#ff4545] border border-[#d8dce6] transition shadow-2xs"
                        >
                          Ver Detalhes
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODE 3: RAW FORMATTED OUTPUT BOX */}
      {viewMode === 'raw' && (
        <div className="bg-white border border-[#d8dce6] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e2e5ec]">
            <span className="text-xs font-bold text-[#555065] uppercase tracking-wider font-mono">
              Relatório Completo em Formato Markdown (NotebookLM Multi-Cenários)
            </span>
            <button
              onClick={handleCopyFullReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#ff4545] hover:bg-[#e03232] text-white transition shadow-sm"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? 'Copiado!' : 'Copiar Texto Completo'}</span>
            </button>
          </div>

          <pre className="font-mono text-xs sm:text-sm text-[#2e2640] bg-[#f8f9fc] p-5 rounded-xl border border-[#e2e5ec] overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {result.rawMarkdownOutput}
          </pre>
        </div>
      )}

      {/* 5. Final Section: Próximo Passo Sugerido para o Coordenador */}
      <div className="bg-[#251f33] border-2 border-[#ff4545]/40 rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff4545]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#ff4545]/20 border border-[#ff4545]/40 text-[#ff4545] flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-[#ff4545]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                💡 Próximo Passo Sugerido para a Coordenação do Inteli:
              </h3>
              <p className="text-xs text-[#b2b6bf]">
                Ação recomendada para validação, negociação e formalização do escopo com o parceiro corporativo
              </p>
            </div>
          </div>

          <div className="bg-[#1b1626] border border-[#3c3253] rounded-xl p-4 sm:p-5 text-sm text-[#e6eaeb] leading-relaxed font-sans shadow-inner">
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
              onClick={handleExportWord}
              disabled={isExportingWord}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#3c3253] hover:bg-[#4a3e66] text-white border border-[#4d3f6a] transition"
            >
              <FileType2 className="w-3.5 h-3.5 text-[#90a5e5]" />
              <span>Baixar Dossiê Executivo (.DOCX)</span>
            </button>

            <button
              onClick={handleExportExcel}
              disabled={isExportingExcel}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#3c3253] hover:bg-[#4a3e66] text-white border border-[#4d3f6a] transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#89cea5]" />
              <span>Baixar Planilha (.XLSX)</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE DETALHES DE INICIATIVA ESPECÍFICA (QUANDO CLICADA NA TABELA) */}
      {selectedInitiativeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl border border-[#d8dce6]">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#e2e5ec]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#ff4545]/10 text-[#e03232] font-mono">
                    {selectedInitiativeModal.code || 'INTELI'}
                  </span>
                  {getViabilityBadge(selectedInitiativeModal.viabilityStatus, selectedInitiativeModal.adherenceLevel)}
                </div>
                <h3 className="text-xl font-bold text-[#2e2640]">
                  {selectedInitiativeModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInitiativeModal(null)}
                className="text-[#6c657e] hover:text-[#2e2640] p-1.5 rounded-lg hover:bg-[#edeef4] transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-[#2e2640]">
              <div className="bg-[#f8f9fc] p-4 rounded-xl border border-[#e2e5ec] space-y-1">
                <span className="font-bold text-[#555065] text-xs font-mono uppercase">Desafio do Parceiro:</span>
                <p className="leading-relaxed">{selectedInitiativeModal.challengeSummary}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-[#fafbfc] p-3 rounded-xl border border-[#e2e5ec] text-xs">
                <div>
                  <span className="text-[#6c657e] block">Metaprojeto Oficial:</span>
                  <span className="font-bold text-[#2e2640]">{selectedInitiativeModal.recommendedMetaproject}</span>
                </div>
                <div>
                  <span className="text-[#6c657e] block">Curso & Trimestre:</span>
                  <span className="font-bold text-[#2e2640]">{selectedInitiativeModal.matchedCourse} • {selectedInitiativeModal.quarter || '1º/2º/3º/4º TRI'}</span>
                </div>
              </div>

              {selectedInitiativeModal.decisionGuidance && (
                <div className="bg-[#f0f2fb] p-3.5 rounded-xl border border-[#90a5e5]/40 text-xs leading-relaxed space-y-1">
                  <span className="font-bold text-[#364f99] font-mono block">🧭 Guia para a Reunião com a Empresa:</span>
                  <p className="text-[#2e2640]">{selectedInitiativeModal.decisionGuidance}</p>
                </div>
              )}

              {/* Opções de Módulos */}
              {selectedInitiativeModal.options && selectedInitiativeModal.options.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="font-bold text-xs font-mono uppercase text-[#555065]">Opções de Módulos & Trade-offs:</span>
                  <div className="space-y-3">
                    {selectedInitiativeModal.options.map((opt, oIdx) => (
                      <div key={oIdx} className="bg-white border border-[#d8dce6] rounded-xl p-4 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#2e2640]">{opt.label}: {opt.moduleName}</span>
                          {getAdherenceBadge(opt.adherenceLevel)}
                        </div>
                        <div className="text-xs space-y-1.5">
                          {opt.pros && opt.pros.length > 0 && (
                            <div>
                              <span className="font-semibold text-[#066d73]">Prós: </span>
                              <span className="text-[#144238]">{opt.pros.join('; ')}</span>
                            </div>
                          )}
                          {opt.cons && opt.cons.length > 0 && (
                            <div>
                              <span className="font-semibold text-[#e03232]">Trade-offs: </span>
                              <span className="text-[#8a1c1c]">{opt.cons.join('; ')}</span>
                            </div>
                          )}
                          {opt.scopeAdjustment && (
                            <div className="bg-[#f8f9fc] p-2 rounded border border-[#e2e5ec]">
                              <span className="font-semibold text-[#364f99]">Ajuste de Escopo: </span>
                              <span>{opt.scopeAdjustment}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#e2e5ec] flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setSelectedInitiativeModal(null);
                  onOpenRefinement(selectedInitiativeModal);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#ff4545] hover:bg-[#e03232] text-white shadow-sm transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Refinar Escopo Desta Iniciativa</span>
              </button>

              <button
                onClick={() => setSelectedInitiativeModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#edeef4] text-[#2e2640] hover:bg-[#d8dce6] transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
