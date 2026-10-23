import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Send,
  Image as ImageIcon,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Printer,
  RotateCcw,
  Sparkles,
  Paperclip,
  Trash2,
  AlertCircle,
  BookOpen,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { EducationLevel, EducationLevelId, ChatMessage } from '../types';
import { EDUCATION_LEVELS } from '../data/educationLevels';

interface ChatTutorProps {
  currentLevel: EducationLevel;
  onSelectLevel: (levelId: EducationLevelId) => void;
  onOpenLevelModal: () => void;
  onNavigateToTab?: (tab: 'chat' | 'quiz' | 'studio' | 'tpq' | 'planner') => void;
}

const WELCOME_TEXT = `🎓 **HALO, SAHABAT BELAJAR!**

Selamat datang di **SAHABAT BELAJAR AI**.
Aku siap menjadi teman belajarmu kapan pun kamu membutuhkan bantuan.

**Pilih jenjang pendidikanmu:**
1. 🧸 TK/PAUD
2. 📖 TPQ
3. 📘 SD/MI
4. 📗 SMP/MTs
5. 📙 SMA/MA
6. 🛠️ SMK
7. 🎓 Perguruan Tinggi
8. 👨‍🏫 Guru/Pendidik
9. 👨‍👩‍👧 Orang Tua/Pendamping

Ketik nomor pilihanmu atau langsung kirim soal, foto, maupun tugas yang ingin dibahas.

**SAHABAT BELAJAR AI — Belajar Lebih Mudah, Prestasi Lebih Baik!**`;

export const ChatTutor: React.FC<ChatTutorProps> = ({
  currentLevel,
  onSelectLevel,
  onOpenLevelModal,
  onNavigateToTab,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-msg',
      role: 'model',
      text: WELCOME_TEXT,
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    data: string;
    mimeType: string;
    previewUrl: string;
  } | null>(null);

  // Subject and grade filter
  const [selectedGrade, setSelectedGrade] = useState<string>(currentLevel.grades[0] || '');
  const [selectedSubject, setSelectedSubject] = useState<string>(currentLevel.subjects[0] || '');

  // Audio / Speech State
  const [isListening, setIsListening] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update default grade/subject when level changes
  useEffect(() => {
    setSelectedGrade(currentLevel.grades[0] || '');
    setSelectedSubject(currentLevel.subjects[0] || '');
  }, [currentLevel]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Voice recognition support
  const handleToggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Fitur pengenalan suara tidak didukung di browser ini. Kamu bisa mengetik langsung.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  // Image Upload Handler
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran foto terlalu besar. Maksimal 10MB ya!');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setSelectedImage({
        data: result,
        mimeType: file.type || 'image/jpeg',
        previewUrl: result,
      });
    };
    reader.readAsDataURL(file);
  };

  // Audio TTS playback handler
  const handlePlayAudio = async (msgId: string, text: string) => {
    if (playingMessageId === msgId) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setPlayingMessageId(null);
      return;
    }

    setPlayingMessageId(msgId);

    // Clean markdown symbols for clearer pronunciation
    const cleanText = text
      .replace(/[#*`_~\[\]()]/g, ' ')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          if (audioRef.current) {
            audioRef.current.pause();
          }
          const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
          audioRef.current = audio;
          audio.onended = () => setPlayingMessageId(null);
          audio.onerror = () => fallbackBrowserSpeech(cleanText);
          await audio.play();
          return;
        }
      }
      fallbackBrowserSpeech(cleanText);
    } catch (e) {
      fallbackBrowserSpeech(cleanText);
    }
  };

  const fallbackBrowserSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 300));
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      utterance.onend = () => setPlayingMessageId(null);
      utterance.onerror = () => setPlayingMessageId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setPlayingMessageId(null);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetChat = () => {
    if (window.confirm('Mulai percakapan baru dengan Sahabat Belajar AI?')) {
      if (audioRef.current) audioRef.current.pause();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setPlayingMessageId(null);
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: 'model',
          text: WELCOME_TEXT,
          timestamp: new Date(),
        },
      ]);
      setSelectedImage(null);
      setInput('');
    }
  };

  // Check if user is picking a number (1-9) from main menu
  const checkLevelShortcut = (text: string): EducationLevelId | null => {
    const trimmed = text.trim();
    const mapNum: Record<string, EducationLevelId> = {
      '1': 'tk',
      '2': 'tpq',
      '3': 'sd',
      '4': 'smp',
      '5': 'sma',
      '6': 'smk',
      '7': 'perguruan_tinggi',
      '8': 'guru',
      '9': 'orang_tua',
    };
    return mapNum[trimmed] || null;
  };

  const handleSubmit = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();

    const userText = (customPrompt !== undefined ? customPrompt : input).trim();
    if (!userText && !selectedImage) return;

    // Check if user typed a single number 1-9 to select level
    const matchedLevel = checkLevelShortcut(userText);
    if (matchedLevel && !selectedImage) {
      onSelectLevel(matchedLevel);
      const targetLevel = EDUCATION_LEVELS.find((l) => l.id === matchedLevel);
      setInput('');

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        text: userText,
        timestamp: new Date(),
      };

      const introMsg: ChatMessage = {
        id: `model-${Date.now() + 1}`,
        role: 'model',
        text: `Hebat! Jenjang telah diatur ke **${targetLevel?.name} ${targetLevel?.icon}**.\n\n${targetLevel?.description}\n\nAda tugas, PR, konsep materi, atau soal yang ingin dibahas bersama? Silakan ketik soalmu atau unggah foto tugas ya! 📚✨`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg, introMsg]);
      return;
    }

    const currentImg = selectedImage;
    setSelectedImage(null);
    setInput('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: userText,
      timestamp: new Date(),
      image: currentImg || undefined,
      educationLevel: currentLevel.id,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Build history for backend
      // Keep only last 10 messages for context efficiency
      const apiMessages = newMessages.slice(-10).map((m) => ({
        role: m.role,
        text: m.text,
        image: m.image
          ? {
              data: m.image.data,
              mimeType: m.image.mimeType,
            }
          : undefined,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          educationLevel: currentLevel.id,
          grade: selectedGrade,
          subject: selectedSubject,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Gagal memproses jawaban');
      }

      const data = await res.json();
      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.reply,
        timestamp: new Date(),
        educationLevel: currentLevel.id,
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'model',
        text: `⚠️ **Maaf, terjadi kendala saat memproses jawaban:**\n${err?.message || 'Koneksi ke AI server bermasalah.'}\n\nSilakan coba tanyakan kembali atau periksa koneksi internetmu ya.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto px-2 sm:px-4 py-2">
      {/* Top Context Bar: Active Level, Grade, and Subject */}
      <div className="bg-white rounded-xl border border-slate-200 p-2.5 sm:p-3 mb-3 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${currentLevel.badgeBg} flex items-center gap-1.5 text-xs font-bold`}>
            <span>{currentLevel.icon}</span>
            <span>{currentLevel.name}</span>
          </div>

          {/* Grade select dropdown */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          >
            {currentLevel.grades.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          {/* Subject select dropdown */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium focus:outline-hidden focus:ring-1 focus:ring-blue-500 hidden sm:block max-w-[180px] truncate"
          >
            {currentLevel.subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={onOpenLevelModal}
            type="button"
            className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Ganti Jenjang
          </button>
          <button
            onClick={handlePrint}
            type="button"
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="Cetak Ringkasan"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetChat}
            type="button"
            className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="Mulai Percakapan Baru"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 overflow-y-auto p-4 sm:p-5 shadow-xs space-y-5 printable-area">
        {messages.map((msg, index) => {
          const isModel = msg.role === 'model';
          const isFirstWelcome = msg.id.startsWith('welcome-');

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isModel ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-4 sm:p-5 shadow-xs transition-all ${
                  isModel
                    ? 'bg-slate-50/90 border border-slate-200 text-slate-800'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/20'
                }`}
              >
                {/* User Image Preview */}
                {!isModel && msg.image && (
                  <div className="mb-3 rounded-lg overflow-hidden border border-white/20 max-w-sm">
                    <img
                      src={msg.image.previewUrl}
                      alt="Lampiran Soal"
                      className="w-full h-auto max-h-60 object-contain bg-slate-900/10"
                    />
                  </div>
                )}

                {/* Message Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200/50">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    {isModel ? (
                      <span className="flex items-center gap-1 text-blue-700">
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                        Sahabat Belajar AI
                      </span>
                    ) : (
                      <span className="text-blue-100">Kamu</span>
                    )}
                  </div>
                  <span className={`text-[10px] ${isModel ? 'text-slate-400' : 'text-blue-200'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {/* Message Content */}
                <div
                  className={`text-sm leading-relaxed space-y-3 break-words ${
                    isModel ? 'prose prose-slate max-w-none' : 'text-white'
                  }`}
                >
                  {isModel ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Custom table styling
                        table: ({ node, ...props }) => (
                          <div className="overflow-x-auto my-3 border rounded-lg border-slate-200">
                            <table className="min-w-full divide-y divide-slate-200 text-xs" {...props} />
                          </div>
                        ),
                        th: ({ node, ...props }) => (
                          <th className="bg-slate-100 px-3 py-2 text-left font-bold text-slate-700" {...props} />
                        ),
                        td: ({ node, ...props }) => (
                          <td className="px-3 py-2 border-t border-slate-100 text-slate-600" {...props} />
                        ),
                        code: ({ node, className, children, ...props }) => (
                          <code className="bg-slate-200/70 text-slate-800 px-1.5 py-0.5 rounded-sm font-mono text-xs" {...props}>
                            {children}
                          </code>
                        ),
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>

                {/* If first welcome message, render interactive level select buttons */}
                {isFirstWelcome && (
                  <div className="mt-4 pt-4 border-t border-slate-200/60 no-print">
                    <p className="text-xs font-bold text-slate-700 mb-2.5">
                      Pilih langsung jenjangmu di bawah ini:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {EDUCATION_LEVELS.map((lvl) => (
                        <button
                          key={lvl.id}
                          onClick={() => {
                            onSelectLevel(lvl.id);
                            handleSubmit(
                              undefined,
                              `Halo! Aku ingin belajar materi untuk jenjang ${lvl.name}. Bimbing aku ya!`
                            );
                          }}
                          className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold text-left transition-all hover:scale-[1.02] cursor-pointer ${lvl.accentBg} ${lvl.borderColor} ${lvl.color}`}
                        >
                          <span className="text-lg">{lvl.icon}</span>
                          <div className="truncate">
                            <div className="text-[10px] opacity-75 font-normal">#{lvl.number}</div>
                            <div className="truncate font-bold">{lvl.shortName}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Action Buttons (TTS, Copy) */}
                {isModel && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 no-print">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePlayAudio(msg.id, msg.text)}
                        type="button"
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors font-medium cursor-pointer ${
                          playingMessageId === msg.id
                            ? 'bg-amber-100 text-amber-800'
                            : 'hover:bg-slate-200/70 text-slate-600'
                        }`}
                        title="Dengarkan penjelasan suara"
                      >
                        {playingMessageId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 animate-pulse text-amber-600" />
                            <span>Berhenti</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Dengarkan</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        type="button"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-200/70 text-slate-600 transition-colors font-medium cursor-pointer"
                        title="Salin jawaban"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      Metode: Pemahaman • Konsep • Langkah • Tips
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-xs max-w-sm">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 animate-spin">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-700">
                    Sahabat Belajar sedang berpikir...
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Menganalisis soal secara runtut & sistematis
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel for Current Level */}
      <div className="py-2 overflow-x-auto flex items-center gap-1.5 scrollbar-none no-print">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pl-1">
          Ide Pertanyaan:
        </span>
        {currentLevel.samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSubmit(undefined, prompt)}
            className="text-xs px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/60 text-slate-700 transition-all whitespace-nowrap shadow-2xs shrink-0 cursor-pointer"
          >
            💡 {prompt}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 sm:p-3 shadow-sm no-print">
        {/* Selected Image Thumbnail Preview */}
        {selectedImage && (
          <div className="mb-2 p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={selectedImage.previewUrl}
                alt="Pratinjau Foto Soal"
                className="w-12 h-12 object-cover rounded-lg border border-slate-200"
              />
              <div>
                <div className="text-xs font-bold text-slate-800">Foto Soal / Tugas Terlampir</div>
                <div className="text-[11px] text-slate-500">
                  AI akan membaca gambar dan menjawab langkah demi langkah
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          {/* File Upload Hidden Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer shrink-0 ${
              selectedImage
                ? 'bg-blue-50 border-blue-400 text-blue-600'
                : 'border-slate-200 hover:bg-slate-100 text-slate-600'
            }`}
            title="Kirim Foto Soal / Dokumen PR"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleToggleVoiceInput}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer shrink-0 ${
              isListening
                ? 'bg-rose-50 border-rose-400 text-rose-600 animate-pulse'
                : 'border-slate-200 hover:bg-slate-100 text-slate-600'
            }`}
            title={isListening ? 'Mendengarkan...' : 'Bicara lewat suara'}
          >
            {isListening ? <Mic className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={`Tanyakan soal, PR, rumus, atau materi ${currentLevel.name}...`}
            rows={1}
            className="flex-1 max-h-32 min-h-[42px] py-2.5 px-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden bg-transparent resize-none"
          />

          <button
            type="submit"
            disabled={isLoading || (!input.trim() && !selectedImage)}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium transition-all shadow-sm shadow-blue-500/20 cursor-pointer disabled:cursor-not-allowed shrink-0"
            title="Kirim pertanyaan"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
