import React from 'react';
import { Sparkles, BookOpen, Layers, CheckCircle2, LogOut, User, History } from 'lucide-react';
import { InteliLogo } from './InteliBrand.tsx';
import { useAuth } from '../context/AuthContext.tsx';

interface HeaderProps {
  activeTab: 'matchmaking' | 'catalog' | 'history';
  setActiveTab: (tab: 'matchmaking' | 'catalog' | 'history') => void;
  modulesCount: number;
  submissionsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  modulesCount,
  submissionsCount = 0,
}) => {
  const { user, signOut } = useAuth();
  return (
    <header className="border-b border-[#d8dce6] bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Official Inteli Brand & App Identifier */}
          <div className="flex items-center gap-4">
            <InteliLogo theme="light" showSignature={true} size="md" />

            <div className="hidden md:flex flex-col border-l border-[#d8dce6] pl-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-[#2e2640] font-sans">
                  MatchMaker <span className="text-[#ff4545]">Projetos</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#ff4545]/10 text-[#e03232] border border-[#ff4545]/25">
                  Coordenação
                </span>
              </div>
              <span className="text-[11px] text-[#6c657e]">
                Matchmaking Inteligente de Desafios & Metaprojetos
              </span>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('matchmaking')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'matchmaking'
                  ? 'bg-[#ff4545] text-white shadow-md shadow-[#ff4545]/20'
                  : 'text-[#555065] hover:text-[#2e2640] hover:bg-[#f0f2f8]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Studio Match</span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'catalog'
                  ? 'bg-[#ff4545] text-white shadow-md shadow-[#ff4545]/20'
                  : 'text-[#555065] hover:text-[#2e2640] hover:bg-[#f0f2f8]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#364f99]" />
              <span>Ementas & Metaprojetos</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#f0f2f8] text-[#364f99] border border-[#d8dce6]">
                {modulesCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-[#ff4545] text-white shadow-md shadow-[#ff4545]/20'
                  : 'text-[#555065] hover:text-[#2e2640] hover:bg-[#f0f2f8]'
              }`}
            >
              <History className="w-4 h-4 text-[#066d73]" />
              <span>Submissões</span>
              {submissionsCount > 0 && (
                <span className={`ml-0.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                  activeTab === 'history'
                    ? 'bg-white/25 text-white border-white/40'
                    : 'bg-[#89cea5]/30 text-[#066d73] border-[#89cea5]/40'
                }`}>
                  {submissionsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Authenticated User & Logout */}
          <div className="flex items-center gap-2.5 border-l border-[#d8dce6] pl-4">
            {user && (
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-bold text-[#2e2640] truncate max-w-[150px]">
                    {user.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#066d73] bg-[#89cea5]/20 px-1.5 py-0.2 rounded border border-[#89cea5]/30 self-end">
                    {user.domain}
                  </span>
                </div>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-[#d8dce6] shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#edeef4] text-[#2e2640] flex items-center justify-center font-bold text-xs border border-[#d8dce6]">
                    <User className="w-4 h-4 text-[#555065]" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={signOut}
                  className="p-1.5 rounded-lg text-[#555065] hover:text-[#e03232] hover:bg-rose-50 transition"
                  title="Sair da conta"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
