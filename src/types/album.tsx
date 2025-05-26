import {Image} from './image'
export class Album {
  name: string;
  artist: string;
  image: Image;
  url: string;

  constructor(albumData: any) {
    this.name = albumData?.name || "";
    this.artist = albumData?.artist || "";
    this.image = new Image(albumData?.image || []);
    this.url = albumData?.url || "";
  }
}