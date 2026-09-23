import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { InteliLogo, InteliPillarsGraphic } from './InteliBrand.tsx';
import { useAuth } from '../context/AuthContext.tsx';

export const LoginScreen: React.FC = () => {
  const { signInWithGoogle, error, clearError, isLoading } = useAuth();
  const [emailInput, setEmailInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    await signInWithGoogle(emailInput.trim());
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col justify-between font-sans text-[#2e2640]">
      {/* Top Simple Bar */}
      <header className="border-b border-[#d8dce6] bg-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <InteliLogo theme="light" showSignature={true} size="md" />
          <div className="flex items-center gap-1.5 text-xs text-[#066d73] bg-[#89cea5]/20 px-3 py-1 rounded-full border border-[#89cea5]/40 font-mono">
            <Lock className="w-3.5 h-3.5 text-[#066d73]" />
            <span>Área de Acesso Restrito</span>
          </div>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-xl bg-white border border-[#d8dce6] rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
          {/* Subtle Background Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff4545]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#364f99]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative space-y-6">
            {/* Header / Title */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#ff4545]/10 text-[#e03232] border border-[#ff4545]/25 font-mono mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#ff4545]" />
                Autenticação Institucional Obrigatória
              </div>
              <h1
                className="text-2xl sm:text-3xl font-bold text-[#2e2640] tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                MatchMaker Projetos
              </h1>
              <p className="text-xs sm:text-sm text-[#555065] max-w-md mx-auto leading-relaxed">
                Portal de Coordenação de Projetos & Parcerias Corporativas do Instituto de Tecnologia e Liderança.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-start gap-3 animate-fadeIn">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-rose-900">Acesso Bloqueado</p>
                  <p className="text-rose-700 leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            {/* Institutional Sign-In Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#2e2640] mb-1.5 uppercase tracking-wide font-mono">
                  Seu E-mail Institucional Inteli:
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="seu.nome@inteli.edu.br"
                    value={emailInput}
                    onChange={(e) => {
                      clearError();
                      setEmailInput(e.target.value);
                    }}
                    className="w-full bg-[#f8f9fc] border border-[#d8dce6] rounded-2xl px-4 py-3 text-sm text-[#2e2640] placeholder-[#9ba0ab] focus:outline-none focus:ring-2 focus:ring-[#ff4545] focus:border-[#ff4545] transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !emailInput.trim()}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-[#2e2640] hover:bg-[#1f192c] text-white font-semibold text-sm transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {/* Google 'G' Icon */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>
                  {isLoading ? 'Autenticando credenciais...' : 'Validar & Acessar com Conta Inteli'}
                </span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              {/* Allowed Domains Badge */}
              <div className="bg-[#f8f9fc] border border-[#d8dce6] rounded-xl p-3.5 text-center space-y-1">
                <span className="text-[11px] font-bold text-[#555065] uppercase tracking-wider font-mono block">
                  Domínios Autorizados:
                </span>
                <div className="flex items-center justify-center gap-2 flex-wrap text-xs font-mono font-semibold">
                  <span className="px-2.5 py-0.5 rounded bg-white text-[#2e2640] border border-[#d8dce6]">
                    @inteli.edu.br
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-white text-[#364f99] border border-[#d8dce6]">
                    @prof.inteli.edu.br
                  </span>
                </div>
              </div>
            </form>

            {/* Security checklist footer */}
            <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-[#6c657e]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#066d73] shrink-0" />
                <span>Zero acesso externo</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#066d73] shrink-0" />
                <span>Proteção de dados dos parceiros</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#d8dce6] bg-white py-4 text-center text-xs text-[#6c657e]">
        <p>Inteli • Instituto de Tecnologia e Liderança • Brandbook 2025</p>
      </footer>
    </div>
  );
};
