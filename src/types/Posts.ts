
export interface IBlogpost {
  id: number;
  title: string;
  description: string;
  viewCount: number;
  publishedAt: string; // ISO string
  userId: number;
  user?: IUser;
}

export interface IImagePost {
  id: number;
  imageUrl: string;
  caption: string;
  comments: Array<string>;
  publishedAt: string; // ISO string
  userId: number;
  user?: IUser;
}

export interface IUser {
  id: number;
  username: string;
  email: string;
  blogPosts: IBlogpost[];
  imagePosts: IImagePost[];
}