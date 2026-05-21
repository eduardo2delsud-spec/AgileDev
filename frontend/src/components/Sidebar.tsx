import { useState } from "react"
import type { Project, UserInfo } from "../types"
import { getDocDisplayName, getTabIdForDoc } from "../constants/documents"

interface Props {
  projects: Project[]
  onSelect: (slug: string | null) => void
  onSelectDoc?: (slug: string, tabId: string) => void
  selected: string | null
  onClose?: () => void
  isMinimized?: boolean
  onToggleMinimize?: () => void
  savedSessions?: any[]
  onResumeSession?: (dbId: number) => void
  onStartNew?: () => void
  onLogout?: () => void
  user?: UserInfo | null
}

export default function Sidebar({
  projects,
  onSelect,
  onSelectDoc,
  selected,
  onClose,
  isMinimized = false,
  onToggleMinimize,
  savedSessions = [],
  onResumeSession,
  onStartNew,
  onLogout,
  user,
}: Props) {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null)

  const handleProjectClick = (slug: string) => {
    if (expandedSlug === slug) {
      setExpandedSlug(null)
      return
    }
    setExpandedSlug(slug)
    onSelect(slug)
  }

  const handleDocClick = (slug: string, docPath: string) => {
    const tabId = getTabIdForDoc(docPath)
    if (tabId) {
      onSelectDoc?.(slug, tabId)
    } else {
      onSelect(slug)
    }
  }
  return (
    <aside className={`flex h-full ${isMinimized ? "w-20" : "w-72"} flex-col border-r border-glass bg-glass shadow-glass shrink-0 z-10 transition-all duration-300 overflow-hidden`}>
      {/* Brand Header */}
      <div className={`flex items-center gap-2.5 border-b border-gray-800/80 ${isMinimized ? "px-3 py-3" : "px-5 py-4"} bg-gray-950/40`}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-[0_2px_10px_rgba(16,185,129,0.3)]">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        {!isMinimized && (
          <div>
            <h1 className="text-[13.5px] font-extrabold text-white tracking-wider uppercase leading-none">
              AgileDev Suite
            </h1>
            <span className="text-[9.5px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase mt-1 inline-block">
              v2.1.0 (Web)
            </span>
          </div>
        )}
        {onToggleMinimize && (
          <button
            onClick={onToggleMinimize}
            title={isMinimized ? "Expandir" : "Minimizar"}
            className="hidden md:block ml-auto p-1 rounded hover:bg-gray-700"
            aria-label={isMinimized ? "Expandir barra lateral" : "Minimizar barra lateral"}
          >
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMinimized ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              )}
            </svg>
          </button>
        )}
      </div>

      {/* Close button for mobile */}
      {onClose && (
        <div className="px-3.5 pt-3">
          <button onClick={onClose} aria-label="Cerrar barra lateral" className="text-xs text-gray-400 hover:text-gray-200 rounded">
            Cerrar ✕
          </button>
        </div>
      )}

      {/* User info */}
      {!isMinimized && user && (
        <div className="px-4 py-2 border-b border-gray-800/60 bg-gray-950/15">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-200 truncate">{user.username}</p>
              <p className="text-[9px] text-gray-500 truncate">{user.email}</p>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                title="Cerrar sesión"
                className="p-1 rounded hover:bg-gray-800/60 text-gray-500 hover:text-red-400 transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* New Interview + Resume buttons */}
      {!isMinimized && (
        <div className="p-3.5 border-b border-gray-800/60 bg-gray-950/15 space-y-2">
          <button
            onClick={() => onSelect(null)}
            className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-600/15 to-teal-500/15 hover:from-emerald-500/25 hover:to-teal-400/25 border border-emerald-500/30 hover:border-emerald-400/50 py-2.5 px-4 text-center text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-all duration-300 shadow-[0_2px_8px_rgba(16,185,129,0.04)] hover:shadow-[0_4px_16px_rgba(16,185,129,0.12)] transform active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Entrevista
          </button>
        </div>
      )}

      {/* Saved Sessions (incomplete) */}
      {!isMinimized && savedSessions.length > 0 && (
        <div className="border-b border-gray-800/60">
          <div className="px-4 pt-3 pb-1.5">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
              Entrevistas Pendientes
            </h2>
          </div>
          <nav className="p-2 space-y-1 max-h-40 overflow-y-auto">
            {savedSessions.map((s: any) => (
              <button
                key={s.id}
                onClick={() => onResumeSession?.(s.id)}
                className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-all duration-200 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 group"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-500">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-amber-300 truncate">
                    {s.project_name || "Sin título"}
                  </p>
                  <p className="text-[9px] text-gray-500">
                    {new Date(s.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Projects section */}
      {!isMinimized && (
        <div className="border-b border-gray-800/60 p-4 bg-gray-950/20">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Tus Proyectos
            </h2>
            <span className="text-[10px] font-bold text-gray-400 bg-gray-800/50 px-2 py-0.5 rounded-full border border-gray-800">
              {projects.length}
            </span>
          </div>
        </div>
      )}

      {/* Projects list */}
      <nav className="flex-1 overflow-y-auto p-3.5 space-y-2">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-2xl border border-dashed border-gray-800 bg-gray-950/20">
            <svg className="h-7 w-7 text-gray-600 mb-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-xs text-gray-500 font-medium">
              Escribí "hola" en el chat para crear tu primer proyecto.
            </p>
          </div>
        ) : (
          projects.map((p) => {
            const isSelected = selected === p.slug
            const isExpanded = expandedSlug === p.slug
            return (
              <div key={p.slug} className="space-y-1">
                <button
                  onClick={() => handleProjectClick(p.slug)}
                  className={`group relative w-full flex items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-all duration-300 border ${
                    isSelected
                      ? "bg-gradient-to-r from-emerald-600/15 to-teal-600/5 border-emerald-500/30 text-white shadow-[0_4px_16px_rgba(16,185,129,0.06)]"
                      : "border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/40 hover:border-gray-800"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  )}
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 ${
                    isSelected
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-gray-800/40 border-gray-800/60 text-gray-500 group-hover:text-gray-400 group-hover:bg-gray-800"
                  }`}>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] font-bold truncate tracking-wide leading-tight">
                      {p.name}
                    </p>
                    <p className="text-[10px] font-semibold text-gray-500 mt-0.5 flex items-center gap-1">
                      <span>{p.docs ? p.docs.length : 0} archivos</span>
                      <span>•</span>
                      <span className="text-[9px] uppercase tracking-wider text-emerald-500/80 font-bold">Scrum</span>
                    </p>
                  </div>
                  <svg
                    className={`h-3.5 w-3.5 text-gray-500 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isExpanded && p.docs && p.docs.length > 0 && (
                  <div className="ml-4 space-y-0.5 border-l-2 border-gray-800/60 pl-2">
                    {p.docs.map((docPath) => {
                      const cleanPath = docPath.replace(/\\/g, "/")
                      return (
                        <button
                          key={docPath}
                          onClick={() => handleDocClick(p.slug, cleanPath)}
                          className="w-full flex items-center gap-2 rounded-lg px-3 py-1.5 text-left transition-all duration-200 hover:bg-gray-800/30 text-gray-500 hover:text-gray-200 group"
                        >
                          <svg className="h-3.5 w-3.5 shrink-0 text-gray-600 group-hover:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <span className="text-[10.5px] font-semibold truncate">
                            {getDocDisplayName(cleanPath)}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-800/80 p-4 bg-gray-950/40 space-y-2">
        <a
          href="/docs/"
          target="_blank"
          className="flex items-center justify-center gap-2 rounded-xl bg-gray-800/60 hover:bg-gray-800 border border-gray-800 px-4 py-2.5 text-center text-xs font-semibold text-gray-300 transition-all duration-300 hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
          </svg>
          Explorar Entregables
        </a>
      </div>
    </aside>
  )
}
