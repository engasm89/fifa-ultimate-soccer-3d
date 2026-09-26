export interface SkillBoost {
  type: 'gold' | 'silver'; // Gold or Silver skill
  nameAr: string;
  nameEn: string;
  level: number;
  category: 'shooting' | 'pace' | 'dribbling' | 'defending' | 'passing' | 'gk' | 'physical';
  descriptionAr: string;
}

export interface Player {
  id: string;
  name: string;
  rating: number;
  shirtNumber?: number;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  detailedPosition?: string; // ST, LW, RW, CAM, CM, CDM, CB, LB, RB, GK
  club: string;
  nation: string;
  image: string;
  rank?: number; // 0 to 5
  eventSide?: 'red' | 'blue'; // Red or Blue event side
  skillBoost?: SkillBoost;
  stats: {
    pac: number;
    sho: number;
    pas: number;
    dri: number;
    def: number;
    phy: number;
  };
}

/**
 * Calculates gem reward for selling a player based on rating / level (OVR):
 * - Level/Rating 118: gives 100 gems (بيع لاعب ليفل 118 يعطي 100 جوهرة)
 * - Level/Rating 125: gives 1,000 gems (بيع لاعب ليفل 125 يعطي 1000 جوهرة)
 * - Other levels scaled proportionally
 */
export function getPlayerSellGems(rating: number): number {
  if (rating >= 125) {
    return 1000 + (rating - 125) * 250;
  }
  if (rating === 124) return 850;
  if (rating === 123) return 700;
  if (rating === 122) return 550;
  if (rating === 121) return 400;
  if (rating === 120) return 250;
  if (rating === 119) return 150;
  if (rating === 118) return 100;
  if (rating === 117) return 80;
  if (rating === 116) return 60;
  if (rating === 115) return 50;
  if (rating === 114) return 40;
  if (rating === 113) return 30;
  if (rating === 112) return 25;
  if (rating === 111) return 20;
  if (rating === 110) return 15;
  return 10;
}

export function getPlayerSkillBoost(player: Player): SkillBoost | null {
  // CRITICAL RULE: Players with rating less than 118 do NOT have gold or silver skill boosts
  if (!player || player.rating < 118) {
    return null;
  }

  if (player.skillBoost) return player.skillBoost;
  
  // High tier (rating >= 120 or legends/titans) get GOLD SKILL BOOST (مهارة ذهبية)
  const isGold = player.rating >= 120 || player.id.startsWith('sk-') || player.id.startsWith('legend-');
  
  if (isGold) {
    if (player.position === 'FWD') {
      return {
        type: 'gold',
        nameAr: 'تسديد صاروخي',
        nameEn: 'Rocket Shot',
        level: player.rating >= 122 ? 15 : player.rating >= 120 ? 14 : 13,
        category: 'shooting',
        descriptionAr: 'زيادة هائلة في دقة وقوة التسديد من جميع المسافات'
      };
    } else if (player.position === 'MID') {
      return {
        type: 'gold',
        nameAr: 'صانع ألعاب أسطوري',
        nameEn: 'Legend Maestro',
        level: player.rating >= 122 ? 15 : 14,
        category: 'passing',
        descriptionAr: 'تمريرات حاسمة وسحرية تخترق أعتى خطوط الدفاع'
      };
    } else if (player.position === 'DEF') {
      return {
        type: 'gold',
        nameAr: 'جدار فولاذي',
        nameEn: 'Steel Wall',
        level: player.rating >= 122 ? 15 : 14,
        category: 'defending',
        descriptionAr: 'افتكاك لا يقهر وصلابة دفاعية مطلقة'
      };
    } else {
      return {
        type: 'gold',
        nameAr: 'رد فعل خارق',
        nameEn: 'Super Reflexes',
        level: 14,
        category: 'gk',
        descriptionAr: 'تصديات إعجازية ورد فعل سريع في انفرادات المرمى'
      };
    }
  }

  // Silver skill boost for tier 118-119 (مهارة فضية)
  if (player.position === 'FWD') {
    return {
      type: 'silver',
      nameAr: 'سرعة خاطفة',
      nameEn: 'Swift Pace',
      level: 10,
      category: 'pace',
      descriptionAr: 'انطلاقات سريعة وكسر مصيدة التسلل'
    };
  } else if (player.position === 'MID') {
    return {
      type: 'silver',
      nameAr: 'تحكم ورشاقة',
      nameEn: 'Agile Control',
      level: 10,
      category: 'dribbling',
      descriptionAr: 'مرونة في الاحتفاظ بالكرة وتغيير الاتجاهات'
    };
  } else if (player.position === 'DEF') {
    return {
      type: 'silver',
      nameAr: 'افتكاك ذكي',
      nameEn: 'Smart Tackle',
      level: 10,
      category: 'defending',
      descriptionAr: 'تغطية دفاعية وقطع التمريرات الأرضية'
    };
  } else {
    return {
      type: 'silver',
      nameAr: 'ارتقاء وتصدي',
      nameEn: 'Reach & Save',
      level: 10,
      category: 'gk',
      descriptionAr: 'تألق في الكرات العالية والعرضيات'
    };
  }
}

export function getCleanPlayerImage(player: { id?: string; name?: string; image?: string } | null | undefined): string {
  if (!player) return 'https://cdn.futbin.com/content/fifa24/img/players/20801.png';
  const name = (player.name || '').toLowerCase();
  const id = (player.id || '').toLowerCase();
  
  if (name.includes('ronaldo') || name.includes('cr7') || id.includes('cr7') || id === '2' || id === 'sk-2') {
    return 'https://cdn.futbin.com/content/fifa24/img/players/20801.png';
  }
  if (name.includes('messi') || id.includes('messi')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/158023.png';
  }
  if (name.includes('mbapp') || id.includes('mbappe')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/231747.png';
  }
  if (name.includes('haaland') || id.includes('haaland')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/239085.png';
  }
  if (name.includes('bellingham') || id.includes('bellingham') || name.includes('fàbregas') || name.includes('fabregas')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/252371.png';
  }
  if (name.includes('hierro') || id.includes('hierro')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/1088.png';
  }
  if (name.includes('cantona') || id.includes('cantona') || name.includes('eusébio') || name.includes('eusebio')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/1075.png';
  }
  if (name.includes('figo') || id.includes('figo')) {
    return 'https://cdn.futbin.com/content/fifa23/img/players/1040.png';
  }
  if (name.includes('saka') || id.includes('saka')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/246669.png';
  }
  if (name.includes('schlotterbeck') || id.includes('schlotterbeck') || name.includes('antónio silva')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/246054.png';
  }
  if (name.includes('simons') || id.includes('simons') || (name.includes('neves') && name.includes('joão'))) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/245367.png';
  }
  if (name.includes('joelinton') || id.includes('joelinton') || name.includes('palhinha')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/228827.png';
  }
  if (name.includes('dias') || name.includes('inácio') || name.includes('inacio')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/239818.png';
  }
  if (name.includes('bernardo') || name.includes('vitinha')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/218667.png';
  }
  if (name.includes('bruno') || name.includes('matheus nunes')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/212198.png';
  }
  if (name.includes('leão') || name.includes('leao') || name.includes('conceição')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/241721.png';
  }
  if (name.includes('rúben neves') || name.includes('ruben neves') || name.includes('otávio') || name.includes('otavio')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/224232.png';
  }
  if (name.includes('cancelo')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/210514.png';
  }
  if (name.includes('pepe')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/120533.png';
  }
  if (name.includes('dalot')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/234574.png';
  }
  if (name.includes('costa') || name.includes('courtois')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/192119.png';
  }
  if (name.includes('alisson') || name.includes('oblak')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/212831.png';
  }
  if (name.includes('andré silva') || name.includes('andre silva')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/215698.png';
  }
  if (name.includes('jota')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/224458.png';
  }
  if (name.includes('neto')) {
    return 'https://cdn.futbin.com/content/fifa23/img/players/244928.png';
  }
  if (name.includes('mendes')) {
    return 'https://cdn.futbin.com/content/fifa23/img/players/258504.png';
  }
  if (name.includes('semedo')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/227928.png';
  }
  if (name.includes('florentino')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/243630.png';
  }
  if (name.includes('ramos')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/256630.png';
  }
  if (name.includes('vinicius') || name.includes('vinícius')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/238794.png';
  }
  if (name.includes('debruyne') || name.includes('de bruyne')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/192985.png';
  }
  if (name.includes('salah')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/209331.png';
  }
  if (name.includes('modric') || name.includes('modrić')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/177003.png';
  }
  if (name.includes('benzema')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/165153.png';
  }
  if (name.includes('neymar')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/190871.png';
  }
  if (name.includes('van dijk')) {
    return 'https://cdn.futbin.com/content/fifa24/img/players/203376.png';
  }
  
  if (player.image && !player.image.includes('sofifa.net') && !player.image.includes('picsum') && !player.image.includes('dicebear')) {
    return player.image;
  }

  return 'https://cdn.futbin.com/content/fifa24/img/players/20801.png';
}

export const PLAYERS: Player[] = [
  // --- RED EVENT PLAYERS (NUMERO 4A - Fiery Crimson) ---
  {
    id: 'cr7-titan-123',
    name: 'CRISTIANO RONALDO',
    rating: 123,
    shirtNumber: 7,
    position: 'FWD',
    detailedPosition: 'ST',
    club: 'Al Nassr',
    nation: 'Portugal',
    eventSide: 'red',
    skillBoost: {
      type: 'gold',
      nameAr: 'صاروخ ماديرا الأسطوري',
      nameEn: 'Legend Rocket Striker',
      level: 15,
      category: 'shooting',
      descriptionAr: 'قوة تسديد خارقة لا تصد وإنهاء إعجازي من أي زاوية'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/20801.png',
    stats: { pac: 128, sho: 135, pas: 118, dri: 125, def: 58, phy: 130 }
  },
  {
    id: 'messi-goat-123',
    name: 'LIONEL MESSI',
    rating: 123,
    shirtNumber: 10,
    position: 'FWD',
    detailedPosition: 'RW',
    club: 'Inter Miami',
    nation: 'Argentina',
    eventSide: 'blue',
    skillBoost: {
      type: 'gold',
      nameAr: 'البرغوث الساحر الأسطوري',
      nameEn: 'Golden Magician',
      level: 15,
      category: 'dribbling',
      descriptionAr: 'مراوغات إعجازية وتمريرات ساحرة وإنهاء تاريخي لا يصد'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/158023.png',
    stats: { pac: 126, sho: 134, pas: 132, dri: 136, def: 52, phy: 112 }
  },
  {
    id: 'hierro-122',
    name: 'FERNANDO HIERRO',
    rating: 122,
    shirtNumber: 4,
    position: 'DEF',
    detailedPosition: 'CB',
    club: 'Real Madrid',
    nation: 'Spain',
    eventSide: 'red',
    skillBoost: {
      type: 'gold',
      nameAr: 'جدار أسطوري',
      nameEn: 'Legend Wall',
      level: 15,
      category: 'defending',
      descriptionAr: 'افتكاك فولاذي وتغطية دفاعية لا تخترق'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/1088.png',
    stats: { pac: 114, sho: 98, pas: 112, dri: 108, def: 132, phy: 128 }
  },
  {
    id: 'fabregas-121',
    name: 'CESC FÀBREGAS',
    rating: 121,
    shirtNumber: 4,
    position: 'MID',
    detailedPosition: 'CM',
    club: 'Arsenal',
    nation: 'Spain',
    eventSide: 'red',
    skillBoost: {
      type: 'gold',
      nameAr: 'مايسترو التمرير',
      nameEn: 'Passing Maestro',
      level: 15,
      category: 'passing',
      descriptionAr: 'تمريرات حاسمة سحرية تخترق أعتى خطوط الدفاع'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/252371.png',
    stats: { pac: 110, sho: 116, pas: 132, dri: 124, def: 92, phy: 106 }
  },
  {
    id: 'schlotterbeck-120',
    name: 'N. SCHLOTTERBECK',
    rating: 120,
    shirtNumber: 4,
    position: 'DEF',
    detailedPosition: 'CB',
    club: 'Borussia Dortmund',
    nation: 'Germany',
    eventSide: 'red',
    skillBoost: {
      type: 'gold',
      nameAr: 'افتكاك ناري',
      nameEn: 'Blazing Tackle',
      level: 14,
      category: 'defending',
      descriptionAr: 'انقضاض سريع وافتكاك للكرات الأرضية والهوائية'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/246054.png',
    stats: { pac: 116, sho: 78, pas: 104, dri: 102, def: 128, phy: 124 }
  },
  // --- BLUE EVENT PLAYERS (NUMERO 7B - Electric Lightning) ---
  {
    id: 'cantona-122',
    name: 'ERIC CANTONA',
    rating: 122,
    shirtNumber: 7,
    position: 'FWD',
    detailedPosition: 'ST',
    club: 'Man Utd',
    nation: 'France',
    eventSide: 'blue',
    skillBoost: {
      type: 'gold',
      nameAr: 'الملك الهجومي',
      nameEn: 'King Finisher',
      level: 15,
      category: 'shooting',
      descriptionAr: 'قوة تسديد مدمرة لا تصد وإنهاء إعجازي'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/1075.png',
    stats: { pac: 120, sho: 132, pas: 118, dri: 126, def: 64, phy: 125 }
  },
  {
    id: 'saka-121',
    name: 'BUKAYO SAKA',
    rating: 121,
    shirtNumber: 7,
    position: 'FWD',
    detailedPosition: 'RW',
    club: 'Arsenal',
    nation: 'England',
    eventSide: 'blue',
    skillBoost: {
      type: 'gold',
      nameAr: 'انطلاقة خاطفة',
      nameEn: 'Electric Pace',
      level: 14,
      category: 'pace',
      descriptionAr: 'سرعة البرق ومراوغات قاتلة تخترق الأطراف'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/246669.png',
    stats: { pac: 130, sho: 122, pas: 118, dri: 128, def: 75, phy: 108 }
  },
  {
    id: 'simons-120',
    name: 'XAVI SIMONS',
    rating: 120,
    shirtNumber: 10,
    position: 'MID',
    detailedPosition: 'CAM',
    club: 'RB Leipzig',
    nation: 'Netherlands',
    eventSide: 'blue',
    skillBoost: {
      type: 'gold',
      nameAr: 'تحكم ساحر',
      nameEn: 'Magic Dribbler',
      level: 14,
      category: 'dribbling',
      descriptionAr: 'رشاقة وسرعة استثنائية في المراوغة تحت الضغط'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/245367.png',
    stats: { pac: 124, sho: 118, pas: 124, dri: 128, def: 68, phy: 104 }
  },
  {
    id: 'joelinton-118',
    name: 'JOELINTON',
    rating: 118,
    shirtNumber: 7,
    position: 'MID',
    detailedPosition: 'CM',
    club: 'Newcastle Utd',
    nation: 'Brazil',
    eventSide: 'blue',
    skillBoost: {
      type: 'silver',
      nameAr: 'قتالية وقوة بدنية',
      nameEn: 'Combat Drive',
      level: 9,
      category: 'physical',
      descriptionAr: 'التحام بدني كاسح وافتكاك الكرة في منتصف الميدان'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/228827.png',
    stats: { pac: 112, sho: 110, pas: 114, dri: 115, def: 110, phy: 125 }
  },
  // --- WORLD SUPERSTARS ---
  {
    id: 'mbappe-121',
    name: 'Kylian Mbappé',
    rating: 121,
    shirtNumber: 9,
    position: 'FWD',
    detailedPosition: 'ST',
    club: 'Real Madrid',
    nation: 'France',
    eventSide: 'red',
    skillBoost: {
      type: 'gold',
      nameAr: 'صاروخ السرعة',
      nameEn: 'Speed Missile',
      level: 15,
      category: 'pace',
      descriptionAr: 'سرعة أسطورية وإنهاء قاتل'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/231747.png',
    stats: { pac: 135, sho: 130, pas: 116, dri: 132, def: 55, phy: 110 }
  },
  {
    id: 'haaland-121',
    name: 'Erling Haaland',
    rating: 121,
    shirtNumber: 9,
    position: 'FWD',
    detailedPosition: 'ST',
    club: 'Man City',
    nation: 'Norway',
    eventSide: 'blue',
    skillBoost: {
      type: 'gold',
      nameAr: 'المدمر التهديفي',
      nameEn: 'Goal Destroyer',
      level: 15,
      category: 'shooting',
      descriptionAr: 'قوة جسمانية هائلة وتسديدات مدمرة'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/239085.png',
    stats: { pac: 126, sho: 136, pas: 102, dri: 116, def: 60, phy: 132 }
  },
  {
    id: 'vinicius-120',
    name: 'Vinícius Júnior',
    rating: 120,
    shirtNumber: 7,
    position: 'FWD',
    detailedPosition: 'LW',
    club: 'Real Madrid',
    nation: 'Brazil',
    eventSide: 'red',
    skillBoost: {
      type: 'gold',
      nameAr: 'سامبا المراوغة',
      nameEn: 'Samba Skill',
      level: 14,
      category: 'dribbling',
      descriptionAr: 'مراوغات برازيلية ساحرة وسرعة خارقة'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/238794.png',
    stats: { pac: 134, sho: 124, pas: 118, dri: 132, def: 48, phy: 105 }
  },
  {
    id: 'debruyne-120',
    name: 'Kevin De Bruyne',
    rating: 120,
    shirtNumber: 17,
    position: 'MID',
    detailedPosition: 'CAM',
    club: 'Man City',
    nation: 'Belgium',
    eventSide: 'blue',
    skillBoost: {
      type: 'gold',
      nameAr: 'المهندس الملكي',
      nameEn: 'Royal Engineer',
      level: 14,
      category: 'passing',
      descriptionAr: 'تمريرات ميليمترية ورؤية ملهمة'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/192985.png',
    stats: { pac: 108, sho: 126, pas: 135, dri: 124, def: 88, phy: 115 }
  },
  {
    id: 'vandijk-120',
    name: 'Virgil van Dijk',
    rating: 120,
    shirtNumber: 4,
    position: 'DEF',
    detailedPosition: 'CB',
    club: 'Liverpool',
    nation: 'Netherlands',
    eventSide: 'red',
    skillBoost: {
      type: 'gold',
      nameAr: 'سد ليفربول المنيع',
      nameEn: 'Unbreakable Guard',
      level: 14,
      category: 'defending',
      descriptionAr: 'قوة بدنية لا تقهر وسيادة جوية كاملة'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/203376.png',
    stats: { pac: 112, sho: 75, pas: 105, dri: 102, def: 134, phy: 130 }
  },
  {
    id: 'courtois-119',
    name: 'Thibaut Courtois',
    rating: 119,
    shirtNumber: 1,
    position: 'GK',
    detailedPosition: 'GK',
    club: 'Real Madrid',
    nation: 'Belgium',
    eventSide: 'blue',
    skillBoost: {
      type: 'gold',
      nameAr: 'الأخطبوط العملاق',
      nameEn: 'Giant Octopus',
      level: 14,
      category: 'gk',
      descriptionAr: 'تصديات مستحيلة وتغطية كاملة للمرمى'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/192119.png',
    stats: { pac: 105, sho: 98, pas: 110, dri: 104, def: 125, phy: 118 }
  },
  {
    id: 'alisson-119',
    name: 'Alisson Becker',
    rating: 119,
    shirtNumber: 1,
    position: 'GK',
    detailedPosition: 'GK',
    club: 'Liverpool',
    nation: 'Brazil',
    eventSide: 'blue',
    skillBoost: {
      type: 'gold',
      nameAr: 'الحارس الذهبي',
      nameEn: 'Golden Gloves',
      level: 14,
      category: 'gk',
      descriptionAr: 'ثبات وردة فعل خارقة في الانفرادات'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/212831.png',
    stats: { pac: 104, sho: 96, pas: 112, dri: 106, def: 124, phy: 116 }
  },
  // --- LEGEND & PORTUGAL STARS ---
  {
    id: 'sk-2',
    name: 'CR7 TITAN RED',
    rating: 120,
    shirtNumber: 7,
    position: 'FWD',
    detailedPosition: 'ST',
    club: 'Al Nassr',
    nation: 'Portugal',
    eventSide: 'red',
    skillBoost: {
      type: 'gold',
      nameAr: 'تسديد صاروخي',
      nameEn: 'Rocket Shot',
      level: 15,
      category: 'shooting',
      descriptionAr: 'قوة تسديد مدمرة لا تصد'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/20801.png',
    stats: { pac: 122, sho: 130, pas: 115, dri: 120, def: 55, phy: 125 }
  },
  {
    id: 'messi-titan-blue',
    name: 'MESSI TITAN BLUE',
    rating: 120,
    shirtNumber: 10,
    position: 'FWD',
    detailedPosition: 'CF',
    club: 'Inter Miami',
    nation: 'Argentina',
    eventSide: 'blue',
    skillBoost: {
      type: 'gold',
      nameAr: 'صانع المجد',
      nameEn: 'Glory Maker',
      level: 14,
      category: 'passing',
      descriptionAr: 'رؤية خيالية وتوزيع كرات متقن'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/158023.png',
    stats: { pac: 120, sho: 128, pas: 130, dri: 132, def: 50, phy: 105 }
  },
  {
    id: 'legend-figo',
    name: 'LUIS FIGO BLUE',
    rating: 120,
    shirtNumber: 10,
    position: 'MID',
    detailedPosition: 'RW',
    club: 'Portugal Legends',
    nation: 'Portugal',
    eventSide: 'blue',
    skillBoost: {
      type: 'gold',
      nameAr: 'صانع ألعاب أسطوري',
      nameEn: 'Legend Maestro',
      level: 15,
      category: 'passing',
      descriptionAr: 'تمريرات ساحرة ورؤية شاملة'
    },
    image: 'https://cdn.futbin.com/content/fifa23/img/players/1040.png',
    stats: { pac: 118, sho: 115, pas: 122, dri: 125, def: 60, phy: 95 }
  },
  {
    id: 'legend-eusebio',
    name: 'EUSÉBIO PRIME RED',
    rating: 119,
    shirtNumber: 10,
    position: 'FWD',
    detailedPosition: 'CF',
    club: 'Portugal Legends',
    nation: 'Portugal',
    eventSide: 'red',
    skillBoost: {
      type: 'gold',
      nameAr: 'إنهاء خارق',
      nameEn: 'Apex Finisher',
      level: 15,
      category: 'shooting',
      descriptionAr: 'دقة استثنائية أمام الشباك'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/1075.png',
    stats: { pac: 125, sho: 130, pas: 105, dri: 118, def: 45, phy: 110 }
  },
  {
    id: '2',
    name: 'Cristiano Ronaldo',
    rating: 117,
    shirtNumber: 7,
    position: 'FWD',
    detailedPosition: 'LW',
    club: 'Al Nassr',
    nation: 'Portugal',
    eventSide: 'red',
    skillBoost: {
      type: 'gold',
      nameAr: 'رأسيات نارية',
      nameEn: 'Aerial Dominance',
      level: 13,
      category: 'shooting',
      descriptionAr: 'ارتقاء جوي وضربات رأسية متقنة'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/20801.png',
    stats: { pac: 115, sho: 120, pas: 110, dri: 115, def: 45, phy: 118 }
  },
  {
    id: 'messi-117',
    name: 'Lionel Messi',
    rating: 117,
    shirtNumber: 10,
    position: 'FWD',
    detailedPosition: 'RW',
    club: 'Inter Miami',
    nation: 'Argentina',
    eventSide: 'blue',
    skillBoost: {
      type: 'gold',
      nameAr: 'سحر التمرير والمراوغة',
      nameEn: 'Magic Vision',
      level: 13,
      category: 'dribbling',
      descriptionAr: 'مهارة فائقة في اختراق الدفاعات'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/158023.png',
    stats: { pac: 112, sho: 122, pas: 126, dri: 128, def: 48, phy: 95 }
  },
  {
    id: '40',
    name: 'Ruben Dias',
    rating: 118,
    shirtNumber: 3,
    position: 'DEF',
    detailedPosition: 'CB',
    club: 'Man City',
    nation: 'Portugal',
    eventSide: 'red',
    skillBoost: {
      type: 'gold',
      nameAr: 'جدار حديدي',
      nameEn: 'Iron Wall',
      level: 14,
      category: 'defending',
      descriptionAr: 'قوة اعتراض وتمركز لا يخترق'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/239818.png',
    stats: { pac: 95, sho: 65, pas: 90, dri: 92, def: 122, phy: 120 }
  },
  {
    id: '19',
    name: 'Bernardo Silva',
    rating: 116,
    shirtNumber: 10,
    position: 'MID',
    detailedPosition: 'CAM',
    club: 'Man City',
    nation: 'Portugal',
    eventSide: 'blue',
    skillBoost: {
      type: 'gold',
      nameAr: 'مراوغ ساحر',
      nameEn: 'Wizard Dribbler',
      level: 13,
      category: 'dribbling',
      descriptionAr: 'تحكم لصيق بالكرة في المساحات الضيقة'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/218667.png',
    stats: { pac: 95, sho: 98, pas: 118, dri: 122, def: 80, phy: 88 }
  },
  {
    id: '20',
    name: 'Bruno Fernandes',
    rating: 115,
    shirtNumber: 8,
    position: 'MID',
    detailedPosition: 'CM',
    club: 'Man Utd',
    nation: 'Portugal',
    eventSide: 'red',
    skillBoost: {
      type: 'gold',
      nameAr: 'رؤية ثاقبة',
      nameEn: 'Master Vision',
      level: 12,
      category: 'passing',
      descriptionAr: 'صناعة فرص استثنائية من منتصف الملعب'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/212198.png',
    stats: { pac: 92, sho: 115, pas: 120, dri: 110, def: 82, phy: 95 }
  },
  {
    id: '44',
    name: 'Vitinha',
    rating: 115,
    shirtNumber: 23,
    position: 'MID',
    detailedPosition: 'CM',
    club: 'PSG',
    nation: 'Portugal',
    eventSide: 'blue',
    skillBoost: {
      type: 'gold',
      nameAr: 'مهندس الوسط',
      nameEn: 'Midfield Engine',
      level: 12,
      category: 'passing',
      descriptionAr: 'ربط الخطوط وسرعة توزيع اللعب'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/218667.png',
    stats: { pac: 105, sho: 98, pas: 118, dri: 120, def: 88, phy: 92 }
  },
  {
    id: '31',
    name: 'Rafael Leão',
    rating: 114,
    shirtNumber: 17,
    position: 'FWD',
    detailedPosition: 'LW',
    club: 'AC Milan',
    nation: 'Portugal',
    eventSide: 'blue',
    skillBoost: {
      type: 'gold',
      nameAr: 'انطلاقة البرق',
      nameEn: 'Lightning Sprint',
      level: 12,
      category: 'pace',
      descriptionAr: 'تسارع مدمر على الأجنحة'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/241721.png',
    stats: { pac: 122, sho: 110, pas: 95, dri: 118, def: 40, phy: 98 }
  },
  {
    id: '45',
    name: 'João Neves',
    rating: 114,
    shirtNumber: 87,
    position: 'MID',
    detailedPosition: 'CDM',
    club: 'PSG',
    nation: 'Portugal',
    eventSide: 'blue',
    skillBoost: {
      type: 'gold',
      nameAr: 'افتراس الكرات',
      nameEn: 'Ball Hunter',
      level: 11,
      category: 'defending',
      descriptionAr: 'ضغط عالي واستعادة سريعة للاستحواذ'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/245367.png',
    stats: { pac: 102, sho: 90, pas: 115, dri: 112, def: 95, phy: 98 }
  },
  {
    id: '55',
    name: 'Rúben Neves',
    rating: 114,
    shirtNumber: 8,
    position: 'MID',
    detailedPosition: 'CM',
    club: 'Al Hilal',
    nation: 'Portugal',
    eventSide: 'red',
    skillBoost: {
      type: 'gold',
      nameAr: 'مدفعجي بعيد',
      nameEn: 'Long Cannon',
      level: 11,
      category: 'shooting',
      descriptionAr: 'تسديدات بعيدة المدى فائقة الدقة'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/224232.png',
    stats: { pac: 82, sho: 110, pas: 122, dri: 105, def: 95, phy: 108 }
  },
  {
    id: 'cancelo-113',
    name: 'João Cancelo',
    rating: 113,
    shirtNumber: 20,
    position: 'DEF',
    detailedPosition: 'RB',
    club: 'Al Hilal',
    nation: 'Portugal',
    eventSide: 'blue',
    skillBoost: {
      type: 'silver',
      nameAr: 'ظهير هجومي',
      nameEn: 'Attacking Wingback',
      level: 9,
      category: 'pace',
      descriptionAr: 'مساندة هجومية وعرضيات نموذجية'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/210514.png',
    stats: { pac: 110, sho: 85, pas: 112, dri: 115, def: 105, phy: 92 }
  },
  {
    id: '46',
    name: 'Nuno Mendes',
    rating: 113,
    shirtNumber: 19,
    position: 'DEF',
    detailedPosition: 'LB',
    club: 'PSG',
    nation: 'Portugal',
    eventSide: 'blue',
    skillBoost: {
      type: 'silver',
      nameAr: 'سرعة الجناح',
      nameEn: 'Wing Speed',
      level: 9,
      category: 'pace',
      descriptionAr: 'سرعة ارتداد دفاعي وهجومي'
    },
    image: 'https://cdn.futbin.com/content/fifa23/img/players/258504.png',
    stats: { pac: 122, sho: 85, pas: 105, dri: 118, def: 108, phy: 95 }
  },
  {
    id: '52',
    name: 'Otávio',
    rating: 113,
    shirtNumber: 25,
    position: 'MID',
    detailedPosition: 'RM',
    club: 'Al Nassr',
    nation: 'Portugal',
    eventSide: 'red',
    skillBoost: {
      type: 'silver',
      nameAr: 'روح قتالية',
      nameEn: 'Tenacity',
      level: 9,
      category: 'physical',
      descriptionAr: 'شراسة في الالتحامات والمراوغة'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/224232.png',
    stats: { pac: 95, sho: 90, pas: 112, dri: 115, def: 85, phy: 98 }
  },
  {
    id: 'pepe-112',
    name: 'Pepe Monster',
    rating: 112,
    shirtNumber: 3,
    position: 'DEF',
    detailedPosition: 'CB',
    club: 'FC Porto',
    nation: 'Portugal',
    eventSide: 'red',
    skillBoost: {
      type: 'silver',
      nameAr: 'تدخل صلب',
      nameEn: 'Hard Tackle',
      level: 9,
      category: 'defending',
      descriptionAr: 'قوة بدنية وتدخلات حاسمة'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/120533.png',
    stats: { pac: 90, sho: 60, pas: 80, dri: 82, def: 120, phy: 125 }
  },
  {
    id: '43',
    name: 'Diogo Costa',
    rating: 112,
    shirtNumber: 1,
    position: 'GK',
    detailedPosition: 'GK',
    club: 'FC Porto',
    nation: 'Portugal',
    eventSide: 'blue',
    skillBoost: {
      type: 'silver',
      nameAr: 'رد فعل حارس',
      nameEn: 'GK Reflex',
      level: 9,
      category: 'gk',
      descriptionAr: 'مرونة في التصدي لركلات الجزاء'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/192119.png',
    stats: { pac: 95, sho: 92, pas: 105, dri: 98, def: 112, phy: 95 }
  },
  {
    id: '47',
    name: 'João Palhinha',
    rating: 112,
    shirtNumber: 6,
    position: 'MID',
    detailedPosition: 'CDM',
    club: 'Bayern Munich',
    nation: 'Portugal',
    eventSide: 'red',
    skillBoost: {
      type: 'silver',
      nameAr: 'صخرة الارتكاز',
      nameEn: 'Midfield Rock',
      level: 8,
      category: 'defending',
      descriptionAr: 'افتكاك الكرات وقوة بدنية هائلة'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/228827.png',
    stats: { pac: 85, sho: 88, pas: 98, dri: 95, def: 125, phy: 128 }
  },
  {
    id: '51',
    name: 'António Silva',
    rating: 112,
    shirtNumber: 4,
    position: 'DEF',
    detailedPosition: 'CB',
    club: 'PSG',
    nation: 'Portugal',
    eventSide: 'red',
    skillBoost: {
      type: 'silver',
      nameAr: 'تغطية ذكية',
      nameEn: 'Smart Cover',
      level: 8,
      category: 'defending',
      descriptionAr: 'قراءة مسار الكرات والعرضيات'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/246054.png',
    stats: { pac: 92, sho: 45, pas: 80, dri: 78, def: 118, phy: 112 }
  },
  {
    id: '48',
    name: 'Diogo Dalot',
    rating: 111,
    shirtNumber: 20,
    position: 'DEF',
    detailedPosition: 'RB',
    club: 'Man Utd',
    nation: 'Portugal',
    eventSide: 'red',
    skillBoost: {
      type: 'silver',
      nameAr: 'عرضيات دقيقة',
      nameEn: 'Pinpoint Cross',
      level: 8,
      category: 'passing',
      descriptionAr: 'تمريرات عرضية وصناعة أهداف'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/234574.png',
    stats: { pac: 112, sho: 82, pas: 108, dri: 110, def: 112, phy: 105 }
  },
  {
    id: '53',
    name: 'Matheus Nunes',
    rating: 111,
    shirtNumber: 27,
    position: 'MID',
    detailedPosition: 'CM',
    club: 'Man City',
    nation: 'Portugal',
    eventSide: 'blue',
    skillBoost: {
      type: 'silver',
      nameAr: 'حمل الكرة',
      nameEn: 'Ball Carrier',
      level: 7,
      category: 'dribbling',
      descriptionAr: 'اختراق الخطوط وحمل الكرة للأمام'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/212198.png',
    stats: { pac: 105, sho: 85, pas: 108, dri: 112, def: 88, phy: 102 }
  },
  {
    id: '50',
    name: 'Gonçalo Inácio',
    rating: 111,
    shirtNumber: 25,
    position: 'DEF',
    detailedPosition: 'CB',
    club: 'FC Porto',
    nation: 'Portugal',
    eventSide: 'red',
    skillBoost: {
      type: 'silver',
      nameAr: 'تمركز دفاعي',
      nameEn: 'Defensive Position',
      level: 7,
      category: 'defending',
      descriptionAr: 'إغلاق زوايا التمرير'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/239818.png',
    stats: { pac: 88, sho: 55, pas: 85, dri: 82, def: 115, phy: 110 }
  },
  {
    id: '59',
    name: 'André Silva',
    rating: 111,
    shirtNumber: 9,
    position: 'FWD',
    detailedPosition: 'ST',
    club: 'Liverpool',
    nation: 'Portugal',
    eventSide: 'red',
    skillBoost: {
      type: 'silver',
      nameAr: 'ارتقاء هوائي',
      nameEn: 'Aerial Leap',
      level: 7,
      category: 'shooting',
      descriptionAr: 'ضربات رأسية دقيقة'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/215698.png',
    stats: { pac: 92, sho: 112, pas: 85, dri: 98, def: 45, phy: 95 }
  },
  {
    id: '41',
    name: 'Diogo Jota',
    rating: 110,
    shirtNumber: 20,
    position: 'FWD',
    detailedPosition: 'LW',
    club: 'Liverpool',
    nation: 'Portugal',
    eventSide: 'red',
    skillBoost: {
      type: 'silver',
      nameAr: 'قناص المرمى',
      nameEn: 'Goal Poacher',
      level: 7,
      category: 'shooting',
      descriptionAr: 'اقتناص الكرات المرتدة داخل الصندوق'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/224458.png',
    stats: { pac: 102, sho: 108, pas: 88, dri: 105, def: 52, phy: 85 }
  },
  {
    id: '49',
    name: 'Pedro Neto',
    rating: 110,
    shirtNumber: 7,
    position: 'FWD',
    detailedPosition: 'RW',
    club: 'Chelsea',
    nation: 'Portugal',
    eventSide: 'blue',
    skillBoost: {
      type: 'silver',
      nameAr: 'مراوغة خاطفة',
      nameEn: 'Lightning Cut',
      level: 7,
      category: 'pace',
      descriptionAr: 'سرعة في المراوغة والتسديد بالقدم اليسرى'
    },
    image: 'https://cdn.futbin.com/content/fifa23/img/players/244928.png',
    stats: { pac: 125, sho: 102, pas: 108, dri: 122, def: 45, phy: 88 }
  },
  {
    id: '54',
    name: 'Francisco Conceição',
    rating: 110,
    shirtNumber: 7,
    position: 'FWD',
    detailedPosition: 'RW',
    club: 'FC Porto',
    nation: 'Portugal',
    eventSide: 'blue',
    skillBoost: {
      type: 'silver',
      nameAr: 'انفجار السرعة',
      nameEn: 'Speed Burst',
      level: 7,
      category: 'dribbling',
      descriptionAr: 'مراوغة واحد لواحد وسرعة رد الفعل'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/241721.png',
    stats: { pac: 120, sho: 95, pas: 92, dri: 125, def: 35, phy: 75 }
  },
  {
    id: '56',
    name: 'Florentino Luís',
    rating: 110,
    shirtNumber: 61,
    position: 'MID',
    detailedPosition: 'CDM',
    club: 'Barcelona',
    nation: 'Portugal',
    eventSide: 'blue',
    skillBoost: {
      type: 'silver',
      nameAr: 'قطع التمرير',
      nameEn: 'Interception',
      level: 6,
      category: 'defending',
      descriptionAr: 'توقع مسار التمريرات وافتكاك نظيف'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/243630.png',
    stats: { pac: 85, sho: 60, pas: 88, dri: 90, def: 115, phy: 105 }
  },
  {
    id: '58',
    name: 'Nélson Semedo',
    rating: 110,
    shirtNumber: 22,
    position: 'DEF',
    detailedPosition: 'RB',
    club: 'Chelsea',
    nation: 'Portugal',
    eventSide: 'blue',
    skillBoost: {
      type: 'silver',
      nameAr: 'تغطية جانبية',
      nameEn: 'Side Cover',
      level: 6,
      category: 'pace',
      descriptionAr: 'سرعة دفاعية في الكرات العالية والقصيرة'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/227928.png',
    stats: { pac: 115, sho: 70, pas: 92, dri: 105, def: 105, phy: 95 }
  },
  {
    id: '42',
    name: 'Gonçalo Ramos',
    rating: 109,
    shirtNumber: 9,
    position: 'FWD',
    detailedPosition: 'ST',
    club: 'PSG',
    nation: 'Portugal',
    eventSide: 'red',
    skillBoost: {
      type: 'silver',
      nameAr: 'ضغط مباشر',
      nameEn: 'High Pressure',
      level: 6,
      category: 'physical',
      descriptionAr: 'إجهاد مدافعي الخصم والإنهاء بلمسة واحدة'
    },
    image: 'https://cdn.futbin.com/content/fifa24/img/players/256630.png',
    stats: { pac: 95, sho: 105, pas: 82, dri: 98, def: 45, phy: 92 }
  }
];
