export type PostCategory = 'dynamics' | 'study-notes' | 'daily-findings';

export interface Post {
  id: number;
  title: string;
  abstract: string;
  content: string;
  category: PostCategory;
  created_at: string;
  updated_at?: string;
}
