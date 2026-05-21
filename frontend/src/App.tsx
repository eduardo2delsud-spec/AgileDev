import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import Login from "./components/Login"
import Register from "./components/Register"
import Chat from "./components/Chat"
import Sidebar from "./components/Sidebar"
import DocPreview from "./components/DocPreview"
import InteractiveForm from "./components/InteractiveForm"
import { listProjects, listModels } from "./api/opencode"
import { useSession } from "./hooks/useSession"
import { setToken, getToken, isLoggedIn, login as apiLogin, listSessions } from "./api/agile"
import type { Project, OpenModel, UserInfo } from "./types"

const DEFAULT_MODEL = "opencode/deepseek-v4-flash-free"

type AuthPage = "login" | "register"

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState<UserInfo | null>(null)
  const [authPage, setAuthPage] = useState<AuthPage>("login")
  const [authError, setAuthError] = useState("")
  const [showSidebar, setShowSidebar] = useState(false)
  const [minimizedSidebar, setMinimizedSidebar] = useState(false)
  const [minimizedPanel, setMinimizedPanel] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [activeDocTab, setActiveDocTab] = useState<string>("vision")
  const [models, setModels] = useState<OpenModel[]>([])
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL)
  const modelRef = useRef(DEFAULT_MODEL)
  const { messages, setMessages, loading, error, start, send, restore, sessionId } = useSession()
  const [savedSessions, setSavedSessions] = useState<any[]>([])
  const [showSessionList, setShowSessionList] = useState(false)

  const [rightPanelContent, setRightPanelContent] = useState<"doc" | "form" | "empty">("empty")

  useEffect(() => {
    modelRef.current = selectedModel
  }, [selectedModel])

  // Auto-login if token exists
  useEffect(() => {
    if (getToken()) {
      setLoggedIn(true)
      initApp()
    }
  }, [])

  const initApp = useCallback(async () => {
    try {
      const [m] = await Promise.all([listModels(), listProjects()])
      setModels(m)
      if (m.some((x) => `${x.providerID}/${x.id}` === DEFAULT_MODEL)) {
        setSelectedModel(DEFAULT_MODEL)
      } else if (m.length > 0) {
        setSelectedModel(`${m[0].providerID}/${m[0].id}`)
      }
      start()
      loadSavedSessions()
    } catch (e: any) {
      console.error("Init error:", e)
    }
  }, [start])

  const loadSavedSessions = async () => {
    try {
      const { sessions } = await listSessions()
      setSavedSessions(sessions.filter((s: any) => s.status === "in_progress"))
    } catch {}
  }

  const handleLogin = useCallback(async (username: string, password: string) => {
    try {
      const result = await apiLogin(username, password)
      setToken(result.token)
      setUser(result.user)
      setLoggedIn(true)
      setAuthError("")
      initApp()
    } catch (e: any) {
      setAuthError(e.message || "Credenciales inválidas")
    }
  }, [initApp])

  const handleRegister = useCallback((token: string) => {
    setToken(token)
    setLoggedIn(true)
    setAuthError("")
    initApp()
  }, [initApp])

  const handleLogout = useCallback(() => {
    setToken(null)
    setLoggedIn(false)
    setUser(null)
    setMessages([])
  }, [])

  // Smart polling to fetch projects list
  useEffect(() => {
    if (!loggedIn) return

    const fetchProj = async () => {
      try {
        const p = await listProjects()
        setProjects(p)
      } catch {}
    }

    fetchProj()
    const interval = setInterval(fetchProj, 5000)
    return () => clearInterval(interval)
  }, [loggedIn])

  const handleSend = useCallback(
    (text: string) => send(text, modelRef.current),
    [send]
  )

  const handleResumeSession = useCallback(async (dbId: number) => {
    await restore(dbId)
    setShowSessionList(false)
  }, [restore])

  const handleStartNew = useCallback(() => {
    start()
  }, [start])

  const handleSelectDoc = useCallback((slug: string, tabId: string) => {
    setSelectedProject(slug)
    setActiveDocTab(tabId)
  }, [])

  // Calculate current step and detected variables from assistant metadata
  const currentStepAndMeta = useMemo(() => {
    if (messages.length === 0) return { step: 0, vars: {} }

    const assistantMessages = messages.filter((m) => m.info.role === "assistant" || m.info.role === "model")
    if (assistantMessages.length === 0) return { step: 1, vars: {} }

    const lastMsg = assistantMessages[assistantMessages.length - 1]
    const rawText = lastMsg.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("\n")

    let step = 1
    let vars: Record<string, string> = {}

    const metaMatch = rawText.match(/===METADATOS===[\s\S]*?```json([\s\S]*?)```[\s\S]*?===FIN METADATOS===/)
    if (metaMatch && metaMatch[1]) {
      try {
        const metaData = JSON.parse(metaMatch[1].trim())
        if (typeof metaData.paso_activo === "number" && metaData.paso_activo >= 1 && metaData.paso_activo <= 12) {
          step = metaData.paso_activo
        }
        if (metaData.variables_detectadas && typeof metaData.variables_detectadas === "object") {
          vars = metaData.variables_detectadas
        }
      } catch (err) {
        console.error("Error parsing metadata from message:", err)
      }
    } else {
      const text = rawText.toUpperCase()
      if (text.includes("NOMBRE LE PONES") || text.includes("FECHA DE INICIO")) step = 1
      else if (text.includes("SECCION A") || text.includes("VISION")) step = 2
      else if (text.includes("SECCION B") || text.includes("TECNOLOGIA") || text.includes("STACK")) step = 3
      else if (text.includes("SECCION C") || text.includes("USABILIDAD")) step = 4
      else if (text.includes("SECCION D") || text.includes("FUNCIONALIDADES")) step = 5
      else if (text.includes("SECCION E") || text.includes("HISTORIAS")) step = 6
      else if (text.includes("SECCION F") || text.includes("SPRINTS")) step = 7
      else if (text.includes("SECCION G") || text.includes("STAKEHOLDERS")) step = 8
      else if (text.includes("SECCION H") || text.includes("RIESGOS")) step = 9
      else if (text.includes("SECCION I") || text.includes("VALOR")) step = 10
      else if (text.includes("SECCION J") || text.includes("METRICAS")) step = 11
      else if (text.includes("NUEVO") && text.includes("EXISTENTE")) step = 12
      else {
        const approxStep = Math.min(12, Math.floor(assistantMessages.length))
        step = Math.max(1, approxStep)
      }
    }

    return { step, vars }
  }, [messages])

  // Force refresh projects when interview completes (step 12)
  useEffect(() => {
    if (currentStepAndMeta.step === 12 && messages.length > 0) {
      const timer = setTimeout(async () => {
        try {
          const p = await listProjects()
          setProjects(p)
        } catch (e) {
          console.error("Error refreshing projects:", e)
        }
      }, 2000) // Espera 2 segundos después de completar para dar tiempo a que se genere el proyecto
      return () => clearTimeout(timer)
    }
  }, [currentStepAndMeta.step, messages.length])

  // Determine right panel content
  useEffect(() => {
    if (selectedProject) {
      setRightPanelContent("doc")
    } else if (currentStepAndMeta.step > 0) {
      setRightPanelContent("form")
    } else {
      setRightPanelContent("empty")
    }
  }, [selectedProject, currentStepAndMeta.step])

  // Get docs of the selected project
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => p.slug && p.slug !== "_defaults.json" && !p.slug.endsWith(".json"))
  }, [projects])

  const activeProject = filteredProjects.find((p) => p.slug === selectedProject)
  const docs = activeProject ? activeProject.docs : []

  if (!loggedIn) {
    if (authPage === "register") {
      return <Register onRegister={handleRegister} onSwitchToLogin={() => setAuthPage("login")} error={authError} />
    }
    return <Login onLogin={handleLogin} onSwitchToRegister={() => setAuthPage("register")} error={authError} />
  }

  return (
    <div className="relative h-screen w-screen bg-gray-950 text-gray-300 flex">
      <div className="relative z-10 flex h-full w-full overflow-hidden flex-col md:flex-row">
        {/* Sidebar */}
        <div className={`${minimizedSidebar ? "w-20" : "w-full md:w-72"} md:flex-shrink-0 transition-all duration-300`}>
          <div className="hidden md:block h-full">
            <Sidebar
              projects={filteredProjects}
              selected={selectedProject}
              onSelect={(slug) => {
                setSelectedProject(slug)
                setActiveDocTab("vision")
                if (slug === null) {
                  setRightPanelContent("form")
                  start()
                }
              }}
              onSelectDoc={handleSelectDoc}
              isMinimized={minimizedSidebar}
              onToggleMinimize={() => setMinimizedSidebar(!minimizedSidebar)}
              savedSessions={savedSessions}
              onResumeSession={handleResumeSession}
              onStartNew={handleStartNew}
              onLogout={handleLogout}
              user={user}
            />
          </div>
          {showSidebar && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowSidebar(false)} />
              <div className="relative h-full w-72">
                <Sidebar
                  projects={filteredProjects}
                  selected={selectedProject}
                  onSelect={(slug) => {
                    setSelectedProject(slug)
                    setActiveDocTab("vision")
                    setShowSidebar(false)
                    if (slug === null) start()
                  }}
                  onSelectDoc={(slug, tabId) => {
                    handleSelectDoc(slug, tabId)
                    setShowSidebar(false)
                  }}
                  onClose={() => setShowSidebar(false)}
                  isMinimized={false}
                  onToggleMinimize={() => {}}
                  savedSessions={savedSessions}
                  onResumeSession={handleResumeSession}
                  onStartNew={handleStartNew}
                  onLogout={handleLogout}
                  user={user}
                />
              </div>
            </div>
          )}
        </div>

        {/* Chat / Interview Panel */}
        <div className="flex-1 min-h-0 flex flex-col">
          <Chat
            messages={messages}
            loading={loading}
            error={error}
            onSend={handleSend}
            models={models}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            onToggleSidebar={() => setShowSidebar((s) => !s)}
          />
        </div>

        {/* Dynamic Right Panel */}
        <div className={`${minimizedPanel ? "w-16" : "hidden md:flex md:w-96 lg:w-1/4"} flex-col transition-all duration-300`}>
          {rightPanelContent === "doc" && selectedProject ? (
            <DocPreview projectSlug={selectedProject} docs={docs} isMinimized={minimizedPanel} onToggleMinimize={() => setMinimizedPanel(!minimizedPanel)} activeTab={activeDocTab} onTabChange={setActiveDocTab} />
          ) : rightPanelContent === "form" ? (
            <InteractiveForm
              currentStep={currentStepAndMeta.step}
              detectedVariables={currentStepAndMeta.vars}
              onSend={handleSend}
              disabled={loading}
              isMinimized={minimizedPanel}
              onToggleMinimize={() => setMinimizedPanel(!minimizedPanel)}
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-8 bg-gray-950/20 text-center animate-fade-in h-full">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900 border border-gray-800 text-gray-500 shadow-inner mb-4">
                <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Previsualización de Entregables</h3>
              <p className="mt-2 text-xs text-gray-500 max-w-sm leading-relaxed">
                Seleccioná un proyecto de la barra lateral para ver su documentación, o iniciá una nueva entrevista para crear un proyecto ágil.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
