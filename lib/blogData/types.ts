export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  type: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  authorRole?: string;
  readingTime: string;
  image: string;
  featured?: boolean;
  keywords: string[];
  tags: string[];
  game: string;
}
