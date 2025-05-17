"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// Object.defineProperty(exports, "__esModule", { value: true });
// require("./index.css");
var API_KEY = 'a8d4d3f17d913cf3ee130debf6df6161';
var artistsStorage = [];
var Image = /** @class */ (function () {
    function Image(images) {
        var _a, _b, _c, _d;
        this.small = ((_a = images.find(function (img) { return img.size === "small" || img['@size'] === "small"; })) === null || _a === void 0 ? void 0 : _a["#text"]) || "";
        this.medium = ((_b = images.find(function (img) { return img.size === "medium" || img['@size'] === "medium"; })) === null || _b === void 0 ? void 0 : _b["#text"]) || "";
        this.large = ((_c = images.find(function (img) { return img.size === "large" || img['@size'] === "large"; })) === null || _c === void 0 ? void 0 : _c["#text"]) || "";
        this.extralarge = ((_d = images.find(function (img) { return img.size === "extralarge" || img['@size'] === "extralarge"; })) === null || _d === void 0 ? void 0 : _d["#text"]) || "";
    }
    Image.prototype.getLargest = function () {
        return this.extralarge || this.large || this.medium || this.small || "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png";
    };
    return Image;
}());
var Artist = /** @class */ (function () {
    function Artist(artistData) {
        var _a, _b;
        this.name = (artistData === null || artistData === void 0 ? void 0 : artistData.name) || "";
        this.mbid = (artistData === null || artistData === void 0 ? void 0 : artistData.mbid) || "";
        this.url = (artistData === null || artistData === void 0 ? void 0 : artistData.url) || "";
        this.bio = ((_a = artistData === null || artistData === void 0 ? void 0 : artistData.bio) === null || _a === void 0 ? void 0 : _a.summary) || "";
        this.tags = ((_b = artistData === null || artistData === void 0 ? void 0 : artistData.tags) === null || _b === void 0 ? void 0 : _b.tag.map(function (tag) { return " ".concat(tag.name); })) || [];
        this.mbid = artistData.mbid;
    }
    Artist.prototype.fetchImages = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch("https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=".concat(this.name, "&api_key=").concat(API_KEY, "&format=json&limit=1"))];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        this.image = new Image(data.topalbums.album[0].image);
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.log(err_1.message);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Artist;
}());
var Track = /** @class */ (function () {
    function Track(trackData) {
        var _a;
        this.tags = [];
        this.name = (trackData === null || trackData === void 0 ? void 0 : trackData.name) || "";
        this.duration = parseInt(trackData === null || trackData === void 0 ? void 0 : trackData.duration) || 0;
        this.playcount = parseInt(trackData === null || trackData === void 0 ? void 0 : trackData.playcount) || 0;
        this.listeners = parseInt(trackData === null || trackData === void 0 ? void 0 : trackData.listeners) || 0;
        this.mbid = (trackData === null || trackData === void 0 ? void 0 : trackData.mbid) || "";
        this.url = (trackData === null || trackData === void 0 ? void 0 : trackData.url) || "";
        this.artist = new Artist(trackData === null || trackData === void 0 ? void 0 : trackData.artist);
        this.images = new Image(Array.isArray((_a = trackData === null || trackData === void 0 ? void 0 : trackData.album) === null || _a === void 0 ? void 0 : _a.image)
            ? trackData.album.image
            : (trackData === null || trackData === void 0 ? void 0 : trackData.image) || [] // fallback для треков без альбома
        );
        this.tags = trackData.toptags.tag.map(function (tag) { return " ".concat(tag.name); });
    }
    return Track;
}());
function addTracksToChart() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, trackPromises, tracks, container, _i, tracks_1, track, chartElement, chartElementCover, chartDescription, chartTrackName, chartArtistName, chartTags, i, chartTag, err_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, fetch("https://ws.audioscrobbler.com/2.0/?method=chart.getTopTracks&api_key=".concat(API_KEY, "&format=json&limit=6"))];
                case 1:
                    response = _a.sent();
                    if (response.status != 200) {
                        throw new Error("Something went wrong. Response status is ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    trackPromises = data.tracks.track.map(function (track) { return __awaiter(_this, void 0, void 0, function () {
                        var trackInfo, trackData;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, fetch("https://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist=".concat(encodeURIComponent(track.artist.name), "&track=").concat(encodeURIComponent(track.name), "&api_key=").concat(API_KEY, "&format=json"))];
                                case 1:
                                    trackInfo = _a.sent();
                                    return [4 /*yield*/, trackInfo.json()];
                                case 2:
                                    trackData = _a.sent();
                                    return [2 /*return*/, new Track(trackData.track)];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(trackPromises)];
                case 3:
                    tracks = _a.sent();
                    container = document.querySelector(".chart-container");
                    for (_i = 0, tracks_1 = tracks; _i < tracks_1.length; _i++) {
                        track = tracks_1[_i];
                        chartElement = document.createElement("div");
                        chartElement.className = "chart-item";
                        chartElementCover = document.createElement("div");
                        chartElementCover.className = "chart-item-cover";
                        chartElementCover.style.backgroundImage = "url(".concat(track.images.getLargest(), ")");
                        chartElement.appendChild(chartElementCover);
                        chartDescription = document.createElement("div");
                        chartDescription.className = "chart-item-description";
                        chartTrackName = document.createElement("a");
                        chartTrackName.className = "chart-item-trackname";
                        chartTrackName.innerHTML = "".concat(track.name);
                        chartTrackName.href = "https://last.fm/music/".concat(track.artist.name, "/_/").concat(track.name);
                        chartArtistName = document.createElement("a");
                        chartArtistName.className = "chart-item-artistname";
                        chartArtistName.href = "https://last.fm/music/".concat(track.artist.name);
                        chartArtistName.innerHTML = "".concat(track.artist.name);
                        chartDescription.appendChild(chartTrackName);
                        chartDescription.appendChild(chartArtistName);
                        chartElement.appendChild(chartDescription);
                        chartTags = document.createElement("ul");
                        chartTags.className = "chart-item-tags";
                        for (i = 0; i < 2; i++) {
                            chartTag = document.createElement("a");
                            chartTag.className = "chart-item-tag";
                            chartTag.innerHTML = "".concat(track.tags[i]);
                            chartTag.href = "https://last.fm/tag/".concat(track.tags[i].trim());
                            chartTags.appendChild(chartTag);
                        }
                        chartDescription.appendChild(chartTags);
                        container === null || container === void 0 ? void 0 : container.appendChild(chartElement);
                    }
                    return [3 /*break*/, 5];
                case 4:
                    err_2 = _a.sent();
                    console.log(err_2.message);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function addArtistsToChart() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, artistPromises, artists, fetchImagesPromises, container, elements, _i, artists_1, artist, chartElement, chartElementCover, chartArtistName, chartTags, i, chartTag, _a, elements_1, element;
        var _this = this;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, fetch("https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=".concat(API_KEY, "&format=json&limit=14"))];
                case 1:
                    response = _e.sent();
                    if (response.status != 200)
                        throw new Error("Something went wrong. Response status is ".concat(response.status));
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _e.sent();
                    artistPromises = data.artists.artist.map(function (artist) { return __awaiter(_this, void 0, void 0, function () {
                        var artistInfo, artistData;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, fetch("https://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=".concat(encodeURIComponent(artist.name), "&api_key=").concat(API_KEY, "&format=json"))];
                                case 1:
                                    artistInfo = _a.sent();
                                    return [4 /*yield*/, artistInfo.json()];
                                case 2:
                                    artistData = _a.sent();
                                    return [2 /*return*/, new Artist(artistData.artist)];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(artistPromises)];
                case 3:
                    artists = _e.sent();
                    fetchImagesPromises = artists.map(function (artist) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, artist.fetchImages()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(fetchImagesPromises)];
                case 4:
                    _e.sent();
                    artistsStorage = artists.splice(0, 2);
                    addHotArtists();
                    container = document.querySelector(".artists-chart-container");
                    elements = [];
                    for (_i = 0, artists_1 = artists; _i < artists_1.length; _i++) {
                        artist = artists_1[_i];
                        chartElement = document.createElement("div");
                        chartElement.className = "artist-chart-item";
                        chartElementCover = document.createElement("div");
                        chartElementCover.className = "artist-chart-image";
                        chartElementCover.style.backgroundImage = "url(".concat((_b = artist.image) === null || _b === void 0 ? void 0 : _b.getLargest(), ")");
                        chartElement.appendChild(chartElementCover);
                        chartArtistName = document.createElement("a");
                        chartArtistName.className = "artist-chart-name";
                        chartArtistName.innerHTML = "".concat(artist.name);
                        chartArtistName.href = "https://last.fm/music/".concat(artist.name);
                        chartElement.appendChild(chartArtistName);
                        chartTags = document.createElement("ul");
                        chartTags.className = "artist-chart-tags";
                        for (i = 0; i < 2; i++) {
                            chartTag = document.createElement("a");
                            chartTag.className = "artist-chart-tag";
                            chartTag.href = "https://last.fm/tag/".concat((_c = artist.tags) === null || _c === void 0 ? void 0 : _c.at(i));
                            chartTag.innerHTML = " ".concat((_d = artist.tags) === null || _d === void 0 ? void 0 : _d.at(i));
                            chartTags.appendChild(chartTag);
                        }
                        chartElement.appendChild(chartTags);
                        elements.push(chartElement);
                    }
                    for (_a = 0, elements_1 = elements; _a < elements_1.length; _a++) {
                        element = elements_1[_a];
                        container === null || container === void 0 ? void 0 : container.appendChild(element);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
var extractLinksRegex = function (str) {
    var regex = /https?:\/\/[^\s"<>]+/g;
    var matches = str.match(regex);
    return matches || [];
};
function addHotArtists() {
    var _a, _b, _c, _d, _e;
    var hotArtists = artistsStorage.slice(0, 2);
    var container = document.querySelector(".artists-cards-container");
    for (var _i = 0, hotArtists_1 = hotArtists; _i < hotArtists_1.length; _i++) {
        var artist = hotArtists_1[_i];
        console.log(artist);
        var card = document.createElement("div");
        card.className = "artist-card";
        card.style.backgroundImage = "url(".concat((_a = artist.image) === null || _a === void 0 ? void 0 : _a.getLargest(), ")");
        var artistInfo = document.createElement("div");
        artistInfo.className = "artist-card-info";
        var artistName = document.createElement("a");
        artistName.className = "artist-card-name";
        artistName.innerHTML = artist.name;
        artistName.href = "https://last.fm/music/".concat(artist.name);
        var artistTags = document.createElement("ul");
        artistTags.className = "artist-card-tags";
        for (var i = 0; i < 3; i++) {
            var artistTag = document.createElement('a');
            artistTag.className = "artist-card-tag";
            artistTag.innerHTML = ((_b = artist.tags) === null || _b === void 0 ? void 0 : _b.at(i)) || "";
            artistTag.href = "https://last.fm/tag/".concat((_d = (_c = artist.tags) === null || _c === void 0 ? void 0 : _c.at(i)) === null || _d === void 0 ? void 0 : _d.trim());
            artistTags.appendChild(artistTag);
        }
        var artistBio = document.createElement("div");
        artistBio.className = "artist-card-bio";
        artistBio.innerHTML = (((_e = artist.bio) === null || _e === void 0 ? void 0 : _e.slice(0, 240)) + "... " || "");
        artistInfo.appendChild(artistName);
        artistInfo.appendChild(artistTags);
        artistInfo.appendChild(artistBio);
        card.appendChild(artistInfo);
        container === null || container === void 0 ? void 0 : container.appendChild(card);
    }
}
function fillPage() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            addTracksToChart();
            addArtistsToChart();
            return [2 /*return*/];
        });
    });
}
fillPage();
