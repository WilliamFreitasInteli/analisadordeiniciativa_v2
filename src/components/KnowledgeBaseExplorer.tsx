import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  Filter,
  GraduationCap,
  Layers,
  CheckCircle2,
  ExternalLink,
  Target,
  Clock,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { INTELI_MODULES_CATALOG, InteliModule } from '../data/inteliKnowledgeBase.ts';
import { InteliSymbol } from './InteliBrand.tsx';

interface KnowledgeBaseExplorerProps {
  selectedModuleName?: string | null;
  onSelectModuleForFilter?: (moduleName: string) => void;
  onClose?: () => void;
}

export const KnowledgeBaseExplorer: React.FC<KnowledgeBaseExplorerProps> = ({
  selectedModuleName,
  onSelectModuleForFilter,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState(selectedModuleName || '');
  const [selectedCourse, setSelectedCourse] = useState<string>('Todos');
  const [selectedYear, setSelectedYear] = useState<string>('Todos');
  const [activeModuleModal, setActiveModuleModal] = useState<InteliModule | null>(null);

  const courses = [
    'Todos',
    'Engenharia de Software',
    'Ciência da Computação',
    'Engenharia de Computação',
    'Sistemas de Informação',
    'ADM Tech',
  ];

  const filteredModules = INTELI_MODULES_CATALOG.filter((m) => {
    const matchesCourse = selectedCourse === 'Todos' || m.course === selectedCourse;
    const matchesYear =
      selectedYear === 'Todos' ||
      (selectedYear === '1' && m.year === 1) ||
      (selectedYear === '2' && m.year === 2) ||
      (selectedYear === '3+' && m.year >= 3);

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      (m.code && m.code.toLowerCase().includes(q)) ||
      (m.controlCode && m.controlCode.toLowerCase().includes(q)) ||
      (m.quarter && m.quarter.toLowerCase().includes(q)) ||
      m.name.toLowerCase().includes(q) ||
      String(m.moduleNumber).includes(q) ||
      m.course.toLowerCase().includes(q) ||
      m.metaprojectName.toLowerCase().includes(q) ||
      m.summary.toLowerCase().includes(q) ||
      m.techStack.some((t: string) => t.toLowerCase().includes(q)) ||
      m.idealPartnerProfile.toLowerCase().includes(q);

    return matchesCourse && matchesYear && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* Explorer Header */}
      <div className="bg-white border border-[#d8dce6] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#ff4545]/10 text-[#e03232] border border-[#ff4545]/25 flex items-center gap-1 font-mono">
              <GraduationCap className="w-3.5 h-3.5" />
              Matriz Curricular Oficial INTELI 2025
            </span>
            <span className="text-xs text-[#6c657e] font-mono">
              {INTELI_MODULES_CATALOG.length} Módulos Oficiais • 4 Anos de Graduação • 100% Baseado em Metaprojetos
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2e2640] tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Base de Conhecimento: Ementas & Metaprojetos
          </h2>
          <p className="text-xs sm:text-sm text-[#555065] mt-1">
            O assistente consulta estritamente os códigos e nomes originais da matriz curricular oficial do Inteli.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#edeef4] hover:bg-[#d8dce6] text-[#2e2640] transition self-start md:self-center"
            title="Fechar catálogo"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white border border-[#d8dce6] rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#555065] absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Buscar por tecnologia, metaprojeto ou palavra-chave (ex: IoT, Machine Learning, Grafos, Web)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f8f9fc] border border-[#d8dce6] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#2e2640] placeholder-[#9ba0ab] focus:outline-none focus:ring-2 focus:ring-[#ff4545] focus:border-[#ff4545]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-[#555065] hover:text-[#2e2640]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-1.5 bg-[#f8f9fc] p-1 rounded-xl border border-[#d8dce6] overflow-x-auto">
            <span className="text-[11px] font-bold text-[#555065] uppercase px-2 font-mono">Ano:</span>
            {[
              { id: 'Todos', label: 'Todos' },
              { id: '1', label: '1º Ano (Básico)' },
              { id: '2', label: '2º Ano (Espec)' },
              { id: '3+', label: '3º/4º Anos' },
            ].map((y) => (
              <button
                key={y.id}
                onClick={() => setSelectedYear(y.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedYear === y.id
                    ? 'bg-[#ff4545] text-white shadow-sm shadow-[#ff4545]/20'
                    : 'text-[#555065] hover:text-[#2e2640] hover:bg-white'
                }`}
              >
                {y.label}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          <span className="text-[11px] font-bold text-[#555065] uppercase shrink-0 mr-1 font-mono">
            Curso:
          </span>
          {courses.map((course) => (
            <button
              key={course}
              onClick={() => setSelectedCourse(course)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
                selectedCourse === course
                  ? 'bg-[#ff4545]/10 text-[#e03232] border-[#ff4545]/30'
                  : 'bg-[#f8f9fc] text-[#555065] border-[#d8dce6] hover:text-[#2e2640] hover:bg-white'
              }`}
            >
              {course}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModules.map((m) => (
          <div
            key={m.id}
            onClick={() => setActiveModuleModal(m)}
            className="bg-white border border-[#d8dce6] hover:border-[#ff4545]/50 hover:bg-[#fffafa] rounded-2xl p-5 shadow-sm cursor-pointer transition flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#ff4545]/10 text-[#e03232] border border-[#ff4545]/25 font-mono">
                    {m.code}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#edeef4] text-[#364f99] border border-[#d8dce6] font-mono">
                    {m.controlCode}
                  </span>
                  {m.quarter && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#89cea5]/20 text-[#066d73] border border-[#89cea5]/40 font-mono">
                      {m.quarter}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-medium text-[#555065] bg-[#f8f9fc] px-2 py-0.5 rounded border border-[#d8dce6] font-mono">
                  {m.durationWeeks} Semanas
                </span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#364f99] block mb-0.5 font-mono">
                  {m.course} • {m.year}º Ano
                </span>
                <h3 className="text-base font-bold text-[#2e2640] group-hover:text-[#ff4545] transition leading-snug">
                  {m.metaprojectName}
                </h3>
              </div>

              <div className="bg-[#f8f9fc] p-2.5 rounded-xl border border-[#e2e5ec]">
                <span className="text-[10px] font-bold text-[#555065] uppercase tracking-wider block mb-1 font-mono">
                  Nome Oficial Canônico:
                </span>
                <p className="text-xs font-semibold text-[#066d73] line-clamp-2">
                  &quot;{m.metaprojectName}&quot;
                </p>
              </div>

              <p className="text-xs text-[#555065] line-clamp-3 leading-relaxed">
                {m.summary}
              </p>
            </div>

            {/* Tech Stack Pills preview & Links */}
            <div className="pt-2 border-t border-[#e2e5ec] space-y-2.5">
              <div className="flex flex-wrap gap-1">
                {m.techStack.slice(0, 3).map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#f8f9fc] text-[#2e2640] border border-[#d8dce6] font-mono"
                  >
                    {tech}
                  </span>
                ))}
                {m.techStack.length > 3 && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] text-[#6c657e] font-mono">
                    +{m.techStack.length - 3} mais
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-[#ff4545] group-hover:translate-x-0.5 transition font-semibold pt-1">
                <span>Ver Ementa & Competências</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}

        {filteredModules.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white border border-[#d8dce6] rounded-2xl p-6 shadow-xs">
            <BookOpen className="w-10 h-10 text-[#6c657e]/50 mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#2e2640]">Nenhum módulo encontrado com estes filtros</p>
            <p className="text-xs text-[#6c657e] mt-1">Tente ajustar a busca ou limpar os filtros de curso e ano.</p>
          </div>
        )}
      </div>

      {/* Module Detail Modal */}
      {activeModuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#140e1f]/50 backdrop-blur-xs animate-fadeIn font-sans">
          <div className="bg-white border border-[#d8dce6] max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 space-y-5 text-[#2e2640]">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#e2e5ec]">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#ff4545]/10 text-[#e03232] border border-[#ff4545]/25 font-mono">
                    {activeModuleModal.code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#edeef4] text-[#364f99] border border-[#d8dce6] font-mono">
                    {activeModuleModal.controlCode}
                  </span>
                  {activeModuleModal.quarter && (
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#89cea5]/20 text-[#066d73] border border-[#89cea5]/40 font-mono">
                      {activeModuleModal.quarter}
                    </span>
                  )}
                  <span className="text-xs font-medium text-[#555065] font-mono">
                    {activeModuleModal.course} • {activeModuleModal.year}º Ano
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#2e2640]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {activeModuleModal.metaprojectName}
                </h3>
              </div>

              <button
                onClick={() => setActiveModuleModal(null)}
                className="p-1.5 rounded-lg bg-[#f8f9fc] hover:bg-[#edeef4] text-[#555065] hover:text-[#2e2640] border border-[#d8dce6] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metaproject Banner */}
            <div className="bg-gradient-to-r from-[#fff5f5] via-[#fafbfc] to-[#f4f8f5] border border-[#ff4545]/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-[#e03232] uppercase tracking-wider block mb-1 font-mono">
                  Nome Canônico Oficial do Metaprojeto:
                </span>
                <p className="text-base font-bold text-[#2e2640]">
                  &quot;{activeModuleModal.metaprojectName}&quot;
                </p>
              </div>

              {/* Direct Link to PDF */}
              {activeModuleModal.pdfUrl && (
                <a
                  href={activeModuleModal.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#89cea5]/20 text-[#066d73] hover:bg-[#89cea5]/30 border border-[#89cea5]/40 transition shrink-0 font-mono"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ementa PDF</span>
                </a>
              )}
            </div>

            {/* Objective & Summary */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-[#555065] uppercase tracking-wider font-mono">
                Objetivo & Ementa Pedagógica:
              </h4>
              <p className="text-sm text-[#2e2640] leading-relaxed bg-[#f8f9fc] p-3.5 rounded-xl border border-[#e2e5ec]">
                {activeModuleModal.summary}
              </p>
            </div>

            {/* Tech Stack */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#555065] uppercase tracking-wider font-mono">
                Competências Tecnológicas (Tech Stack):
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeModuleModal.techStack.map((tech: string, i: number) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#f8f9fc] text-[#364f99] border border-[#d8dce6] font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Business & Leadership */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#555065] uppercase tracking-wider font-mono">
                Competências de Negócios & Liderança:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeModuleModal.businessAndLeadership.map((item: string, i: number) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#f0f9f4] text-[#066d73] border border-[#89cea5]/40"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Ideal Partner Profile */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-[#555065] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Target className="w-3.5 h-3.5 text-[#ff4545]" />
                Perfil Ideal de Desafio de Parceiro:
              </h4>
              <p className="text-xs sm:text-sm text-[#2e2640] leading-relaxed bg-[#f8f9fc] p-3 rounded-xl border border-[#e2e5ec]">
                {activeModuleModal.idealPartnerProfile}
              </p>
            </div>

            {/* Typical Deliverables */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-[#555065] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#066d73]" />
                Entregáveis Típicos das 5 Sprints (10 Semanas):
              </h4>
              <ul className="space-y-1.5">
                {activeModuleModal.deliverables.map((deliv: string, i: number) => (
                  <li key={i} className="text-xs text-[#2e2640] flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#066d73] mt-1.5 shrink-0" />
                    <span>{deliv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-[#e2e5ec] flex items-center justify-between gap-3">
              {activeModuleModal.partnerPortalUrl ? (
                <a
                  href={activeModuleModal.partnerPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#364f99] hover:underline font-mono"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ver no Portal de Parcerias Inteli</span>
                </a>
              ) : <div />}

              <button
                onClick={() => setActiveModuleModal(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#ff4545] hover:bg-[#e03232] text-white transition shadow-sm"
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
