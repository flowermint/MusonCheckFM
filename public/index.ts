import './index.css';
const API_KEY = 'a8d4d3f17d913cf3ee130debf6df6161'

let artistsStorage: Artist[] = []

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
    constructor(artistData: any) {
        this.name = artistData?.name || "";
        this.mbid = artistData?.mbid || "";
        this.url = artistData?.url || "";
        this.bio = artistData?.bio?.summary || ""
        this.tags = artistData?.tags?.tag.map((tag: {name: string;}) => ` ${tag.name}`) || [];
        this.mbid = artistData.mbid
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

async function addTracksToChart(): Promise<void> {
try 
{ 
   const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=chart.getTopTracks&api_key=${API_KEY}&format=json&limit=6`)
   if (response.status != 200) {
    throw new Error(`Something went wrong. Response status is ${response.status}`)
   }
       const data = await response.json()
        const trackPromises = data.tracks.track.map(async (track: any) => {
        const trackInfo = await fetch(`https://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist=${encodeURIComponent(track.artist.name)}&track=${encodeURIComponent(track.name)}&api_key=${API_KEY}&format=json`);
        const trackData = await trackInfo.json();
        return new Track(trackData.track);
    });
    
    const tracks = await Promise.all(trackPromises);

       let container = document.querySelector(".chart-container")
       for(let track of tracks) {
            let chartElement = document.createElement("div")
            chartElement.className = "chart-item"
            let chartElementCover = document.createElement("div")
            chartElementCover.className = "chart-item-cover"
            chartElementCover.style.backgroundImage = `url(${track.images.getLargest()})`
            chartElement.appendChild(chartElementCover)
        
            let chartDescription = document.createElement("div")
            chartDescription.className = "chart-item-description"
        
            let chartTrackName = document.createElement("a")
            chartTrackName.className = "chart-item-trackname"
            chartTrackName.innerHTML = `${track.name}`
            chartTrackName.href = `https://last.fm/music/${track.artist.name}/_/${track.name}`
        
            let chartArtistName = document.createElement("a")
            chartArtistName.className = "chart-item-artistname"
            chartArtistName.href = `https://last.fm/music/${track.artist.name}`
            chartArtistName.innerHTML = `${track.artist.name}`
        
            chartDescription.appendChild(chartTrackName)
            chartDescription.appendChild(chartArtistName)
        
            chartElement.appendChild(chartDescription)
        
            let chartTags = document.createElement("ul")
            chartTags.className = "chart-item-tags"
        
            for(let i = 0; i < 2; i++) {
                let chartTag = document.createElement("a")
                chartTag.className = "chart-item-tag"
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

async function addArtistsToChart(): Promise<void> {
    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${API_KEY}&format=json&limit=14`)

    if (response.status != 200)
        throw new Error(`Something went wrong. Response status is ${response.status}`)

    const data = await response.json()
    const artistPromises = data.artists.artist.map(async (artist: any) => {
        const artistInfo = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=${encodeURIComponent(artist.name)}&api_key=${API_KEY}&format=json`);
        const artistData = await artistInfo.json();
        return new Artist(artistData.artist);
    })
    const artists: Artist[] = await Promise.all(artistPromises);

    const fetchImagesPromises = artists.map(async (artist: Artist) => {
        await artist.fetchImages()
    })
    await Promise.all(fetchImagesPromises)
    
    artistsStorage = artists.splice(0, 2)

    addHotArtists()

    
    let container = document.querySelector(".artists-chart-container")
    let elements: HTMLDivElement[] = []
    
    for(let artist of artists) {

        let chartElement = document.createElement("div")
            chartElement.className = "artist-chart-item"
            let chartElementCover = document.createElement("div")
            chartElementCover.className = "artist-chart-image"
            chartElementCover.style.backgroundImage = `url(${artist.image?.getLargest()})`
            chartElement.appendChild(chartElementCover)
        
            let chartArtistName = document.createElement("a")
            chartArtistName.className = "artist-chart-name"
            chartArtistName.innerHTML = `${artist.name}`
            chartArtistName.href=`https://last.fm/music/${artist.name}`
        
            chartElement.appendChild(chartArtistName)
        
            let chartTags = document.createElement("ul")
            chartTags.className = "artist-chart-tags"
        
            for(let i = 0; i < 2; i++) {
                let chartTag = document.createElement("a")
                chartTag.className = "artist-chart-tag"
                chartTag.href = `https://last.fm/tag/${artist.tags?.at(i)}`
                chartTag.innerHTML = ` ${artist.tags?.at(i)}`
                chartTags.appendChild(chartTag)
            }
        
            chartElement.appendChild(chartTags)
        
            elements.push(chartElement)
    }
    for(const element of elements) {
        container?.appendChild(element)
    }
}

const extractLinksRegex = (str: string): string[] => {
    const regex = /https?:\/\/[^\s"<>]+/g;
    const matches = str.match(regex);
    return matches || [];
  };

function addHotArtists(): void {
    let hotArtists = artistsStorage.slice(0, 2)
    const container = document.querySelector(".artists-cards-container")
    for(let artist of hotArtists) {
        console.log(artist)
        let card = document.createElement("div")
        card.className = "artist-card"
        card.style.backgroundImage = `url(${artist.image?.getLargest()})`

        let artistInfo = document.createElement("div")
        artistInfo.className = "artist-card-info"

        let artistName = document.createElement("a")
        artistName.className = "artist-card-name"
        artistName.innerHTML = artist.name
        artistName.href = `https://last.fm/music/${artist.name}`

        let artistTags = document.createElement("ul")
        artistTags.className = "artist-card-tags"

        for(let i = 0; i < 3; i++) {
            let artistTag = document.createElement('a')
            artistTag.className = "artist-card-tag"
            artistTag.innerHTML = artist.tags?.at(i) || "";
            artistTag.href = `https://last.fm/tag/${artist.tags?.at(i)?.trim()}`
            artistTags.appendChild(artistTag)
        }

        let artistBio = document.createElement("div")
        artistBio.className = "artist-card-bio"
        artistBio.innerHTML = (artist.bio?.slice(0, 240) + "... " || "")
        artistInfo.appendChild(artistName)
        artistInfo.appendChild(artistTags)
        artistInfo.appendChild(artistBio)
        card.appendChild(artistInfo)
        container?.appendChild(card)
    }
}

async function fillPage() {
    addTracksToChart()

    addArtistsToChart()
} 

fillPage()

