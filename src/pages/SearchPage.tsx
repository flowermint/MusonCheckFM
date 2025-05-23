import { useSearchParams } from 'react-router-dom';
import { useSearchTracks } from '../hooks/useSearchTracks';
import { 
  TrackCard, 
  ArtistSearchCard, 
  AlbumSearchCard,  
  LoadingSpinner, 
  ErrorMessage,
  NoResults 
} from '../components/index';
import { useSearchArtists } from '../hooks';
import { useSearchAlbums } from '../hooks/useSearchAlbums';

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('artist') || '';
  
  const { tracks, loading, error } = useSearchTracks(query);
  const { artists, artistsLoading, artistsError } = useSearchArtists(query);
  const { albums, albumsLoading, albumsError } = useSearchAlbums(query);

  console.log(loading)

  const noTracks = !loading && tracks.length === 0;
  const noArtists = !artistsLoading && artists.length === 0;
  const noAlbums = !albumsLoading && albums.length === 0;

  return (
    <div className="search-page">
      <div className="title-container">
        <div className="title">
          <h1>search results</h1>
        </div>
      </div>
      
      {error && <ErrorMessage message={error} />}
      {artistsError && <ErrorMessage message={artistsError} />}
      {albumsError && <ErrorMessage message={albumsError} />}

      <section className="search-section">
        <div className="title-container">
          <div className="title">
            <h2>tracks</h2>
            <hr className="title-underline"></hr>
          </div>
        </div>
        
        <div className="search-tracks-grid">
          {loading && <LoadingSpinner />}
           {loading && <LoadingSpinner />}
            {loading && <LoadingSpinner />}
          
          {noTracks ? (
            <NoResults type="tracks" query={query} />
          ) : (
            tracks.map(track => (
              <TrackCard key={track.mbid || track.name} track={track} />
            ))
          )}
        </div>
      </section>

      <section className="search-section">
        <div className="title-container">
          <div className="title">
            <h2>artists</h2>
            <hr className="title-underline"></hr>
          </div>
        </div>
        
        <div className="search-artists-grid">
          {artistsLoading && <LoadingSpinner />}
          {artistsLoading && <LoadingSpinner />}
          {artistsLoading && <LoadingSpinner />}
          {artistsLoading && <LoadingSpinner />}
          {artistsLoading && <LoadingSpinner />}
          
          {noArtists ? (
            <NoResults type="artists" query={query} />
          ) : (
            artists.map(artist => (
              <ArtistSearchCard key={artist.mbid || artist.name} artist={artist} />
            ))
          )}
        </div>
      </section>

      <section className="search-section">
        <div className="title-container">
          <div className="title">
            <h2>albums</h2>
            <hr className="title-underline"></hr>
          </div>
        </div>
        
        <div className="search-albums-grid">
          {albumsLoading && <LoadingSpinner />}
          {albumsLoading && <LoadingSpinner />}
          {albumsLoading && <LoadingSpinner />}
          {albumsLoading && <LoadingSpinner />}
          {albumsLoading && <LoadingSpinner />}
          
          {noAlbums ? (
            <NoResults type="albums" query={query} />
          ) : (
            albums.map((album, index) => (
              <AlbumSearchCard
                key={`${album.name}-${index}`} 
                album={album} 
              /> 
            ))
          )}
        </div>
      </section>
      <div className="footer-container">
        <footer>
          <p>© 2025 MusonCheck FM. All rights reserved</p>
        </footer>
      </div>
    </div>
  );
};