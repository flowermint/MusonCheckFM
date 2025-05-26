import { LAST_FM_API_KEY } from '../config';
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

export const fetchTopTracks = async (limit = 6) => {
  const response = await fetch(
    `${BASE_URL}?method=chart.getTopTracks&api_key=${LAST_FM_API_KEY}&format=json&limit=${limit}`
  );
  return response.json();
};

export const fetchTrackInfo = async (artist: string, track: string) => {
  const response = await fetch(
    `${BASE_URL}?method=track.getInfo&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&api_key=${LAST_FM_API_KEY}&format=json`
  );
  return response.json();
};

export const fetchTopArtists = async (limit = 18) => {
  const response = await fetch(
    `${BASE_URL}?method=chart.gettopartists&api_key=${LAST_FM_API_KEY}&format=json&limit=${limit}`
  );
  return response.json();
};

export const fetchArtistInfo = async (artist: string) => {
  const response = await fetch(
    `${BASE_URL}?method=artist.getInfo&artist=${encodeURIComponent(artist)}&api_key=${LAST_FM_API_KEY}&format=json`
  );
  return response.json();
};

export const searchTracks = async (query: string, limit = 9) => {
  const response = await fetch(
    `${BASE_URL}?method=track.search&track=${query}&api_key=${LAST_FM_API_KEY}&format=json&limit=${limit}`
  );
  return response.json();
};

export const searchAlbums = async (query: string, limit = 12) => {
  const response = await fetch(
    `${BASE_URL}?method=album.search&album=${query}&api_key=${LAST_FM_API_KEY}&format=json&limit=${limit}`
  );
  return response.json();
};

export const searchArtists = async (query: string, limit = 12) => {
  const response = await fetch(
    `${BASE_URL}?method=artist.search&artist=${query}&api_key=${LAST_FM_API_KEY}&format=json&limit=${limit}`
  );
  return response.json();
};



