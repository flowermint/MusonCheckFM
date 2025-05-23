import {useState, useEffect} from 'react'
import { Album } from '../types'
import { searchAlbums } from '../api/lastfm'
/**
 * Хук для поиска альбомов по запросу c Last.fm
 * 
 * @param {string} query - Название альбома
 * 
 * @returns {Album[]} albums - Найденные альбомы (пустой массив если ничего не найдено)
 * @returns {boolean} albumsLoading - Флаг выполнения запроса
 * @returns {string|null} albumsError - Сообщение об ошибке (null если ошибок нет)
 * 
 * @example
 * // Базовое использование
 * const { albums, albumsLoading, albumsError } = useSearchAlbums('Whole Lotta Red');
 * 
 * @example
 * // Обработка состояний
 * if (albumsLoading) return <Loader />;
 * if (albumsError) return <Error message={albumsError} />;
 * return <AlbumGrid albums={albums} />;
 */
export const useSearchAlbums = (query: string) => {
    const [results, setResults] = useState<{
        albums: Album[];
    }>({albums: []});

    const [albumsLoading, setLoading] = useState(true)
    const [albumsError, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!query.trim()) {
            setResults({albums: []});
            return;
        }

    const controller = new AbortController();
    const {signal} = controller

    const fetchData = async() => {
        setLoading(true)
        setError(null)

        try {
            const [albumsResponse] = await Promise.all([searchAlbums(query, 12)])

            const albums = albumsResponse.results?.albummatches?.album?.map((a: any) => new Album(a)) || [];
            setResults({albums})
        }
        catch (err) {
            if (!signal.aborted) {
                setError('Failed to load albums')
                console.error(err)
            }
        }
        finally {
            if(!signal.aborted) {
                setLoading(false)
            }
        }
        
    }
    const timer = setTimeout(fetchData, 500);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);
  return { ...results, albumsLoading, albumsError };
    };