import { LAST_FM_API_KEY } from '../config';
import {Image} from './image'
export class Artist {
  name: string;
  mbid?: string;
  url: string;
  tags?: string[];
  bio?: string;
  image?: Image;
  listeners?: number;

  constructor(artistData: any) {
    this.name = artistData?.name || "";
    this.mbid = artistData?.mbid || "";
    this.url = artistData?.url || "";
    this.bio = artistData?.bio?.summary || "";
    this.tags = artistData?.tags?.tag?.map((tag: any) => tag.name) || [];
    this.listeners = artistData?.stats?.listeners || 0;
  }
  /**
   * Загружает изображение исполнителя.
   * Использует первый альбом из топ-альбомов исполнителя как источник изображений
   * @returns {Promise<void>}
   * @throws {Error} В случае ошибки
   */
  async fetchImages(): Promise<void> {
    try {
      const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${encodeURIComponent(this.name)}&api_key=${LAST_FM_API_KEY}&format=json&limit=1`
      );
      const data = await response.json();
      this.image = new Image(data.topalbums?.album[0]?.image || []);
    } catch (err) {
      console.error("Failed to fetch artist images:", err);
    }
  }
}