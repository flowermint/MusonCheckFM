import { useState, useEffect } from 'react';
import { fetchTopArtists, fetchArtistInfo } from '../api/lastfm';
import { Artist } from '../types/artist';

export const useArtists = (limit = 14) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Получаем топ артистов
        const topArtistsData = await fetchTopArtists(limit);
        
        // 2. Для каждого артиста получаем детальную информацию
        const artistsPromises = topArtistsData.artists.artist.map(async (artist: any) => {
          const artistInfo = await fetchArtistInfo(artist.name);
          const artistObj = new Artist(artistInfo.artist || artist);
          
          // 3. Загружаем изображения для артиста
          try {
            await artistObj.fetchImages();
          } catch (err) {
            console.error("Failed to load artist images:", err);
          }
          
          return artistObj;
        });

        const artistsData = await Promise.all(artistsPromises);
        setArtists(artistsData);
      } catch (err) {
        setError('Failed to load artists');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [limit]);

  return { artists, loading, error };
};