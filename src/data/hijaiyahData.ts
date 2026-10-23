import { HijaiyahItem, DoaItem } from '../types';

export const HIJAIYAH_LETTERS: HijaiyahItem[] = [
  { arabic: 'ا', name: 'Alif', latin: 'a / alif', makhraj: 'Al-Jauf (rongga mulut & tenggorokan)', example: 'اَبَتَ' },
  { arabic: 'ب', name: 'Ba', latin: 'ba', makhraj: 'Asy-Syafatain (kedua bibir terkatup)', example: 'بَابٌ' },
  { arabic: 'ت', name: 'Ta', latin: 'ta', makhraj: 'Ujung lidah menempel di pangkal gigi seri atas', example: 'تَمْرٌ' },
  { arabic: 'ث', name: 'Tsa', latin: 'tsa', makhraj: 'Ujung lidah keluar sedikit mengenai ujung gigi seri atas', example: 'ثَوْبٌ' },
  { arabic: 'ج', name: 'Jim', latin: 'jim', makhraj: 'Tengah lidah menempel ke langit-langit atas', example: 'جَمَلٌ' },
  { arabic: 'ح', name: 'Ha', latin: 'ha (pedas)', makhraj: 'Wasathul Halq (tenggorokan bagian tengah)', example: 'حَسَنٌ' },
  { arabic: 'خ', name: 'Kha', latin: 'kha', makhraj: 'Adnal Halq (tenggorokan bagian atas dekat rongga mulut)', example: 'خَيْرٌ' },
  { arabic: 'د', name: 'Dal', latin: 'dal', makhraj: 'Ujung lidah pada pangkal gigi seri atas', example: 'دَرْسٌ' },
  { arabic: 'ذ', name: 'Dzal', latin: 'dzal', makhraj: 'Ujung lidah keluar sedikit mengenai ujung gigi seri atas', example: 'ذِكْرٌ' },
  { arabic: 'ر', name: 'Ra', latin: 'ra', makhraj: 'Ujung lidah dekat gusi gigi seri atas dengan getaran ringan', example: 'رَحْمَةٌ' },
  { arabic: 'ز', name: 'Zay', latin: 'za', makhraj: 'Ujung lidah di atas gigi seri bawah mendesing', example: 'زَيْتُونٌ' },
  { arabic: 'س', name: 'Sin', latin: 'sa', makhraj: 'Ujung lidah di atas gigi seri bawah dengan desis halus', example: 'سَلَامٌ' },
  { arabic: 'ش', name: 'Syin', latin: 'sya', makhraj: 'Tengah lidah terangkat ke langit-langit (tafasysyi)', example: 'شَمْسٌ' },
  { arabic: 'ص', name: 'Shad', latin: 'sha (tebal)', makhraj: 'Ujung lidah pada gigi seri bawah dengan ketebalan suara (isti\'la)', example: 'صَبْرٌ' },
  { arabic: 'ض', name: 'Dhad', latin: 'dha', makhraj: 'Tepi lidah menyentuh gigi geraham atas', example: 'ضَوْءٌ' },
  { arabic: 'ط', name: 'Tha', latin: 'tha (tebal)', makhraj: 'Ujung lidah bertemu pangkal gigi seri atas dengan suara kuat', example: 'طَرِيقٌ' },
  { arabic: 'ظ', name: 'Zha', latin: 'zha (tebal)', makhraj: 'Ujung lidah keluar sedikit menempel ujung gigi seri atas', example: 'ظِلٌّ' },
  { arabic: 'ع', name: '\'Ain', latin: '\'ain', makhraj: 'Wasathul Halq (tenggorokan bagian tengah, ditekan sedikit)', example: 'عِلْمٌ' },
  { arabic: 'غ', name: 'Ghain', latin: 'gha', makhraj: 'Adnal Halq (tenggorokan atas dekat langit-langit lunak)', example: 'غَفُورٌ' },
  { arabic: 'ف', name: 'Fa', latin: 'fa', makhraj: 'Ujung gigi seri atas menyentuh perut bibir bawah', example: 'فَجْرٌ' },
  { arabic: 'ق', name: 'Qaf', latin: 'qa (tebal/pantul)', makhraj: 'Pangkal lidah paling belakang menempel langit-langit lembut', example: 'قَلَمٌ' },
  { arabic: 'ك', name: 'Kaf', latin: 'ka', makhraj: 'Pangkal lidah setelah makhraj Qaf ke depan sedikit', example: 'كِتَابٌ' },
  { arabic: 'ل', name: 'Lam', latin: 'la', makhraj: 'Ujung tepi lidah ke gusi atas', example: 'لَيْلٌ' },
  { arabic: 'م', name: 'Mim', latin: 'ma', makhraj: 'Dua bibir terkatup disertai dengung hidung (ghunnah)', example: 'مَسْجِدٌ' },
  { arabic: 'ن', name: 'Nun', latin: 'na', makhraj: 'Ujung lidah ke gusi gigi seri atas', example: 'نُورٌ' },
  { arabic: 'و', name: 'Waw', latin: 'wa', makhraj: 'Kedua bibir membulat (monyong)', example: 'وَقْتٌ' },
  { arabic: 'هـ', name: 'Ha', latin: 'ha (dada/dalam)', makhraj: 'Aqshal Halq (pangkal tenggorokan paling bawah)', example: 'هُدَى' },
  { arabic: 'ي', name: 'Ya', latin: 'ya', makhraj: 'Tengah lidah terangkat ke langit-langit atas', example: 'يَوْمٌ' },
];

export const DOA_HARIAN: DoaItem[] = [
  {
    title: 'Doa Sebelum Belajar',
    arabic: 'رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا',
    latin: 'Robbi zidnii \'ilman warzuqnii fahman',
    meaning: 'Ya Tuhanku, tambahkanlah kepadaku ilmu dan berilah aku karunia untuk memahaminya.',
  },
  {
    title: 'Doa Kedua Orang Tua',
    arabic: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    latin: 'Robbighfir lii waliwaalidayya warhamhumaa kamaa robbayaanii shoghiiroo',
    meaning: 'Wahai Tuhanku, ampunilah aku dan kedua orang tuaku, dan sayangilah mereka berdua sebagaimana mereka telah mendidikku pada waktu kecil.',
  },
  {
    title: 'Doa Sebelum Makan',
    arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ',
    latin: 'Alloohumma baarik lanaa fiimaa rozaqtanaa wa qinaa \'adzaaban naar',
    meaning: 'Ya Allah, berkahilah rezeki yang Engkau berikan kepada kami dan peliharalah kami dari siksa api neraka.',
  },
  {
    title: 'Doa Sebelum Tidur',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَحْيَا وَأَمُوتُ',
    latin: 'Bismikalloohumma ahyaa wa amuutu',
    meaning: 'Dengan nama-Mu ya Allah, aku hidup dan aku mati.',
  },
  {
    title: 'Doa Kebaikan Dunia dan Akhirat',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    latin: 'Robbanaa aatinaa fid dunyaa hasanah wa fil aakhiroti hasanah wa qinaa \'adzaaban naar',
    meaning: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat dan lindungilah kami dari siksa api neraka.',
  },
];

export const TAJWID_RULES = [
  {
    name: 'Izhar Halqi',
    letters: 'ء, هـ, ع, ح, غ, خ',
    explanation: 'Nun sukun (نْ) atau tanwin bertemu 6 huruf tenggorokan. Dibaca jelas tanpa dengung.',
    example: 'مِنْ خَوْفٍ (Min khouf)',
  },
  {
    name: 'Idgham Bighunnah',
    letters: 'ي, ن, م, و (Yanmu)',
    explanation: 'Nun sukun atau tanwin bertemu salah satu huruf Yanmu. Suara melebur disertai dengung 2 harakat.',
    example: 'مَنْ يَقُولُ (May yaquulu)',
  },
  {
    name: 'Idgham Bilaghunnah',
    letters: 'ل, ر',
    explanation: 'Nun sukun atau tanwin bertemu huruf Lam atau Ra. Suara melebur tanpa dengung sama sekali.',
    example: 'مِنْ رَبِّهِمْ (Mir robbihim)',
  },
  {
    name: 'Iqlab',
    letters: 'ب',
    explanation: 'Nun sukun atau tanwin bertemu huruf Ba. Suara nun berubah menjadi bunyi mim samar dengan dengung.',
    example: 'مِنْ بَعْدِ (Mim ba\'di)',
  },
  {
    name: 'Ikhfa Haqiqi',
    letters: 'ت, ث, ج, د, ذ, ز, س, ش, ص, ض, ط, ظ, ف, ق, ك (15 huruf)',
    explanation: 'Nun sukun atau tanwin bertemu 15 huruf ikhfa. Dibaca samar antara izhar dan idgham dengan dengung.',
    example: 'مِنْ قَبْلُ (Ming qoblu)',
  },
  {
    name: 'Qalqalah (Pantulan)',
    letters: 'ب, ج, د, ط, ق (Baju Ditoko)',
    explanation: 'Huruf qalqalah yang berharakat sukun (asli atau wakaf) dibaca memantul. Qalqalah Sughra (pantulan ringan di tengah) dan Kubra (pantulan kuat di akhir).',
    example: 'قُلْ هُوَ اللَّهُ أَحَدٌ (Qul huwallahu ahad(d))',
  },
];
