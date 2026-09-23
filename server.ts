import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import * as XLSX from 'xlsx';
import { getModulesContextText, INTELI_MODULES_CATALOG } from './src/data/inteliKnowledgeBase.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Enable large JSON bodies for base64 documents and audio
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize GoogleGenAI SDK with required user-agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Utility helpers for error extraction and resilient Gemini calling
function extractErrorMessage(error: any): string {
  if (!error) return 'Erro desconhecido no processamento.';
  const raw = error?.message || String(error);
  try {
    const parsed = typeof raw === 'string' && (raw.startsWith('{') || raw.includes('{"error"')) ? JSON.parse(raw) : null;
    if (parsed?.error?.message) {
      return parsed.error.message;
    }
  } catch {
    // If not valid JSON, check regex match
    const match = raw.match(/"message":\s*"([^"]+)"/);
    if (match && match[1]) return match[1];
  }
  return raw;
}

function isRetryableDemandError(error: any): boolean {
  const msg = extractErrorMessage(error).toLowerCase();
  const status = String(error?.status || error?.code || '').toLowerCase();
  return (
    msg.includes('high demand') ||
    msg.includes('demand') ||
    msg.includes('spikes in demand') ||
    msg.includes('unavailable') ||
    msg.includes('resource_exhausted') ||
    msg.includes('rate limit') ||
    msg.includes('503') ||
    msg.includes('429') ||
    msg.includes('timeout') ||
    status.includes('503') ||
    status.includes('unavailable')
  );
}

// Helper to enforce a generous timeout per API attempt so requests never hang indefinitely
function withTimeout<T>(promise: Promise<T>, ms: number, errorMsg: string): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timer = setTimeout(() => reject(new Error(errorMsg)), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

// Helper to find exact official module in INTELI_MODULES_CATALOG
function findModuleInCatalog(
  query: string | undefined,
  course?: string
): typeof INTELI_MODULES_CATALOG[0] | undefined {
  if (!query) return undefined;
  const q = query.trim().toLowerCase();

  // 1. Direct match by code (e.g. "SIMD7", "1AMD2", "ESMD5", "CCMD11")
  const byCode = INTELI_MODULES_CATALOG.find(
    (m) => m.code.toLowerCase() === q || q.startsWith(m.code.toLowerCase()) || q.includes(m.code.toLowerCase())
  );
  if (byCode) return byCode;

  // 2. Direct match by control code (e.g. "Módulo 07_SI", "Módulo 7 SI", "Módulo 01_IN")
  const normalizedQuery = q.replace(/[^a-z0-9]/gi, '');
  const byControl = INTELI_MODULES_CATALOG.find((m) => {
    const normCtrl = m.controlCode.toLowerCase().replace(/[^a-z0-9]/gi, '');
    return normalizedQuery.includes(normCtrl) || normCtrl.includes(normalizedQuery);
  });
  if (byControl) return byControl;

  // 3. Match by canonical metaproject name (e.g. "Sistemas de Gestão e Governança Empresarial")
  const byName = INTELI_MODULES_CATALOG.find((m) => {
    const nameNorm = m.metaprojectName.toLowerCase();
    return q.includes(nameNorm) || nameNorm.includes(q);
  });
  if (byName) return byName;

  // 4. Match by module number + course
  const numMatch = q.match(/\b(1[0-1]|[1-9])\b/);
  if (numMatch) {
    const modNum = parseInt(numMatch[1], 10);
    const byCourse = INTELI_MODULES_CATALOG.find((m) => {
      if (m.moduleNumber !== modNum) return false;
      if (!course) return true;
      const cNorm = course.toLowerCase();
      const mNorm = m.course.toLowerCase();
      return (
        cNorm.includes(mNorm) ||
        mNorm.includes(cNorm) ||
        (cNorm.includes('software') && mNorm.includes('software')) ||
        (cNorm.includes('ciência') && mNorm.includes('ciência')) ||
        (cNorm.includes('informação') && mNorm.includes('informação')) ||
        (cNorm.includes('adm') && mNorm.includes('adm')) ||
        (cNorm.includes('computação') && mNorm.includes('computação'))
      );
    });
    if (byCourse) return byCourse;
  }

  return undefined;
}

// Resilient Gemini generateContent caller with generous timeout, exponential backoff and fallback models
async function generateContentWithResilience(
  contents: any,
  config: any,
  preferredModel: string = 'gemini-2.5-flash'
) {
  // Prioritize high-performance models with massive context and ultra-fast generation
  const candidateModels = [
    preferredModel,
    'gemini-2.5-flash',
    'gemini-flash-latest',
    'gemini-3.8-flash',
  ];
  const uniqueModels = Array.from(new Set(candidateModels));

  let lastError: any = null;

  for (const model of uniqueModels) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[Gemini] Executando chamada com modelo '${model}' (tentativa ${attempt}/2)...`);
        // Enforce 60s timeout per call so deep multi-initiative analyses have ample time
        const response = await withTimeout(
          ai.models.generateContent({
            model,
            contents,
            config,
          }),
          60000,
          `Tempo limite de 60s excedido no modelo '${model}'`
        );
        return response;
      } catch (err: any) {
        lastError = err;
        const msg = extractErrorMessage(err);
        console.warn(`[Gemini] Alerta com modelo '${model}' (tentativa ${attempt}):`, msg);

        if (isRetryableDemandError(err) && attempt < 2) {
          const delay = attempt * 1200;
          console.log(`[Gemini] Aguardando ${delay}ms antes de tentar novamente...`);
          await new Promise((res) => setTimeout(res, delay));
          continue;
        }

        // If not retryable or timed out, proceed immediately to the next model in the cascade
        break;
      }
    }
  }

  throw lastError;
}

// GET /api/catalog - Returns official Inteli Metaproject catalog
app.get('/api/catalog', (_req, res) => {
  res.json({
    success: true,
    modules: INTELI_MODULES_CATALOG,
  });
});

// POST /api/transcribe - Transcribes audio using gemini-3.5-transcribe with resilience
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: 'Nenhum arquivo de áudio fornecido para transcrição.' });
    }

    const effectiveMimeType = mimeType || 'audio/webm';

    // Retry logic for audio transcription
    let response: any = null;
    let lastErr: any = null;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.5-transcribe',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: effectiveMimeType,
                  data: audioBase64,
                },
              },
              {
                text: 'Transcreva este áudio na íntegra em português do Brasil, identificando diferentes interlocutores e destacando os pontos e desafios discutidos.',
              },
            ],
          },
        });
        break;
      } catch (e: any) {
        lastErr = e;
        if (isRetryableDemandError(e) && attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          continue;
        }
        break;
      }
    }

    if (!response) {
      throw lastErr;
    }

    const transcript = response.text || '';
    return res.json({ success: true, transcript });
  } catch (error: any) {
    console.error('Erro na transcrição de áudio:', error);
    const friendly = isRetryableDemandError(error)
      ? 'O serviço de transcrição do Gemini está momentaneamente com alta demanda. Por favor, tente novamente.'
      : extractErrorMessage(error);
    return res.status(isRetryableDemandError(error) ? 503 : 500).json({
      error: friendly,
      isRetryable: isRetryableDemandError(error),
    });
  }
});

// POST /api/matchmake - Main multimodal matchmaking endpoint
app.post('/api/matchmake', async (req, res) => {
  try {
    const {
      inputContent,
      fileAttachment,
      audioAttachment,
      customModulesContext,
      formatType = 'Texto',
      partnerName,
    } = req.body;

    if (!inputContent && !fileAttachment && !audioAttachment) {
      return res.status(400).json({
        error: 'Por favor, forneça um texto, planilha, PDF ou áudio com as iniciativas do parceiro.',
      });
    }

    const knowledgeBaseText = customModulesContext || getModulesContextText();

    const systemInstruction = `Você é um Assistente Especialista de Coordenação de Projetos do INTELI (Instituto de Tecnologia e Liderança), operando em conjunto com o Escritório de Projetos (EP).
Sua missão é analisar desafios e iniciativas propostas por empresas parceiras (em texto, áudio transcrito, PDFs ou planilhas) e combiná-las (fazer matchmaking) com os módulos e metaprojetos dos cursos de graduação do Inteli.
Sua base de conhecimento (ementas e metaprojetos oficiais, inventário de hardware e diretrizes de governança do EP) está anexada abaixo. NUNCA invente um metaprojeto que não esteja nesta base de conhecimento.

# BASE DE CONHECIMENTO OFICIAL DO INTELI (EMENTAS, REGRAS DE GOVERNANÇA E HARDWARE):
${knowledgeBaseText}

# REGRAS DE OURO DE POSICIONAMENTO E GOVERNANÇA DO ESCRITÓRIO DE PROJETOS (EP):
1. **Postura Consultiva e Acadêmica (Proibido Tom Comercial Agressivo):**
   - NUNCA use termos de vendas como "cobertura de 100% das demandas em um único ano", "esteiras contínuas de contratação" ou "pacotes em lote".
   - Posicione as opções como "Janelas de Oportunidade por Trimestre Letivo" ou "Matriz de Possibilidades Temporais".
   - Aplique o **Princípio da Seleção Pontual**: Recomende ao parceiro a escolha de **1 projeto por ciclo letivo** para garantir profundidade acadêmica e qualidade nas entregas.
   - SEMPRE indique o trimestre letivo correspondente (**1º Tri, 2º Tri, 3º Tri ou 4º Tri**).

2. **Critérios Rígidos de Exclusão (Fronteiras Inegociáveis de Escopo):**
   - **Deployment em Produção Comercial:** PROIBIDO. Alunos não mantêm sistemas ao vivo nem prestam SLA pós-projeto.
   - **Instalação Física em Campo/Rua:** PROIBIDO. Sem instalação em postes, vias públicas, subestações ou áreas fabris de risco.
   - **Apps Mobile fora de módulos mobile:** PROIBIDO. Permitido apenas em módulos com foco mobile (ex: Módulo 6 de ES, Módulo 10 de EC ou Módulo 2 do 1º Ano).
   - **Gravação Direta em ERP/Banco de Produção:** PROIBIDO. Exigir ambientes de sandbox/staging ou dumps anonimizados.
   - **Treinamento de LLMs do Zero ou Violação de LGPD:** PROIBIDO. Utilizar RAG ou fine-tuning em modelos pré-treinados, com datasets anonimizados.
   - **Publicação em Lojas de Apps:** Responsabilidade exclusiva da conta do parceiro.

3. **Diretrizes de Calibração e "Pivô Pedagógico":**
   - **Princípio do 1 Nó Físico + N Nós Simulados:** Em IoT/Cidades Inteligentes (ex: Módulo 9 de EC), desenvolve-se 1 nó físico em bancada com sensores reais e simula-se via código a carga de 100+ nós virtuais (Kafka/MQTT) para testar escalabilidade.
   - **Viabilidade de Hardware do Laboratório:** Considere o inventário real do Inteli:
     * Apple Mac mini M4 (compilação iOS e apps mobile no Módulo 6 de ES e Módulo 10 de EC).
     * Workstations Dell Precision 3660 com GPU RTX A4000 (treinamento de CNNs, visão e Big Data).
     * Workstation Dell Precision 5860 com GPU RTX A6000 48GB VRAM (GenAI/LLMs locais e Deep Learning denso).
     * Raspberry Pi 5 e microcontroladores ESP32 (IoT de bancada e Edge Computing).
     * Robótica de ponta (Braço Dobot Magician Lite, Robô Quadrúpede Unitree Go2 com LiDAR 4D, TurtleBot3 com ROS 2 e Drones DJI para inspeção aérea).
   - **Fatiamento em Janelas Sequenciais:** Para demandas corporativas gigantescas, fatie em trilhas por trimestres (Bancada -> Ingestão/Nuvem -> Interface Mobile -> Borda/IA).

# REGRA CRÍTICA DE NOMENCLATURA DE MÓDULOS E METAPROJETOS:
1. NUNCA invente, customize ou anexe texto adicional ao nome oficial de um módulo do Inteli.
2. Cada módulo DEVE ser identificado pelo seu CÓDIGO OFICIAL (ex: "SIMD7", "1AMD2", "ESMD5", "CCMD11") e pelo seu NOME CANÔNICO ORIGINAL da matriz oficial (ex: "Sistemas de Gestão e Governança Empresarial", "Aplicação Web", "Arquitetura e governança de dados alinhada à estratégia corporativa").
   - Exemplo ERRADO (PROIBIDO): "Módulo 7 SI - Modern Data Stack, Data Lakehouses e Business Intelligence Avançado"
   - Exemplo CORRETO: "SIMD7 - Sistemas de Gestão e Governança Empresarial" (Código: SIMD7 | Controle: Módulo 07_SI | Curso: Sistemas de Informação | Trimestre: 3º TRI)
3. O resumo ou título curto e intuitivo que você criar para sintetizar a problemática ou desafio do parceiro corporativo DEVE ser colocado EXCLUSIVAMENTE no campo "title" da iniciativa (ex: title: "Modern Data Stack e Business Intelligence Avançado").

# DIRETRIZ FUNDAMENTAL: NUNCA SEJA BINÁRIO (ESTILO NOTEBOOKLM MULTI-CENÁRIOS)
Desafios reais trazidos por parceiros corporativos raramente possuem uma única solução engessada. Frequentemente, a mesma iniciativa pode ser abordada sob diferentes ângulos pedagógicos (ex: um sistema pode ter um enfoque em Aplicação Web no 1AMD2, ou em Sistemas de Gestão no SIMD7, ou em Arquitetura de Dados no ESMD11).
Portanto, para CADA iniciativa identificada, você DEVE trazer as POSSIBILIDADES DE MÓDULOS (geralmente 2 ou 3 opções quando aplicável), indicando claramente:
- Opção Principal (mais recomendada ou com maior aderência inicial)
- Opções Alternativas Viáveis (ângulos alternativos de desenvolvimento e aprendizagem)
- Para CADA opção:
  * Pontos Positivos (Prós): O que o parceiro ganha, valor prático gerado, alinhamento técnico direto e uso de hardwares de laboratório aplicáveis.
  * Pontos Negativos / Trade-offs (Contras): O que precisará ficar de fora ou ser adaptado da demanda original, riscos ou tecnologias fora do escopo daquele módulo.
  * Ajuste de Escopo Recomendado: Como calibrar a demanda para encaixar nas 10 semanas do módulo (aplicando pivôs pedagógicos e critérios de exclusão).
- Guia de Decisão para a Reunião com o Parceiro: orientação prática para o coordenador conduzir a escolha junto à empresa.

# FORMATO DE SAÍDA EXIGIDO EM TEXTO
Para CADA iniciativa identificada, estruture a resposta de forma clara e visual:

## 🎯 Iniciativa: [Título Curto e Intuitivo do Desafio do Parceiro]
*   **Resumo do Desafio:** [Descrição em 2 ou 3 linhas do que o parceiro precisa]
*   **Metaprojeto Principal Recomendado:** [Código Oficial] - [Nome Canônico Original Oficial] (ex: SIMD7 - Sistemas de Gestão e Governança Empresarial)
*   **Curso/Trimestre:** [ex: Sistemas de Informação • 3º TRI]
*   **Grau de Aderência Principal:** [Alto / Médio / Baixo] - [Breve justificativa]

### 🧭 Possibilidades de Módulos & Análise de Trade-offs:

#### 🔹 Opção 1 (Recomendada): [Código] - [Nome Canônico Oficial]
*   **Código:** [ex: SIMD7]
*   **Curso/Trimestre:** [ex: Sistemas de Informação / 3º TRI]
*   **Grau de Aderência:** [Alto / Médio / Baixo]
*   ✅ **Pontos Positivos (Prós):**
    * [Ponto positivo 1]
    * [Ponto positivo 2]
*   ⚠️ **Pontos Negativos / Trade-offs (Contras):**
    * [Ponto negativo ou limitação de escopo 1]
    * [Ponto de atenção ou dependência 2]
*   🔧 **Ajuste de Escopo Sugerido:** [Como adaptar a demanda para caber em 10 semanas]

#### 🔸 Opção 2 (Alternativa Viável): [Código] - [Nome Canônico Oficial]
*   **Código:** [ex: ESMD11]
*   **Curso/Trimestre:** [ex: Engenharia de Software / 3º TRI]
*   **Grau de Aderência:** [Alto / Médio / Baixo]
*   ✅ **Pontos Positivos (Prós):**
    * [Ponto positivo 1]
*   ⚠️ **Pontos Negativos / Trade-offs (Contras):**
    * [Ponto negativo ou limitação de escopo 1]
*   🔧 **Ajuste de Escopo Sugerido:** [Como adaptar para este módulo]

💡 **Guia de Decisão para o Coordenador na Reunião:** [Ex: Se o parceiro priorizar X, direcionar para Opção 1; se a dor principal for Y, direcionar para Opção 2]

[Repetir para cada iniciativa encontrada]

---
💡 **Próximo Passo Geral Sugerido para o Coordenador:** [Ação geral imediata]

# BLOCO JSON ESTRUTURADO OBRIGATÓRIO (json:structured)
Ao final, inclua estritamente o bloco JSON para alimentar a interface do coordenador:
\`\`\`json:structured
{
  "totalInitiatives": number,
  "initiatives": [
    {
      "id": "init-1",
      "title": "Título intuitivo e curto da problemática do parceiro",
      "challengeSummary": "Descrição de 2 ou 3 linhas da demanda",
      "code": "Código oficial exato do módulo principal (ex: SIMD7)",
      "controlCode": "Código de controle (ex: Módulo 07_SI)",
      "quarter": "Trimestre (ex: 3º TRI)",
      "recommendedMetaproject": "Nome canônico oficial da matriz (ex: Sistemas de Gestão e Governança Empresarial)",
      "matchedCourse": "Nome oficial do curso",
      "matchedModule": "ex: Módulo 07_SI - Sistemas de Gestão e Governança Empresarial",
      "matchedYear": 2,
      "matchJustification": ["Ponto chave 1", "Ponto chave 2"],
      "adherenceLevel": "Alto" | "Médio" | "Baixo",
      "adherenceJustification": "Justificativa breve da opção principal",
      "keyTechnologies": ["tech1", "tech2"],
      "potentialRisksOrGaps": ["alerta de escopo principal"],
      "decisionGuidance": "Orientação comparativa para a reunião com o parceiro",
      "options": [
        {
          "id": "opt-1",
          "isPrimary": true,
          "label": "Opção 1 (Principal Recomendada)",
          "code": "SIMD7",
          "controlCode": "Módulo 07_SI",
          "quarter": "3º TRI",
          "moduleName": "Módulo 07_SI - Sistemas de Gestão e Governança Empresarial",
          "metaprojectName": "Sistemas de Gestão e Governança Empresarial",
          "course": "Sistemas de Informação",
          "year": 2,
          "moduleNumber": 7,
          "adherenceLevel": "Alto",
          "adherenceJustification": "Justificativa de aderência desta opção",
          "pros": [
            "Ponto positivo 1: foco em governança corporativa e processos",
            "Ponto positivo 2: integração de dados empresariais"
          ],
          "cons": [
            "Trade-off 1: escopo analítico focado em gestão e BPM",
            "Trade-off 2: não envolve desenvolvimento mobile"
          ],
          "scopeAdjustment": "Focar a entrega no mapeamento e integração de dados de gestão",
          "keyTechnologies": ["BPMN", "APIs Corporativas", "SQL"]
        }
      ]
    }
  ],
  "coordinatorNextStep": "Sugestão de próximo passo geral para o coordenador"
}
\`\`\``;

    const parts: any[] = [];

    // Smart handling of file attachments (Spreadsheets, PDFs, CSV, Text)
    if (fileAttachment?.base64) {
      const fileName = fileAttachment.fileName || '';
      const mime = fileAttachment.mimeType || '';
      const isExcel =
        fileName.match(/\.(xlsx|xls|ods)$/i) ||
        mime.includes('spreadsheet') ||
        mime.includes('excel') ||
        mime.includes('openxmlformats');
      const isTextOrCsv =
        fileName.match(/\.(csv|tsv|txt|md|json)$/i) ||
        mime.includes('text/') ||
        mime.includes('csv');

      if (isExcel) {
        try {
          const buffer = Buffer.from(fileAttachment.base64, 'base64');
          const workbook = XLSX.read(buffer, { type: 'buffer' });
          const sheetOutputs: string[] = [];
          for (const sheetName of workbook.SheetNames) {
            const sheet = workbook.Sheets[sheetName];
            const csv = XLSX.utils.sheet_to_csv(sheet);
            if (csv && csv.trim().length > 0) {
              sheetOutputs.push(`### Aba da Planilha: "${sheetName}"\n\`\`\`csv\n${csv.trim()}\n\`\`\``);
            }
          }
          const spreadsheetText = sheetOutputs.join('\n\n');
          parts.push({
            text: `[PLANILHA DO PARCEIRO ANEXADA: "${fileName}"]\nO parceiro enviou a seguinte planilha com demandas/iniciativas:\n\n${spreadsheetText}`,
          });
        } catch (excelErr) {
          console.warn('Erro ao processar planilha Excel:', excelErr);
          parts.push({
            text: `Arquivo de planilha recebido: ${fileName}.`,
          });
        }
      } else if (isTextOrCsv) {
        try {
          const decoded = Buffer.from(fileAttachment.base64, 'base64').toString('utf-8');
          parts.push({
            text: `[DOCUMENTO/CSV DO PARCEIRO: "${fileName}"]\n\n${decoded}`,
          });
        } catch {
          parts.push({
            text: `Arquivo de texto anexado: ${fileName}.`,
          });
        }
      } else if (mime === 'application/pdf' || fileName.endsWith('.pdf')) {
        parts.push({
          inlineData: {
            mimeType: 'application/pdf',
            data: fileAttachment.base64,
          },
        });
        parts.push({
          text: `Documento PDF anexado pelo parceiro: ${fileName}. Por favor, analise todas as páginas e extraia as iniciativas propostas.`,
        });
      } else {
        // Generic fallback inline data
        parts.push({
          inlineData: {
            mimeType: mime || 'application/octet-stream',
            data: fileAttachment.base64,
          },
        });
        parts.push({
          text: `Arquivo anexado pelo parceiro: ${fileName}.`,
        });
      }
    }

    // Add audio attachment if present
    if (audioAttachment?.base64 && audioAttachment?.mimeType) {
      parts.push({
        inlineData: {
          mimeType: audioAttachment.mimeType,
          data: audioAttachment.base64,
        },
      });
      parts.push({
        text: 'Gravação / áudio anexo enviado para análise e extração das iniciativas propostas pelo parceiro.',
      });
    }

    // Add user text briefing if present
    if (inputContent) {
      parts.push({
        text: `Conteúdo / Briefing enviado para análise de matchmaking com o Inteli:\n\n${inputContent}`,
      });
    } else if (parts.length === 0) {
      parts.push({
        text: 'Por favor, processe o conteúdo enviado, extraia todas as iniciativas distintas e realize o matchmaking conforme as diretrizes do Inteli.',
      });
    }

    const response = await generateContentWithResilience(
      { parts },
      {
        systemInstruction,
        temperature: 0.2, // Low temperature for factual precision and consistency with knowledge base
      },
      'gemini-2.5-flash'
    );

    const rawText = response.text || '';

    // Extract structured JSON block if present
    let structuredData: any = null;
    let cleanMarkdown = rawText;

    const jsonMatch = rawText.match(/```json:structured\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        structuredData = JSON.parse(jsonMatch[1]);
        cleanMarkdown = rawText.replace(/```json:structured[\s\S]*?```/, '').trim();
      } catch (err) {
        console.warn('Não foi possível parsear bloco JSON estruturado, usando fallback de extração:', err);
      }
    }

    // Fallback parser if structured JSON was omitted or malformed
    if (!structuredData || !structuredData.initiatives || structuredData.initiatives.length === 0) {
      structuredData = parseMarkdownInitiativesFallback(cleanMarkdown);
    }

    // Ensure every initiative has options (multi-possibilities) and decisionGuidance properly normalized
    const normalizedInitiatives = (structuredData.initiatives || []).map((init: any, idx: number) => {
      let rawOptions = Array.isArray(init.options) && init.options.length > 0 ? init.options : [];

      if (rawOptions.length === 0) {
        rawOptions = [
          {
            id: `opt-${idx + 1}-1`,
            isPrimary: true,
            label: 'Opção 1 (Principal Recomendada)',
            code: init.code,
            moduleName: init.matchedModule || init.recommendedMetaproject,
            metaprojectName: init.recommendedMetaproject,
            course: init.matchedCourse || 'Todos os Cursos',
            year: init.matchedYear || 1,
            moduleNumber: init.matchedModule || 1,
            adherenceLevel: init.adherenceLevel || 'Alto',
            adherenceJustification: init.adherenceJustification || 'Aderência aos critérios pedagógicos do módulo.',
            pros: Array.isArray(init.matchJustification) && init.matchJustification.length > 0
              ? init.matchJustification
              : ['Excelente aderência à ementa e aos objetivos do metaprojeto.'],
            cons: Array.isArray(init.potentialRisksOrGaps) && init.potentialRisksOrGaps.length > 0
              ? init.potentialRisksOrGaps
              : ['Necessidade de validar escopo detalhado nas primeiras sprints.'],
            scopeAdjustment: 'Focar os entregáveis no núcleo da dor do parceiro respeitando o ciclo de 10 semanas.',
            keyTechnologies: init.keyTechnologies || [],
          }
        ];
      }

      // Strictly normalize every option to canonical Inteli catalog
      const options = rawOptions.map((opt: any, optIdx: number) => {
        const catalogMatch = findModuleInCatalog(
          opt.code || opt.metaprojectName || opt.moduleName,
          opt.course
        );

        if (catalogMatch) {
          return {
            ...opt,
            id: opt.id || `opt-${idx + 1}-${optIdx + 1}`,
            isPrimary: opt.isPrimary !== undefined ? opt.isPrimary : optIdx === 0,
            label: opt.label || (optIdx === 0 ? 'Opção 1 (Principal Recomendada)' : `Opção ${optIdx + 1} (Alternativa Viável)`),
            code: catalogMatch.code,
            controlCode: catalogMatch.controlCode,
            quarter: catalogMatch.quarter,
            metaprojectName: catalogMatch.metaprojectName, // O NOME CANÔNICO ORIGINAL
            moduleName: `${catalogMatch.controlCode} - ${catalogMatch.metaprojectName}`,
            course: catalogMatch.course,
            year: catalogMatch.year,
            moduleNumber: catalogMatch.moduleNumber,
            pdfUrl: catalogMatch.pdfUrl,
            partnerPortalUrl: catalogMatch.partnerPortalUrl,
          };
        }

        return {
          ...opt,
          id: opt.id || `opt-${idx + 1}-${optIdx + 1}`,
          isPrimary: opt.isPrimary !== undefined ? opt.isPrimary : optIdx === 0,
        };
      });

      // Normalize the initiative's primary recommendation based on Option 1 / catalog
      const primaryOpt = options[0];
      const mainCatalog = findModuleInCatalog(
        init.code || init.recommendedMetaproject || init.matchedModule,
        init.matchedCourse
      ) || (primaryOpt ? findModuleInCatalog(primaryOpt.code || primaryOpt.metaprojectName, primaryOpt.course) : undefined);

      const code = mainCatalog?.code || primaryOpt?.code || init.code;
      const controlCode = mainCatalog?.controlCode || primaryOpt?.controlCode || init.controlCode;
      const quarter = mainCatalog?.quarter || primaryOpt?.quarter || init.quarter;
      const canonicalMetaproject = mainCatalog?.metaprojectName || primaryOpt?.metaprojectName || init.recommendedMetaproject;
      const course = mainCatalog?.course || primaryOpt?.course || init.matchedCourse;
      const matchedModule = mainCatalog ? `${mainCatalog.controlCode} - ${mainCatalog.metaprojectName}` : primaryOpt?.moduleName || init.matchedModule;
      const year = mainCatalog?.year || primaryOpt?.year || init.matchedYear;
      const pdfUrl = mainCatalog?.pdfUrl || primaryOpt?.pdfUrl;
      const partnerPortalUrl = mainCatalog?.partnerPortalUrl || primaryOpt?.partnerPortalUrl;

      return {
        ...init,
        id: init.id || `init-${idx + 1}`,
        code,
        controlCode,
        quarter,
        recommendedMetaproject: canonicalMetaproject,
        matchedCourse: course,
        matchedModule,
        matchedYear: year,
        pdfUrl,
        partnerPortalUrl,
        options,
        decisionGuidance: init.decisionGuidance || (
          options.length > 1
            ? `Se o parceiro priorizar a entrega de ${options[0].moduleName}, opte pela Opção 1; caso queira explorar ${options[1]?.moduleName || 'outra abordagem'}, avalie a Opção 2 na reunião.`
            : 'Alinhar com o parceiro os requisitos de acesso a dados e definição do Product Owner da empresa.'
        ),
      };
    });

    const result = {
      initiatives: normalizedInitiatives,
      coordinatorNextStep: structuredData.coordinatorNextStep || 'Agendar reunião com o parceiro para refinamento de escopo.',
      rawMarkdownOutput: cleanMarkdown,
      totalInitiatives: normalizedInitiatives.length,
      extractedFromFormat: formatType,
      partnerName: partnerName || 'Parceiro Corporativo',
      processedAt: new Date().toISOString(),
    };

    return res.json({ success: true, result });
  } catch (error: any) {
    console.error('Erro no matchmaking:', error);
    const friendlyMsg = isRetryableDemandError(error)
      ? 'O modelo de IA do Gemini está com alta demanda momentânea no Google Cloud. Tentamos a recuperação automática mas os servidores continuam temporariamente sobrecarregados. Por favor, clique em "Tentar Novamente" em alguns segundos.'
      : extractErrorMessage(error);

    return res.status(isRetryableDemandError(error) ? 503 : 500).json({
      success: false,
      error: friendlyMsg,
      isRetryable: isRetryableDemandError(error),
    });
  }
});

// POST /api/refine - Interactive scope refinement assistant for coordinator
app.post('/api/refine', async (req, res) => {
  try {
    const { initiative, question, conversationHistory = [] } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Pergunta de refinamento não fornecida.' });
    }

    const prompt = `Você é o Assistente Especialista de Coordenação de Projetos do INTELI (Escritório de Projetos - EP).
Diretrizes do EP:
- Postura consultiva de excelência acadêmica (MEC nota 5).
- Vocabulário correto: "Janelas de Oportunidade por Trimestre Letivo" (1º, 2º, 3º ou 4º Tri), "Matriz de Possibilidades Temporais".
- Respeitar os Critérios Rígidos de Exclusão (sem deployment final em produção, sem instalação em campo/rua, sem gravação direta em banco de produção, sem treinamento de LLM do zero, sem apps mobile fora de módulos mobile).
- Aplicar calibrações de escopo e pivôs pedagógicos (ex: 1 nó físico + N simulados; viabilidade dos equipamentos de bancada e laboratório como Workstations Dell RTX A4000/A6000, Mac mini M4, Raspberry Pi 5, Braço Dobot, Robô Unitree Go2, TurtleBot3, Drones DJI).
- Ciclos fixos de 10 semanas em 5 sprints quinzenais por squads de 6 a 8 alunos.

Contexto da Iniciativa analisada:
- Título: ${initiative?.title || 'Iniciativa'}
- Resumo do Desafio: ${initiative?.challengeSummary || ''}
- Metaprojeto / Módulo Principal: ${initiative?.recommendedMetaproject || ''}
- Grau de Aderência: ${initiative?.adherenceLevel || ''} - ${initiative?.adherenceJustification || ''}
${initiative?.decisionGuidance ? `- Guia de Decisão: ${initiative.decisionGuidance}` : ''}
${Array.isArray(initiative?.options) && initiative.options.length > 0 ? `- Possibilidades de Módulos e Trade-offs Analisados:\n${initiative.options.map((o: any) => `  * ${o.label} -> ${o.moduleName} (Aderência: ${o.adherenceLevel})\n    - Prós: ${o.pros?.join('; ') || 'N/A'}\n    - Contras / Trade-offs: ${o.cons?.join('; ') || 'N/A'}\n    - Ajuste de Escopo: ${o.scopeAdjustment || 'Padrão'}`).join('\n')}` : ''}

Pergunta / Solicitação do Coordenador:
"${question}"

Responda de maneira direta, prática e executiva, considerando o modelo acadêmico do Inteli (módulos de 10 semanas divididos em 5 sprints quinzenais, times de 6 a 8 alunos, papéis ágeis). Se solicitado rascunho de e-mail ao parceiro, entregue um texto cordial, consultivo e pronto para envio.`;

    const response = await generateContentWithResilience(
      prompt,
      {
        systemInstruction: 'Você é um coordenador de projetos sênior do Inteli, focado em alinhamento de escopo com parceiros e viabilidade acadêmica.',
        temperature: 0.3,
      },
      'gemini-2.5-flash'
    );

    const reply = response.text || '';
    return res.json({ success: true, reply });
  } catch (error: any) {
    console.error('Erro no refinamento:', error);
    const friendlyMsg = isRetryableDemandError(error)
      ? 'O modelo de IA está com alta demanda temporária. Por favor, tente enviar sua pergunta novamente em alguns segundos.'
      : extractErrorMessage(error);

    return res.status(isRetryableDemandError(error) ? 503 : 500).json({
      success: false,
      error: friendlyMsg,
      isRetryable: isRetryableDemandError(error),
    });
  }
});

// Fallback helper to parse markdown initiatives if JSON block was absent
function parseMarkdownInitiativesFallback(markdown: string) {
  const initiatives: any[] = [];
  const sections = markdown.split(/## 🎯 Iniciativa:/gi);

  let nextStep = 'Agendar reunião com o parceiro para refinamento do escopo e alinhamento dos dados de entrada.';
  const nextStepMatch = markdown.match(/💡 \*\*Próximo Passo Sugerido para o Coordenador:\*\*\s*([\s\S]*?)$/i);
  if (nextStepMatch && nextStepMatch[1]) {
    nextStep = nextStepMatch[1].trim();
  }

  for (let i = 1; i < sections.length; i++) {
    const sec = sections[i];
    const lines = sec.split('\n');
    const title = lines[0]?.trim() || `Iniciativa ${i}`;

    const summaryMatch = sec.match(/\*\s+\*\*Resumo do Desafio:\*\*\s*([\s\S]*?)(?=\n\*|\n---|\n##|$)/i);
    const metaMatch = sec.match(/\*\s+\*\*Metaprojeto\/Módulo Recomendado:\*\*\s*([\s\S]*?)(?=\n\*|\n---|\n##|$)/i);
    const justMatch = sec.match(/\*\s+\*\*Justificativa do Match:\*\*\s*([\s\S]*?)(?=\n\*|\n---|\n##|$)/i);
    const aderMatch = sec.match(/\*\s+\*\*Grau de Aderência:\*\*\s*([\s\S]*?)(?=\n\*|\n---|\n##|$)/i);

    let adherence: 'Alto' | 'Médio' | 'Baixo' = 'Alto';
    let adherenceText = aderMatch ? aderMatch[1].trim() : 'Alto';
    if (adherenceText.toLowerCase().includes('baixo')) adherence = 'Baixo';
    else if (adherenceText.toLowerCase().includes('médio') || adherenceText.toLowerCase().includes('medio')) adherence = 'Médio';

    const justifications: string[] = [];
    if (justMatch && justMatch[1]) {
      const jLines = justMatch[1].split('\n');
      for (const line of jLines) {
        const cleaned = line.replace(/^[-*•\s]+/, '').trim();
        if (cleaned) justifications.push(cleaned);
      }
    }
    if (justifications.length === 0 && justMatch) {
      justifications.push(justMatch[1].trim());
    }

    const recMeta = metaMatch ? metaMatch[1].trim() : 'Módulo Inteli';
    const catalogMatch = findModuleInCatalog(recMeta);

    initiatives.push({
      id: `init-${i}`,
      title,
      challengeSummary: summaryMatch ? summaryMatch[1].trim() : '',
      code: catalogMatch?.code,
      controlCode: catalogMatch?.controlCode,
      quarter: catalogMatch?.quarter,
      recommendedMetaproject: catalogMatch?.metaprojectName || recMeta,
      matchedCourse: catalogMatch?.course || (recMeta.includes('Software') ? 'Engenharia de Software' : recMeta.includes('Computação') ? 'Ciência da Computação' : 'Todos os Cursos'),
      matchedModule: catalogMatch ? `${catalogMatch.controlCode} - ${catalogMatch.metaprojectName}` : (recMeta.match(/Módulo \d+/i)?.[0] || 'Módulo Correspondente'),
      matchedYear: catalogMatch?.year || (recMeta.includes('Módulo 1') || recMeta.includes('Módulo 2') || recMeta.includes('Módulo 3') || recMeta.includes('Módulo 4') ? 1 : 2),
      pdfUrl: catalogMatch?.pdfUrl,
      partnerPortalUrl: catalogMatch?.partnerPortalUrl,
      matchJustification: justifications,
      adherenceLevel: adherence,
      adherenceJustification: adherenceText,
      keyTechnologies: catalogMatch?.techStack || [],
    });
  }

  return {
    initiatives,
    coordinatorNextStep: nextStep,
  };
}

// Development Vite Middleware vs Production Static Serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Inteli MatchMaker Server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error('Falha ao iniciar o servidor:', err);
    process.exit(1);
  });
}

export default app;
export { app };

