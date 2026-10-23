import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Info,
  Compass
} from 'lucide-react';
import { HIJAIYAH_LETTERS, DOA_HARIAN, TAJWID_RULES } from '../data/hijaiyahData';
import { HijaiyahItem, DoaItem } from '../types';

interface PojokTPQProps {
  onAskTutor: (prompt: string) => void;
}

export const PojokTPQ: React.FC<PojokTPQProps> = ({ onAskTutor }) => {
  const [activeTab, setActiveTab] = useState<'hijaiyah' | 'tajwid' | 'doa'>('hijaiyah');
  const [selectedLetter, setSelectedLetter] = useState<HijaiyahItem>(HIJAIYAH_LETTERS[0]);
  const [playingAudioTitle, setPlayingAudioTitle] = useState<string | null>(null);

  const handlePlayArabicSpeech = (text: string, title: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85;
      setPlayingAudioTitle(title);
      utterance.onend = () => setPlayingAudioTitle(null);
      utterance.onerror = () => setPlayingAudioTitle(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-2">
            <span>📖</span> Taman Pendidikan Al-Qur'an (TPQ)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Pojok Santri & Belajar Al-Qur'an
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl">
            Belajar Makharijul Huruf Hijaiyah, Kaidah Tajwid Dasar, Doa Sehari-hari, dan Adab Islami dengan teks Arab berharakat akurat.
          </p>

          {/* Sub Navigation */}
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('hijaiyah')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'hijaiyah'
                  ? 'bg-white text-emerald-800 shadow-md'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              Huruf Hijaiyah (28 Huruf)
            </button>
            <button
              onClick={() => setActiveTab('tajwid')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'tajwid'
                  ? 'bg-white text-emerald-800 shadow-md'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              Hukum Tajwid Dasar
            </button>
            <button
              onClick={() => setActiveTab('doa')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'doa'
                  ? 'bg-white text-emerald-800 shadow-md'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              Doa Sehari-Hari & Adab
            </button>
          </div>
        </div>
      </div>

      {/* 1. Tab Hijaiyah */}
      {activeTab === 'hijaiyah' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Letters Grid */}
          <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center justify-between">
              <span>Pilih Huruf Hijaiyah:</span>
              <span className="text-xs font-normal text-slate-400">Klik untuk melihat makhraj</span>
            </h2>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
              {HIJAIYAH_LETTERS.map((item, idx) => {
                const isSelected = selectedLetter.name === item.name;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedLetter(item)}
                    className={`aspect-square rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm ring-2 ring-emerald-500/20 scale-105'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <span className="font-arabic text-2xl font-bold leading-none mb-1">
                      {item.arabic}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 truncate max-w-full px-1">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Letter Detail Card */}
          <div className="md:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Detail Huruf Hijaiyah
                </span>
                <button
                  onClick={() => handlePlayArabicSpeech(selectedLetter.arabic, selectedLetter.name)}
                  className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                  title="Dengarkan pengucapan huruf"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Lafalkan</span>
                </button>
              </div>

              {/* Big Arabic Display */}
              <div className="my-6 text-center">
                <div className="font-arabic text-7xl font-bold text-emerald-800 leading-tight">
                  {selectedLetter.arabic}
                </div>
                <div className="text-xl font-bold text-slate-900 mt-2">{selectedLetter.name}</div>
                <div className="text-xs text-slate-400 font-mono">Transliterasi: {selectedLetter.latin}</div>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                <div>
                  <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Makharijul Huruf (Tempat Keluar Suara)
                  </div>
                  <div className="text-slate-600 mt-0.5 leading-relaxed">
                    {selectedLetter.makhraj}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Contoh Lafaz dalam Kata
                  </div>
                  <div className="font-arabic text-xl font-bold text-emerald-800 mt-1">
                    {selectedLetter.example}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onAskTutor(`Tolong jelaskan secara mendalam tentang huruf hijaiyah ${selectedLetter.name} (${selectedLetter.arabic}), sifat-sifat hurufnya, dan kesalahan umum saat melafalkannya.`)}
              className="mt-4 w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tanyakan Tajwid & Latihan Huruf Ini</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Tab Tajwid */}
      {activeTab === 'tajwid' && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Panduan Hukum Tajwid Dasar
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Pedoman membaca Al-Qur'an secara tartil, benar, dan sesuai kaidah tajwid yang disepakati para ulama qira'at.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TAJWID_RULES.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-emerald-300 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-emerald-800 text-sm">{rule.name}</h3>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Tajwid
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 leading-relaxed">
                    {rule.explanation}
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">Contoh:</span>
                    <span className="font-arabic text-base font-bold text-slate-800">
                      {rule.example}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Tab Doa */}
      {activeTab === 'doa' && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Doa Sehari-Hari & Adab Islami
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Hafalan doa harian dengan teks Arab berharakat, transliterasi Latin yang jelas, dan terjemahan bahasa Indonesia.
            </p>

            <div className="space-y-4">
              {DOA_HARIAN.map((doa, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      {doa.title}
                    </h3>
                    <button
                      onClick={() => handlePlayArabicSpeech(doa.arabic, doa.title)}
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                      title="Dengarkan lafaz doa"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Dengarkan</span>
                    </button>
                  </div>

                  {/* Arabic Text */}
                  <div className="font-arabic text-2xl sm:text-3xl text-emerald-950 font-bold leading-loose text-right pr-2">
                    {doa.arabic}
                  </div>

                  {/* Latin & Meaning */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1 text-xs">
                    <div className="text-emerald-800 font-medium italic">
                      "{doa.latin}"
                    </div>
                    <div className="text-slate-600 pt-1 border-t border-slate-100">
                      <strong>Artinya:</strong> {doa.meaning}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
