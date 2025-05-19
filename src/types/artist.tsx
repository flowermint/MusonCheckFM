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

  getLargestImage(): string {
    return (
      this.image?.extralarge ||
      this.image?.large ||
      this.image?.medium ||
      this.image?.small ||
      "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
    );
  }

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