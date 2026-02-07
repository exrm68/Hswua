export interface Episode {
  id: string;
  number: number;
  season: number; // Added Season Number
  title: string;
  duration: string;
  telegramCode: string;
}

export interface Movie {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  telegramCode: string;
  rating: number;
  views: string;
  year?: string;
  quality?: string;
  description?: string;
  episodes?: Episode[];
  isPremium?: boolean;
  createdAt?: any;
}

export interface AppSettings {
  botUsername: string;
  channelLink: string;
}

export type Category = 'Exclusive' | 'Korean Drama' | 'Series' | 'All' | 'Favorites';