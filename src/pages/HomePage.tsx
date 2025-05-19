import { useTracks, useArtists } from '../hooks';
import { TrackCard, ArtistCard, ErrorMessage, LoadingSpinner } from '../components';

export const HomePage = () => {
  const { tracks, loading: tracksLoading, error: tracksError } = useTracks();
  const { artists, loading: artistsLoading, error: artistsError } = useArtists();

  // Разделяем артистов на "горячих" (первые 2) и остальных
  const hotArtists = artists.slice(0, 2);
  const regularArtists = artists.slice(2);

  return (
    <div className="app">
      {/* Секция популярных треков */}
      <div className="title-container">
        <div className="title">
          <h2>Popular Tracks</h2>
          <hr className="title-underline" />
        </div>
      </div>
      
      {tracksError && <ErrorMessage message={tracksError} />}
      <div className="chart-container">
        { tracksLoading && <LoadingSpinner /> }
        { tracksLoading && <LoadingSpinner /> }
        { tracksLoading && <LoadingSpinner /> }
        {
          tracks.map(track => (
            <TrackCard 
              key={track.mbid || track.name} 
              track={track} 
            />
          ))
        }
      </div>

      <hr className="block-separator" />

      {/* Секция горячих артистов */}
      <div className="title-container">
        <div className="title">
          <h2>Hot Artists</h2>
          <hr className="title-underline" />
        </div>
      </div>
      
      {artistsError && <ErrorMessage message={artistsError} />}
      <div className="artists-cards-container">
        {artistsLoading ? <LoadingSpinner /> : 
          hotArtists.map(artist => (
            <ArtistCard 
              key={artist.mbid || artist.name} 
              artist={artist} 
              variant="large" 
            />
          ))
        }
      </div>

      {/* Секция остальных артистов */}
      <div className="artists-chart-container">
        {
          regularArtists.map(artist => (
            <ArtistCard 
              key={artist.mbid || artist.name} 
              artist={artist} 
              variant="small" 
            />
          ))
        }
      </div>

      <div className="footer-container">
        <footer>
          <p>© 2025 MusonCheck FM. All rights reserved</p>
        </footer>
      </div>
    </div>
  );
};
