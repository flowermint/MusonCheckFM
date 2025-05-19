export class Image {
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