export type AnimeStatus = 'Онгоинг' | 'Завершён' | 'Анонс' | 'Фильм';

export type AnimeKind = 'TV-сериал' | 'Полнометражный фильм' | 'ONA' | 'OVA';

export interface Anime {
  id: string;
  title: string;
  original: string;
  kind: AnimeKind;
  year: number;
  studio: string;
  genres: string[];
  rating: number;
  episodes: number;
  status: AnimeStatus;
  tagline: string;
  synopsis: string;
  /** Ключ постера из карты ассетов либо null — тогда карточка рисует генеративный фон. */
  poster: string | null;
  /** Акцентный цвет карточки (HSL-строка без hsl()) */
  color: string;
  popularity: number;
}

export interface Character {
  id: string;
  name: string;
  original: string;
  anime: string;
  role: 'Протагонист' | 'Антагонист' | 'Дейтерагонист' | 'Со второго плана';
  archetype: string;
  description: string;
  traits: string[];
  quote: string;
  color: string;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  anime: string;
  year: number;
  context: string;
}

export interface TimelineEvent {
  year: number;
  title: string;
  detail: string;
  era: 'Заря' | 'Золотой век' | 'Бум' | 'Цифра' | 'Сейчас';
  importance: 1 | 2 | 3;
}

export interface Studio {
  id: string;
  name: string;
  founded: number;
  city: string;
  founders: string;
  famous: string[];
  style: string;
  description: string;
  color: string;
}

export interface Genre {
  id: string;
  name: string;
  jp: string;
  description: string;
  mood: string;
  starter: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  hint: string;
  answers: { text: string; weights: Record<string, number> }[];
}

export type SectionId =
  | 'hero'
  | 'manifest'
  | 'catalog'
  | 'gallery3d'
  | 'characters'
  | 'timeline'
  | 'genres'
  | 'studios'
  | 'quotes'
  | 'quiz';
