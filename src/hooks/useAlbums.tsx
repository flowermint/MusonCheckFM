import { useState, useEffect } from 'react';
import { searchAlbums } from '../api/lastfm';
import { Album } from '../types/album';

export const useAlbums = (query: string, limit = 10) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setAlbums([]);
      return;
    }

    const fetchAlbums = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchAlbums(query, limit);
        setAlbums(data.results.albummatches.album.map((album: any) => new Album(album)));
      } catch (err) {
        setError('Failed to load albums');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchAlbums, 500);
    return () => clearTimeout(debounceTimer);
  }, [query, limit]);

  return { albums, loading, error };
};