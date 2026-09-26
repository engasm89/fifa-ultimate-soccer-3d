/**
 * UEFA Champions League 120 OVR Superstars Roster
 * Features Kylian Mbappé, Cristiano Ronaldo, Erling Haaland, Neymar Jr, and Lionel Messi.
 */

export interface SuperstarProfile {
  id: 'mbappe' | 'ronaldo' | 'haaland' | 'neymar' | 'messi';
  nameAr: string;
  nameEn: string;
  rating: number; // 120 OVR
  position: 'ST' | 'LW' | 'RW' | 'CF';
  jerseyNumber: number;
  club: string;
  flag: string;
  avatarEmoji: string;
  stats: {
    PAC: number; // Pace
    SHO: number; // Shooting
    PAS: number; // Passing
    DRI: number; // Dribbling
    DEF: number; // Defending
    PHY: number; // Physical
  };
  traits: {
    walkSpeed: number;
    sprintSpeed: number;
    maxShotPower: number;
    curveMultiplier: number;
    turnSpeed: number;
    description: string;
    specialSkill: string;
  };
  themeColor: string;
  secondaryColor: string;
}

export const SUPERSTARS: SuperstarProfile[] = [
  {
    id: 'mbappe',
    nameAr: 'كيليان مبابي',
    nameEn: 'Kylian Mbappé',
    rating: 120,
    position: 'ST',
    jerseyNumber: 9,
    club: 'ريال مدريد',
    flag: '🇫🇷',
    avatarEmoji: '⚡',
    stats: {
      PAC: 99,
      SHO: 98,
      PAS: 92,
      DRI: 99,
      DEF: 48,
      PHY: 90,
    },
    traits: {
      walkSpeed: 6.8,
      sprintSpeed: 11.4, // Blazing speed!
      maxShotPower: 35.0,
      curveMultiplier: 1.6,
      turnSpeed: 26.0,
      description: 'صاروخ الهجوم الخارق، سرعة انطلاق 99 لا يمكن اللحاق بها وتسلل نفاث خلف المدافعين.',
      specialSkill: 'انطلاقة البرق السريعة (Lightning Sprint 99)',
    },
    themeColor: '#38bdf8', // Neon Sky Blue / Madrid Cyan
    secondaryColor: '#facc15', // Gold
  },
  {
    id: 'ronaldo',
    nameAr: 'كريستيانو رونالدو',
    nameEn: 'Cristiano Ronaldo',
    rating: 120,
    position: 'ST',
    jerseyNumber: 7,
    club: 'النصر / أيقونة الأبطال',
    flag: '🇵🇹',
    avatarEmoji: '👑',
    stats: {
      PAC: 97,
      SHO: 99,
      PAS: 90,
      DRI: 96,
      DEF: 52,
      PHY: 99,
    },
    traits: {
      walkSpeed: 6.4,
      sprintSpeed: 10.6,
      maxShotPower: 39.0, // World record bullet shot! (up to 140 km/h)
      curveMultiplier: 1.9,
      turnSpeed: 24.0,
      description: 'الهداف التاريخي لدوري أبطال أوروبا، تسديدات صاروخية بعيدة المدى وارتقاء هوائي خيالي.',
      specialSkill: 'تسديدة المدفع الصاروخية (Rocket Knuckleball 99)',
    },
    themeColor: '#ef4444', // Crimson Red
    secondaryColor: '#fbbf24', // Gold
  },
  {
    id: 'haaland',
    nameAr: 'إيرلينغ هالاند',
    nameEn: 'Erling Haaland',
    rating: 120,
    position: 'ST',
    jerseyNumber: 9,
    club: 'مانشستر سيتي',
    flag: '🇳🇴',
    avatarEmoji: '🦾',
    stats: {
      PAC: 98,
      SHO: 99,
      PAS: 85,
      DRI: 92,
      DEF: 55,
      PHY: 99,
    },
    traits: {
      walkSpeed: 6.5,
      sprintSpeed: 11.0,
      maxShotPower: 38.0,
      curveMultiplier: 1.2,
      turnSpeed: 22.0,
      description: 'الدبابة الهجومية الإعصارية، قوة بدنية هائلة في منطقة الجزاء ولمسات إنهاء قاتلة للشباك.',
      specialSkill: 'القوة البدنية الكاسحة (Cyborg Power 99)',
    },
    themeColor: '#0ea5e9', // City Sky Blue
    secondaryColor: '#f59e0b', // Gold
  },
  {
    id: 'messi',
    nameAr: 'ليونيل ميسي',
    nameEn: 'Lionel Messi',
    rating: 120,
    position: 'RW',
    jerseyNumber: 10,
    club: 'إنتر ميامي / أسطورة الأبطال',
    flag: '🇦🇷',
    avatarEmoji: '🐐',
    stats: {
      PAC: 95,
      SHO: 99,
      PAS: 99,
      DRI: 99,
      DEF: 45,
      PHY: 88,
    },
    traits: {
      walkSpeed: 6.6,
      sprintSpeed: 10.2,
      maxShotPower: 34.0,
      curveMultiplier: 2.6, // Insane curve / bend!
      turnSpeed: 30.0, // Ultra tight turns
      description: 'الساحر الاستثنائي، مراوغة لاصقة بالقدم وتمريرات حريرية وانحناءات كيرف في زوايا المرمى المستحيلة.',
      specialSkill: 'المراوغة الساحرة والكيرف الخيالي (Magic Curve 99)',
    },
    themeColor: '#3b82f6', // Albiceleste Blue
    secondaryColor: '#fbbf24', // Gold
  },
  {
    id: 'neymar',
    nameAr: 'نيمار جونيور',
    nameEn: 'Neymar Jr',
    rating: 120,
    position: 'LW',
    jerseyNumber: 11,
    club: 'الهلال / سامبا الأبطال',
    flag: '🇧🇷',
    avatarEmoji: '✨',
    stats: {
      PAC: 98,
      SHO: 95,
      PAS: 96,
      DRI: 99,
      DEF: 44,
      PHY: 85,
    },
    traits: {
      walkSpeed: 6.6,
      sprintSpeed: 10.5,
      maxShotPower: 33.5,
      curveMultiplier: 2.2,
      turnSpeed: 28.0,
      description: 'سلطان مهارات السامبا البرازيلية، فنيات ومراوغات فردية تجعل المدافعين يسقطون أرضاً.',
      specialSkill: 'فنيات السامبا الخادعة (Samba Joga Bonito 99)',
    },
    themeColor: '#10b981', // Brazil Emerald Green
    secondaryColor: '#facc15', // Gold
  },
];
