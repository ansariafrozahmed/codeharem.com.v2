import pool from "../config/db";
import { AppError } from "../middlewares/errorHandler";

const BLOG_FIELDS = `
  b.id, b.slug, b.title, b.excerpt, b.content,
  b.featured_image, b.tags, b.category,
  b.status, b.views,
  b.created_at, b.updated_at,
  b.user_id,
  u.name AS author_name, u.avatar AS author_avatar, u.username AS author_username
`;

function mapRow(row: any) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    featuredImage: row.featured_image,
    tags: row.tags,
    category: row.category,
    status: row.status,
    views: row.views,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    userId: row.user_id,
    author:
      row.author_name !== undefined
        ? {
            name: row.author_name,
            avatar: row.author_avatar,
            username: row.author_username,
          }
        : undefined,
  };
}

class BlogService {
  async listPublished(options: {
    category?: string;
    tag?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = options.page || 1;
    const limit = Math.min(options.limit || 20, 50);
    const offset = (page - 1) * limit;

    const conditions: string[] = ["b.status = 'published'"];
    const values: any[] = [];
    let idx = 1;

    if (options.category) {
      conditions.push(`b.category = $${idx++}`);
      values.push(options.category);
    }

    if (options.tag) {
      conditions.push(`$${idx++} = ANY(b.tags)`);
      values.push(options.tag);
    }

    if (options.search) {
      conditions.push(`(b.title ILIKE $${idx} OR b.excerpt ILIKE $${idx})`);
      idx++;
      values.push(`%${options.search}%`);
    }

    const where = conditions.join(" AND ");

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM blogs b WHERE ${where}`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    values.push(limit, offset);
    const result = await pool.query(
      `SELECT ${BLOG_FIELDS}
       FROM blogs b
       JOIN users u ON u.id = b.user_id
       WHERE ${where}
       ORDER BY b.created_at DESC
       LIMIT $${idx++} OFFSET $${idx++}`,
      values
    );

    return {
      blogs: result.rows.map(mapRow),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getBySlug(slug: string) {
    const result = await pool.query(
      `SELECT ${BLOG_FIELDS}
       FROM blogs b
       JOIN users u ON u.id = b.user_id
       WHERE b.slug = $1 AND b.status = 'published'`,
      [slug]
    );
    if (result.rows.length === 0) {
      throw new AppError(404, "Blog post not found");
    }
    return mapRow(result.rows[0]);
  }

  async incrementViews(slug: string) {
    await pool.query(
      "UPDATE blogs SET views = views + 1 WHERE slug = $1",
      [slug]
    );
  }
}

export const blogService = new BlogService();
