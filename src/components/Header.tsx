import React from 'react';
import { Sparkles, BookOpen, History, LogOut, User as UserIcon } from 'lucide-react';
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
    <header className="border-b border-[#e2e5ec] bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Name - Clean & Uncluttered */}
          <div className="flex items-center gap-3">
            <InteliLogo theme="light" showSignature={false} size="sm" />
            <div className="h-4 w-px bg-[#d8dce6] hidden sm:block" />
            <span className="text-sm font-semibold tracking-tight text-[#2e2640] hidden sm:inline">
              MatchMaker <span className="font-normal text-[#6c657e]">/ Projetos</span>
            </span>
          </div>

          {/* Central Segmented Navigation - Clean UX, zero candy-pill noise */}
          <nav
            aria-label="Navegação Principal"
            className="flex items-center p-1 bg-[#f1f3f8] rounded-xl border border-[#e2e5ec]"
          >
            <button
              type="button"
              onClick={() => setActiveTab('matchmaking')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'matchmaking'
                  ? 'bg-white text-[#2e2640] shadow-xs'
                  : 'text-[#6c657e] hover:text-[#2e2640]'
              }`}
            >
              <Sparkles
                className={`w-3.5 h-3.5 ${
                  activeTab === 'matchmaking' ? 'text-[#ff4545]' : 'text-[#6c657e]'
                }`}
              />
              <span>Matchmaking</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-white text-[#2e2640] shadow-xs'
                  : 'text-[#6c657e] hover:text-[#2e2640]'
              }`}
            >
              <BookOpen
                className={`w-3.5 h-3.5 ${
                  activeTab === 'catalog' ? 'text-[#364f99]' : 'text-[#6c657e]'
                }`}
              />
              <span>Ementas</span>
              <span className="text-[10px] font-mono text-[#8a8497] font-normal">
                ({modulesCount})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-white text-[#2e2640] shadow-xs'
                  : 'text-[#6c657e] hover:text-[#2e2640]'
              }`}
            >
              <History
                className={`w-3.5 h-3.5 ${
                  activeTab === 'history' ? 'text-[#066d73]' : 'text-[#6c657e]'
                }`}
              />
              <span>Submissões</span>
              {submissionsCount > 0 && (
                <span className="text-[10px] font-mono font-bold text-[#066d73]">
                  ({submissionsCount})
                </span>
              )}
            </button>
          </nav>

          {/* User Profile & Sign Out - Understated & Elegant */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-medium text-[#2e2640] truncate max-w-[140px]">
                    {user.name}
                  </span>
                  <span className="text-[11px] text-[#8a8497] leading-none">
                    {user.role || 'Coordenação'}
                  </span>
                </div>

                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-[#d8dce6] shrink-0 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#edeef4] text-[#555065] flex items-center justify-center font-bold text-xs border border-[#d8dce6]">
                    <UserIcon className="w-3.5 h-3.5 text-[#6c657e]" />
                  </div>
                )}

                <button
                  type="button"
                  onClick={signOut}
                  className="p-1.5 rounded-lg text-[#6c657e] hover:text-[#e03232] hover:bg-rose-50 transition cursor-pointer ml-1"
                  title="Sair da conta"
                  aria-label="Sair da conta"
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
