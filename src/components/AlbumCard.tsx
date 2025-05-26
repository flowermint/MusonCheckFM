import { Album } from '../types/album';

interface AlbumCardProps {
  album: Album;
}

export const AlbumCard = ({ album }: AlbumCardProps) => (
  <div className="album-card">
    <div
      className="album-cover"
      style={{ backgroundImage: `url(${album.image.getLargest()})` }}
      aria-label={`Cover for ${album.name}`}
    />
    
    <div className="album-details">
      <a
        href={album.url}
        target="_blank"
        rel="noopener noreferrer"
        className="album-title"
      >
        {album.name}
      </a>
      <a
        href={`https://last.fm/music/${album.artist}`}
        target="_blank"
        rel="noopener noreferrer"
        className="album-artist"
      >
        {album.artist}
      </a>
    </div>
  </div>
);