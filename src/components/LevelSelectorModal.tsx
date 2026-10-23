import React from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import { EducationLevel, EducationLevelId } from '../types';
import { EDUCATION_LEVELS } from '../data/educationLevels';

interface LevelSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevelId: EducationLevelId;
  onSelectLevel: (levelId: EducationLevelId) => void;
}

export const LevelSelectorModal: React.FC<LevelSelectorModalProps> = ({
  isOpen,
  onClose,
  currentLevelId,
  onSelectLevel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-blue-50/40">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>🎓</span> Pilih Jenjang Pendidikan
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sahabat Belajar AI akan menyesuaikan gaya bahasa, tingkat kesulitan, dan format penjelasan untukmu.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {EDUCATION_LEVELS.map((level) => {
              const isSelected = level.id === currentLevelId;
              return (
                <button
                  key={level.id}
                  onClick={() => {
                    onSelectLevel(level.id);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between group cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{level.icon}</span>
                      <span className="text-[11px] font-bold text-slate-400">
                        #{level.number}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                      {level.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {level.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {level.grades[0]}
                    </span>
                    {isSelected ? (
                      <span className="flex items-center gap-1 text-blue-600 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                      </span>
                    ) : (
                      <span className="text-slate-400 group-hover:text-blue-600 transition-colors flex items-center gap-0.5 text-[11px]">
                        Pilih <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>💡 Kamu dapat mengganti jenjang kapan saja tanpa kehilangan riwayat obrolan.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition-colors cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
