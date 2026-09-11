export interface Article {
  id?: string;
  title: string;
  date: string;
  content: string;
  type: 'Article' | 'News';
  category?: string;
  url?: string;
  image?: string;
  lockedUntil?: Date | null;
  createdAt: Date;
}

export interface ArticleComment {
  id?: string;
  articleId: string;
  name: string;
  email: string;
  website?: string;
  message: string;
  createdAt: Date;
}
