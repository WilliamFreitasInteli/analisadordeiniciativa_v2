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
  ArrowRight,
  Cpu,
  ShieldAlert,
  Server,
  Workflow,
  Send
} from 'lucide-react';
import { INTELI_MODULES_CATALOG, InteliModule } from '../data/inteliKnowledgeBase.ts';
import { INTELI_HARDWARE_INVENTORY, InteliHardwareItem } from '../data/inteliHardwareCatalog.ts';
import { InteliSymbol } from './InteliBrand.tsx';

interface KnowledgeBaseExplorerProps {
  selectedModuleName?: string | null;
  onSelectModuleForFilter?: (moduleName: string) => void;
  onClose?: () => void;
  onOpenSubmissionForModule?: (module: InteliModule) => void;
}

export const KnowledgeBaseExplorer: React.FC<KnowledgeBaseExplorerProps> = ({
  selectedModuleName,
  onSelectModuleForFilter,
  onClose,
  onOpenSubmissionForModule,
}) => {
  const [activeTab, setActiveTab] = useState<'modules' | 'hardware' | 'governance'>('modules');
  const [searchQuery, setSearchQuery] = useState(selectedModuleName || '');
  const [selectedCourse, setSelectedCourse] = useState<string>('Todos');
  const [selectedYear, setSelectedYear] = useState<string>('Todos');
  const [activeModuleModal, setActiveModuleModal] = useState<InteliModule | null>(null);
  const [activeHardwareModal, setActiveHardwareModal] = useState<InteliHardwareItem | null>(null);

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
              Base de Conhecimento & Governança • EP Inteli
            </span>
            <span className="text-xs text-[#6c657e] font-mono">
              Matriz 2025 • Hardware & Bancada • Regras de Negócio
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2e2640] tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Base de Conhecimento: Metaprojetos, Hardware & Governança
          </h2>
          <p className="text-xs sm:text-sm text-[#555065] mt-1">
            Consulte a matriz curricular oficial, o acervo de equipamentos e as diretrizes de escopo do Escritório de Projetos.
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

      {/* Main Knowledge Base Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-[#d8dce6] pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('modules')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition border-b-2 font-mono ${
            activeTab === 'modules'
              ? 'border-[#ff4545] text-[#e03232] bg-white'
              : 'border-transparent text-[#555065] hover:text-[#2e2640] hover:bg-white/50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Matriz de Metaprojetos ({INTELI_MODULES_CATALOG.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hardware')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition border-b-2 font-mono ${
            activeTab === 'hardware'
              ? 'border-[#364f99] text-[#364f99] bg-white'
              : 'border-transparent text-[#555065] hover:text-[#2e2640] hover:bg-white/50'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Hardware & Equipamentos de Laboratório ({INTELI_HARDWARE_INVENTORY.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('governance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition border-b-2 font-mono ${
            activeTab === 'governance'
              ? 'border-[#066d73] text-[#066d73] bg-white'
              : 'border-transparent text-[#555065] hover:text-[#2e2640] hover:bg-white/50'
          }`}
        >
          <Workflow className="w-4 h-4" />
          <span>Regras de Negócio & Governança (EP)</span>
        </button>
      </div>

      {/* Tab 1: Modules Catalog */}
      {activeTab === 'modules' && (
        <>
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
        </>
      )}

      {/* Tab 2: Hardware & Lab Inventory */}
      {activeTab === 'hardware' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#d8dce6] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#364f99]/10 text-[#364f99] border border-[#364f99]/25 flex items-center gap-1 font-mono">
                <Server className="w-3.5 h-3.5" />
                Infraestrutura de Laboratório & Bancada
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#555065] leading-relaxed">
              Equipamentos de alta performance disponíveis para as squads do Inteli durante os módulos de 10 semanas. O assistente de inteligência utiliza este inventário para validar viabilidade de hardware e orientar o parceiro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INTELI_HARDWARE_INVENTORY.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveHardwareModal(item)}
                className="bg-white border border-[#d8dce6] hover:border-[#364f99]/50 hover:bg-[#f8f9fc] rounded-2xl p-5 shadow-sm cursor-pointer transition flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-[#364f99] uppercase tracking-wider font-mono bg-[#364f99]/10 px-2 py-0.5 rounded border border-[#364f99]/20">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-[#066d73] bg-[#89cea5]/20 px-2 py-0.5 rounded border border-[#89cea5]/40">
                      {item.quantity}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#2e2640] group-hover:text-[#364f99] transition leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#555065] line-clamp-2 mt-1">
                      {item.primaryUse}
                    </p>
                  </div>

                  {item.specs.cpuGpu && (
                    <div className="bg-[#f8f9fc] p-2.5 rounded-xl border border-[#e2e5ec] text-[11px] text-[#2e2640] font-mono">
                      <span className="text-[#6c657e] block text-[10px] uppercase font-bold mb-0.5">CPU/GPU:</span>
                      {item.specs.cpuGpu}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#e2e5ec] space-y-2">
                  <div className="text-[10px] font-bold text-[#555065] uppercase font-mono">
                    Módulos Recomendados:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.recommendedModules.slice(0, 2).map((m, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-white border border-[#d8dce6] text-[#2e2640] font-mono">
                        {m}
                      </span>
                    ))}
                    {item.recommendedModules.length > 2 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] text-[#6c657e] font-mono">
                        +{item.recommendedModules.length - 2}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#364f99] group-hover:translate-x-0.5 transition font-semibold pt-1">
                    <span>Ver Especificações Completas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Governance & EP Business Rules */}
      {activeTab === 'governance' && (
        <div className="space-y-6">
          {/* Executive Summary Banner */}
          <div className="bg-gradient-to-r from-[#2e2640] to-[#1f192c] text-white rounded-3xl p-6 sm:p-8 shadow-md">
            <div className="max-w-3xl space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ff4545]/20 text-[#ff8080] border border-[#ff4545]/40 font-mono">
                <GraduationCap className="w-3.5 h-3.5" />
                Escritório de Projetos (EP) • Inteli Graduação (MEC Nota 5)
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                Diretrizes de Governança, Fronteiras de Escopo e Boas Práticas
              </h3>
              <p className="text-xs sm:text-sm text-[#d8dce6] leading-relaxed">
                Regras de negócio e calibrações consolidadas pelo EP para garantir a excelência pedagógica, foco acadêmico e mitigação de riscos nas parcerias de mercado.
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Postura Consultiva */}
            <div className="bg-white border border-[#d8dce6] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-[#364f99] font-bold text-sm">
                <Workflow className="w-4 h-4 text-[#364f99]" />
                <h4>1. Postura Consultiva vs. Comercial</h4>
              </div>
              <ul className="text-xs text-[#555065] space-y-2 leading-relaxed">
                <li>
                  <strong className="text-[#e03232]">❌ Termos Proibidos:</strong> Jargões agressivos como &quot;cobertura de 100% das demandas em um único ano&quot;, &quot;esteiras contínuas&quot; ou &quot;contratação em lote&quot;.
                </li>
                <li>
                  <strong className="text-[#066d73]">✅ Posicionamento Correto:</strong> &quot;Janelas de Oportunidade por Trimestre Letivo&quot; (1º, 2º, 3º ou 4º Tri) ou &quot;Matriz de Possibilidades Temporais&quot;.
                </li>
                <li>
                  <strong className="text-[#2e2640]">🎯 Princípio da Seleção Pontual:</strong> O padrão recomendado para a empresa é focar em <strong>1 projeto por ciclo letivo</strong> (semestral ou anual), garantindo profundidade pedagógica e qualidade dos protótipos.
                </li>
              </ul>
            </div>

            {/* Card 2: Critérios Rígidos de Exclusão */}
            <div className="bg-white border border-[#ff4545]/25 rounded-2xl p-6 shadow-xs space-y-4 bg-rose-50/20">
              <div className="flex items-center gap-2 text-[#e03232] font-bold text-sm">
                <ShieldAlert className="w-4 h-4 text-[#ff4545]" />
                <h4>2. Critérios Rígidos de Exclusão (Fora de Escopo)</h4>
              </div>
              <ul className="text-xs text-[#555065] space-y-2 leading-relaxed">
                <li>
                  <strong>Sem Deployment em Produção Comercial:</strong> Squads entregam PoCs e protótipos funcionais; não assumem SLA de operação ou suporte contínuo.
                </li>
                <li>
                  <strong>Sem Instalação Física em Campo/Rua:</strong> Estudantes não sobem em postes, vias públicas, subestações elétricas ou áreas de risco fabril.
                </li>
                <li>
                  <strong>Sem Apps Mobile fora de Módulos Específicos:</strong> Desenvolvimento mobile nativo/híbrido consome muita capacidade e só é aceito em módulos dedicados (ex: Módulo 6 de ES, Módulo 10 de EC ou Módulo 2 do 1º Ano).
                </li>
                <li>
                  <strong>Sem Gravação Direta em Sistemas Produtivos:</strong> Acesso restrito a sandboxes, ambientes de staging e dados anonimizados (LGPD).
                </li>
              </ul>
            </div>

            {/* Card 3: Calibração de Escopo */}
            <div className="bg-white border border-[#d8dce6] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-[#066d73] font-bold text-sm">
                <Target className="w-4 h-4 text-[#066d73]" />
                <h4>3. Pivô Pedagógico & Calibração de Escopo</h4>
              </div>
              <ul className="text-xs text-[#555065] space-y-2 leading-relaxed">
                <li>
                  <strong className="text-[#2e2640]">Princípio do &quot;1 Nó Físico + N Nós Simulados&quot;:</strong> Em IoT/Cidades Inteligentes (ex: Módulo 9 de EC), desenvolve-se 1 nó em bancada física com sensores reais e simula-se via código a carga de 100+ nós virtuais (Kafka/MQTT).
                </li>
                <li>
                  <strong className="text-[#2e2640]">Fatiamento em Trilha de Maturidade:</strong> Demandas gigantescas são desmembradas em janelas sequenciais: Bancada/IoT (1º Ano) ➔ Rede/Nuvem ➔ Mobile ➔ IA de Borda.
                </li>
                <li>
                  <strong className="text-[#2e2640]">Substituição de Câmeras de Borda:</strong> Quando visão na borda for inviável, utiliza-se sensores de presença ou Wi-Fi Probe passivo (sem coleta de PII).
                </li>
              </ul>
            </div>

            {/* Card 4: Modelo de Parceria */}
            <div className="bg-white border border-[#d8dce6] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-[#2e2640] font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#066d73]" />
                <h4>4. Modelo Acadêmico e Papel do Parceiro</h4>
              </div>
              <ul className="text-xs text-[#555065] space-y-2 leading-relaxed">
                <li>
                  <strong>Ciclos de 10 Semanas:</strong> Estruturados em 5 sprints quinzenais por squads de 6 a 8 estudantes com orientação de professores doutores.
                </li>
                <li>
                  <strong>Propriedade Intelectual 100% da Empresa:</strong> Sem custo financeiro de desenvolvimento para o parceiro; código e protótipos são transferidos integralmente.
                </li>
                <li>
                  <strong>Compromisso de Ponto Focal (~30 horas):</strong> Presença em 7 momentos chave (Onboarding, Kickoff, 4 Validações de Sprint e Apresentação Final) e preenchimento prévio do TAPI.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

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

            <div className="pt-3 border-t border-[#e2e5ec] flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                {activeModuleModal.partnerPortalUrl && (
                  <a
                    href={activeModuleModal.partnerPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#364f99] hover:underline font-mono"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Portal Inteli</span>
                  </a>
                )}

                {onOpenSubmissionForModule && (
                  <button
                    type="button"
                    onClick={() => {
                      const mod = activeModuleModal;
                      setActiveModuleModal(null);
                      onOpenSubmissionForModule(mod);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#ff4545] hover:bg-[#e03232] text-white transition shadow-sm font-mono"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submeter Proposta ({activeModuleModal.code})</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => setActiveModuleModal(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#edeef4] hover:bg-[#d8dce6] text-[#2e2640] transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hardware Detail Modal */}
      {activeHardwareModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveHardwareModal(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-5 border border-[#d8dce6] shadow-2xl animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#e2e5ec] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#364f99]/10 text-[#364f99] border border-[#364f99]/25 font-mono">
                    {activeHardwareModal.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-[#89cea5]/20 text-[#066d73] border border-[#89cea5]/40">
                    {activeHardwareModal.quantity}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#2e2640] tracking-tight">
                  {activeHardwareModal.name}
                </h3>
                <p className="text-xs text-[#6c657e] mt-1 font-mono">
                  Fonte: {activeHardwareModal.sourceRef}
                </p>
              </div>

              <button
                onClick={() => setActiveHardwareModal(null)}
                className="p-2 rounded-xl bg-[#edeef4] hover:bg-[#d8dce6] text-[#2e2640] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Primary Use */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-[#555065] uppercase tracking-wider font-mono">
                Aplicação Prática no Inteli:
              </h4>
              <p className="text-xs sm:text-sm text-[#2e2640] leading-relaxed bg-[#f8f9fc] p-3.5 rounded-xl border border-[#e2e5ec]">
                {activeHardwareModal.primaryUse}
              </p>
            </div>

            {/* Technical Specs */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#555065] uppercase tracking-wider font-mono">
                Especificações Técnicas:
              </h4>
              <div className="bg-[#f8f9fc] rounded-xl p-3.5 border border-[#e2e5ec] space-y-2 text-xs font-mono">
                {activeHardwareModal.specs.cpuGpu && (
                  <div>
                    <span className="text-[#6c657e] font-bold">Processador / GPU: </span>
                    <span className="text-[#2e2640]">{activeHardwareModal.specs.cpuGpu}</span>
                  </div>
                )}
                {activeHardwareModal.specs.ram && (
                  <div>
                    <span className="text-[#6c657e] font-bold">Memória RAM: </span>
                    <span className="text-[#2e2640]">{activeHardwareModal.specs.ram}</span>
                  </div>
                )}
                {activeHardwareModal.specs.storage && (
                  <div>
                    <span className="text-[#6c657e] font-bold">Armazenamento: </span>
                    <span className="text-[#2e2640]">{activeHardwareModal.specs.storage}</span>
                  </div>
                )}
                {activeHardwareModal.specs.connectivity && (
                  <div>
                    <span className="text-[#6c657e] font-bold">Conectividade & Portas: </span>
                    <span className="text-[#2e2640]">{activeHardwareModal.specs.connectivity}</span>
                  </div>
                )}
                {activeHardwareModal.specs.specialFeatures && (
                  <div>
                    <span className="text-[#6c657e] font-bold">Diferenciais Técnicos: </span>
                    <span className="text-[#066d73] font-semibold">{activeHardwareModal.specs.specialFeatures}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Recommended Modules */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#555065] uppercase tracking-wider font-mono">
                Módulos Oficiais onde este Hardware é Empregado:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeHardwareModal.recommendedModules.map((m, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#364f99]/10 text-[#364f99] border border-[#364f99]/25 font-mono"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#e2e5ec] flex justify-end">
              <button
                onClick={() => setActiveHardwareModal(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#364f99] hover:bg-[#293d79] text-white transition shadow-sm"
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
