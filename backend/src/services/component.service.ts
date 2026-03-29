import pool from "../config/db";
import { AppError } from "../middlewares/errorHandler";

export interface CreateComponentData {
  title: string;
  category: string;
  styling: "css" | "tailwind";
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  headContent: string;
  externalCss: string[];
  externalJs: string[];
  status: "draft" | "published";
}

export interface UpdateComponentData extends Partial<CreateComponentData> {}

const COMPONENT_FIELDS = `
  c.id, c.slug, c.title, c.category, c.styling,
  c.html_code, c.css_code, c.js_code, c.head_content,
  c.external_css, c.external_js,
  c.status, c.views, c.likes,
  c.created_at, c.updated_at,
  c.user_id,
  u.name AS author_name, u.avatar AS author_avatar
`;

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function mapRow(row: any) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    styling: row.styling,
    htmlCode: row.html_code,
    cssCode: row.css_code,
    jsCode: row.js_code,
    headContent: row.head_content,
    externalCss: row.external_css,
    externalJs: row.external_js,
    status: row.status,
    views: row.views,
    likes: row.likes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    userId: row.user_id,
    author: row.author_name !== undefined
      ? { name: row.author_name, avatar: row.author_avatar }
      : undefined,
  };
}

class ComponentService {
  private async createUniqueSlug(title: string): Promise<string> {
    const base = generateSlug(title);
    let slug = base;
    let suffix = 0;

    while (true) {
      const existing = await pool.query(
        "SELECT 1 FROM components WHERE slug = $1",
        [slug]
      );
      if (existing.rows.length === 0) return slug;
      suffix++;
      slug = `${base}-${suffix}`;
    }
  }

  async create(userId: string, data: CreateComponentData) {
    const slug = await this.createUniqueSlug(data.title);

    const result = await pool.query(
      `INSERT INTO components (user_id, slug, title, category, styling, html_code, css_code, js_code, head_content, external_css, external_js, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        userId,
        slug,
        data.title,
        data.category,
        data.styling,
        data.htmlCode,
        data.cssCode,
        data.jsCode,
        data.headContent,
        data.externalCss,
        data.externalJs,
        data.status,
      ]
    );
    return mapRow(result.rows[0]);
  }

  async getBySlug(slug: string) {
    const result = await pool.query(
      `SELECT ${COMPONENT_FIELDS}
       FROM components c
       JOIN users u ON u.id = c.user_id
       WHERE c.slug = $1`,
      [slug]
    );
    if (result.rows.length === 0) {
      throw new AppError(404, "Component not found");
    }
    return mapRow(result.rows[0]);
  }

  async update(slug: string, userId: string, data: UpdateComponentData) {
    // Verify ownership
    const check = await pool.query(
      "SELECT id FROM components WHERE slug = $1 AND user_id = $2",
      [slug, userId]
    );
    if (check.rows.length === 0) {
      throw new AppError(404, "Component not found or access denied");
    }

    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.title !== undefined) {
      fields.push(`title = $${idx++}`);
      values.push(data.title);
      // Regenerate slug when title changes
      const newSlug = await this.createUniqueSlug(data.title);
      fields.push(`slug = $${idx++}`);
      values.push(newSlug);
    }
    if (data.category !== undefined) { fields.push(`category = $${idx++}`); values.push(data.category); }
    if (data.styling !== undefined) { fields.push(`styling = $${idx++}`); values.push(data.styling); }
    if (data.htmlCode !== undefined) { fields.push(`html_code = $${idx++}`); values.push(data.htmlCode); }
    if (data.cssCode !== undefined) { fields.push(`css_code = $${idx++}`); values.push(data.cssCode); }
    if (data.jsCode !== undefined) { fields.push(`js_code = $${idx++}`); values.push(data.jsCode); }
    if (data.headContent !== undefined) { fields.push(`head_content = $${idx++}`); values.push(data.headContent); }
    if (data.externalCss !== undefined) { fields.push(`external_css = $${idx++}`); values.push(data.externalCss); }
    if (data.externalJs !== undefined) { fields.push(`external_js = $${idx++}`); values.push(data.externalJs); }
    if (data.status !== undefined) { fields.push(`status = $${idx++}`); values.push(data.status); }

    if (fields.length === 0) {
      throw new AppError(400, "No fields to update");
    }

    fields.push("updated_at = now()");
    values.push(slug);

    const result = await pool.query(
      `UPDATE components SET ${fields.join(", ")} WHERE slug = $${idx} RETURNING *`,
      values
    );
    return mapRow(result.rows[0]);
  }

  async delete(slug: string, userId: string) {
    const result = await pool.query(
      "DELETE FROM components WHERE slug = $1 AND user_id = $2 RETURNING id",
      [slug, userId]
    );
    if (result.rows.length === 0) {
      throw new AppError(404, "Component not found or access denied");
    }
  }

  async listPublished(options: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = options.page || 1;
    const limit = Math.min(options.limit || 20, 50);
    const offset = (page - 1) * limit;

    const conditions: string[] = ["c.status = 'published'"];
    const values: any[] = [];
    let idx = 1;

    if (options.category) {
      conditions.push(`c.category = $${idx++}`);
      values.push(options.category);
    }

    if (options.search) {
      conditions.push(`c.title ILIKE $${idx++}`);
      values.push(`%${options.search}%`);
    }

    const where = conditions.join(" AND ");

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM components c WHERE ${where}`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    values.push(limit, offset);
    const result = await pool.query(
      `SELECT ${COMPONENT_FIELDS}
       FROM components c
       JOIN users u ON u.id = c.user_id
       WHERE ${where}
       ORDER BY c.created_at DESC
       LIMIT $${idx++} OFFSET $${idx++}`,
      values
    );

    return {
      components: result.rows.map(mapRow),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async listByUser(userId: string, status?: "draft" | "published") {
    const conditions = ["c.user_id = $1"];
    const values: any[] = [userId];

    if (status) {
      conditions.push("c.status = $2");
      values.push(status);
    }

    const result = await pool.query(
      `SELECT ${COMPONENT_FIELDS}
       FROM components c
       JOIN users u ON u.id = c.user_id
       WHERE ${conditions.join(" AND ")}
       ORDER BY c.updated_at DESC`,
      values
    );

    return result.rows.map(mapRow);
  }

  async incrementViews(slug: string) {
    await pool.query(
      "UPDATE components SET views = views + 1 WHERE slug = $1",
      [slug]
    );
  }

  async toggleLike(slug: string, userId: string): Promise<{ liked: boolean; likes: number }> {
    const comp = await pool.query("SELECT id, likes FROM components WHERE slug = $1", [slug]);
    if (comp.rows.length === 0) {
      throw new AppError(404, "Component not found");
    }
    const componentId = comp.rows[0].id;

    const existing = await pool.query(
      "SELECT 1 FROM component_likes WHERE user_id = $1 AND component_id = $2",
      [userId, componentId]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        "DELETE FROM component_likes WHERE user_id = $1 AND component_id = $2",
        [userId, componentId]
      );
      await pool.query(
        "UPDATE components SET likes = GREATEST(likes - 1, 0) WHERE id = $1",
        [componentId]
      );
      const updated = await pool.query("SELECT likes FROM components WHERE id = $1", [componentId]);
      return { liked: false, likes: updated.rows[0].likes };
    } else {
      await pool.query(
        "INSERT INTO component_likes (user_id, component_id) VALUES ($1, $2)",
        [userId, componentId]
      );
      await pool.query(
        "UPDATE components SET likes = likes + 1 WHERE id = $1",
        [componentId]
      );
      const updated = await pool.query("SELECT likes FROM components WHERE id = $1", [componentId]);
      return { liked: true, likes: updated.rows[0].likes };
    }
  }

  async hasLiked(slug: string, userId: string): Promise<boolean> {
    const comp = await pool.query("SELECT id FROM components WHERE slug = $1", [slug]);
    if (comp.rows.length === 0) return false;
    const result = await pool.query(
      "SELECT 1 FROM component_likes WHERE user_id = $1 AND component_id = $2",
      [userId, comp.rows[0].id]
    );
    return result.rows.length > 0;
  }

  async getLikedSlugs(userId: string, slugs: string[]): Promise<string[]> {
    if (slugs.length === 0) return [];
    const result = await pool.query(
      `SELECT c.slug FROM component_likes cl
       JOIN components c ON c.id = cl.component_id
       WHERE cl.user_id = $1 AND c.slug = ANY($2)`,
      [userId, slugs]
    );
    return result.rows.map((r: { slug: string }) => r.slug);
  }
}

export const componentService = new ComponentService();
