/**
 * Player Bridge System
 * Connects the mobile simulator player database with the 3D game superstar system
 */

import { Player, PLAYERS } from './players';
import { SuperstarProfile, SUPERSTARS } from '../game/superstars';

/**
 * Convert a mobile simulator Player to a 3D game SuperstarProfile
 * Used when a collected player is selected for 3D gameplay
 */
export function playerToSuperstar(player: Player): SuperstarProfile {
  // Map player positions to superstar positions
  const positionMap: Record<string, 'ST' | 'LW' | 'RW' | 'CF'> = {
    'ST': 'ST',
    'CF': 'CF',
    'LW': 'LW',
    'RW': 'RW',
    'CAM': 'CF',
    'CM': 'CF',
    'CDM': 'CF',
    'GK': 'ST', // Goalkeepers mapped to ST for compatibility
    'DEF': 'ST', // Defenders mapped to ST for compatibility
    'MID': 'CF', // Midfielders mapped to CF
    'FWD': 'ST',
  };

  // Get base position
  const basePosition = player.detailedPosition || player.position;
  const mappedPosition = positionMap[basePosition] || 'ST';

  // Calculate theme color based on rating
  const getThemeColor = (rating: number): string => {
    if (rating >= 120) return '#fbbf24'; // Gold for 120+
    if (rating >= 115) return '#f59e0b'; // Amber for 115-119
    if (rating >= 110) return '#10b981'; // Emerald for 110-114
    if (rating >= 100) return '#3b82f6'; // Blue for 100-109
    return '#6b7280'; // Gray for <100
  };

  // Create a superstar profile from the player
  const superstar: SuperstarProfile = {
    id: (player.id.includes('mbappe') ? 'mbappe' : 
         player.id.includes('ronaldo') ? 'ronaldo' :
         player.id.includes('haaland') ? 'haaland' :
         player.id.includes('messi') ? 'messi' : 'neymar') as any, // Map to valid superstar IDs
    nameAr: player.name,
    nameEn: player.name,
    rating: player.rating,
    position: mappedPosition,
    jerseyNumber: player.shirtNumber || 10,
    club: player.club,
    flag: player.nation === 'Portugal' ? '🇵🇹' : 
          player.nation === 'Argentina' ? '🇦🇷' :
          player.nation === 'France' ? '🇫🇷' :
          player.nation === 'Brazil' ? '🇧🇷' :
          player.nation === 'Norway' ? '🇳🇴' : '⚽',
    avatarEmoji: player.position === 'GK' ? '🧤' : '⚽',
    stats: {
      PAC: player.stats.pac,
      SHO: player.stats.sho,
      PAS: player.stats.pas,
      DRI: player.stats.dri,
      DEF: player.stats.def,
      PHY: player.stats.phy,
    },
    traits: {
      walkSpeed: 6.0 + (player.stats.pac / 20),
      sprintSpeed: 8.0 + (player.stats.pac / 15),
      maxShotPower: 25.0 + (player.stats.sho / 3),
      curveMultiplier: 1.0 + (player.stats.dri / 50),
      turnSpeed: 20.0 + (player.stats.dri / 5),
      description: `${player.name} - OVR ${player.rating} ${player.position} from ${player.club}`,
      specialSkill: player.rating >= 115 ? 'Special Ability Active' : 'Standard Player',
    },
    themeColor: getThemeColor(player.rating),
    secondaryColor: '#fbbf24',
  };

  return superstar;
}

/**
 * Get all available players including both superstars and mobile database
 */
export function getAllPlayers(): Player[] {
  return [...PLAYERS];
}

/**
 * Get superstar players as Player format for collection system
 */
export function getSuperstarsAsPlayers(): Player[] {
  return SUPERSTARS.map(star => ({
    id: star.id,
    name: star.nameEn,
    rating: star.rating,
    shirtNumber: star.jerseyNumber,
    position: star.position === 'ST' ? 'FWD' : 
             star.position === 'LW' ? 'FWD' : 
             star.position === 'RW' ? 'FWD' : 'MID',
    detailedPosition: star.position,
    club: star.club,
    nation: star.flag === '🇵🇹' ? 'Portugal' :
           star.flag === '🇦🇷' ? 'Argentina' :
           star.flag === '🇫🇷' ? 'France' :
           star.flag === '🇧🇷' ? 'Brazil' :
           star.flag === '🇳🇴' ? 'Norway' : 'International',
    image: `https://upload.wikimedia.org/wikipedia/en/thumb/e/e3/FIFA_World_Cup_Trophy.svg/512px-FIFA_World_Cup_Trophy.svg.png`,
    stats: {
      pac: star.stats.PAC,
      sho: star.stats.SHO,
      pas: star.stats.PAS,
      dri: star.stats.DRI,
      def: star.stats.DEF,
      phy: star.stats.PHY,
    },
  }));
}

/**
 * Find a player by ID from either system
 */
export function findPlayerById(id: string): Player | null {
  // Check mobile players first
  const mobilePlayer = PLAYERS.find(p => p.id === id);
  if (mobilePlayer) return mobilePlayer;

  // Check superstars
  const superstar = SUPERSTARS.find(s => s.id === id);
  if (superstar) {
    const superstarPlayers = getSuperstarsAsPlayers();
    return superstarPlayers.find(p => p.id === id) || null;
  }

  return null;
}

/**
 * Get recommended players for 3D gameplay based on rating
 */
export function getRecommendedPlayersFor3D(count: number = 5): Player[] {
  return PLAYERS
    .filter(p => p.rating >= 110)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, count);
}