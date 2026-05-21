import { Router, Request, Response } from "express"
import { getDb } from "../db"
import { authMiddleware } from "../middleware/auth"
import path from "path"
import fs from "fs"

const PROYECTOS_DIR = process.env.PROYECTOS_DIR || path.resolve(__dirname, "..", "..", "proyectos")

function scanProyectos(): { name: string; slug: string; docs: string[] }[] {
  try {
    if (!fs.existsSync(PROYECTOS_DIR)) {
      console.warn(`[projects] PROYECTOS_DIR not found: ${PROYECTOS_DIR}`)
      return []
    }
    const entries = fs.readdirSync(PROYECTOS_DIR, { withFileTypes: true })
    const projects: { name: string; slug: string; docs: string[] }[] = []

    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      if (entry.name.startsWith(".") || entry.name === "_defaults") continue

      const slug = entry.name
      const projectDir = path.join(PROYECTOS_DIR, slug)
      const name = slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())

      const docs: string[] = []
      const docsDir = path.join(projectDir, "docs")
      const changelogPath = path.join(projectDir, "changelog.md")

      if (fs.existsSync(changelogPath)) {
        docs.push("changelog.md")
      }

      if (fs.existsSync(docsDir)) {
        collectMdFiles(docsDir, "docs", docs)
      }

      projects.push({ name, slug, docs })
    }

    return projects
  } catch (err) {
    console.error("[projects] Error scanning proyectos:", err)
    return []
  }
}

function collectMdFiles(dir: string, prefix: string, result: string[]) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      const relPath = `${prefix}/${entry.name}`
      if (entry.isDirectory()) {
        collectMdFiles(fullPath, relPath, result)
      } else if (entry.name.endsWith(".md")) {
        result.push(relPath)
      }
    }
  } catch { }
}

const router = Router()

router.get("/list", (_req: Request, res: Response) => {
  const projects = scanProyectos()
  res.json(projects)
})

router.use(authMiddleware)

router.get("/", (req: Request, res: Response) => {
  const user = (req as any).user
  const db = getDb()

  const projects = db
    .prepare(
      `SELECT id, slug, name, status, created_at, updated_at
       FROM projects
       WHERE user_id = ?
       ORDER BY updated_at DESC`
    )
    .all(user.userId)

  res.json({ projects })
})

router.post("/", (req: Request, res: Response) => {
  const user = (req as any).user
  const { slug, name } = req.body

  if (!slug || !name) {
    res.status(400).json({ error: "slug y name son requeridos" })
    return
  }

  const db = getDb()

  const existing = db
    .prepare("SELECT id FROM projects WHERE slug = ? AND user_id = ?")
    .get(slug, user.userId) as any

  if (existing) {
    db.prepare("UPDATE projects SET name = ?, updated_at = datetime('now') WHERE id = ?").run(name, existing.id)
    res.json({ id: existing.id })
  } else {
    const result = db
      .prepare("INSERT INTO projects (user_id, slug, name) VALUES (?, ?, ?)")
      .run(user.userId, slug, name)

    res.status(201).json({ id: result.lastInsertRowid })
  }
})

router.patch("/:slug", (req: Request, res: Response) => {
  const user = (req as any).user
  const { status } = req.body

  if (!status || !["incomplete", "complete"].includes(status)) {
    res.status(400).json({ error: "status debe ser 'incomplete' o 'complete'" })
    return
  }

  const db = getDb()

  const result = db
    .prepare("UPDATE projects SET status = ?, updated_at = datetime('now') WHERE slug = ? AND user_id = ?")
    .run(status, req.params.slug, user.userId)

  if (result.changes === 0) {
    res.status(404).json({ error: "Proyecto no encontrado" })
    return
  }

  res.json({ success: true })
})

export default router
