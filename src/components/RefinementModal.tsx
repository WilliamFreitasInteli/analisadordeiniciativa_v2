import React, { useState } from 'react';
import { X, Send, Bot, User, Sparkles, Copy, Check, Mail, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { InitiativeMatch } from '../types.ts';
import { InteliSymbol } from './InteliBrand.tsx';

interface RefinementModalProps {
  initiative: InitiativeMatch | null;
  onClose: () => void;
}

export const RefinementModal: React.FC<RefinementModalProps> = ({
  initiative,
  onClose,
}) => {
  if (!initiative) return null;

  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    {
      sender: 'assistant',
      text: `Olá! Sou o Assistente de Coordenação de Projetos do Inteli. Como posso apoiar você no refinamento da iniciativa **"${initiative.title}"** e na negociação dos módulos com o parceiro corporativo? Você pode clicar em uma das ações rápidas abaixo ou digitar sua dúvida.`,
    },
  ]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const quickPrompts = [
    {
      label: '⚖️ Negociar Opções de Módulos & Trade-offs',
      prompt: 'Ajude-me a preparar os argumentos de negociação para a reunião com o parceiro. Compare as opções de módulos mapeadas para esta iniciativa, explicando quais perguntas devo fazer ao parceiro (ex: prontidão de dados, maturidade técnica, necessidade de hardware vs web) para bater o martelo na melhor opção.',
    },
    {
      label: '📧 Rascunho de E-mail para o Parceiro',
      prompt: 'Gere um e-mail cordial e profissional para a empresa parceira formalizando o aceite preliminar da iniciativa, apresentando as possibilidades de módulos mapeadas no Inteli e solicitando agendamento de reunião de alinhamento com lista de dados e acessos necessários.',
    },
    {
      label: '🗓️ Divisão das 5 Sprints (10 Semanas)',
      prompt: 'Faça um planejamento preliminar do projeto dividido nas 5 Sprints quinzenais do Inteli (Sprint 1 a Sprint 5), especificando os entregáveis esperados de cada sprint para o time de alunos.',
    },
    {
      label: '⚠️ Riscos de Escopo & Mitigações',
      prompt: 'Quais são os principais riscos de execução e gargalos de dados para esta iniciativa com o parceiro, e quais salvaguardas o coordenador deve acordar antes do início do módulo?',
    },
  ];

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || question;
    if (!promptToSend.trim() || loading) return;

    const userMessage = { sender: 'user' as const, text: promptToSend };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initiative,
          question: promptToSend,
          conversationHistory: messages,
        }),
      });

      const resText = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(resText);
      } catch {
        throw new Error('Serviço temporariamente indisponível.');
      }

      if (data?.reply) {
        setMessages((prev) => [...prev, { sender: 'assistant', text: data.reply }]);
      } else {
        throw new Error(data?.error || 'Erro na resposta');
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Desculpe, ocorreu uma falha ao processar o refinamento. Por favor, tente novamente.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1b1626]/85 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="bg-[#251f33] border border-[#3c3253] max-w-3xl w-full h-[85vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#1f192c] px-5 py-4 border-b border-[#3c3253] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ff4545]/15 text-[#ff4545] flex items-center justify-center border border-[#ff4545]/30">
              <InteliSymbol className="w-5 h-5" color="#ff4545" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  Refinamento de Escopo & Apoio ao Coordenador
                </h3>
                <span className="text-[10px] bg-[#90a5e5]/15 text-[#90a5e5] px-2 py-0.5 rounded font-mono border border-[#90a5e5]/30">
                  {initiative.matchedModule}
                </span>
              </div>
              <p className="text-xs text-[#b2b6bf] truncate max-w-md">
                Iniciativa: <span className="text-white font-medium">{initiative.title}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#2e2640] hover:bg-[#3c3253] text-[#b2b6bf] hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Prompts */}
        <div className="bg-[#1f192c]/60 p-3 border-b border-[#3c3253] overflow-x-auto flex gap-2">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              type="button"
              disabled={loading}
              onClick={() => handleSend(qp.prompt)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#2e2640] hover:bg-[#ff4545] hover:text-white text-[#e6eaeb] border border-[#3c3253] transition whitespace-nowrap shrink-0"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Chat History */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-[#ff4545]/15 text-[#ff4545] flex items-center justify-center shrink-0 border border-[#ff4545]/30 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed relative group ${
                  msg.sender === 'user'
                    ? 'bg-[#ff4545] text-white rounded-br-none shadow-md shadow-[#ff4545]/20'
                    : 'bg-[#1f192c] border border-[#3c3253] text-[#e6eaeb] rounded-bl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => handleCopyMessage(msg.text, idx)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded bg-[#2e2640] text-[#b2b6bf] hover:text-white transition"
                    title="Copiar texto"
                  >
                    {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-[#89cea5]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-[#ff4545] text-white flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-[#90a5e5]">
              <div className="w-7 h-7 rounded-lg bg-[#ff4545]/15 text-[#ff4545] flex items-center justify-center shrink-0 border border-[#ff4545]/30">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <span className="animate-pulse font-mono">Elaborando parecer com o modelo pedagógico do Inteli...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#1f192c] border-t border-[#3c3253] flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ex: Como posso propor um corte de escopo para encaixar no Módulo 2? Ou gerar e-mail para o parceiro..."
            className="flex-1 bg-[#251f33] border border-[#3c3253] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#b2b6bf]/50 focus:outline-none focus:ring-1 focus:ring-[#ff4545] focus:border-[#ff4545]"
          />

          <button
            type="button"
            disabled={!question.trim() || loading}
            onClick={() => handleSend()}
            className="px-5 py-2.5 rounded-xl bg-[#ff4545] hover:bg-[#e03232] disabled:bg-[#2e2640] disabled:text-[#b2b6bf]/40 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
