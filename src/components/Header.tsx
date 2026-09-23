import React from 'react';
import { Sparkles, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { InteliLogo } from './InteliBrand.tsx';

interface HeaderProps {
  activeTab: 'matchmaking' | 'catalog' | 'history';
  setActiveTab: (tab: 'matchmaking' | 'catalog' | 'history') => void;
  modulesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  modulesCount,
}) => {
  return (
    <header className="border-b border-[#3c3253] bg-[#251f33]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Official Inteli Brand & App Identifier */}
          <div className="flex items-center gap-4">
            <InteliLogo theme="dark" showSignature={true} size="md" />

            <div className="hidden md:flex flex-col border-l border-[#3c3253] pl-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-white font-sans">
                  MatchMaker <span className="text-[#ff4545]">Projetos</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#ff4545]/15 text-[#ff4545] border border-[#ff4545]/30">
                  Coordenação
                </span>
              </div>
              <span className="text-[11px] text-[#b2b6bf]">
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
                  ? 'bg-[#ff4545] text-white shadow-md shadow-[#ff4545]/30'
                  : 'text-[#caced6] hover:text-white hover:bg-[#2e2640]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Studio Match</span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'catalog'
                  ? 'bg-[#ff4545] text-white shadow-md shadow-[#ff4545]/30'
                  : 'text-[#caced6] hover:text-white hover:bg-[#2e2640]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#90a5e5]" />
              <span>Ementas & Metaprojetos</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#1b1626] text-[#90a5e5] border border-[#3c3253]">
                {modulesCount}
              </span>
            </button>
          </nav>

          {/* Official Academic Status Badge */}
          <div className="hidden xl:flex items-center gap-2 text-xs text-[#b2b6bf] border-l border-[#3c3253] pl-4">
            <div className="flex items-center gap-1.5 text-[#89cea5] bg-[#89cea5]/10 px-3 py-1 rounded-full border border-[#89cea5]/25">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="font-semibold text-[11px]">Brandbook 2025 • Base Oficial</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
