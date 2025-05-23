import { useState, useEffect } from 'react';
import { fetchTopTracks, fetchTrackInfo } from '../api/lastfm';
import { Track } from '../types/track';
/**
 * Хук для получения треков из чарта Last.fm API
 * 
 * @param {number} [limit=8] - Количество возвращаемых треков (по умолчанию 9)
 * 
 * @returns {Track[]} tracks - Массив треков с полной информацией
 * @returns {boolean} loading - Флаг состояния загрузки
 * @returns {string|null} error - Сообщение об ошибке (null если ошибок нет)
 * 
 * @example
 * // Получение топ-9 треков по умолчанию
 * const { tracks } = useTracks();
 * 
 * @example
 * // Получение 10 треков с обработкой состояний
 * const { tracks, loading, error } = useTracks(10);
 * if (loading) return <Spinner />;
 * if (error) return <Error message={error} />;
 * return <TrackList items={tracks} />;
 */
export const useTracks = (limit = 9) => {
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