import { Artist } from './artist';
import {Image} from './image'

export class Track {
  name: string;
  duration: number;
  playcount: number;
  listeners: number;
  mbid: string;
  url: string;
  artist: Artist;
  image: Image;
  tags: string[] = [];

  constructor(trackData: any) {
    this.name = trackData?.name || "";
    this.duration = parseInt(trackData?.duration) || 0;
    this.playcount = parseInt(trackData?.playcount) || 0;
    this.listeners = parseInt(trackData?.listeners) || 0;
    this.mbid = trackData?.mbid || "";
    this.url = trackData?.url || "";
    this.artist = new Artist(trackData?.artist);
    this.image = new Image(trackData?.album?.image || trackData?.image || []);
    this.tags = trackData?.toptags.tag.map((tag: { name: string; }) => ` ${tag.name}`)
  }
}