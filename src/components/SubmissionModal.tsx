import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building,
  User,
  Mail,
  Phone,
  Briefcase,
  Globe,
  FileText,
  Sparkles,
  Copy,
  ExternalLink,
  Download,
  Clock,
  RotateCcw,
  Check,
  Cpu,
  HelpCircle,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  InitiativeMatch,
  ModuleOption,
  SubmissionProponentInfo,
  SubmissionItemConfig,
  SubmissionReceipt
} from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { maskPhone, validatePhone } from '../utils/phoneMask.ts';
import { InteliLogo, InteliSymbol } from './InteliBrand.tsx';

interface SubmissionModalProps {
  initiative: InitiativeMatch;
  allInitiatives?: InitiativeMatch[];
  defaultModuleOption?: ModuleOption | null;
  initialProponentInfo?: Partial<SubmissionProponentInfo>;
  onClose: () => void;
  onSubmissionSuccess?: (receipts: SubmissionReceipt[]) => void;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({
  initiative,
  allInitiatives = [],
  defaultModuleOption,
  initialProponentInfo,
  onClose,
  onSubmissionSuccess,
}) => {
  const { user } = useAuth();

  // Step state: 1: Configure & Form | 2: Dispatching / Emulating | 3: Results
  const [currentStep, setCurrentStep] = useState<'form' | 'dispatching' | 'results'>('form');

  // Multi-option detection
  const hasMultipleOptions = Array.isArray(initiative.options) && initiative.options.length > 1;

  // Submission Strategy: 'single' | 'all-options' | 'portfolio-batch'
  const [submissionStrategy, setSubmissionStrategy] = useState<'single' | 'all-options' | 'portfolio-batch'>(
    hasMultipleOptions ? 'all-options' : 'single'
  );

  // If single, which option is selected
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    defaultModuleOption?.id || initiative.options?.[0]?.id || 'primary'
  );

  // Proponent Form Data - automatically pre-filled from AI extraction if available, or current user
  const [proponent, setProponent] = useState<SubmissionProponentInfo>(() => ({
    proponentName: initialProponentInfo?.proponentName || user?.name || '',
    proponentEmail: initialProponentInfo?.proponentEmail || user?.email || '',
    proponentPhone: initialProponentInfo?.proponentPhone ? maskPhone(initialProponentInfo.proponentPhone) : '',
    proponentRole: initialProponentInfo?.proponentRole || (user?.role === 'Docente / Professor' ? 'Professor Orientador' : 'Coordenador de Parcerias'),
    organizationName: initialProponentInfo?.organizationName || '',
    organizationSector: initialProponentInfo?.organizationSector || '',
    organizationWebsite: initialProponentInfo?.organizationWebsite || '',
    academicTermsAccepted: false,
  }));

  const hasAutoExtractedContact = Boolean(
    initialProponentInfo &&
      (initialProponentInfo.organizationName ||
        initialProponentInfo.proponentName ||
        initialProponentInfo.proponentEmail ||
        initialProponentInfo.proponentPhone ||
        initialProponentInfo.organizationSector ||
        initialProponentInfo.organizationWebsite)
  );

  // Validation Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Submission items queue to be submitted
  const [submissionQueue, setSubmissionQueue] = useState<SubmissionItemConfig[]>([]);
  const [activeQueueTab, setActiveQueueTab] = useState<string>('');

  // Live execution progress state
  const [overallProgress, setOverallProgress] = useState(0);
  const [generatedReceipts, setGeneratedReceipts] = useState<SubmissionReceipt[]>([]);
  const [copiedProtocol, setCopiedProtocol] = useState<string | null>(null);
  const [isAdaptingAi, setIsAdaptingAi] = useState(false);

  // Initialize queue on mount or when strategy / selected option changes
  useEffect(() => {
    buildSubmissionQueue();
  }, [submissionStrategy, selectedOptionId, initiative]);

  const buildSubmissionQueue = () => {
    let items: SubmissionItemConfig[] = [];

    if (submissionStrategy === 'single') {
      // Find selected option or default
      const opt = initiative.options?.find((o) => o.id === selectedOptionId) || {
        id: 'primary',
        isPrimary: true,
        label: 'Opção Recomendada',
        code: initiative.code || 'INTELI',
        controlCode: initiative.controlCode || 'Módulo Principal',
        metaprojectName: initiative.recommendedMetaproject,
        moduleName: initiative.matchedModule,
        course: initiative.matchedCourse,
        quarter: initiative.quarter || '1º TRI',
        adherenceLevel: initiative.adherenceLevel,
        adherenceJustification: initiative.adherenceJustification,
        pros: ['Alta compatibilidade curricular com as competências do ciclo.'],
        cons: ['Ciclo delimitado estritamente em 10 semanas (5 sprints quinzenais).'],
        scopeAdjustment: 'Foco em protótipo funcional demonstrável com arquitetura validada.',
        partnerPortalUrl: initiative.partnerPortalUrl || 'https://web.inteli.edu.br/projetos-parceiros',
      };

      items = [createQueueItem(initiative, opt)];
    } else if (submissionStrategy === 'all-options') {
      // Generate one item for each evaluated option
      const optionsList = initiative.options && initiative.options.length > 0
        ? initiative.options
        : [{
            id: 'primary',
            isPrimary: true,
            label: 'Opção Recomendada',
            code: initiative.code || 'INTELI',
            controlCode: initiative.controlCode || 'Módulo',
            metaprojectName: initiative.recommendedMetaproject,
            moduleName: initiative.matchedModule,
            course: initiative.matchedCourse,
            quarter: initiative.quarter || '1º TRI',
            adherenceLevel: initiative.adherenceLevel,
            adherenceJustification: initiative.adherenceJustification,
            pros: ['Alta compatibilidade curricular.'],
            cons: ['Ciclo de 10 semanas.'],
            scopeAdjustment: 'Foco em protótipo validado.',
            partnerPortalUrl: initiative.partnerPortalUrl || 'https://web.inteli.edu.br/projetos-parceiros',
          }];

      items = optionsList.map((opt) => createQueueItem(initiative, opt));
    } else if (submissionStrategy === 'portfolio-batch') {
      // Batch for all initiatives in current document
      items = allInitiatives.map((init) => {
        const topOpt = init.options?.[0] || {
          id: init.id,
          isPrimary: true,
          label: 'Opção Recomendada',
          code: init.code || 'INTELI',
          controlCode: init.controlCode || 'Módulo',
          metaprojectName: init.recommendedMetaproject,
          moduleName: init.matchedModule,
          course: init.matchedCourse,
          quarter: init.quarter || '1º TRI',
          adherenceLevel: init.adherenceLevel,
          adherenceJustification: init.adherenceJustification,
          pros: ['Compatibilidade avaliada pelo assistente de projetos.'],
          cons: ['Escopo calibrado para 10 semanas.'],
          scopeAdjustment: init.recommendedAction || 'Escopo delimitado para 5 sprints.',
          partnerPortalUrl: init.partnerPortalUrl || 'https://web.inteli.edu.br/projetos-parceiros',
        };
        return createQueueItem(init, topOpt);
      });
    }

    setSubmissionQueue(items);
    if (items.length > 0) {
      setActiveQueueTab(items[0].id);
    }
  };

  const createQueueItem = (init: InitiativeMatch, opt: any): SubmissionItemConfig => {
    const prosText = opt.pros?.join('. ') || 'Alta sinergia com o curso.';
    const consText = opt.cons?.join('. ') || 'Restrição temporal de 10 semanas.';
    const scopeText = opt.scopeAdjustment || 'Delimitação estrita do escopo para 5 sprints quinzenais.';

    const adaptedDesc = `[Proposta Direcionada para ${opt.metaprojectName || opt.moduleName} - ${opt.course}]\n\nDesafio Central: ${init.challengeSummary || init.title}\n\nEnquadramento Pedagógico & Oportunidade: Esta submissão foi estruturada especificamente para alavancar as competências de ${opt.course}, aproveitando: ${prosText}.`;

    const tradeoffNote = `Mitigação de Trade-offs & Ajuste de Escopo: ${consText}. Estratégia de Mitigação: ${scopeText}. O desenvolvimento ocorrerá em ambiente controlado de sandbox pedagógico.`;

    const deliverables = [
      'Sprint 1-2: Documento de Requisitos (TAPI), Arquitetura Técnica e Wireframes.',
      'Sprint 3: Primeiro MVP Funcional integrando o fluxo central da aplicação.',
      'Sprint 4: Refinamento de testes, segurança e validação com usuários do parceiro.',
      'Sprint 5: Solução final empacotada, repositório documentado e apresentação executiva.'
    ];

    return {
      id: `${init.id}-${opt.id || opt.code || Math.random().toString(36).substr(2, 5)}`,
      initiativeId: init.id,
      initiativeTitle: init.title,
      moduleCode: opt.code || 'INTELI',
      moduleControlCode: opt.controlCode || 'Módulo',
      moduleName: opt.moduleName || opt.metaprojectName,
      metaprojectName: opt.metaprojectName || opt.moduleName,
      course: opt.course,
      quarter: opt.quarter,
      year: opt.year,
      adherenceLevel: opt.adherenceLevel || 'Alto',
      pros: opt.pros || [],
      cons: opt.cons || [],
      scopeAdjustment: opt.scopeAdjustment,
      partnerPortalUrl: opt.partnerPortalUrl || 'https://web.inteli.edu.br/projetos-parceiros',
      adaptedChallengeDescription: adaptedDesc,
      adaptedDeliverables: deliverables,
      tradeoffMitigationNote: tradeoffNote,
      status: 'pending',
    };
  };

  // Handle phone input with dynamic mask and live validation
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const masked = maskPhone(rawVal);
    setProponent((prev) => ({ ...prev, proponentPhone: masked }));

    if (masked.length > 0) {
      const valResult = validatePhone(masked);
      if (!valResult.isValid) {
        setErrors((prev) => ({ ...prev, proponentPhone: valResult.message || 'Telefone inválido' }));
      } else {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated.proponentPhone;
          return updated;
        });
      }
    } else {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.proponentPhone;
        return updated;
      });
    }
  };

  // Trigger AI adaptation for all items in the queue
  const handleRegenerateTextWithAi = async (itemId: string) => {
    const item = submissionQueue.find((q) => q.id === itemId);
    if (!item) return;

    try {
      setIsAdaptingAi(true);
      const res = await fetch('/api/adapt-submission-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initiative: {
            title: item.initiativeTitle,
            challengeSummary: item.adaptedChallengeDescription,
          },
          moduleOption: {
            moduleName: item.moduleName,
            metaprojectName: item.metaprojectName,
            code: item.moduleCode,
            course: item.course,
            pros: item.pros,
            cons: item.cons,
            scopeAdjustment: item.scopeAdjustment,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmissionQueue((prev) =>
          prev.map((q) => {
            if (q.id === itemId) {
              return {
                ...q,
                adaptedChallengeDescription: data.adaptedDescription || q.adaptedChallengeDescription,
                tradeoffMitigationNote: data.tradeoffMitigation || q.tradeoffMitigationNote,
                adaptedDeliverables: data.deliverables || q.adaptedDeliverables,
              };
            }
            return q;
          })
        );
      }
    } catch (e) {
      console.error('Falha ao regenerar com IA:', e);
    } finally {
      setIsAdaptingAi(false);
    }
  };

  // Validate form prior to submission emulation
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!proponent.proponentName.trim()) {
      newErrors.proponentName = 'O nome completo do proponente é obrigatório.';
    }

    if (!proponent.proponentEmail.trim() || !proponent.proponentEmail.includes('@')) {
      newErrors.proponentEmail = 'Informe um e-mail corporativo válido.';
    }

    const phoneValidation = validatePhone(proponent.proponentPhone);
    if (!phoneValidation.isValid) {
      newErrors.proponentPhone = phoneValidation.message || 'Telefone inválido.';
    }

    if (!proponent.proponentRole.trim()) {
      newErrors.proponentRole = 'O cargo ou função é obrigatório.';
    }

    if (!proponent.organizationName.trim()) {
      newErrors.organizationName = 'A empresa ou organização é obrigatória.';
    }

    if (!proponent.academicTermsAccepted) {
      newErrors.academicTermsAccepted = 'É obrigatório aceitar o termo de diretrizes acadêmicas do Inteli.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Start submission execution with visual emulation
  const handleStartSubmission = async () => {
    if (!validateForm()) {
      return;
    }

    setCurrentStep('dispatching');
    setOverallProgress(10);

    try {
      // Step A: Emulate validation
      setSubmissionQueue((prev) =>
        prev.map((item) => ({ ...item, status: 'validating', progressMessage: 'Validando campos obrigatórios...' }))
      );
      await new Promise((r) => setTimeout(r, 600));
      setOverallProgress(35);

      // Step B: Emulate form click & dispatch to API
      setSubmissionQueue((prev) =>
        prev.map((item) => ({
          ...item,
          status: 'submitting',
          progressMessage: 'Emulando clique no botão de submissão do portal...',
        }))
      );
      await new Promise((r) => setTimeout(r, 700));
      setOverallProgress(65);

      // Send to server
      const response = await fetch('/api/submit-initiative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proponent,
          submissions: submissionQueue,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao submeter propostas ao portal.');
      }

      setOverallProgress(100);

      // Mark all items as success with assigned protocols
      const receipts: SubmissionReceipt[] = data.receipts || [];
      setGeneratedReceipts(receipts);

      setSubmissionQueue((prev) =>
        prev.map((item, index) => {
          const rec = receipts[index];
          return {
            ...item,
            status: 'success',
            progressMessage: 'Confirmado pelo Portal de Projetos Inteli',
            protocol: rec?.protocol || `INTELI-2025-${Math.floor(1000 + Math.random() * 9000)}`,
            submittedAt: rec?.submittedAt || new Date().toLocaleTimeString(),
          };
        })
      );

      if (onSubmissionSuccess) {
        onSubmissionSuccess(receipts);
      }

      // Transition to results step
      setTimeout(() => {
        setCurrentStep('results');
      }, 700);
    } catch (err: any) {
      console.error('Erro na submissão:', err);
      setSubmissionQueue((prev) =>
        prev.map((item) => ({
          ...item,
          status: 'error',
          errorMessage: err?.message || 'Falha na submissão.',
        }))
      );
      alert(`Falha no envio: ${err?.message || 'Verifique sua conexão e tente novamente.'}`);
      setCurrentStep('form');
    }
  };

  const handleCopyProtocol = (protocol: string) => {
    navigator.clipboard.writeText(protocol);
    setCopiedProtocol(protocol);
    setTimeout(() => setCopiedProtocol(null), 2000);
  };

  const handleDownloadReceiptsFile = () => {
    const textContent = generatedReceipts
      .map(
        (r, idx) => `=====================================================
COMPROVANTE OFICIAL DE SUBMISSÃO DE INICIATIVA • INTELI
=====================================================
Protocolo de Registro: ${r.protocol}
Data/Hora de Envio: ${r.submittedAt}
Status: ${r.status}

1. DADOS DO PROPONENTE:
- Solicitante: ${r.proponentName}
- E-mail: ${r.proponentEmail}
- Telefone: ${r.proponentPhone}
- Cargo: ${r.proponentRole}
- Organização: ${r.organizationName} ${r.organizationSector ? `(${r.organizationSector})` : ''}

2. DADOS DO PROJETO SUBMETIDO:
- Título: ${r.initiativeTitle}
- Módulo Alvo: ${r.moduleName} (${r.moduleCode} - ${r.moduleControlCode})
- Curso: ${r.course} | Trimestre: ${r.quarter || 'N/A'}
- Link no Portal: ${r.partnerPortalUrl}

3. DESAFIO ADEQUADO (PRÓS & TRADE-OFFS):
${r.adaptedChallengeDescription}

4. MITIGAÇÃO DE TRADE-OFFS & AJUSTE DE ESCOPO:
${r.tradeoffMitigationNote}

5. ENTREGÁVEIS PREVISTOS (5 SPRINTS / 10 SEMANAS):
${r.adaptedDeliverables.map((d) => `  * ${d}`).join('\n')}

DIRETRIZES ACADÊMICAS:
O projeto será conduzido pedagogicamente por squads de 6 a 8 alunos sob mentoria de professores do Inteli, sem garantia de SLA comercial de produção.
`
      )
      .join('\n\n');

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Comprovante_Submissao_Inteli_${generatedReceipts[0]?.protocol || 'Lote'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#140e1f]/60 backdrop-blur-xs animate-fadeIn font-sans">
      <div className="bg-white border border-[#d8dce6] max-w-4xl w-full max-h-[92vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col text-[#2e2640]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#e2e5ec] flex items-center justify-between bg-[#fafbfc]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ff4545]/10 text-[#ff4545] flex items-center justify-center border border-[#ff4545]/25">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#2e2640]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Submissão de Proposta ao Portal Inteli
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#364f99]/10 text-[#364f99] border border-[#364f99]/20 font-bold">
                  Escritório de Projetos
                </span>
              </div>
              <p className="text-xs text-[#555065]">
                {currentStep === 'form' && 'Preenchimento automatizado, adequação pedagógica e emulação de envio.'}
                {currentStep === 'dispatching' && 'Orquestrando envio seguro e emulando clique no portal oficial...'}
                {currentStep === 'results' && 'Submissão concluída com emissão oficial de protocolo.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#f8f9fc] hover:bg-[#edeef4] text-[#555065] hover:text-[#2e2640] border border-[#d8dce6] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* STEP 1: FORM & CONFIGURATION */}
          {currentStep === 'form' && (
            <div className="space-y-6">
              {/* Question 1: Single vs Multiple Choice Banner */}
              {hasMultipleOptions && (
                <div className="bg-gradient-to-r from-[#fff5f5] via-white to-[#f4f8f5] border-2 border-[#ff4545]/30 rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#ff4545] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#2e2640]">
                        Classificação Multi-Opções Identificada ({initiative.options?.length} possibilidades)
                      </h4>
                      <p className="text-xs text-[#555065] mt-0.5">
                        Esta iniciativa tem encaixe viável em mais de um curso/módulo. Como você deseja realizar a submissão?
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Option A: Submit Single */}
                    <label
                      onClick={() => setSubmissionStrategy('single')}
                      className={`cursor-pointer rounded-xl p-3.5 border-2 transition flex flex-col justify-between space-y-2 ${
                        submissionStrategy === 'single'
                          ? 'border-[#364f99] bg-[#f0f4ff]'
                          : 'border-[#d8dce6] bg-white hover:border-[#90a5e5]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="strategy"
                            checked={submissionStrategy === 'single'}
                            onChange={() => setSubmissionStrategy('single')}
                            className="text-[#364f99] focus:ring-[#364f99]"
                          />
                          <span className="text-xs font-bold text-[#2e2640]">
                            Submissão Única (Módulo Específico)
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[#364f99] font-semibold bg-[#364f99]/10 px-1.5 py-0.5 rounded">
                          1 Proposta
                        </span>
                      </div>
                      <p className="text-[11px] text-[#555065]">
                        Submeter apenas para a opção principal recomendada ou selecionar manualmente um dos módulos classificados.
                      </p>
                    </label>

                    {/* Option B: Submit All with Adapted Text */}
                    <label
                      onClick={() => setSubmissionStrategy('all-options')}
                      className={`cursor-pointer rounded-xl p-3.5 border-2 transition flex flex-col justify-between space-y-2 ${
                        submissionStrategy === 'all-options'
                          ? 'border-[#ff4545] bg-[#fff8f8]'
                          : 'border-[#d8dce6] bg-white hover:border-[#ff4545]/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="strategy"
                            checked={submissionStrategy === 'all-options'}
                            onChange={() => setSubmissionStrategy('all-options')}
                            className="text-[#ff4545] focus:ring-[#ff4545]"
                          />
                          <span className="text-xs font-bold text-[#e03232]">
                            Submeter para Todas as Opções
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[#e03232] font-semibold bg-[#ff4545]/15 px-1.5 py-0.5 rounded">
                          {initiative.options?.length} Propostas Adequadas
                        </span>
                      </div>
                      <p className="text-[11px] text-[#555065]">
                        Gera envios paralelos com a redação de cada desafio já calibrada, enfatizando os <strong>Pontos Positivos</strong> e contornando os <strong>Trade-offs</strong> de cada curso.
                      </p>
                    </label>
                  </div>

                  {/* If Single Strategy, choose which module */}
                  {submissionStrategy === 'single' && (
                    <div className="pt-2 border-t border-[#e2e5ec]/60 flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-[#2e2640]">Selecione o Módulo Alvo:</span>
                      <div className="flex flex-wrap gap-2">
                        {initiative.options?.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSelectedOptionId(opt.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
                              selectedOptionId === opt.id
                                ? 'bg-[#364f99] text-white border-[#364f99]'
                                : 'bg-white text-[#555065] border-[#d8dce6] hover:bg-[#edeef4]'
                            }`}
                          >
                            {opt.code} - {opt.course}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Section 1: Proponent & Contact Data */}
              <div className="bg-white border border-[#d8dce6] rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#e2e5ec] pb-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#ff4545]" />
                    <h4 className="text-sm font-bold text-[#2e2640]">
                      1. Dados do Solicitante / Contato do Parceiro
                    </h4>
                  </div>
                  <span className="text-[11px] text-[#6c657e]">
                    <span className="text-[#ff4545] font-bold">*</span> Campos Obrigatórios
                  </span>
                </div>

                {hasAutoExtractedContact && (
                  <div className="bg-[#89cea5]/15 border border-[#89cea5]/40 rounded-xl p-3 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#066d73] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold text-[#066d73]">
                        Dados de contato e da empresa preenchidos automaticamente pela IA
                      </p>
                      <p className="text-[#3c364c] text-[11px] mt-0.5 leading-relaxed">
                        Identificamos as informações do solicitante diretamente a partir do texto/documento da iniciativa. Os campos abaixo já foram organizados para submissão e você pode revisá-los ou editá-los livremente antes de enviar.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Nome Completo */}
                  <div>
                    <label className="block text-xs font-semibold text-[#2e2640] mb-1">
                      Nome Completo <span className="text-[#ff4545]">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#6c657e] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={proponent.proponentName}
                        onChange={(e) =>
                          setProponent((p) => ({ ...p, proponentName: e.target.value }))
                        }
                        placeholder="Ex: Carlos Mendonça"
                        className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border ${
                          errors.proponentName ? 'border-[#ff4545] bg-[#fff5f5]' : 'border-[#d8dce6] bg-white'
                        } focus:outline-none focus:border-[#ff4545]`}
                      />
                    </div>
                    {errors.proponentName && (
                      <span className="text-[10px] text-[#e03232] mt-0.5 block">{errors.proponentName}</span>
                    )}
                  </div>

                  {/* E-mail Corporativo */}
                  <div>
                    <label className="block text-xs font-semibold text-[#2e2640] mb-1">
                      E-mail Corporativo / Institucional <span className="text-[#ff4545]">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#6c657e] absolute left-3 top-2.5" />
                      <input
                        type="email"
                        value={proponent.proponentEmail}
                        onChange={(e) =>
                          setProponent((p) => ({ ...p, proponentEmail: e.target.value }))
                        }
                        placeholder="nome@empresa.com.br"
                        className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border ${
                          errors.proponentEmail ? 'border-[#ff4545] bg-[#fff5f5]' : 'border-[#d8dce6] bg-white'
                        } focus:outline-none focus:border-[#ff4545]`}
                      />
                    </div>
                    {errors.proponentEmail && (
                      <span className="text-[10px] text-[#e03232] mt-0.5 block">{errors.proponentEmail}</span>
                    )}
                  </div>

                  {/* Telefone com Máscara e Validação Estrita */}
                  <div>
                    <label className="block text-xs font-semibold text-[#2e2640] mb-1">
                      Telefone / WhatsApp <span className="text-[#ff4545]">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#6c657e] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={proponent.proponentPhone}
                        onChange={handlePhoneChange}
                        placeholder="(11) 98765-4321"
                        maxLength={15}
                        className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl font-mono border ${
                          errors.proponentPhone ? 'border-[#ff4545] bg-[#fff5f5]' : 'border-[#d8dce6] bg-white'
                        } focus:outline-none focus:border-[#ff4545]`}
                      />
                    </div>
                    {errors.proponentPhone ? (
                      <span className="text-[10px] text-[#e03232] mt-0.5 block">{errors.proponentPhone}</span>
                    ) : (
                      <span className="text-[10px] text-[#6c657e] mt-0.5 block">
                        Máscara: (XX) XXXXX-XXXX
                      </span>
                    )}
                  </div>

                  {/* Cargo / Função */}
                  <div>
                    <label className="block text-xs font-semibold text-[#2e2640] mb-1">
                      Cargo / Função <span className="text-[#ff4545]">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-[#6c657e] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={proponent.proponentRole}
                        onChange={(e) =>
                          setProponent((p) => ({ ...p, proponentRole: e.target.value }))
                        }
                        placeholder="Ex: Head de Inovação / Tech Lead"
                        className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border ${
                          errors.proponentRole ? 'border-[#ff4545] bg-[#fff5f5]' : 'border-[#d8dce6] bg-white'
                        } focus:outline-none focus:border-[#ff4545]`}
                      />
                    </div>
                    {errors.proponentRole && (
                      <span className="text-[10px] text-[#e03232] mt-0.5 block">{errors.proponentRole}</span>
                    )}
                  </div>

                  {/* Organização / Empresa */}
                  <div>
                    <label className="block text-xs font-semibold text-[#2e2640] mb-1">
                      Empresa / Parceiro Corporativo <span className="text-[#ff4545]">*</span>
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-[#6c657e] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={proponent.organizationName}
                        onChange={(e) =>
                          setProponent((p) => ({ ...p, organizationName: e.target.value }))
                        }
                        placeholder="Ex: Hospital Albert Einstein"
                        className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border ${
                          errors.organizationName ? 'border-[#ff4545] bg-[#fff5f5]' : 'border-[#d8dce6] bg-white'
                        } focus:outline-none focus:border-[#ff4545]`}
                      />
                    </div>
                    {errors.organizationName && (
                      <span className="text-[10px] text-[#e03232] mt-0.5 block">{errors.organizationName}</span>
                    )}
                  </div>

                  {/* Setor de Atuação (Opcional) */}
                  <div>
                    <label className="block text-xs font-semibold text-[#555065] mb-1 flex items-center justify-between">
                      <span>Setor de Atuação</span>
                      <span className="text-[10px] text-[#6c657e] font-normal">Opcional</span>
                    </label>
                    <input
                      type="text"
                      value={proponent.organizationSector || ''}
                      onChange={(e) =>
                        setProponent((p) => ({ ...p, organizationSector: e.target.value }))
                      }
                      placeholder="Ex: Saúde, Varejo, Logística..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#d8dce6] bg-white focus:outline-none focus:border-[#ff4545]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Adapted Proposals Review (Tabs for Multiple Options) */}
              <div className="bg-white border border-[#d8dce6] rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e2e5ec] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#364f99]" />
                      <h4 className="text-sm font-bold text-[#2e2640]">
                        2. Propostas Adequadas ao Encaixe Pedagógico ({submissionQueue.length})
                      </h4>
                    </div>
                    <p className="text-[11px] text-[#555065] mt-0.5">
                      Textos de submissão ajustados automaticamente destacando os <strong>Prós</strong> e mitigando os <strong>Trade-offs</strong> identificados.
                    </p>
                  </div>

                  {submissionQueue.length > 1 && (
                    <div className="flex flex-wrap gap-1.5">
                      {submissionQueue.map((item, idx) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveQueueTab(item.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono transition border ${
                            activeQueueTab === item.id
                              ? 'bg-[#ff4545] text-white border-[#ff4545]'
                              : 'bg-[#f8f9fc] text-[#555065] border-[#d8dce6] hover:bg-[#edeef4]'
                          }`}
                        >
                          {item.moduleCode || `Opção ${idx + 1}`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Active Item Editor & Trade-offs Display */}
                {submissionQueue.map((item) => {
                  if (item.id !== activeQueueTab && submissionQueue.length > 1) return null;

                  return (
                    <div key={item.id} className="space-y-4 animate-fadeIn">
                      {/* Target Module Badge */}
                      <div className="bg-[#f8f9fc] p-3.5 rounded-xl border border-[#d8dce6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ff4545]/10 text-[#e03232] border border-[#ff4545]/25 font-mono">
                              {item.moduleCode}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#edeef4] text-[#364f99] border border-[#d8dce6] font-mono">
                              {item.moduleControlCode}
                            </span>
                            <span className="text-xs font-semibold text-[#555065]">
                              {item.course} • {item.quarter}
                            </span>
                          </div>
                          <h5 className="text-sm font-bold text-[#2e2640]">
                            {item.metaprojectName}
                          </h5>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRegenerateTextWithAi(item.id)}
                          disabled={isAdaptingAi}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-[#fff5f5] text-[#e03232] border border-[#ff4545]/30 transition shrink-0 disabled:opacity-50"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{isAdaptingAi ? 'Adequando...' : 'Regerar Redação com IA'}</span>
                        </button>
                      </div>

                      {/* Pros & Cons Incorporated Preview */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-[#f0f9f4] border border-[#89cea5]/40 rounded-xl p-3 text-xs">
                          <span className="font-bold text-[#066d73] block mb-1 flex items-center gap-1 font-mono text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Pontos Positivos Aproveitados nesta Submissão:
                          </span>
                          <p className="text-[#144238] leading-relaxed text-[11px]">
                            {item.pros.length > 0
                              ? item.pros.join('; ')
                              : 'Alta aderência às competências curriculares.'}
                          </p>
                        </div>

                        <div className="bg-[#fff5f5] border border-[#ff4545]/25 rounded-xl p-3 text-xs">
                          <span className="font-bold text-[#e03232] block mb-1 flex items-center gap-1 font-mono text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Trade-offs Mitigados no Escopo:
                          </span>
                          <p className="text-[#8a1c1c] leading-relaxed text-[11px]">
                            {item.cons.length > 0
                              ? item.cons.join('; ')
                              : 'Ciclo de 10 semanas em 5 sprints quinzenais.'}
                          </p>
                        </div>
                      </div>

                      {/* Text 1: Desafio Adequado */}
                      <div>
                        <label className="block text-xs font-semibold text-[#2e2640] mb-1">
                          Descrição do Desafio Customizada para o Módulo <span className="text-[#ff4545]">*</span>
                        </label>
                        <textarea
                          rows={4}
                          value={item.adaptedChallengeDescription}
                          onChange={(e) => {
                            const newText = e.target.value;
                            setSubmissionQueue((prev) =>
                              prev.map((q) => (q.id === item.id ? { ...q, adaptedChallengeDescription: newText } : q))
                            );
                          }}
                          className="w-full p-3 text-xs rounded-xl border border-[#d8dce6] focus:outline-none focus:border-[#ff4545] leading-relaxed"
                        />
                      </div>

                      {/* Text 2: Mitigação de Trade-offs */}
                      <div>
                        <label className="block text-xs font-semibold text-[#2e2640] mb-1">
                          Justificativa Pedagógica & Mitigação de Trade-offs <span className="text-[#ff4545]">*</span>
                        </label>
                        <textarea
                          rows={3}
                          value={item.tradeoffMitigationNote}
                          onChange={(e) => {
                            const newText = e.target.value;
                            setSubmissionQueue((prev) =>
                              prev.map((q) => (q.id === item.id ? { ...q, tradeoffMitigationNote: newText } : q))
                            );
                          }}
                          className="w-full p-3 text-xs rounded-xl border border-[#d8dce6] focus:outline-none focus:border-[#ff4545] leading-relaxed font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Section 3: Academic Terms Checkbox */}
              <div className="bg-[#f8f9fc] border border-[#d8dce6] rounded-2xl p-4 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={proponent.academicTermsAccepted}
                    onChange={(e) =>
                      setProponent((p) => ({ ...p, academicTermsAccepted: e.target.checked }))
                    }
                    className="mt-1 rounded text-[#ff4545] focus:ring-[#ff4545]"
                  />
                  <div className="text-xs text-[#2e2640] leading-relaxed">
                    <span className="font-bold">Termo de Diretrizes Acadêmicas Inteli:</span> Declaro ciência de que os projetos são desenvolvidos por squads de alunos em sprints pedagógicas de 10 semanas sob tutoria de professores, focando em validação técnica e MVP, sem garantia ou prestação de SLA comercial em ambiente de produção final. <span className="text-[#ff4545]">*</span>
                  </div>
                </label>
                {errors.academicTermsAccepted && (
                  <span className="text-[10px] text-[#e03232] block pl-6 font-semibold">
                    {errors.academicTermsAccepted}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: DISPATCHING / EMULATING SUBMISSION */}
          {currentStep === 'dispatching' && (
            <div className="py-10 text-center space-y-6 max-w-xl mx-auto">
              <div className="relative w-20 h-20 mx-auto">
                <div className="w-20 h-20 rounded-full border-4 border-[#e2e5ec] border-t-[#ff4545] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <InteliSymbol className="w-8 h-8 text-[#ff4545]" />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-bold text-[#2e2640]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Orquestrando Submissão ao Portal do Inteli
                </h4>
                <p className="text-xs text-[#555065]">
                  Validando payloads, formatando campos obrigatórios e emulando o clique de confirmação de envio...
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#edeef4] rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-[#ff4545] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>

              {/* Items in Queue Status */}
              <div className="space-y-2 text-left pt-3">
                {submissionQueue.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-[#d8dce6] bg-white flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#364f99] bg-[#364f99]/10 px-2 py-0.5 rounded">
                        {item.moduleCode}
                      </span>
                      <span className="font-semibold text-[#2e2640] truncate max-w-xs">
                        {item.metaprojectName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-[#ff4545] font-mono">
                      <Clock className="w-3.5 h-3.5 animate-pulse" />
                      <span>{item.progressMessage || 'Enviando...'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: RESULTS & PROTOCOLS */}
          {currentStep === 'results' && (
            <div className="space-y-6">
              {/* Success Banner */}
              <div className="bg-[#f0f9f4] border-2 border-[#89cea5] rounded-2xl p-5 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#066d73] text-white flex items-center justify-center mx-auto shadow-sm">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-lg font-bold text-[#066d73]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Submissão Confirmada com Sucesso!
                </h4>
                <p className="text-xs text-[#144238] max-w-md mx-auto leading-relaxed">
                  {generatedReceipts.length === 1
                    ? 'A iniciativa foi transmitida com sucesso para a esteira de triagem do Escritório de Projetos do Inteli.'
                    : `Foram geradas ${generatedReceipts.length} propostas independentes e devidamente calibradas para cada um dos módulos selecionados.`}
                </p>
              </div>

              {/* Receipts Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-[#555065] uppercase tracking-wider font-mono">
                    Protocolos Oficiais de Registro Emitidos:
                  </h5>
                  <button
                    type="button"
                    onClick={handleDownloadReceiptsFile}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#364f99] hover:underline font-mono"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar Comprovante (.txt)</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {generatedReceipts.map((rec) => (
                    <div
                      key={rec.protocol}
                      className="bg-white border border-[#d8dce6] rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#066d73] bg-[#89cea5]/20 px-2 py-0.5 rounded border border-[#89cea5]/40 font-mono">
                            Protocolo Oficial
                          </span>
                          <span className="text-[11px] text-[#6c657e] font-mono">
                            {rec.submittedAt}
                          </span>
                        </div>

                        <div className="flex items-center justify-between bg-[#f8f9fc] p-2 rounded-xl border border-[#e2e5ec]">
                          <span className="font-mono text-xs font-bold text-[#2e2640] tracking-wider">
                            {rec.protocol}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyProtocol(rec.protocol)}
                            className="text-[11px] text-[#364f99] hover:text-[#ff4545] font-semibold flex items-center gap-1"
                          >
                            {copiedProtocol === rec.protocol ? (
                              <>
                                <Check className="w-3 h-3 text-[#066d73]" />
                                <span className="text-[#066d73]">Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#364f99] font-semibold">
                            <span>{rec.moduleCode}</span>
                            <span>•</span>
                            <span>{rec.course}</span>
                          </div>
                          <h6 className="text-sm font-bold text-[#2e2640] leading-tight mt-0.5">
                            {rec.metaprojectName}
                          </h6>
                        </div>

                        <p className="text-xs text-[#555065] line-clamp-2">
                          {rec.initiativeTitle}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#e2e5ec] flex items-center justify-between">
                        <a
                          href={rec.partnerPortalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#ff4545] hover:underline font-mono"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Acessar Portal Inteli</span>
                        </a>
                        <span className="text-[10px] text-[#066d73] font-semibold font-mono">
                          ✓ Triagem Iniciada
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#e2e5ec] bg-[#fafbfc] flex items-center justify-between gap-3">
          {currentStep === 'form' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-[#edeef4] text-[#555065] border border-[#d8dce6] transition"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleStartSubmission}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#ff4545] hover:bg-[#e03232] text-white shadow-md shadow-[#ff4545]/20 transition"
              >
                <Send className="w-4 h-4" />
                <span>
                  Confirmar & Emular Submissão ao Portal (
                  {submissionQueue.length} {submissionQueue.length === 1 ? 'proposta' : 'propostas'})
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {currentStep === 'dispatching' && (
            <div className="w-full text-center text-xs text-[#6c657e] font-mono">
              Processando envio seguro com o portal de parceiros do Inteli...
            </div>
          )}

          {currentStep === 'results' && (
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={handleDownloadReceiptsFile}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-[#edeef4] text-[#2e2640] border border-[#d8dce6] transition"
              >
                <Download className="w-3.5 h-3.5 text-[#364f99]" />
                <span>Baixar Comprovantes</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#2e2640] hover:bg-[#1b1626] text-white shadow-sm transition"
              >
                Concluir & Fechar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
