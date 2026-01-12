
export interface IBlogpost {
  id: number;
  title: string;
  description: string;
  viewCount: number;
  publishedAt: string; // ISO string
}

export interface IImagePost {
  id: number;
  imageUrl: string;
  caption: string;
  comments: Array<string>;
  publishedAt: string; // ISO string
}
