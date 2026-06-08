import { SpotifyStreamingData, AdvancedStats } from './types';

export function calculateAdvancedStats(data: SpotifyStreamingData[]): AdvancedStats {
  if (data.length === 0) {
    return {
      peakListeningHour: 0,
      skipIndex: 0,
      weekendListenRatio: 0,
      topLoyalArtist: { name: '', plays: 0 },
    };
  }

  // peakListeningHour
  const hourCounts: Record<number, number> = {};
  data.forEach((d) => {
    const hour = new Date(d.endTime).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  let peakListeningHour = 0;
  let maxStreams = 0;
  Object.entries(hourCounts).forEach(([hour, count]) => {
    if (count > maxStreams) {
      maxStreams = count;
      peakListeningHour = parseInt(hour);
    }
  });

  // weekendListenRatio
  const weekendStreams = data.filter((d) => {
    const day = new Date(d.endTime).getDay();
    return day === 0 || day === 6;
  }).length;
  const weekendListenRatio = weekendStreams / data.length;

  // topLoyalArtist
  const artistCounts: Record<string, number> = {};
  data.forEach((d) => {
    artistCounts[d.artistName] = (artistCounts[d.artistName] || 0) + 1;
  });
  let topLoyalArtistName = '';
  let maxArtistPlays = 0;
  Object.entries(artistCounts).forEach(([artist, plays]) => {
    if (plays > maxArtistPlays) {
      maxArtistPlays = plays;
      topLoyalArtistName = artist;
    }
  });

  // skipIndex (using average track length of 3 minutes = 180000ms)
  const totalMsPlayed = data.reduce((sum, d) => sum + d.msPlayed, 0);
  const skipIndex = totalMsPlayed / (data.length * 180000);

  return {
    peakListeningHour,
    skipIndex,
    weekendListenRatio,
    topLoyalArtist: { name: topLoyalArtistName, plays: maxArtistPlays },
  };
}
