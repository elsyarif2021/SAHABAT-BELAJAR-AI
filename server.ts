import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const BASE_SYSTEM_INSTRUCTION = `
Kamu adalah SAHABAT BELAJAR AI, asisten dan tutor pendidikan berbasis kecerdasan buatan terdepan di Indonesia.
Tagline: "Teman Belajar Cerdas, Sabar, dan Menyenangkan"

MISI UTAMA:
1. Membantu pengguna memahami pelajaran secara mudah, bertahap, dan menyenangkan.
2. Membimbing penyelesaian PR, tugas, soal, dan latihan dengan mengutamakan pemahaman konsep (bukan sekadar menyalin jawaban).
3. Membantu guru menyiapkan perangkat pembelajaran (Modul Ajar Kurikulum Merdeka, RPP, LKPD, asesmen).
4. Membantu mahasiswa dalam kegiatan akademik, kerangka pemikiran, metodologi penelitian, dan skripsi/tesis tanpa plagiarisme atau referensi fiktif.
5. Mengembangkan kemampuan berpikir kritis, kreatif, dan mandiri bagi setiap jenjang pendidikan di Indonesia.
6. Mendorong penggunaan AI secara bijak, bertanggung jawab, dan beretika.

PEDOMAN KHUSUS SETIAP JENJANG PENDIDIKAN:
- TK/PAUD: Mengenal huruf, angka, warna, bentuk, hewan, dan lingkungan. Kalimat SANGAT SEDERHANA, penuh keceriaan, analogi bermain, bersahabat.
- TPQ (Taman Pendidikan Al-Qur'an): Pengenalan huruf hijaiyah, makharijul huruf, Iqra/Al-Qur'an, tajwid dasar (idgham, ikhfa, dll), doa harian, surah pendek. Selalu sertakan teks Arab yang berharakat rapi dan benar, transliterasi Latin yang jelas, dan terjemahan bahasa Indonesia. Adab dan akhlak terpuji.
- SD/MI (Kelas 1 - 6): Penjelasan sederhana, runtut, menggunakan contoh konkret kehidupan sehari-hari anak Indonesia, dorong rasa ingin tahu.
- SMP/MTs (Kelas 7 - 9): Penjelasan konsep yang sistematis, runtut, rumus matematika/IPA yang dipaparkan dengan makna fisisnya, latihan mandiri.
- SMA/MA (Kelas 10 - 12 & Kurikulum Merdeka Fase E/F): Pembelajaran mendalam, analitis, penalaran logis, strategi persiapan UTBK/SNBT dan ujian sekolah.
- SMK: Berorientasi kejuruan dan praktik nyata (Teknik, IT, Bisnis, Pariwisata, dll), simulasi dunia kerja, proyek nyata, persiapan PKL & industri.
- Perguruan Tinggi: Bahasa akademik formal dan terstruktur. Bimbingan kerangka teori, metodologi penelitian (kualitatif, kuantitatif, R&D), analisis data, dan sitasi kredibel. DILARANG membuat referensi, DOI, atau data penelitian palsu.
- Guru/Pendidik: Bantuan pembuatan Modul Ajar (Kurikulum Merdeka), Capaian Pembelajaran (CP), Tujuan Pembelajaran (TP), Alur Tujuan Pembelajaran (ATP), LKPD interaktif, rubrik asesmen formatif & sumatif, soal HOTS, dan program remedial/pengayaan.
- Orang Tua/Pendamping: Tips mendampingi anak belajar di rumah dengan sabar, cara menjelaskan konsep sulit dengan santai, stimulasi belajar positif tanpa stres.

FORMAT JAWABAN SAAT MEMBAHAS SOAL ATAU TUGAS:
Jika pengguna menanyakan pembahasan soal/latihan, utamakan format terstruktur berikut (sesuaikan keluwesannya dengan jenjang):
**A. Pemahaman Soal**
(Jelaskan apa saja yang diketahui dan apa yang ditanyakan secara gamblang)
**B. Konsep Dasar**
(Jelaskan rumus, aturan, hukum, atau definisi teori yang digunakan)
**C. Langkah Penyelesaian**
(Uraikan perhitungan atau proses pemecahan langkah demi langkah dengan jelas)
**D. Jawaban Akhir**
(Tuliskan kesimpulan dan hasil jawaban yang tepat)
**E. Tips Belajar**
(Berikan cara mudah mengingat konsep ini atau trik pemahaman cepat)

GAYA BAHASA:
- Bahasa Indonesia yang ramah, bersahabat, sabar, tidak menghakimi, positif, dan memotivasi.
- Gunakan emoji pendidikan secukupnya: 🎓, 📚, ✏️, 💡, 🌟, ✨.
- Jika pengguna melampirkan foto soal/dokumen, baca teks dan gambarnya secara teliti dan langsung berikan pembahasan lengkap.
`;

// Helper to build contents with optional multimodal image
function buildChatContents(messages: Array<{ role: 'user' | 'model'; text: string; image?: { data: string; mimeType: string } }>) {
  return messages.map((msg) => {
    if (msg.role === 'user' && msg.image && msg.image.data) {
      const parts: Array<{ text: string } | { inlineData: { data: string; mimeType: string } }> = [
        {
          inlineData: {
            data: msg.image.data.replace(/^data:[^;]+;base64,/, ''),
            mimeType: msg.image.mimeType || 'image/jpeg',
          },
        },
      ];
      if (msg.text) {
        parts.push({ text: msg.text });
      } else {
        parts.push({ text: 'Tolong baca dan bahas soal/materi yang ada pada foto ini secara lengkap dan jelas sesuai jenjang pendidikanku.' });
      }
      return {
        role: 'user',
        parts,
      };
    }

    return {
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    };
  });
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', name: 'SAHABAT BELAJAR AI' });
});

// 1. Chat Tutor Endpoint
app.post('/api/chat', async (req, res) => {
  const startTime = Date.now();
  try {
    const { messages, educationLevel, grade, subject } = req.body;
    console.log(`[API /api/chat] Starting request with ${messages?.length} messages for level: ${educationLevel}`);

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages are required' });
    }

    let dynamicSystemInstruction = BASE_SYSTEM_INSTRUCTION;
    if (educationLevel) {
      dynamicSystemInstruction += `\n\n[KONTEKS AKTIF PENGGUNA]:\n- Jenjang: ${educationLevel.toUpperCase()}\n- Tingkat/Kelas: ${grade || 'Umum'}\n- Mata Pelajaran/Fokus: ${subject || 'Umum'}\nSesuaikan gaya bahasa, kedalaman materi, dan contoh secara spesifik untuk jenjang ${educationLevel.toUpperCase()}.`;
    }

    const contents = buildChatContents(messages);
    console.log('[API /api/chat] Calling Gemini generateContent...');

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents as any,
      config: {
        systemInstruction: dynamicSystemInstruction,
        temperature: 0.7,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    const elapsed = Date.now() - startTime;
    console.log(`[API /api/chat] Completed in ${elapsed}ms`);

    const reply = response.text || 'Maaf, aku tidak dapat memproses jawaban saat ini. Coba tanyakan lagi ya!';
    return res.json({ reply });
  } catch (error: any) {
    console.error('[API /api/chat] Error after', Date.now() - startTime, 'ms:', error?.message);
    return res.status(500).json({
      error: error?.message || 'Terjadi kesalahan saat memproses jawaban dengan AI.',
    });
  }
});

// 2. Interactive Quiz Generator
app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { topic, educationLevel, grade, count = 5 } = req.body;

    const quizPrompt = `Buatkan kuis latihan interaktif sebanyak ${count} soal pilihan ganda untuk jenjang ${educationLevel || 'SD'} (${grade || 'Umum'}) dengan topik "${topic || 'Pengetahuan Umum'}".
Setiap soal harus memiliki 4 pilihan jawaban (A, B, C, D), kunci jawaban yang benar (indeks 0 untuk A, 1 untuk B, 2 untuk C, 3 untuk D), penjelasan jawaban yang mendidik, dan tips singkat.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: quizPrompt,
      config: {
        systemInstruction: BASE_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseSchema: {
          type: Type.ARRAY,
          description: 'Daftar soal kuis interaktif',
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING, description: 'Pertanyaan soal yang jelas' },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '4 pilihan jawaban',
              },
              correctAnswer: { type: Type.INTEGER, description: 'Indeks jawaban yang benar (0-3)' },
              explanation: { type: Type.STRING, description: 'Pembahasan lengkap mengapa jawaban tersebut benar' },
              tip: { type: Type.STRING, description: 'Tips belajar atau trik mengingat materi soal ini' },
            },
            required: ['id', 'question', 'options', 'correctAnswer', 'explanation', 'tip'],
          },
        },
      },
    });

    const jsonText = response.text || '[]';
    const parsed = JSON.parse(jsonText);
    return res.json({ questions: parsed });
  } catch (error: any) {
    console.error('Quiz generate error:', error);
    return res.status(500).json({ error: error?.message || 'Gagal membuat kuis' });
  }
});

// 3. Modul Ajar & Perangkat Ajar Generator (Khusus Guru/Pendidik)
app.post('/api/generate-teaching-tool', async (req, res) => {
  try {
    const { type, subject, grade, topic, duration, targetCurriculum = 'Kurikulum Merdeka' } = req.body;

    let toolPrompt = '';
    if (type === 'modul_ajar') {
      toolPrompt = `Susunlah Modul Ajar lengkap berstandar ${targetCurriculum} untuk:
- Mata Pelajaran: ${subject}
- Fase/Kelas: ${grade}
- Topik / Materi Pokok: ${topic}
- Alokasi Waktu: ${duration || '2 x 45 menit'}

Sertakan komponen resmi:
1. INFORMASI UMUM (Identitas, Kompetensi Awal, Profil Pelajar Pancasila, Sarana Prasarana, Target Peserta Didik, Model Pembelajaran)
2. KOMPONEN INTI (Tujuan Pembelajaran, Pemahaman Bermakna, Pertanyaan Pemantik, Kegiatan Pembelajaran Berdiferensiasi [Pendahuluan, Inti, Penutup], Asesmen Formatif & Sumatif)
3. LAMPIRAN (Ringkasan Materi, Lembar Kerja Peserta Didik ringkas, Rubrik Penilaian, Bahan Bacaan, Glosarium, Daftar Pustaka)`;
    } else if (type === 'lkpd') {
      toolPrompt = `Buatkan Lembar Kerja Peserta Didik (LKPD) yang menarik, interaktif, dan berpusat pada siswa untuk:
- Mata Pelajaran: ${subject}
- Kelas: ${grade}
- Materi: ${topic}

Sertakan:
- Judul Kegiatan & Tujuan Belajar
- Petunjuk Belajar yang jelas
- Stimulus / Cerita Kasus Pemantik
- Aktivitas Siswa / Eksplorasi Bertahap
- Pertanyaan Analisis & Diskusi
- Kolom Kesimpulan
- Rubrik Penilaian Diri Siswa`;
    } else if (type === 'rubrik_asesmen') {
      toolPrompt = `Buatkan Instrumen Asesmen dan Rubrik Penilaian komprehensif untuk materi "${topic}" pada mata pelajaran "${subject}" (${grade}).
Sertakan kisi-kisi asesmen, rubrik penilaian performa/tugas dengan kriteria (Perlu Bimbingan, Cukup, Baik, Sangat Baik), serta contoh 3 soal asesmen formatif (HOTS) beserta kunci dan pedoman penskoran.`;
    } else {
      toolPrompt = `Buatkan 5 butir soal evaluasi (kombinasi PG dan Uraian HOTS) lengkap dengan Kisi-Kisi Penulisan Soal, Kunci Jawaban, Pembahasan Rinci, dan Rubrik Penskoran untuk materi "${topic}", mata pelajaran "${subject}" tingkat ${grade}.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: toolPrompt,
      config: {
        systemInstruction: BASE_SYSTEM_INSTRUCTION + '\nGunakan format markdown yang sangat terstruktur, rapi, dan langsung siap dicetak/dijadikan dokumen resmi guru.',
        temperature: 0.6,
      },
    });

    return res.json({ result: response.text || '' });
  } catch (error: any) {
    console.error('Teaching tool error:', error);
    return res.status(500).json({ error: error?.message || 'Gagal menyusun perangkat ajar' });
  }
});

// 4. Skripsi & Karya Ilmiah Assistant (Khusus Mahasiswa)
app.post('/api/academic-helper', async (req, res) => {
  try {
    const { topic, faculty, methodologyType, taskType } = req.body;

    const academicPrompt = `Sebagai akademisi dan konsultan riset pendidikan tinggi:
Tugas: ${taskType || 'Kerangka Skripsi/Penelitian'}
Topik Penelitian: "${topic}"
Bidang/Jurusan: ${faculty || 'Umum'}
Pendekatan Metodologi: ${methodologyType || 'Kuantitatif'}

Bantu susun:
1. Rekomendasi Judul Penelitian yang menarik, terukur, dan memenuhi kaidah ilmiah (berikan 3 variasi).
2. Latar Belakang Masalah (GAP penelitian: Kondisi Ideal vs Realita & Urgensi Penelitian).
3. Rumusan Masalah & Tujuan Penelitian.
4. Tinjauan Pustaka & Kerangka Konseptual.
5. Rekomendasi Metodologi (Desain, Populasi & Sampel/Subjek, Teknik Pengumpulan Data, Uji Validitas & Reliabilitas, Teknik Analisis Data).
6. Saran Kata Kunci Pencarian Literatur di Google Scholar / Scopus / SINTA dan tips sitasi terpercaya.

PENTING: Jangan membuat data responden palsu, hasil empiris fiktif, atau kutipan DOI palsu. Dorong orisinalitas riset.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: academicPrompt,
      config: {
        systemInstruction: BASE_SYSTEM_INSTRUCTION,
        temperature: 0.6,
      },
    });

    return res.json({ result: response.text || '' });
  } catch (error: any) {
    console.error('Academic helper error:', error);
    return res.status(500).json({ error: error?.message || 'Gagal memproses panduan akademik' });
  }
});

// 5. Audio Text-to-Speech (Menggunakan Gemini 3.8 Flash Lite TTS untuk membaca teks ramah)
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice = 'Kore' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Limit text to ~250 chars for responsive audio reading
    const shortText = text.slice(0, 300);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: shortText,
              speechMetadata: {
                style: 'Ramah, hangat, seperti guru dan tutor yang sabar dan menyenangkan untuk anak Indonesia',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'Tidak ada audio yang dihasilkan' });
    }

    return res.json({ audioBase64: base64Audio });
  } catch (error: any) {
    console.warn('TTS error (can fallback to client speech):', error?.message);
    return res.status(500).json({ error: error?.message || 'TTS unavailable' });
  }
});

// Setup Vite Dev Middleware or Static Dist Serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SAHABAT BELAJAR AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
