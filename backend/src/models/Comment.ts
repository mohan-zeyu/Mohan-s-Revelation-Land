import db from '../config/database';

export interface Comment {
  id?: number;
  post_id: number;
  name?: string | null;
  content: string;
  created_at?: string;
}

export class CommentModel {
  static create(post_id: number, name: string | null, content: string): Comment {
    const stmt = db.prepare(
      'INSERT INTO comments (post_id, name, content) VALUES (?, ?, ?)'
    );
    const result = stmt.run(post_id, name, content);
    const created = db.prepare('SELECT * FROM comments WHERE id = ?').get(
      result.lastInsertRowid
    ) as Comment;
    return created;
  }

  static findByPostId(postId: number): Comment[] {
    const stmt = db.prepare(
      'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC'
    );
    return stmt.all(postId) as Comment[];
  }
}
