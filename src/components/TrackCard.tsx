import { Track } from '../types/track';

interface TrackCardProps {
  track: Track;
}

export const TrackCard = ({ track }: TrackCardProps) => (
  <div className="chart-item">
    <div 
      className="chart-item-cover"
      style={{ backgroundImage: `url(${track.image.getLargest()})` }}
      aria-label={`Cover for ${track.name}`}
    />
    <div className="chart-item-description">
      <a href={track.url} target="_blank" rel="noopener noreferrer" className='chart-item-trackname'>
        {track.name}
      </a>
      <a href={track.artist.url} target="_blank" rel="noopener noreferrer" className='chart-item-artistname'>
        {track.artist.name}
      </a>
      <ul className="chart-item-tags">
                                {track.tags?.slice(0, 2).map((tag, i) => (
                                    <a
                                        key={i}
                                        className="chart-item-tag"
                                        href={`https://last.fm/tag/${tag.trim()}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {tag}
                                    </a>
                                ))}
                            </ul>
    </div>
    
  </div>
);