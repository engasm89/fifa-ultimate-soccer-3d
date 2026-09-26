export interface Verse {
  id: number;
  verse_number: number;
  text_uthmani: string;
  translation?: string;
}

export interface SurahInfo {
  id: number;
  name_arabic: string;
  name_simple: string;
  verses_count: number;
  revelation_place: string;
}

export interface Recitation {
  id: number;
  reciter_name: string;
  audio_url: string;
}
