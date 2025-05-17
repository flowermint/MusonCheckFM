import './search.css';
const API_KEY = 'a8d4d3f17d913cf3ee130debf6df6161'

class Image {
    small: string;
    medium: string;
    large: string;
    extralarge: string;

    constructor(images: any[]) {
        this.small = images.find(img => img.size === "small" || img['@size'] === "small")?.["#text"] || "";
        this.medium = images.find(img => img.size === "medium" || img['@size'] === "medium")?.["#text"] || "";
        this.large = images.find(img => img.size === "large" || img['@size'] === "large")?.["#text"] || "";
        this.extralarge = images.find(img => img.size === "extralarge" || img['@size'] === "extralarge")?.["#text"] || "";
    }

    getLargest(): string {
        return this.extralarge || this.large || this.medium || this.small || "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png";
    }
}

class Artist {
    name: string;
    mbid?: string;
    url: string;
    tags?: string[];
    bio?: string;
    image?: Image
    listeners?: number
    constructor(artistData: any) {
        this.name = artistData?.name || "";
        this.mbid = artistData?.mbid || "";
        this.url = artistData?.url || "";
        this.bio = artistData?.bio?.summary || ""
        this.tags = artistData?.tags?.tag.map((tag: {name: string;}) => ` ${tag.name}`) || [];
        this.mbid = artistData.mbid
        this.listeners = artistData?.stats?.listeners || 0
    }

    async fetchImages(): Promise<void> {
        try{
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${this.name}&api_key=${API_KEY}&format=json&limit=1`)

        const data = await response.json()
        this.image = new Image(data.topalbums.album[0].image)
        } catch (err) {
            console.log((err as Error).message)
        }
    }
}

class Track {
    name: string;
    duration: number;
    playcount: number;
    listeners: number;
    mbid: string;
    url: string;
    artist: Artist;
    images: Image;
    tags: string[] = [];

    constructor(trackData: any) {
        this.name = trackData?.name || "";
        this.duration = parseInt(trackData?.duration) || 0;
        this.playcount = parseInt(trackData?.playcount) || 0;
        this.listeners = parseInt(trackData?.listeners) || 0;
        this.mbid = trackData?.mbid || "";
        this.url = trackData?.url || "";
        this.artist = new Artist(trackData?.artist);
        this.images = new Image(
            Array.isArray(trackData?.album?.image)
                ? trackData.album.image
                : trackData?.image || [] // fallback для треков без альбома
        );
        this.tags = trackData.toptags.tag.map((tag: { name: string; }) => ` ${tag.name}`)
    }
}

class Album {
    name: string;
    images: Image;
    artistName: string;
    url: string;

    constructor(albumData: any) {
        this.name = albumData?. name || ""
        this.artistName = albumData?.artist || ""
        this.images = new Image(
            Array.isArray(albumData?.image)
                ? albumData.image
                :  [] // fallback для треков без альбома
        );
        this.url = albumData?.url || ""
    }
}

async function searchTracks(query: string) {
    try 
{ 
   const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=track.search&track=${query}&api_key=${API_KEY}&format=json&limit=9`)
   if (response.status != 200) {
    throw new Error(`Something went wrong. Response status is ${response.status}`)
   }
        const data = await response.json()
        const trackPromises = data.results.trackmatches.track.map(async (track: any) => {

        const trackInfo = await fetch(`https://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist=${encodeURIComponent(track.artist)}&track=${encodeURIComponent(track.name)}&api_key=${API_KEY}&format=json`);
        // console.log(`https://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist=${encodeURIComponent(track.artist.name)}&track=${encodeURIComponent(track.name)}&api_key=${API_KEY}&format=json`)
        const trackData = await trackInfo.json();
        // console.log(trackData)
        return new Track(trackData.track);
    });
    
    const tracks = await Promise.all(trackPromises);

       let container = document.querySelector(".found-tracks-container")
       for(let track of tracks) {
            let chartElement = document.createElement("div")
            chartElement.className = "found-tracks-item"
            let chartElementCover = document.createElement("div")
            chartElementCover.className = "found-tracks-item-cover"
            chartElementCover.style.backgroundImage = `url(${track.images.getLargest()})`
            chartElement.appendChild(chartElementCover)
        
            let chartDescription = document.createElement("div")
            chartDescription.className = "found-tracks-item-description"
        
            let chartTrackName = document.createElement("a")
            chartTrackName.className = "found-tracks-item-trackname"
            chartTrackName.innerHTML = `${track.name}`
            chartTrackName.href = `https://last.fm/music/${track.artist.name}/_/${track.name}`
        
            let chartArtistName = document.createElement("a")
            chartArtistName.className = "found-tracks-item-artistname"
            chartArtistName.href = `https://last.fm/music/${track.artist.name}`
            chartArtistName.innerHTML = `${track.artist.name}`
        
            chartDescription.appendChild(chartTrackName)
            chartDescription.appendChild(chartArtistName)
        
            chartElement.appendChild(chartDescription)
        
            let chartTags = document.createElement("ul")
            chartTags.className = "found-tracks-item-tags"
        
            for(let i = 0; i < 2; i++) {
                let chartTag = document.createElement("a")
                chartTag.className = "found-tracks-item-tag"
                chartTag.innerHTML = `${track.tags[i]}`
                chartTag.href = `https://last.fm/tag/${track.tags[i].trim()}`
                chartTags.appendChild(chartTag)
            }
        
            chartDescription.appendChild(chartTags)
        
            container?.appendChild(chartElement)
   }
}
catch(err) {
   console.log((err as Error).message)
}  
}

function formatNumberWithDots(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

async function searchAlbums(query: string) {
    try 
    { 
       let albums: Album[] = []
       const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=album.search&album=${query}&api_key=${API_KEY}&format=json&limit=10`)
       if (response.status != 200) {
        throw new Error(`Something went wrong. Response status is ${response.status}`)
       }
            const data = await response.json()
            for(let album of data.results.albummatches.album) {
                albums.push(new Album(album))
            }
            const container = document.querySelector(".found-albums-container")
            for(let album of albums) {
                let albumItem = document.createElement("div")
                albumItem.className = "found-album"
                albumItem.style.backgroundImage = `url(${album.images.getLargest()})`

                let albumDescription = document.createElement("div")
                albumDescription.className = "found-album-description"

                let albumName = document.createElement("a")
                albumName.className = "found-album-name"
                albumName.href=`https://last.fm/music/${album.artistName}/${album.name}`
                albumName.innerHTML = album.name

                let artistName = document.createElement("a")
                artistName.className="found-album-artistname"
                artistName.href=`https://last.fm/music/${album.artistName}`
                artistName.innerHTML = album.artistName

                albumDescription.appendChild(albumName)
                albumDescription.appendChild(artistName)

                albumItem.append(albumDescription)

                container?.appendChild(albumItem)
            }

    }
    catch(err) {
       console.log((err as Error).message)
    }  
}

async function searchArtists(query: string) {
    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${query}&api_key=${API_KEY}&format=json&limit=10`)

    if (response.status != 200)
        throw new Error(`Something went wrong. Response status is ${response.status}`)

    const data = await response.json()
    const artistPromises = data.results.artistmatches.artist.map(async (artist: any) => {
        const artistInfo = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=${encodeURIComponent(artist.name)}&api_key=${API_KEY}&format=json`);
        const artistData = await artistInfo.json();
        console.log(artistData)
        return new Artist(artistData.artist);
    })
    const artists: Artist[] = await Promise.all(artistPromises);

    const fetchImagesPromises = artists.map(async (artist: Artist) => {
        await artist.fetchImages()
    })
    await Promise.all(fetchImagesPromises)

    let container = document.querySelector(".found-artists-container")
    let elements: HTMLDivElement[] = []
    console.log(artists)
    for(let artist of artists) {

        let artistElement = document.createElement("div")
        artistElement.className = "found-artist"
        artistElement.style.backgroundImage = `url(${artist.image?.getLargest()})`
        
        let artistDescription = document.createElement("div")
        artistDescription.className = "found-artist-description"

        let artistName = document.createElement("a")
        artistName.className = "found-artist-name"
        artistName.href=artist.url
        artistName.innerHTML = artist.name

        let artistListeners = document.createElement("div")
        artistListeners.className = "found-artist-listeners"
        artistListeners.innerHTML = `${formatNumberWithDots(artist.listeners || 0)} listeners`

        artistDescription.appendChild(artistName)
        artistDescription.appendChild(artistListeners)

        artistElement.appendChild(artistDescription)

        container?.appendChild(artistElement)
        
    }
    for(const element of elements) {
        container?.appendChild(element)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('artist');
    
    if (query) {
        searchTracks(query);
        searchAlbums(query)
        searchArtists(query)
    }
});
