import { Router, Request, Response } from "express"
import { getDb } from "../db"
import { authMiddleware } from "../middleware/auth"

const router = Router()
router.use(authMiddleware)

router.get("/", (req: Request, res: Response) => {
  const user = (req as any).user
  const db = getDb()

  const sessions = db
    .prepare(
      `SELECT id, opencode_session_id, project_slug, project_name, status,
              substr(messages, 1, 500) as messages_preview,
              created_at, updated_at
       FROM chat_sessions
       WHERE user_id = ?
       ORDER BY updated_at DESC`
    )
    .all(user.userId)

  res.json({ sessions })
})

router.get("/:id", (req: Request, res: Response) => {
  const user = (req as any).user
  const db = getDb()

  const session = db
    .prepare("SELECT * FROM chat_sessions WHERE id = ? AND user_id = ?")
    .get(req.params.id, user.userId) as any

  if (!session) {
    res.status(404).json({ error: "Sesión no encontrada" })
    return
  }

  res.json({
    session: {
      ...session,
      messages: session.messages ? JSON.parse(session.messages) : [],
    },
  })
})

router.post("/", (req: Request, res: Response) => {
  const user = (req as any).user
  const { opencode_session_id, project_slug, project_name, messages } = req.body

  if (!opencode_session_id) {
    res.status(400).json({ error: "opencode_session_id es requerido" })
    return
  }

  const db = getDb()

  const existing = db
    .prepare("SELECT id FROM chat_sessions WHERE opencode_session_id = ? AND user_id = ?")
    .get(opencode_session_id, user.userId) as any

  const messagesJson = messages ? JSON.stringify(messages) : "[]"

  if (existing) {
    db.prepare(
      `UPDATE chat_sessions
       SET project_slug = ?, project_name = ?, messages = ?, status = ?, updated_at = datetime('now')
       WHERE id = ?`
    ).run(project_slug || null, project_name || null, messagesJson, req.body.status || "in_progress", existing.id)

    // Create project if project_slug and project_name are provided
    if (project_slug && project_name) {
      const existingProject = db
        .prepare("SELECT id FROM projects WHERE slug = ? AND user_id = ?")
        .get(project_slug, user.userId) as any

      if (!existingProject) {
        db.prepare(
          "INSERT INTO projects (user_id, slug, name) VALUES (?, ?, ?)"
        ).run(user.userId, project_slug, project_name)
      }
    }

    res.json({ id: existing.id })
  } else {
    const result = db
      .prepare(
        `INSERT INTO chat_sessions (user_id, opencode_session_id, project_slug, project_name, messages, status)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(user.userId, opencode_session_id, project_slug || null, project_name || null, messagesJson, req.body.status || "in_progress")

    // Create project if project_slug and project_name are provided
    if (project_slug && project_name) {
      db.prepare(
        "INSERT OR IGNORE INTO projects (user_id, slug, name) VALUES (?, ?, ?)"
      ).run(user.userId, project_slug, project_name)
    }

    res.status(201).json({ id: result.lastInsertRowid })
  }
})

router.patch("/:id", (req: Request, res: Response) => {
  const user = (req as any).user
  const db = getDb()

  const existing = db
    .prepare("SELECT id FROM chat_sessions WHERE id = ? AND user_id = ?")
    .get(req.params.id, user.userId)

  if (!existing) {
    res.status(404).json({ error: "Sesión no encontrada" })
    return
  }

  const updates: string[] = []
  const values: any[] = []

  if (req.body.status) {
    updates.push("status = ?")
    values.push(req.body.status)
  }
  if (req.body.messages) {
    updates.push("messages = ?")
    values.push(JSON.stringify(req.body.messages))
  }
  if (req.body.project_slug !== undefined) {
    updates.push("project_slug = ?")
    values.push(req.body.project_slug)
  }
  if (req.body.project_name !== undefined) {
    updates.push("project_name = ?")
    values.push(req.body.project_name)
  }

  if (updates.length === 0) {
    res.status(400).json({ error: "No hay campos para actualizar" })
    return
  }

  updates.push("updated_at = datetime('now')")
  values.push(req.params.id)

  db.prepare(`UPDATE chat_sessions SET ${updates.join(", ")} WHERE id = ?`).run(...values)

  // Create project if project_slug and project_name are being updated
  if (req.body.project_slug && req.body.project_name) {
    const existingProject = db
      .prepare("SELECT id FROM projects WHERE slug = ? AND user_id = ?")
      .get(req.body.project_slug, user.userId) as any

    if (!existingProject) {
      db.prepare(
        "INSERT INTO projects (user_id, slug, name) VALUES (?, ?, ?)"
      ).run(user.userId, req.body.project_slug, req.body.project_name)
    } else {
      db.prepare(
        "UPDATE projects SET name = ?, updated_at = datetime('now') WHERE id = ?"
      ).run(req.body.project_name, existingProject.id)
    }
  }

  res.json({ success: true })
})

router.delete("/:id", (req: Request, res: Response) => {
  const user = (req as any).user
  const db = getDb()

  const result = db.prepare("DELETE FROM chat_sessions WHERE id = ? AND user_id = ?").run(req.params.id, user.userId)

  if (result.changes === 0) {
    res.status(404).json({ error: "Sesión no encontrada" })
    return
  }

  res.json({ success: true })
})

export default router
