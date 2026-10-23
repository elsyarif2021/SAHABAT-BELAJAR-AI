import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  BookOpen,
  Award
} from 'lucide-react';
import { EducationLevel } from '../types';

interface StudyPlannerProps {
  currentLevel: EducationLevel;
  onAskTutor: (prompt: string) => void;
}

interface ScheduleItem {
  id: string;
  day: string;
  time: string;
  subject: string;
  topic: string;
  completed: boolean;
}

export const StudyPlanner: React.FC<StudyPlannerProps> = ({ currentLevel, onAskTutor }) => {
  // Pomodoro timer state
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'study' | 'break'>('study');

  const [activeDay, setActiveDay] = useState('Senin');

  // Schedule list
  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => [
    {
      id: '1',
      day: 'Senin',
      time: '19:00 - 19:45',
      subject: currentLevel.subjects[0] || 'Matematika',
      topic: 'Pemahaman Konsep & Bahas PR',
      completed: false,
    },
    {
      id: '2',
      day: 'Senin',
      time: '20:00 - 20:30',
      subject: currentLevel.subjects[1] || 'Bahasa Indonesia',
      topic: 'Membaca Teks & Latihan Soal',
      completed: false,
    },
    {
      id: '3',
      day: 'Selasa',
      time: '19:00 - 19:45',
      subject: currentLevel.subjects[2] || 'IPA / Sains',
      topic: 'Ringkasan Materi & Uji Mandiri',
      completed: false,
    },
    {
      id: '4',
      day: 'Rabu',
      time: '19:00 - 19:45',
      subject: currentLevel.subjects[0] || 'Matematika',
      topic: 'Latihan Kuis Interaktif',
      completed: false,
    },
    {
      id: '5',
      day: 'Kamis',
      time: '19:00 - 19:45',
      subject: currentLevel.subjects[3] || 'Bahasa Inggris',
      topic: 'Kosakata & Pemahaman Bacaan',
      completed: false,
    },
    {
      id: '6',
      day: 'Jumat',
      time: '19:00 - 20:00',
      subject: 'Review Mingguan',
      topic: 'Evaluasi & Refleksi Belajar',
      completed: false,
    },
  ]);

  // Form input for new item
  const [newTime, setNewTime] = useState('19:00 - 19:45');
  const [newSubject, setNewSubject] = useState(currentLevel.subjects[0] || '');
  const [newTopic, setNewTopic] = useState('');

  // Pomodoro effect
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsRunning(false);
      if (timerMode === 'study') {
        alert('Waktu belajar 25 menit selesai! Istirahat santai sejenak 5 menit ya 🌟');
        setTimerMode('break');
        setTimerSeconds(5 * 60);
      } else {
        alert('Waktu istirahat selesai! Semangat untuk sesi belajar berikutnya! 🚀');
        setTimerMode('study');
        setTimerSeconds(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds, timerMode]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimerSeconds(timerMode === 'study' ? 25 * 60 : 5 * 60);
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleComplete = (id: string) => {
    setSchedule((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    setSchedule((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newTopic.trim()) return;

    const newItem: ScheduleItem = {
      id: `sched-${Date.now()}`,
      day: activeDay,
      time: newTime,
      subject: newSubject,
      topic: newTopic,
      completed: false,
    };

    setSchedule((prev) => [...prev, newItem]);
    setNewTopic('');
  };

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const dayItems = schedule.filter((item) => item.day === activeDay);

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5 text-sky-200" /> Manajemen Waktu & Belajar Efektif
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Perencana Jadwal Belajar Mingguan
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl">
            Atur rutinitas belajar teratur, terhindar dari sistem kebut semalam, dengan bantuan teknik Pomodoro fokus 25 menit.
          </p>
        </div>

        {/* Mini Pomodoro Widget in Banner */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center shrink-0 min-w-[200px]">
          <div className="text-[11px] uppercase tracking-wider text-blue-200 font-bold">
            {timerMode === 'study' ? '⏱️ Sesi Belajar Fokus' : '☕ Waktu Istirahat'}
          </div>
          <div className="text-3xl font-extrabold tracking-wider my-1 font-mono">
            {formatTimer(timerSeconds)}
          </div>
          <div className="flex justify-center gap-2 mt-2">
            <button
              onClick={toggleTimer}
              className="px-3 py-1 bg-white text-blue-700 hover:bg-blue-50 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isRunning ? 'Jeda' : 'Mulai'}</span>
            </button>
            <button
              onClick={resetTimer}
              className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Days & Schedule List */}
        <div className="md:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          {/* Day Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-100">
            {days.map((day) => {
              const count = schedule.filter((s) => s.day === day).length;
              const isSelected = activeDay === day;
              return (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  <span>{day}</span>
                  {count > 0 && (
                    <span
                      className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-300 text-slate-700'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Schedule Checklist for selected day */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Agenda Belajar Hari {activeDay}:</span>
              <span className="text-slate-400 font-normal">
                {dayItems.filter((i) => i.completed).length} dari {dayItems.length} selesai
              </span>
            </div>

            {dayItems.length === 0 ? (
              <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl space-y-2">
                <p className="text-sm font-semibold">Belum ada jadwal untuk hari {activeDay}</p>
                <p className="text-xs">Gunakan formulir di bawah untuk menambahkan mata pelajaran.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {dayItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      item.completed
                        ? 'bg-emerald-50/60 border-emerald-200 text-slate-500'
                        : 'bg-slate-50/70 border-slate-200 text-slate-800 hover:bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleComplete(item.id)}
                        className="cursor-pointer text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        <CheckCircle2
                          className={`w-5 h-5 ${
                            item.completed ? 'text-emerald-600 fill-emerald-100' : ''
                          }`}
                        />
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${item.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {item.subject}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500 font-medium">
                            {item.time}
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 ${item.completed ? 'line-through text-slate-400' : 'text-slate-600'}`}>
                          {item.topic}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onAskTutor(`Bantu aku belajar materi "${item.topic}" untuk mata pelajaran "${item.subject}". Berikan ringkasan penting dan trik mengingatnya.`)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Bahas topik ini dengan AI"
                      >
                        <Sparkles className="w-3 h-3 text-blue-600" />
                        <span>Bahas</span>
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Item Form */}
          <form onSubmit={handleAddItem} className="pt-3 border-t border-slate-100 space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              + Tambah Sesi Belajar Baru ({activeDay})
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="Waktu (e.g. 19:00 - 19:45)"
                className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Mata Pelajaran"
                className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="Topik / Rencana PR"
                className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={!newSubject.trim() || !newTopic.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambahkan ke Jadwal</span>
            </button>
          </form>
        </div>

        {/* Study Tips Sidebar */}
        <div className="md:col-span-4 space-y-4">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 text-amber-900 space-y-3 shadow-xs">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <span>💡</span> Tips Belajar Efektif Sahabat AI
            </h3>
            <ul className="text-xs space-y-2 leading-relaxed text-amber-950/80">
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-amber-700">•</span>
                <span><strong>Fokus 25 Menit:</strong> Jangan belajar terlalu lama tanpa jeda. Otak manusia menyerap materi terbaik dalam rentang 25-30 menit.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-amber-700">•</span>
                <span><strong>Pahami Konsep, Bukan Menghafal:</strong> Cari tahu 'mengapa' rumusnya demikian, bukan sekadar menghafal langkahnya.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-amber-700">•</span>
                <span><strong>Tanya Saat Bingung:</strong> Jangan biarkan keraguan menumpuk. Gunakan Sahabat Belajar AI untuk menjelaskan bagian tersulit dengan santai.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-xs space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Target Harian</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Konsistensi 30 menit setiap hari jauh lebih berdampak daripada belajar 5 jam sehari sebelum ujian.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
