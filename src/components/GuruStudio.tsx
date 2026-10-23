import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  FileText,
  Copy,
  Check,
  Printer,
  Sparkles,
  BookOpen,
  GraduationCap,
  ClipboardList,
  CheckSquare,
  RotateCcw,
  Download
} from 'lucide-react';

export const GuruStudio: React.FC = () => {
  const [activeRole, setActiveRole] = useState<'guru' | 'mahasiswa'>('guru');

  // Teacher Tool State
  const [teacherToolType, setTeacherToolType] = useState<'modul_ajar' | 'lkpd' | 'rubrik_asesmen' | 'soal_kisi_kisi'>('modul_ajar');
  const [curriculum, setCurriculum] = useState('Kurikulum Merdeka');
  const [subject, setSubject] = useState('Ilmu Pengetahuan Alam (IPA)');
  const [grade, setGrade] = useState('Fase B / Kelas 4 SD');
  const [topic, setTopic] = useState('Siklus Hidup Tumbuhan dan Hewan di Sekitar Kita');
  const [duration, setDuration] = useState('2 x 35 Menit');

  // Academic / Student State
  const [academicTopic, setAcademicTopic] = useState('Pengaruh Model Pembelajaran Berbasis Proyek (PjBL) terhadap Keterampilan Berpikir Kritis Siswa');
  const [faculty, setFaculty] = useState('Fakultas Keguruan dan Ilmu Pendidikan (FKIP)');
  const [methodologyType, setMethodologyType] = useState<'Kuantitatif (Eksperimen Semu)' | 'Kualitatif (Fenomenologi/Studi Kasus)' | 'Research and Development (R&D)' | 'Mixed Methods'>('Kuantitatif (Eksperimen Semu)');
  const [taskType, setTaskType] = useState('Kerangka Bab 1 & Rumusan Masalah');

  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateTeacherTool = async () => {
    setIsLoading(true);
    setGeneratedResult(null);

    try {
      const res = await fetch('/api/generate-teaching-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: teacherToolType,
          subject,
          grade,
          topic,
          duration,
          targetCurriculum: curriculum,
        }),
      });

      if (!res.ok) throw new Error('Gagal menyusun perangkat ajar');
      const data = await res.json();
      setGeneratedResult(data.result);
    } catch (err: any) {
      alert(err?.message || 'Terjadi kesalahan saat menyusun dokumen');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAcademicHelper = async () => {
    setIsLoading(true);
    setGeneratedResult(null);

    try {
      const res = await fetch('/api/academic-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: academicTopic,
          faculty,
          methodologyType,
          taskType,
        }),
      });

      if (!res.ok) throw new Error('Gagal menyusun panduan riset akademik');
      const data = await res.json();
      setGeneratedResult(data.result);
    } catch (err: any) {
      alert(err?.message || 'Terjadi kesalahan saat memproses riset');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedResult) return;
    navigator.clipboard.writeText(generatedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Studio Perangkat Ajar & Akademik
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Perangkat Pembelajaran & Bimbingan Riset
          </h1>
          <p className="text-rose-100 text-sm mt-1 max-w-2xl leading-relaxed">
            Membantu guru menyusun Modul Ajar (Kurikulum Merdeka), LKPD, rubrik asesmen, dan membimbing mahasiswa dalam kerangka metodologi skripsi ilmiah yang kredibel.
          </p>
        </div>

        {/* Role Switcher Pill */}
        <div className="mt-5 flex gap-2 relative z-10">
          <button
            onClick={() => {
              setActiveRole('guru');
              setGeneratedResult(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeRole === 'guru'
                ? 'bg-white text-rose-700 shadow-md'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Ruang Guru / Pendidik</span>
          </button>
          <button
            onClick={() => {
              setActiveRole('mahasiswa');
              setGeneratedResult(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeRole === 'mahasiswa'
                ? 'bg-white text-purple-700 shadow-md'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Ruang Mahasiswa & Peneliti</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Controls Column */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          {activeRole === 'guru' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Jenis Dokumen Yang Ingin Dibuat
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'modul_ajar', label: 'Modul Ajar (RPP)', icon: '📋' },
                    { id: 'lkpd', label: 'LKPD Interaktif', icon: '📝' },
                    { id: 'rubrik_asesmen', label: 'Rubrik & Asesmen', icon: '📊' },
                    { id: 'soal_kisi_kisi', label: 'Bank Soal & Kisi-kisi', icon: '🎯' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setTeacherToolType(item.id as any)}
                      type="button"
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all flex items-center gap-2 cursor-pointer ${
                        teacherToolType === item.id
                          ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kurikulum</label>
                <select
                  value={curriculum}
                  onChange={(e) => setCurriculum(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Kurikulum Merdeka">Kurikulum Merdeka</option>
                  <option value="Kurikulum 2013 (K13 Revisi)">Kurikulum 2013 (K13)</option>
                  <option value="Kurikulum Madrasah (Kemenag)">Kurikulum Madrasah (Kemenag)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Misal: Matematika, IPA, IPAS, Bahasa Indonesia..."
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fase / Kelas</label>
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="Contoh: Fase B / Kelas 4 SD"
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Alokasi Waktu</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="2 x 35 Menit"
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Topik / Materi Pokok</label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  rows={2}
                  placeholder="Masukkan pokok bahasan atau materi pembelajaran..."
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500 resize-none"
                />
              </div>

              <button
                onClick={handleGenerateTeacherTool}
                disabled={isLoading || !topic.trim()}
                className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Menyusun Perangkat Ajar...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Susun Dokumen Pembelajaran</span>
                  </>
                )}
              </button>
            </>
          ) : (
            // Mahasiswa / Akademik
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fokus Tugas Akademik</label>
                <select
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Kerangka Bab 1 & Rumusan Masalah">Kerangka Bab 1 & Rumusan Masalah</option>
                  <option value="Kajian Teori & Matriks Sintesis Literatur">Kajian Teori & Matriks Sintesis Literatur</option>
                  <option value="Desain Metodologi Penelitian & Teknik Analisis Data">Desain Metodologi Penelitian & Analisis Data</option>
                  <option value="Struktur Keseluruhan Skripsi (Bab 1 s.d. 5)">Struktur Proposal / Skripsi Lengkap (Bab 1 - 5)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jurusan / Program Studi</label>
                <input
                  type="text"
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  placeholder="Contoh: Pendidikan Matematika, Teknik Informatika, Akuntansi..."
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pendekatan Metodologi</label>
                <select
                  value={methodologyType}
                  onChange={(e) => setMethodologyType(e.target.value as any)}
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Kuantitatif (Eksperimen Semu)">Kuantitatif (Eksperimen Semu / Survei)</option>
                  <option value="Kualitatif (Fenomenologi/Studi Kasus)">Kualitatif (Studi Kasus / Etnografi)</option>
                  <option value="Research and Development (R&D)">Research and Development (R&D / Model ADDIE)</option>
                  <option value="Mixed Methods">Metode Kombinasi (Mixed Methods)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Topik Penelitian / Rencana Judul</label>
                <textarea
                  value={academicTopic}
                  onChange={(e) => setAcademicTopic(e.target.value)}
                  rows={3}
                  placeholder="Masukkan topik atau ide judul penelitian..."
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-xs text-purple-900 leading-relaxed">
                💡 <strong>Etika Ilmiah AI:</strong> Sahabat Belajar AI menjunjung tinggi integritas akademik, tidak membuat data responden fiktif, kutipan palsu, dan mendorong orisinalitas risetmu.
              </div>

              <button
                onClick={handleGenerateAcademicHelper}
                disabled={isLoading || !academicTopic.trim()}
                className="w-full py-3 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm shadow-md shadow-purple-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Menganalisis Kerangka Akademik...</span>
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-4 h-4" />
                    <span>Susun Kerangka Penelitian</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {/* Generated Document Output Column */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-slate-800 text-sm sm:text-base">
                {activeRole === 'guru' ? 'Dokumen Perangkat Ajar Siap Pakai' : 'Kerangka Riset Akademik'}
              </h2>
            </div>

            {generatedResult && (
              <div className="flex items-center gap-2 no-print">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin' : 'Salin Semua'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / PDF</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto printable-area">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center animate-spin">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800">Sahabat Belajar sedang menyusun dokumen...</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Mengintegrasikan Capaian Pembelajaran, tujuan berdiferensiasi, profil pelajar Pancasila, dan kaidah kurikulum resmi.
                </p>
              </div>
            ) : generatedResult ? (
              <div className="prose prose-slate max-w-none text-sm leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {generatedResult}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 text-slate-400">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl">
                  {activeRole === 'guru' ? '📚' : '🎓'}
                </div>
                <h3 className="font-bold text-slate-700">Belum Ada Dokumen Yang Dibuat</h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  Isi formulir di sebelah kiri dan klik tombol untuk membuat Modul Ajar, LKPD, atau bimbingan kerangka riset skripsi.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
