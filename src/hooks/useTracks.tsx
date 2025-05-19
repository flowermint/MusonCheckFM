import { useState, useEffect } from 'react';
import { fetchTopTracks, fetchTrackInfo } from '../api/lastfm';
import { Track } from '../types/track';

export const useTracks = (limit = 6) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      try {
        const data = await fetchTopTracks(limit);
        const tracks = await Promise.all(
          data.tracks.track.map(async (track: any) => {
            const info = await fetchTrackInfo(track.artist.name, track.name);
            return new Track(info.track);
          })
        );
        setTracks(tracks);
      } catch (err) {
        setError('Failed to load tracks');
      } finally {
        setLoading(false);
      }
    };
    fetchTracks();
  }, [limit]);

  return { tracks, loading, error };
};