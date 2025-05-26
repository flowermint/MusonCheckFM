import { useState, useEffect } from 'react';
import { fetchTopArtists, fetchArtistInfo } from '../api/lastfm';
import { Artist } from '../types/artist';

/**
 * Хук для получения данных об артистах из чарта Last.fm.

 * 
 * @param {number} [limit=20] - Количество возвращаемых артистов (по умолчанию 20)
 * @returns {Object} Объект с результатами выполнения
 * @returns {Artist[]} artists - Массив объектов артистов с полной информацией
 * @returns {boolean} loading - Флаг состояния загрузки
 * @returns {string|null} error - Сообщение об ошибке (null если ошибки нет)
 * 
 * @example
 * // Получение 8 топовых артистов
 * const { artists, loading, error } = useArtists(8);
 * 
 * @example
 * // Использование со значением по умолчанию (20 артистов)
 * const { artists } = useArtists();
 * console.log(artists[0].name); // Название первого артиста
 */
export const useArtists = (limit = 20) => {
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