import { Artist } from '../types/artist';

interface ArtistCardProps {
  artist: Artist;
  variant?: 'large' | 'small';
}

export const ArtistCard = ({ artist, variant = 'large' }: ArtistCardProps) => {
  if (variant === 'large') {
    return (
      <div 
        className="artist-card large"
        style={{ backgroundImage: `url(${artist?.image?.getLargest()})` }}
      >
        <div className="artist-card-info">
          <a
            className="artist-card-name"
            href={`https://last.fm/music/${encodeURIComponent(artist.name)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {artist.name}
          </a>
          
          {(artist.tags?.length || 0) > 0 && (
            <ul className="artist-card-tags">
              {artist.tags?.slice(0, 3).map((tag, i) => (
                <a
                  key={i}
                  className="artist-card-tag"
                  href={`https://last.fm/tag/${tag.trim()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {tag}
                </a>
              ))}
            </ul>
          )}
          
          {artist.bio && (
            <div className="artist-card-bio">
              {artist.bio.slice(0, 240) + "... "}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="artist-chart-item">
      <div
        className="artist-chart-image"
        style={{ backgroundImage: `url(${artist.image?.getLargest()})` }}
      />
      <a
        className="artist-chart-name"
        href={`https://last.fm/music/${encodeURIComponent(artist.name)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {artist.name}
      </a>
      <ul className="artist-chart-tags">
        {artist.tags?.slice(0, 2).map((tag, i) => (
          <a
            key={i}
            className="artist-chart-tag"
            href={`https://last.fm/tag/${tag.trim()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {tag}
          </a>
        ))}
      </ul>
    </div>
  );
};