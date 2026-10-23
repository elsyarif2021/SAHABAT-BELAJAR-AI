export type EducationLevelId =
  | 'tk'
  | 'tpq'
  | 'sd'
  | 'smp'
  | 'sma'
  | 'smk'
  | 'perguruan_tinggi'
  | 'guru'
  | 'orang_tua';

export interface EducationLevel {
  id: EducationLevelId;
  number: number;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  accentBg: string;
  badgeBg: string;
  borderColor: string;
  description: string;
  grades: string[];
  subjects: string[];
  samplePrompts: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  image?: {
    data: string; // base64
    mimeType: string;
    previewUrl: string;
  };
  educationLevel?: EducationLevelId;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  tip: string;
}

export interface HijaiyahItem {
  arabic: string;
  name: string;
  latin: string;
  makhraj: string;
  example: string;
}

export interface DoaItem {
  title: string;
  arabic: string;
  latin: string;
  meaning: string;
}
