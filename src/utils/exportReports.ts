import * as XLSX from 'xlsx';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  BorderStyle,
  AlignmentType,
  WidthType,
  ShadingType,
} from 'docx';
import { MatchmakingResult, InitiativeMatch } from '../types.ts';

/**
 * Export complete portfolio and initiatives to Excel (.xlsx)
 */
export function exportToExcel(result: MatchmakingResult) {
  const partner = result.partnerName || 'Parceiro Corporativo';
  const total = result.initiatives.length;
  const directMatch = result.initiatives.filter(
    (i) => i.viabilityStatus === 'Aderente (Match Direto)' || i.adherenceLevel === 'Alto'
  ).length;
  const scopeAdjustment = result.initiatives.filter(
    (i) => i.viabilityStatus === 'Ajuste de Escopo Necessário' || i.adherenceLevel === 'Médio'
  ).length;
  const outOfScope = result.initiatives.filter(
    (i) => i.viabilityStatus === 'Fora de Escopo Computacional' || i.adherenceLevel === 'Baixo'
  ).length;

  const wb = XLSX.utils.book_new();

  // 1. Sheet: Resumo Executivo
  const summaryRows = [
    { Indicador: 'Parceiro Corporativo', Valor: partner },
    { Indicador: 'Data da Análise', Valor: new Date(result.processedAt).toLocaleString('pt-BR') },
    { Indicador: 'Total de Iniciativas Analisadas', Valor: total },
    { Indicador: 'Aderentes (Match Direto)', Valor: `${directMatch} (${Math.round((directMatch / (total || 1)) * 100)}%)` },
    { Indicador: 'Ajuste de Escopo Necessário', Valor: `${scopeAdjustment} (${Math.round((scopeAdjustment / (total || 1)) * 100)}%)` },
    { Indicador: 'Fora de Escopo Computacional', Valor: `${outOfScope} (${Math.round((outOfScope / (total || 1)) * 100)}%)` },
    { Indicador: 'Próximo Passo Recomendado', Valor: result.coordinatorNextStep },
  ];

  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
  // Auto-fit column widths
  wsSummary['!cols'] = [{ wch: 35 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumo Executivo');

  // 2. Sheet: Tabela Completa de Iniciativas
  const initiativesRows = result.initiatives.map((item, idx) => {
    const primaryOpt = item.options?.[0];
    const altOpt = item.options?.[1];

    const status = item.viabilityStatus || (
      item.adherenceLevel === 'Alto'
        ? 'Aderente (Match Direto)'
        : item.adherenceLevel === 'Médio'
        ? 'Ajuste de Escopo Necessário'
        : 'Fora de Escopo Computacional'
    );

    return {
      '#': idx + 1,
      'Iniciativa / Demanda': item.title,
      'Status de Enquadramento': status,
      'Grau de Aderência': item.adherenceLevel,
      'Metaprojeto Recomendado': item.recommendedMetaproject,
      'Código Módulo': item.code || primaryOpt?.code || '-',
      'Código Controle': item.controlCode || primaryOpt?.controlCode || '-',
      'Trimestre': item.quarter || primaryOpt?.quarter || '-',
      'Curso': item.matchedCourse,
      'Ano Letivo': item.matchedYear ? `${item.matchedYear}º Ano` : '-',
      'Resumo do Desafio': item.challengeSummary,
      'Prós / Valor Gerado': primaryOpt?.pros?.join('; ') || item.matchJustification?.join('; ') || '',
      'Trade-offs / Riscos': primaryOpt?.cons?.join('; ') || item.potentialRisksOrGaps?.join('; ') || '',
      'Ajuste de Escopo (10 Semanas)': primaryOpt?.scopeAdjustment || '',
      'Opção Alternativa (Módulo)': altOpt ? `${altOpt.code || ''} - ${altOpt.metaprojectName} (${altOpt.course})` : 'N/A',
      'Guia de Decisão na Reunião': item.decisionGuidance || '',
      'Link Ementa PDF': item.pdfUrl || primaryOpt?.pdfUrl || '',
    };
  });

  const wsInits = XLSX.utils.json_to_sheet(initiativesRows);
  wsInits['!cols'] = [
    { wch: 5 },
    { wch: 38 },
    { wch: 28 },
    { wch: 16 },
    { wch: 35 },
    { wch: 14 },
    { wch: 14 },
    { wch: 12 },
    { wch: 24 },
    { wch: 12 },
    { wch: 45 },
    { wch: 45 },
    { wch: 40 },
    { wch: 40 },
    { wch: 35 },
    { wch: 45 },
    { wch: 30 },
  ];
  XLSX.utils.book_append_sheet(wb, wsInits, 'Portfólio de Iniciativas');

  const fileName = `enquadramento-inteli-${partner.toLowerCase().replace(/[^a-z0-9]/g, '-')}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

/**
 * Export executive portfolio report to genuine Microsoft Word (.docx)
 */
export async function exportToWord(result: MatchmakingResult) {
  const partner = result.partnerName || 'Parceiro Corporativo';
  const total = result.initiatives.length;
  const directMatch = result.initiatives.filter(
    (i) => i.viabilityStatus === 'Aderente (Match Direto)' || i.adherenceLevel === 'Alto'
  ).length;
  const scopeAdjustment = result.initiatives.filter(
    (i) => i.viabilityStatus === 'Ajuste de Escopo Necessário' || i.adherenceLevel === 'Médio'
  ).length;
  const outOfScope = result.initiatives.filter(
    (i) => i.viabilityStatus === 'Fora de Escopo Computacional' || i.adherenceLevel === 'Baixo'
  ).length;

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Capa / Cabeçalho
          new Paragraph({
            text: 'INTELI - INSTITUTO DE TECNOLOGIA E LIDERANÇA',
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Dossiê Executivo de Enquadramento de Projetos',
                bold: true,
                size: 32,
                color: 'FF4545',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Parceiro: ', bold: true }),
              new TextRun({ text: partner, bold: true, color: '2E2640' }),
              new TextRun({ text: '  |  Data: ' }),
              new TextRun({ text: new Date(result.processedAt).toLocaleDateString('pt-BR') }),
              new TextRun({ text: '  |  Fonte: ' }),
              new TextRun({ text: result.extractedFromFormat }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),

          // Sumário Executivo
          new Paragraph({
            text: '1. Sumário Executivo do Portfólio',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            text: `Este documento consolida a análise técnica e pedagógica realizada pelo Escritório de Projetos do Inteli para o portfólio de demandas apresentado por ${partner}. Foram catalogadas ${total} iniciativas e cruzadas contra a matriz curricular oficial de metaprojetos de graduação.`,
            spacing: { after: 150 },
          }),

          // Tabela de Métricas Globais
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Métrica de Enquadramento', bold: true })] })],
                    shading: { fill: 'F4F5FA', type: ShadingType.CLEAR, color: 'auto' },
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Quantidade', bold: true })] })],
                    shading: { fill: 'F4F5FA', type: ShadingType.CLEAR, color: 'auto' },
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Taxa (%)', bold: true })] })],
                    shading: { fill: 'F4F5FA', type: ShadingType.CLEAR, color: 'auto' },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Aderente (Match Direto)')] }),
                  new TableCell({ children: [new Paragraph(String(directMatch))] }),
                  new TableCell({ children: [new Paragraph(`${Math.round((directMatch / (total || 1)) * 100)}%`)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Ajuste de Escopo Necessário')] }),
                  new TableCell({ children: [new Paragraph(String(scopeAdjustment))] }),
                  new TableCell({ children: [new Paragraph(`${Math.round((scopeAdjustment / (total || 1)) * 100)}%`)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Fora de Escopo Computacional')] }),
                  new TableCell({ children: [new Paragraph(String(outOfScope))] }),
                  new TableCell({ children: [new Paragraph(`${Math.round((outOfScope / (total || 1)) * 100)}%`)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Total Geral', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(total), bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '100%', bold: true })] })] }),
                ],
              }),
            ],
          }),

          // Diretrizes e Regras de Governança
          new Paragraph({
            text: '2. Fronteiras de Governança e Operação do Inteli',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Ciclos Acadêmicos: ', bold: true }),
              new TextRun({ text: 'Módulos trimestrais de 10 semanas (5 sprints quinzenais), com squads de 6 a 8 alunos dedicados integralmente sob mentoria docente.\n' }),
              new TextRun({ text: '• Sem SLA Comercial: ', bold: true }),
              new TextRun({ text: 'O projeto foca na validação conceitual, arquitetura e protótipo funcional em staging/sandbox. Alunos não fornecem suporte ou sustentação 24/7 em produção.\n' }),
              new TextRun({ text: '• Hardware Real de Bancada: ', bold: true }),
              new TextRun({ text: 'Projetos de IoT e Cidades Inteligentes adotam o princípio de 1 nó físico em bancada com sensores reais + simulação de carga de 100+ nós virtuais.' }),
            ],
            spacing: { after: 200 },
          }),

          // Próximos Passos Gerais
          new Paragraph({
            text: '3. Próximo Passo Recomendado para a Coordenação',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            text: result.coordinatorNextStep,
            spacing: { after: 250 },
          }),

          // Detalhamento Individualizado de Todas as Iniciativas
          new Paragraph({
            text: '4. Análise Individualizada de Todas as Iniciativas',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
          }),

          // Loop de iniciativas
          ...result.initiatives.flatMap((item, idx) => {
            const status = item.viabilityStatus || (
              item.adherenceLevel === 'Alto'
                ? 'Aderente (Match Direto)'
                : item.adherenceLevel === 'Médio'
                ? 'Ajuste de Escopo Necessário'
                : 'Fora de Escopo Computacional'
            );

            const primaryOpt = item.options?.[0];
            const altOpt = item.options?.[1];

            return [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Iniciativa #${idx + 1}: ${item.title}`,
                    bold: true,
                    size: 24,
                    color: '2E2640',
                  }),
                ],
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 80 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Status de Viabilidade: ', bold: true }),
                  new TextRun({ text: `${status}  |  ` }),
                  new TextRun({ text: 'Aderência: ', bold: true }),
                  new TextRun({ text: `${item.adherenceLevel}\n` }),
                  new TextRun({ text: 'Metaprojeto Principal: ', bold: true }),
                  new TextRun({
                    text: `${item.code || primaryOpt?.code || ''} - ${item.recommendedMetaproject} (${item.matchedCourse} • ${item.quarter || primaryOpt?.quarter || ''})\n`,
                  }),
                ],
                spacing: { after: 60 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Desafio do Parceiro: ', bold: true }),
                  new TextRun({ text: item.challengeSummary }),
                ],
                spacing: { after: 80 },
              }),

              // Prós e Contras
              new Paragraph({
                children: [
                  new TextRun({ text: '• Pontos Positivos (Prós): ', bold: true, color: '066D73' }),
                  new TextRun({ text: primaryOpt?.pros?.join('; ') || item.matchJustification?.join('; ') || 'Boa aderência pedagógica.' }),
                ],
                spacing: { after: 40 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: '• Trade-offs e Riscos (Contras): ', bold: true, color: 'E03232' }),
                  new TextRun({ text: primaryOpt?.cons?.join('; ') || item.potentialRisksOrGaps?.join('; ') || 'Alinhar requisitos de dados.' }),
                ],
                spacing: { after: 40 },
              }),

              // Ajuste de Escopo se houver
              ...(primaryOpt?.scopeAdjustment
                ? [
                    new Paragraph({
                      children: [
                        new TextRun({ text: '• Ajuste de Escopo para 10 Semanas: ', bold: true }),
                        new TextRun({ text: primaryOpt.scopeAdjustment }),
                      ],
                      spacing: { after: 40 },
                    }),
                  ]
                : []),

              // Opção Alternativa se houver
              ...(altOpt
                ? [
                    new Paragraph({
                      children: [
                        new TextRun({ text: '• Opção Alternativa Viável: ', bold: true, color: '364F99' }),
                        new TextRun({
                          text: `${altOpt.code || ''} - ${altOpt.metaprojectName} (${altOpt.course} • ${altOpt.quarter || ''})`,
                        }),
                      ],
                      spacing: { after: 40 },
                    }),
                  ]
                : []),

              // Guia de Decisão
              ...(item.decisionGuidance
                ? [
                    new Paragraph({
                      children: [
                        new TextRun({ text: '💡 Guia para a Reunião com o Parceiro: ', bold: true }),
                        new TextRun({ text: item.decisionGuidance }),
                      ],
                      spacing: { after: 120 },
                    }),
                  ]
                : [
                    new Paragraph({
                      text: '',
                      spacing: { after: 80 },
                    }),
                  ]),
            ];
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `dossie-executivo-inteli-${partner.toLowerCase().replace(/[^a-z0-9]/g, '-')}.docx`;
  link.click();
  URL.revokeObjectURL(url);
}
