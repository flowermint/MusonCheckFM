import { useState, useEffect } from 'react';
import { searchArtists, fetchArtistInfo } from '../api/lastfm';
import { Artist } from '../types/artist';

export const useSearchArtists = (query: string, limit = 10) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [artistsLoading, setLoading] = useState(true);
  const [artistsError, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setArtists([]);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchArtists = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Сначала ищем артистов по запросу
        const searchData = await searchArtists(query, limit);
        
        // 2. Для каждого найденного артиста получаем полную информацию
        const artistsPromises = searchData.results.artistmatches.artist.map(async (artist: any) => {
          const artistInfo = await fetchArtistInfo(artist.name);
          return new Artist(artistInfo.artist || artist); // fallback к базовым данным
        });

        const artistsData = await Promise.all(artistsPromises);
        if (!signal.aborted) {
          await Promise.all(
          artistsData.map(artist => artist.fetchImages())
        );
          setArtists(artistsData.filter(artist => artist.name)); // Фильтруем пустые значения
        }
      } catch (err) {
        if (!signal.aborted) {
          setError('Failed to load artists');
          console.error(err);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    const debounceTimer = setTimeout(fetchArtists, 500);
    return () => {
      clearTimeout(debounceTimer);
      controller.abort();
    };
  }, [query, limit]);

  return { artists, artistsLoading, artistsError };
};

export {}