import React, { useState, useEffect } from 'react';
import {
  X,
  History,
  Search,
  Download,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  Building,
  CheckCircle2,
  Filter,
  FileSpreadsheet,
  Layers,
  Sparkles
} from 'lucide-react';
import { SubmissionReceipt } from '../types.ts';

interface SubmissionsHistoryModalProps {
  onClose: () => void;
}

export const SubmissionsHistoryModal: React.FC<SubmissionsHistoryModalProps> = ({ onClose }) => {
  const [history, setHistory] = useState<SubmissionReceipt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedProtocol, setCopiedProtocol] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/submission-history');
      const data = await res.json();
      if (data.success && Array.isArray(data.history)) {
        setHistory(data.history);
      }
    } catch (e) {
      console.error('Erro ao buscar histórico:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHistory = history.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      !searchQuery ||
      item.protocol.toLowerCase().includes(q) ||
      item.initiativeTitle.toLowerCase().includes(q) ||
      item.moduleName.toLowerCase().includes(q) ||
      item.organizationName.toLowerCase().includes(q) ||
      item.proponentName.toLowerCase().includes(q)
    );
  });

  const handleCopyProtocol = (protocol: string) => {
    navigator.clipboard.writeText(protocol);
    setCopiedProtocol(protocol);
    setTimeout(() => setCopiedProtocol(null), 2000);
  };

  const handleExportAllHistory = () => {
    if (history.length === 0) return;

    const textContent = history
      .map(
        (r) => `[PROTOCOLO: ${r.protocol}]
Data/Hora: ${r.submittedAt}
Status: ${r.status}
Organização: ${r.organizationName}
Proponente: ${r.proponentName} (${r.proponentEmail} - ${r.proponentPhone})
Iniciativa: ${r.initiativeTitle}
Módulo: ${r.moduleName} (${r.moduleCode}) - ${r.course} - ${r.quarter || ''}
Portal: ${r.partnerPortalUrl}
--------------------------------------------------
Desafio Adequado:
${r.adaptedChallengeDescription}
--------------------------------------------------
Mitigação de Trade-offs:
${r.tradeoffMitigationNote}
==================================================`
      )
      .join('\n\n');

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Historico_Submissoes_Inteli_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#140e1f]/60 backdrop-blur-xs animate-fadeIn font-sans">
      <div className="bg-white border border-[#d8dce6] max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col text-[#2e2640]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e2e5ec] flex items-center justify-between bg-[#fafbfc]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#364f99]/10 text-[#364f99] flex items-center justify-center border border-[#364f99]/25">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#2e2640]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Histórico de Propostas Submetidas
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#89cea5]/25 text-[#066d73] border border-[#89cea5]/40 font-bold">
                  {history.length} Registro(s)
                </span>
              </div>
              <p className="text-xs text-[#555065]">
                Protocolos oficiais emitidos para triagem do Escritório de Projetos do Inteli.
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

        {/* Filter & Actions Bar */}
        <div className="px-6 py-3 border-b border-[#e2e5ec] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#6c657e] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por protocolo, empresa, módulo..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#d8dce6] bg-white focus:outline-none focus:border-[#ff4545]"
            />
          </div>

          {history.length > 0 && (
            <button
              type="button"
              onClick={handleExportAllHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-[#edeef4] text-[#2e2640] border border-[#d8dce6] transition shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-[#364f99]" />
              <span>Exportar Histórico (.txt)</span>
            </button>
          )}
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-[#6c657e] font-mono animate-pulse">
              Carregando histórico de submissões...
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-[#fafbfc] rounded-2xl border border-dashed border-[#d8dce6] p-8">
              <div className="w-12 h-12 rounded-full bg-[#364f99]/10 text-[#364f99] flex items-center justify-center mx-auto">
                <History className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#2e2640]">
                {history.length === 0 ? 'Nenhuma proposta submetida ainda nesta sessão' : 'Nenhum registro encontrado'}
              </h4>
              <p className="text-xs text-[#555065] max-w-sm mx-auto">
                {history.length === 0
                  ? 'Quando você classificar e submeter iniciativas, os comprovantes com número de protocolo serão arquivados aqui.'
                  : 'Tente alterar os termos da busca.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((item) => (
                <div
                  key={item.protocol}
                  className="bg-white border border-[#d8dce6] hover:border-[#364f99]/40 rounded-2xl p-4 shadow-xs transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-[#2e2640] bg-[#f8f9fc] px-2.5 py-1 rounded-lg border border-[#d8dce6]">
                        {item.protocol}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#89cea5]/20 text-[#066d73] border border-[#89cea5]/40 font-mono">
                        ✓ {item.status}
                      </span>
                      <span className="text-[11px] text-[#6c657e] font-mono">
                        {item.submittedAt}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyProtocol(item.protocol)}
                      className="inline-flex items-center gap-1 text-xs text-[#364f99] hover:text-[#ff4545] font-semibold self-start sm:self-auto"
                    >
                      {copiedProtocol === item.protocol ? (
                        <>
                          <Check className="w-3 h-3 text-[#066d73]" />
                          <span className="text-[#066d73]">Protocolo Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar Protocolo</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#6c657e] uppercase font-mono">
                        Iniciativa & Módulo Alvo:
                      </span>
                      <h5 className="font-bold text-[#2e2640]">
                        {item.initiativeTitle}
                      </h5>
                      <p className="text-[#364f99] font-mono text-[11px]">
                        {item.moduleCode} • {item.metaprojectName} ({item.course})
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#6c657e] uppercase font-mono">
                        Dados do Proponente:
                      </span>
                      <p className="text-[#2e2640] font-semibold">
                        {item.proponentName} ({item.proponentRole})
                      </p>
                      <p className="text-[#555065] text-[11px]">
                        {item.organizationName} • {item.proponentEmail} • {item.proponentPhone}
                      </p>
                    </div>
                  </div>

                  {item.tradeoffMitigationNote && (
                    <div className="bg-[#f8f9fc] p-2.5 rounded-xl border border-[#e2e5ec] text-[11px] text-[#3c364c]">
                      <span className="font-semibold text-[#066d73]">Mitigação de Trade-offs: </span>
                      {item.tradeoffMitigationNote}
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#e2e5ec] flex items-center justify-between text-xs">
                    <a
                      href={item.partnerPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#ff4545] hover:underline font-mono"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Ver no Portal Inteli ({item.moduleCode})</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#e2e5ec] bg-[#fafbfc] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-[#edeef4] text-[#2e2640] border border-[#d8dce6] transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
