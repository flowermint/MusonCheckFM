import { useState, useEffect } from 'react';
import { Track} from '../types/index';
import { searchTracks, searchArtists, searchAlbums, fetchTrackInfo } from '../api/lastfm';
/**
 * Хук для поиска треков с Last.fm
 * 
 * @param {string} query - Название трека
 * 
 * @returns {Track[]} tracks - Найденные треки (массив объектов Track)
 * @returns {boolean} loading - Флаг выполнения запроса (true - в процессе загрузки)
 * @returns {string} error - Сообщение об ошибке (пустая строка, если ошибок нет)
 * 
 * @example
 * // Базовое использование
 * const { tracks, loading, error } = useSearchTracks('Bohemian Rhapsody');
 * 
 * @example
 * // Обработка состояний загрузки
 * const SearchResults = ({ query }) => {
 *   const { tracks, loading, error } = useSearchTracks(query);
 *   
 *   if (loading) return <Loader />;
 *   if (error) return <Error message={error} />;
 *   return <TrackList tracks={tracks} />;
 * };
 */
export const useSearchTracks = (query: string) => {
  const [results, setResults] = useState<{
    tracks: Track[];
  }>({ tracks: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ tracks: []});
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 1. Получаем базовые результаты поиска
        const [tracksResponse] = await Promise.all([
          searchTracks(query, 9),
        ]);

        // 2. Обрабатываем треки (с дополнительными запросами)
        const trackPromises = tracksResponse.results?.trackmatches?.track?.map(async (trackData: any) => {
          try {
            // Делаем запрос за полной информацией о треке
            const fullTrackInfo = await fetchTrackInfo(
              trackData.artist,
              trackData.name,
            );
            return new Track(fullTrackInfo.track || trackData);
          } catch (err) {
            console.error('Failed to fetch full track info:', err);
            return new Track(trackData);
          }
        }) || [];

        const tracks = await Promise.all(trackPromises);

        setResults({ tracks });
      } catch (err) {
        if (!signal.aborted) {
          setError('Failed to load search results');
          console.error(err);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
          setError('')
        }
      }
    };

    const timer = setTimeout(fetchData, 500);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return { ...results, loading, error };
};