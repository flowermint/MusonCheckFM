import { Artist } from '../types/artist';

export const ArtistSearchCard = ({ artist }: { artist: Artist }) => (
  <div className="search-artist-card">
    <div 
      className="search-artist-image"
      style={{ backgroundImage: `url(${artist.image?.getLargest()})` }}
    />
    <div className="search-artist-info">
      <a
        href={artist.url}
        target="_blank"
        rel="noopener noreferrer"
        className="search-artist-name"
      >
        {artist.name}
      </a>
      <div className="search-artist-listeners">
        {artist.listeners?.toLocaleString()} listeners
      </div>
    </div>
  </div>
);