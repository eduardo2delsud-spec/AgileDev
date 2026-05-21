export const TABS = [
  { id: "vision", name: "Visión del Producto", path: "product-vision.md" },
  { id: "funcionales", name: "R. Funcionales", path: "requerimientos/funcionales.md" },
  { id: "nofuncionales", name: "R. No Funcionales", path: "requerimientos/no-funcionales.md" },
  { id: "backlog", name: "Product Backlog", path: "backlog/backlog.md" },
  { id: "sprint", name: "Sprint Plan", path: "backlog/sprint-plan.md" },
  { id: "roadmap", name: "Roadmap", path: "roadmap-sprints.md" },
  { id: "tasks", name: "Task Cards", path: "task-cards.md" },
  { id: "changelog", name: "Changelog", path: "../changelog.md" },
]

export const EXTRA_DOC_NAMES: Record<string, string> = {
  "docs/usabilidad.md": "Usabilidad",
  "docs/glosario.md": "Glosario",
  "docs/presentacion-ejecutiva.md": "Presentación Ejecutiva",
  "docs/acta-reunion.md": "Acta de Reunión",
  "docs/retrospectiva.md": "Retrospectiva",
}

export function getDocDisplayName(docPath: string): string {
  const cleanPath = docPath.replace(/\\/g, "/")
  const tab = TABS.find((t) => cleanPath.includes(t.path))
  if (tab) return tab.name
  if (EXTRA_DOC_NAMES[cleanPath]) return EXTRA_DOC_NAMES[cleanPath]
  return cleanPath.split("/").pop()?.replace(".md", "") || cleanPath
}

export function getTabIdForDoc(docPath: string): string | undefined {
  const cleanPath = docPath.replace(/\\/g, "/")
  const tab = TABS.find((t) => cleanPath.includes(t.path))
  return tab?.id
}

export function getFilePathForTab(tabId: string, isChangelog: boolean): string {
  if (isChangelog) return "changelog.md"
  const tab = TABS.find((t) => t.id === tabId)
  return tab ? `docs/${tab.path}` : ""
}
