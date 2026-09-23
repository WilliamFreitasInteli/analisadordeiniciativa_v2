export type AdherenceLevel = 'Alto' | 'Médio' | 'Baixo';

export interface ModuleOption {
  id: string;
  isPrimary: boolean;
  label: string; // ex: 'Opção Principal (Recomendada)', 'Alternativa A (Foco em IoT/Hardware)', 'Alternativa B (Foco em Ciência de Dados)'
  code?: string; // ex: 'SIMD7', '1AMD2', 'ESMD5'
  controlCode?: string; // ex: 'Módulo 07_SI', 'Módulo 02_IN'
  quarter?: string; // ex: '1º TRI', '2º TRI', '3º TRI', '4º TRI'
  metaprojectName: string; // Nome oficial exato da matriz Inteli (ex: 'Sistemas de Gestão e Governança Empresarial')
  moduleName: string; // Nome oficial canônico do módulo
  course: string; // ex: 'Sistemas de Informação', 'Ciência da Computação', 'Engenharia de Software', etc.
  year?: number;
  moduleNumber?: number | string;
  adherenceLevel: AdherenceLevel;
  adherenceJustification: string;
  pros: string[]; // Pontos positivos / o que o parceiro e o projeto ganham
  cons: string[]; // Pontos de atenção / o que fica de fora ou trade-offs
  scopeAdjustment?: string; // Como calibrar ou adaptar o escopo do parceiro para caber na ementa
  keyTechnologies?: string[];
  pdfUrl?: string; // Link direto para a ementa oficial em PDF no site do Inteli
  partnerPortalUrl?: string; // Link no portal de projetos do Inteli
}

export interface InitiativeMatch {
  id: string;
  title: string; // Título descritivo/intuitivo da iniciativa ou problemática do parceiro (ex: 'Plataforma de Governança de Dados e BI Operacional')
  challengeSummary: string; // Resumo analítico do desafio proposto pelo parceiro
  code?: string; // Código oficial do módulo principal (ex: 'SIMD7')
  controlCode?: string; // Código de controle geral (ex: 'Módulo 07_SI')
  quarter?: string; // Trimestre (ex: '3º TRI')
  recommendedMetaproject: string; // Nome oficial exato do metaprojeto (da matriz oficial do Inteli)
  matchedCourse: string;
  matchedModule: string;
  matchedYear?: number;
  matchJustification: string[];
  adherenceLevel: AdherenceLevel;
  adherenceJustification: string;
  potentialRisksOrGaps?: string[];
  keyTechnologies?: string[];
  scopeFitDurationWeeks?: number;
  pdfUrl?: string;
  partnerPortalUrl?: string;

  // Multi-possibilities (NotebookLM style)
  options?: ModuleOption[];
  decisionGuidance?: string; // Guia para a reunião com o parceiro: como escolher entre as opções
}

export interface MatchmakingResult {
  initiatives: InitiativeMatch[];
  coordinatorNextStep: string;
  rawMarkdownOutput: string;
  totalInitiatives: number;
  extractedFromFormat: 'Texto' | 'Planilha / Dados' | 'Áudio / Transcrição' | 'Documento / PDF' | 'Arquivo';
  partnerName?: string;
  processedAt: string;
}

export interface AudioRecordingState {
  isRecording: boolean;
  recordingTimeSeconds: number;
  audioBlobUrl: string | null;
  audioBase64: string | null;
  mimeType: string;
}

export interface RefinementMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
