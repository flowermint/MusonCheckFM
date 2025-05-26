import { Album } from '../types/album';

export const AlbumSearchCard = ({ album }: { album: Album }) => (
  <div className="search-album-card" style={{ backgroundImage: `url(${album.image.getLargest()})` }}>
    <div className="search-album-info">
      <a
        href={`https://last.fm/music/${album.artist}/${album.name}`}
        target="_blank"
        rel="noopener noreferrer"
        className="search-album-title"
      >
        {album.name}
      </a>
      <a
        href={`https://last.fm/music/${album.artist}`}
        target="_blank"
        rel="noopener noreferrer"
        className="search-album-artist"
      >
        {album.artist}
      </a>
    </div>
    </div>
);