import React from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  HelpCircle,
  Calendar,
  Layers,
  ChevronDown
} from 'lucide-react';
import { EducationLevel, EducationLevelId } from '../types';
import { EDUCATION_LEVELS } from '../data/educationLevels';

interface HeaderProps {
  activeTab: 'chat' | 'quiz' | 'studio' | 'tpq' | 'planner';
  setActiveTab: (tab: 'chat' | 'quiz' | 'studio' | 'tpq' | 'planner') => void;
  currentLevel: EducationLevel;
  onSelectLevel: (levelId: EducationLevelId) => void;
  onOpenLevelModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentLevel,
  onOpenLevelModal,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                  SAHABAT BELAJAR <span className="text-blue-600">AI</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Cerdas & Sabar
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block truncate max-w-xs md:max-w-md">
                Teman Belajar Cerdas, Sabar, dan Menyenangkan
              </p>
            </div>
          </div>

          {/* Education Level Switcher Button */}
          <button
            onClick={onOpenLevelModal}
            type="button"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-medium transition-all shadow-xs hover:shadow-md cursor-pointer ${currentLevel.accentBg} ${currentLevel.borderColor} ${currentLevel.color}`}
            title="Ganti Jenjang Pendidikan"
          >
            <span className="text-lg leading-none">{currentLevel.icon}</span>
            <div className="text-left hidden xs:block">
              <div className="text-[10px] uppercase font-bold tracking-wider opacity-75">Jenjang Aktif</div>
              <div className="font-bold text-xs truncate max-w-[120px] sm:max-w-[160px] text-slate-800">
                {currentLevel.name}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 opacity-70 shrink-0" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 -mb-px text-sm scrollbar-none border-t border-slate-100">
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="text-base">💬</span>
            <span>Tutor & PR</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="text-base">🎯</span>
            <span>Arena Kuis</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'studio'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="text-base">👨‍🏫</span>
            <span>Studio Guru & Riset</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tpq')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'tpq'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="text-base">📖</span>
            <span>Pojok TPQ & Qur'an</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('planner')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'planner'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Jadwal Belajar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
