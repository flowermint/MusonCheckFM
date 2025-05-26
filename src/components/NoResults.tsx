import { ReactNode } from 'react';

interface NoResultsProps {
  type: 'tracks' | 'artists' | 'albums';
  query: string;
  children?: ReactNode;
}

export const NoResults = ({ type, query, children }: NoResultsProps) => {
  const typeNames = {
    tracks: 'tracks',
    artists: 'artists',
    albums: 'albums'
  };

  return (
    <div className="no-results">
      <p className="no-results-message">
        No {typeNames[type]} found.
      </p>
      {children}
    </div>
  );
};