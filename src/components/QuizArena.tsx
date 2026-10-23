import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  Flame,
  Award,
  Lightbulb
} from 'lucide-react';
import { EducationLevel, QuizQuestion } from '../types';
import { EDUCATION_LEVELS } from '../data/educationLevels';

interface QuizArenaProps {
  currentLevel: EducationLevel;
}

export const QuizArena: React.FC<QuizArenaProps> = ({ currentLevel }) => {
  const [topic, setTopic] = useState('Pecahan & Operasi Hitung Campuran');
  const [questionCount, setQuestionCount] = useState(5);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleGenerateQuiz = async (customTopic?: string) => {
    const activeTopic = customTopic || topic;
    if (!activeTopic.trim()) return;

    setIsLoading(true);
    setQuizFinished(false);
    setSelectedAnswers({});
    setIsAnswerSubmitted({});
    setCurrentIndex(0);

    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: activeTopic,
          educationLevel: currentLevel.name,
          grade: currentLevel.grades[0] || 'Umum',
          count: questionCount,
        }),
      });

      if (!res.ok) throw new Error('Gagal memuat kuis');
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err: any) {
      alert(err?.message || 'Terjadi kesalahan saat membuat kuis.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isAnswerSubmitted[currentIndex]) return; // lock once submitted

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
    setIsAnswerSubmitted((prev) => ({
      ...prev,
      [currentIndex]: true,
    }));

    // Trigger small celebration if correct
    if (optionIndex === questions[currentIndex].correctAnswer) {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Finish quiz
      setQuizFinished(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const currentQ = questions[currentIndex];
  const totalScore = questions.reduce((acc, q, idx) => {
    return acc + (selectedAnswers[idx] === q.correctAnswer ? 100 / questions.length : 0);
  }, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-300" /> Arena Kuis Interaktif
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Uji Pemahaman & Latihan Soal
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-lg">
            Kuis otomatis bertenaga AI dengan pembahasan bertahap dan tips memahami konsep untuk jenjang {currentLevel.name}.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
          <span className="text-2xl">{currentLevel.icon}</span>
          <div className="text-left text-xs">
            <div className="opacity-80">Jenjang</div>
            <div className="font-bold">{currentLevel.name}</div>
          </div>
        </div>
      </div>

      {/* Generator Control Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-8">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Topik atau Materi Yang Ingin Dilatih
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Contoh: Fotosintesis, Hukum Newton, Aljabar, dll..."
              className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-4">
            <button
              onClick={() => handleGenerateQuiz()}
              disabled={isLoading || !topic.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Membuat Kuis...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Mulai Kuis Baru</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Topic Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-slate-400">Rekomendasi Topik:</span>
          {currentLevel.subjects.slice(0, 4).map((sub, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTopic(sub);
                handleGenerateQuiz(sub);
              }}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 transition-colors cursor-pointer"
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Quiz Area */}
      {questions.length > 0 && !quizFinished && currentQ && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
          {/* Progress Bar & Counter */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-3 border-b border-slate-100">
            <span className="flex items-center gap-1 text-blue-600">
              <Flame className="w-4 h-4 text-amber-500" /> Soal {currentIndex + 1} dari {questions.length}
            </span>
            <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, oIdx) => {
              const letter = String.fromCharCode(65 + oIdx);
              const isSelected = selectedAnswers[currentIndex] === oIdx;
              const hasSubmitted = isAnswerSubmitted[currentIndex];
              const isCorrect = oIdx === currentQ.correctAnswer;

              let btnStyle = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800';
              if (hasSubmitted) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                } else if (isSelected) {
                  btnStyle = 'border-rose-500 bg-rose-50 text-rose-900 line-through';
                } else {
                  btnStyle = 'border-slate-200 opacity-60 text-slate-600';
                }
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(oIdx)}
                  disabled={hasSubmitted}
                  className={`w-full p-3.5 rounded-xl border text-left text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                      {letter}
                    </span>
                    <span className="leading-relaxed">{opt}</span>
                  </div>

                  {hasSubmitted && (
                    <div className="shrink-0 ml-2">
                      {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box (Reveals after choosing) */}
          {isAnswerSubmitted[currentIndex] && (
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 text-xs sm:text-sm space-y-2 animate-in fade-in">
              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Pembahasan Jawaban:</span>
              </div>
              <p className="text-slate-700 leading-relaxed">{currentQ.explanation}</p>
              {currentQ.tip && (
                <div className="mt-2 pt-2 border-t border-blue-200 text-blue-800 font-medium">
                  💡 <strong>Tips Belajar:</strong> {currentQ.tip}
                </div>
              )}
            </div>
          )}

          {/* Navigation Button */}
          {isAnswerSubmitted[currentIndex] && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                <span>{currentIndex === questions.length - 1 ? 'Lihat Hasil Akhir' : 'Soal Berikutnya'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Finished Quiz Screen */}
      {quizFinished && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-md space-y-5 animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-full bg-amber-50 border-4 border-amber-300 flex items-center justify-center mx-auto text-4xl shadow-inner">
            🏆
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">Kuis Selesai! Kerja Bagus!</h2>
            <p className="text-slate-500 text-sm mt-1">
              Kamu telah menyelesaikan {questions.length} soal latihan dengan sungguh-sungguh.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-sm mx-auto">
            <div className="text-xs uppercase font-bold text-slate-400">Skor Akhirmu</div>
            <div className="text-4xl font-extrabold text-blue-600 mt-1">
              {Math.round(totalScore)} / 100
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Benar: {Object.entries(selectedAnswers).filter(([idx, ans]) => ans === questions[parseInt(idx)].correctAnswer).length} dari {questions.length} soal
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-3">
            <button
              onClick={() => handleGenerateQuiz()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Coba Topik Ini Lagi</span>
            </button>
          </div>
        </div>
      )}

      {/* Initial Empty State */}
      {questions.length === 0 && !isLoading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 space-y-3 shadow-xs">
          <div className="text-5xl">🎯</div>
          <h3 className="font-bold text-slate-700 text-base">Siap Menguji Pemahamanmu?</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Ketik materi pelajaran yang sedang kamu pelajari dan klik tombol <strong>Mulai Kuis Baru</strong> di atas untuk mendapatkan soal latihan beserta pembahasannya.
          </p>
        </div>
      )}
    </div>
  );
};
