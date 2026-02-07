import { Movie } from './types';

// Your Actual Bot Username
export const BOT_USERNAME = 'Cinaflix_Streembot';

// Static Data - Structured for future Firestore migration
export const INITIAL_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Bachelor Point Season 5',
    thumbnail: 'https://picsum.photos/seed/bp5/300/450',
    category: 'Series',
    telegramCode: 'bp5_full_hd',
    rating: 9.2,
    views: '2,845',
    year: '2025',
    quality: '4K',
    description: 'The gang returns for another season of chaos and laughter in Dhaka.',
    episodes: [
      { id: 'e1', number: 1, season: 5, title: 'The Return', duration: '24m', telegramCode: 'bp5_ep1' },
      { id: 'e2', number: 2, season: 5, title: 'Kabila\'s Crisis', duration: '22m', telegramCode: 'bp5_ep2' },
      { id: 'e3', number: 3, season: 5, title: 'Shuvo\'s Plan', duration: '25m', telegramCode: 'bp5_ep3' },
      { id: 'e4', number: 4, season: 5, title: 'New Flat', duration: '21m', telegramCode: 'bp5_ep4' },
      { id: 'e5', number: 5, season: 5, title: 'The Conflict', duration: '26m', telegramCode: 'bp5_ep5' },
    ]
  },
  {
    id: '2',
    title: 'Money Heist: Korea',
    thumbnail: 'https://picsum.photos/seed/money/300/450',
    category: 'Korean Drama',
    telegramCode: 'mh_korea_s1',
    rating: 8.5,
    views: '1,240',
    year: '2024',
    quality: '1080p',
    description: 'Thieves overtake the mint of a unified Korea. With hostages trapped inside, the police must stop them.',
    episodes: [
      { id: 'e1', number: 1, season: 1, title: 'Episode 1', duration: '1h 05m', telegramCode: 'mh_ep1' },
      { id: 'e2', number: 2, season: 1, title: 'Episode 2', duration: '58m', telegramCode: 'mh_ep2' },
      { id: 'e3', number: 3, season: 1, title: 'Episode 3', duration: '1h 02m', telegramCode: 'mh_ep3' },
    ]
  },
  {
    id: '3',
    title: 'Surongo',
    thumbnail: 'https://picsum.photos/seed/surongo/300/450',
    category: 'Exclusive',
    telegramCode: 'surongo_movie',
    rating: 8.9,
    views: '2,100',
    year: '2023',
    quality: '4K HDR',
    description: 'A thrilling tale of a man digging a tunnel to change his destiny.'
  },
  {
    id: '4',
    title: 'Jawan',
    thumbnail: 'https://picsum.photos/seed/jawan/300/450',
    category: 'Exclusive',
    telegramCode: 'jawan_4k',
    rating: 9.5,
    views: '2,950',
    year: '2023',
    quality: '4K',
    description: 'A high-octane action thriller outlining the emotional journey of a man who is set to rectify the wrongs in the society.'
  },
  {
    id: '5',
    title: 'Stranger Things S5',
    thumbnail: 'https://picsum.photos/seed/st5/300/450',
    category: 'Series',
    telegramCode: 'st_s5_ep1',
    rating: 9.0,
    views: '2,980',
    year: '2025',
    quality: 'Dolby Vision',
    description: 'The final chapter of the Hawkins saga begins.',
    episodes: [
      { id: 'e1', number: 1, season: 5, title: 'Chapter One: The Crawl', duration: '55m', telegramCode: 'st5_ep1' },
      { id: 'e2', number: 2, season: 5, title: 'Chapter Two: The Vanishing', duration: '1h 02m', telegramCode: 'st5_ep2' },
      { id: 'e3', number: 3, season: 5, title: 'Chapter Three: The Turn', duration: '58m', telegramCode: 'st5_ep3' },
    ]
  },
  {
    id: '6',
    title: 'Toofan',
    thumbnail: 'https://picsum.photos/seed/toofan/300/450',
    category: 'Exclusive',
    telegramCode: 'toofan_official',
    rating: 9.8,
    views: '2,999',
    year: '2024',
    quality: '4K',
    description: 'A storms approaches as the underworld kingpin rises to power.'
  },
  {
    id: '7',
    title: 'Hawa',
    thumbnail: 'https://picsum.photos/seed/hawa/300/450',
    category: 'Exclusive',
    telegramCode: 'hawa_bd',
    rating: 8.7,
    views: '1,560',
    year: '2022',
    quality: '1080p',
    description: 'A mystery drama film centered around a fishing boat in the middle of the sea.'
  },
  {
    id: '8',
    title: 'Avatar: Way of Water',
    thumbnail: 'https://picsum.photos/seed/avatar/300/450',
    category: 'Exclusive',
    telegramCode: 'avatar_2_hd',
    rating: 8.2,
    views: '2,400',
    year: '2022',
    quality: '3D',
    description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.'
  },
  {
    id: '9',
    title: 'All of Us Are Dead',
    thumbnail: 'https://picsum.photos/seed/aouad/300/450',
    category: 'Korean Drama',
    telegramCode: 'aouad_s1',
    rating: 8.8,
    views: '1,890',
    year: '2024',
    quality: 'HD',
    description: 'Trapped in a virus-ridden school with no cellphones, no way out, and fewer things to survive.',
    episodes: [
      { id: 'e1', number: 1, season: 1, title: 'Episode 1', duration: '1h 06m', telegramCode: 'aouad_ep1' },
      { id: 'e2', number: 2, season: 1, title: 'Episode 2', duration: '1h 10m', telegramCode: 'aouad_ep2' },
    ]
  },
  {
    id: '10',
    title: 'Squid Game S2',
    thumbnail: 'https://picsum.photos/seed/squid/300/450',
    category: 'Korean Drama',
    telegramCode: 'squid_s2',
    rating: 9.1,
    views: '2,850',
    year: '2025',
    quality: '4K HDR',
    description: 'The game continues. New players, new rules, same deadly stakes.',
    episodes: [
      { id: 'e1', number: 1, season: 2, title: 'Red Light, Green Light', duration: '1h 03m', telegramCode: 'sg2_ep1' },
      { id: 'e2', number: 2, season: 2, title: 'Honeycomb', duration: '59m', telegramCode: 'sg2_ep2' },
    ]
  }
];

export const CATEGORIES = ['Exclusive', 'Korean Drama', 'Series', 'All'];