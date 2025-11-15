import db from '../config/database';

export interface Post {
  id?: number;
  title: string;
  abstract: string;
  content: string;
  category: 'dynamics' | 'study-notes' | 'daily-findings';
  author_id: number;
  created_at?: string;
  updated_at?: string;
}

export class PostModel {
  static create(post: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Post {
    const stmt = db.prepare(
      'INSERT INTO posts (title, abstract, content, category, author_id) VALUES (?, ?, ?, ?, ?)'
    );
    const result = stmt.run(
      post.title,
      post.abstract,
      post.content,
      post.category,
      post.author_id
    );
    return {
      id: result.lastInsertRowid as number,
      ...post
    };
  }

  static findAll(): Post[] {
    const stmt = db.prepare('SELECT * FROM posts ORDER BY created_at DESC');
    return stmt.all() as Post[];
  }

  static findByCategory(category: string): Post[] {
    const stmt = db.prepare('SELECT * FROM posts WHERE category = ? ORDER BY created_at DESC');
    return stmt.all(category) as Post[];
  }

  static findById(id: number): Post | undefined {
    const stmt = db.prepare('SELECT * FROM posts WHERE id = ?');
    return stmt.get(id) as Post | undefined;
  }

  static update(id: number, post: Partial<Omit<Post, 'id' | 'author_id' | 'created_at'>>): boolean {
    const fields: string[] = [];
    const values: any[] = [];

    if (post.title !== undefined) {
      fields.push('title = ?');
      values.push(post.title);
    }
    if (post.abstract !== undefined) {
      fields.push('abstract = ?');
      values.push(post.abstract);
    }
    if (post.content !== undefined) {
      fields.push('content = ?');
      values.push(post.content);
    }
    if (post.category !== undefined) {
      fields.push('category = ?');
      values.push(post.category);
    }

    if (fields.length === 0) return false;

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = db.prepare(`UPDATE posts SET ${fields.join(', ')} WHERE id = ?`);
    const result = stmt.run(...values);
    return result.changes > 0;
  }

  static delete(id: number): boolean {
    const stmt = db.prepare('DELETE FROM posts WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
