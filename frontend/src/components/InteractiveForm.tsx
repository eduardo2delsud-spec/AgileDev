import { useState, useEffect } from "react"

interface Props {
  currentStep: number
  detectedVariables: Record<string, string>
  onSend: (text: string) => void
  disabled: boolean
  isMinimized?: boolean
  onToggleMinimize?: () => void
}

const STEP_METADATA = [
  { id: 1, title: "Proyecto", desc: "Define el nombre de tu proyecto y su fecha de inicio estimada." },
  { id: 2, title: "Visión del Producto", desc: "Describe el problema y la solución, junto con los objetivos y criterios de éxito de negocio." },
  { id: 3, title: "Tecnología", desc: "Stack tecnológico (frontend, backend, BD, hosting) y requerimientos no funcionales (rendimiento, seguridad, etc.)." },
  { id: 4, title: "Usabilidad", desc: "Perfil detallado de usuarios, accesibilidad (leyes, WCAG), usabilidad y dispositivos objetivo." },
  { id: 5, title: "Funcionalidades (Épicas)", desc: "Establece las 3 épicas principales de tu MVP y el alcance general del roadmap." },
  { id: 6, title: "Historias de Usuario", desc: "Historias de usuario con estimaciones en Story Points (SP) y criterios de aceptación." },
  { id: 7, title: "Sprint Plan", desc: "Define la cantidad de sprints, equipo de trabajo, objetivos y asignación de tareas del Sprint 1." },
  { id: 8, title: "Stakeholders (Socios)", desc: "Identifica decisores de presupuesto, aprobadores de cambio y canales de comunicación." },
  { id: 9, title: "Análisis de Riesgos", desc: "Riesgos identificados (mercado, legal, adopción de usuario, dependencias tecnológicas)." },
  { id: 10, title: "Valor de Negocio", desc: "Pitch ejecutivo, justificación build vs buy, cálculo de ROI aproximado y competidores." },
  { id: 11, title: "Métricas de Éxito (KPIs)", desc: "KPIs principales de producto, técnicos (uptime, velocidad) y de negocio." },
  { id: 12, title: "Tipo de Proyecto", desc: "Selecciona si el proyecto es nuevo o cuenta con documentación previa existente." },
]

export default function InteractiveForm({ currentStep, detectedVariables, onSend, disabled, isMinimized = false, onToggleMinimize }: Props) {
  const [formState, setFormState] = useState<Record<string, string>>({})
  const [completed, setCompleted] = useState(false)

  // Update local state when incoming variables change
  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      ...detectedVariables,
    }))
    if (currentStep !== 12) setCompleted(false)
  }, [detectedVariables, currentStep])

  const handleInputChange = (key: string, val: string) => {
    setFormState((prev) => ({ ...prev, [key]: val }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Generate human-friendly message text based on the active step's data
    let messageText = ""
    if (currentStep === 1) {
      messageText = `Proyecto: El nombre del proyecto es "${formState.nombre_proyecto || "Pendiente"}" y la fecha de inicio es "${formState.fecha || "Pendiente"}"`
    } else if (currentStep === 2) {
      messageText = `Visión: El problema es "${formState.problema_descripcion || "Pendiente"}". La solución es "${formState.solucion_descripcion || "Pendiente"}". Los objetivos son: "${formState.objetivos || "Pendiente"}". El público objetivo es "${formState.publico_objetivo || "Pendiente"}". Los criterios de éxito son: "${formState.criterios_exito || "Pendiente"}"`
    } else if (currentStep === 3) {
      messageText = `Tecnología: El stack es "${formState.tecnologia || "Pendiente"}". Rendimiento: "${formState.rendimiento || "Pendiente"}". Seguridad: "${formState.seguridad || "Pendiente"}". Compatibilidad: "${formState.compatibilidad || "Pendiente"}". Mantenibilidad: "${formState.mantenibilidad || "Pendiente"}"`
    } else if (currentStep === 4) {
      messageText = `Usabilidad: El perfil es "${formState.perfil_usuarios_detalle || "Pendiente"}". Accesibilidad: "${formState.necesidades_accesibilidad || "Pendiente"}". Nivel de usabilidad: "${formState.nivel_usabilidad || "Pendiente"}". Dispositivos: "${formState.dispositivos_objetivo || "Pendiente"}". Idiomas: "${formState.idiomas || "Pendiente"}"`
    } else if (currentStep === 5) {
      messageText = `Épicas: Épica 1: "${formState.epica_1_nombre || "Pendiente"}" (${formState.epica_1_desc || "Pendiente"}), prioridad ${formState.epica_1_prioridad || "must"}. Épica 2: "${formState.epica_2_nombre || "Pendiente"}" (${formState.epica_2_desc || "Pendiente"}), prioridad ${formState.epica_2_prioridad || "should"}. Épica 3: "${formState.epica_3_nombre || "Pendiente"}" (${formState.epica_3_desc || "Pendiente"}), prioridad ${formState.epica_3_prioridad || "could"}. El MVP es "${formState.mvp_descripcion || "Pendiente"}". El roadmap es "${formState.roadmap || "Pendiente"}"`
    } else if (currentStep === 6) {
      messageText = `Historias: Historia 1: "${formState.historia_1 || "Pendiente"}" (${formState.sp_1 || "3"} SP), CA: "${formState.ca_1 || "Pendiente"}". Historia 2: "${formState.historia_2 || "Pendiente"}" (${formState.sp_2 || "5"} SP), CA: "${formState.ca_2 || "Pendiente"}". Historia 3: "${formState.historia_3 || "Pendiente"}" (${formState.sp_3 || "8"} SP), CA: "${formState.ca_3 || "Pendiente"}"`
    } else if (currentStep === 7) {
      messageText = `Sprints: Total sprints: ${formState.sprint_count || "4"}. Equipo: "${formState.equipo || "Pendiente"}". Sprint 1 Goal: "${formState.sprint_1_goal || "Pendiente"}" con duración: "${formState.sprint_1_duracion || "Pendiente"}"`
    } else if (currentStep === 8) {
      messageText = `Stakeholders: Involucrados: "${formState.stakeholders_lista || "Pendiente"}". Decisor de presupuesto: "${formState.decisor_presupuesto || "Pendiente"}". Aprobador de cambios: "${formState.aprobador_cambios || "Pendiente"}"`
    } else if (currentStep === 9) {
      messageText = `Riesgos: Mercado: "${formState.riesgo_mercado || "Pendiente"}". Legal: "${formState.riesgo_legal || "Pendiente"}". Adopción: "${formState.riesgo_adopcion || "Pendiente"}". Dependencia: "${formState.riesgo_dependencia || "Pendiente"}"`
    } else if (currentStep === 10) {
      messageText = `Valor: Pitch: "${formState.pitch_ejecutivo || "Pendiente"}". Justificación: "${formState.justificacion_negocio || "Pendiente"}". ROI: "${formState.roi || "Pendiente"}". Competidores: "${formState.competidores_alternativas || "Pendiente"}"`
    } else if (currentStep === 11) {
      messageText = `Métricas: KPIs principales: "${formState.kpi_principales || "Pendiente"}". KPIs técnicos: "${formState.kpi_tecnicos || "Pendiente"}". KPIs de negocio: "${formState.kpi_negocio || "Pendiente"}"`
    } else if (currentStep === 12) {
      messageText = `El tipo de proyecto es "${formState.tipo || "nuevo"}"`
    }

    onSend(messageText)
    if (currentStep === 12) setCompleted(true)
  }

  const activeMeta = STEP_METADATA.find((m) => m.id === currentStep) || STEP_METADATA[0]

  const isComplete = currentStep === 12

  if (currentStep === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 bg-gray-950/20 text-center animate-fade-in h-full">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900 border border-gray-800 text-gray-500 shadow-inner mb-4">
          <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Asistente Interactivo</h3>
        <p className="mt-2 text-xs text-gray-500 max-w-sm leading-relaxed">
          Escribe "hola" en el chat para activar este panel interactivo. Podrás rellenar los datos del proyecto ágil de forma visual e intuitiva en tiempo real.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col h-full bg-gray-950/45 border-l border-glass overflow-hidden animate-fade-in z-0">
      {/* Header */}
      <div className="bg-gray-900/30 border-b border-gray-800/80 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-5.5 w-5.5 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[10.5px] font-bold text-emerald-400">
            {currentStep}
          </span>
          <h2 className="text-sm font-bold text-gray-100 tracking-wide">
            {activeMeta.title}
          </h2>
          <span className="text-[8px] font-bold text-teal-400 bg-teal-400/10 px-1.5 py-0.5 rounded border border-teal-500/20 uppercase tracking-wider ml-auto">
            Panel Visual
          </span>
        </div>
        <p className="mt-1.5 text-xs text-gray-400 leading-relaxed font-medium">
          {activeMeta.desc}
        </p>
      </div>

      {/* Form Fields Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {currentStep === 1 && (
            <>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Nombre del Proyecto</label>
                <input
                  type="text"
                  value={formState.nombre_proyecto || ""}
                  onChange={(e) => handleInputChange("nombre_proyecto", e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-gray-100 transition-all placeholder-gray-600 outline-none"
                  placeholder="ej. Sistema de Pedidos Online"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Fecha de Inicio (YYYY-MM-DD)</label>
                <input
                  type="date"
                  value={formState.fecha || ""}
                  onChange={(e) => handleInputChange("fecha", e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-gray-100 transition-all outline-none"
                  required
                />
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Problema a resolver</label>
                <textarea
                  value={formState.problema_descripcion || ""}
                  onChange={(e) => handleInputChange("problema_descripcion", e.target.value)}
                  className="w-full h-20 bg-gray-900/50 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-gray-100 transition-all placeholder-gray-600 outline-none resize-none"
                  placeholder="¿Qué problema o necesidad actual resuelve el producto?"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Solución Propuesta</label>
                <textarea
                  value={formState.solucion_descripcion || ""}
                  onChange={(e) => handleInputChange("solucion_descripcion", e.target.value)}
                  className="w-full h-20 bg-gray-900/50 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-gray-100 transition-all placeholder-gray-600 outline-none resize-none"
                  placeholder="¿Cómo la plataforma resuelve este problema?"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Objetivos de Negocio</label>
                <textarea
                  value={formState.objetivos || ""}
                  onChange={(e) => handleInputChange("objetivos", e.target.value)}
                  className="w-full h-20 bg-gray-900/50 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-gray-100 transition-all placeholder-gray-600 outline-none resize-none"
                  placeholder="ej. Reducir errores manuales en un 80%..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Público Objetivo</label>
                <input
                  type="text"
                  value={formState.publico_objetivo || ""}
                  onChange={(e) => handleInputChange("publico_objetivo", e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-gray-100 transition-all placeholder-gray-600 outline-none"
                  placeholder="ej. Clientes corporativos, administradores"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Criterios de Éxito</label>
                <textarea
                  value={formState.criterios_exito || ""}
                  onChange={(e) => handleInputChange("criterios_exito", e.target.value)}
                  className="w-full h-16 bg-gray-900/50 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-gray-100 transition-all placeholder-gray-600 outline-none resize-none"
                  placeholder="ej. 100 transacciones diarias en el primer mes"
                />
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Stack Tecnológico</label>
                <textarea
                  value={formState.tecnologia || ""}
                  onChange={(e) => handleInputChange("tecnologia", e.target.value)}
                  className="w-full h-20 bg-gray-900/50 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-gray-100 transition-all placeholder-gray-600 outline-none resize-none"
                  placeholder="ej. Frontend React, Backend Node, DB PostgreSQL, Hosting AWS"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Requisito Rendimiento</label>
                <input
                  type="text"
                  value={formState.rendimiento || ""}
                  onChange={(e) => handleInputChange("rendimiento", e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-gray-100 transition-all placeholder-gray-600 outline-none"
                  placeholder="ej. Tiempos de carga menores a 2 segundos"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Requisito Seguridad</label>
                <input
                  type="text"
                  value={formState.seguridad || ""}
                  onChange={(e) => handleInputChange("seguridad", e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-gray-100 transition-all placeholder-gray-600 outline-none"
                  placeholder="ej. Encriptación HTTPS, hashing bcrypt, tokens JWT"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Compatibilidad / Mantenibilidad</label>
                <input
                  type="text"
                  value={formState.compatibilidad || ""}
                  onChange={(e) => handleInputChange("compatibilidad", e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-gray-100 transition-all placeholder-gray-600 outline-none mb-2"
                  placeholder="ej. Responsivo en Chrome, Safari e iOS/Android"
                />
                <input
                  type="text"
                  value={formState.mantenibilidad || ""}
                  onChange={(e) => handleInputChange("mantenibilidad", e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-gray-100 transition-all placeholder-gray-600 outline-none"
                  placeholder="ej. Código modulado, despliegues por CI/CD"
                />
              </div>
            </>
          )}

          {currentStep === 4 && (
            <>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Perfil de Usuarios</label>
                <textarea
                  value={formState.perfil_usuarios_detalle || ""}
                  onChange={(e) => handleInputChange("perfil_usuarios_detalle", e.target.value)}
                  className="w-full h-20 bg-gray-900/50 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-gray-100 transition-all placeholder-gray-600 outline-none resize-none"
                  placeholder="¿Quiénes usarán el sistema y cuál es su nivel digital?"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Necesidades de Accesibilidad</label>
                <textarea
                  value={formState.necesidades_accesibilidad || ""}
                  onChange={(e) => handleInputChange("necesidades_accesibilidad", e.target.value)}
                  className="w-full h-16 bg-gray-900/50 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-gray-100 transition-all placeholder-gray-600 outline-none resize-none"
                  placeholder="ej. Estándar WCAG 2.1 AA, soporte de lector de pantalla"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Detalles de Dispositivos e Idiomas</label>
                <input
                  type="text"
                  value={formState.dispositivos_objetivo || ""}
                  onChange={(e) => handleInputChange("dispositivos_objetivo", e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-gray-100 transition-all placeholder-gray-600 outline-none mb-2"
                  placeholder="ej. Móviles y Escritorio"
                />
                <input
                  type="text"
                  value={formState.idiomas || ""}
                  onChange={(e) => handleInputChange("idiomas", e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-gray-100 transition-all placeholder-gray-600 outline-none"
                  placeholder="ej. Español, Inglés"
                />
              </div>
            </>
          )}

          {currentStep === 5 && (
            <>
              <div className="border border-gray-800 bg-gray-900/10 p-3.5 rounded-xl space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Especificación de Épicas</h4>
                
                <div className="space-y-1">
                  <label className="text-[9.5px] font-bold text-gray-400 uppercase">Épica 1 (Must)</label>
                  <input
                    type="text"
                    value={formState.epica_1_nombre || ""}
                    onChange={(e) => handleInputChange("epica_1_nombre", e.target.value)}
                    className="w-full bg-gray-900/40 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-200"
                    placeholder="Nombre Épica 1"
                  />
                  <textarea
                    value={formState.epica_1_desc || ""}
                    onChange={(e) => handleInputChange("epica_1_desc", e.target.value)}
                    className="w-full h-12 bg-gray-900/40 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 resize-none mt-1"
                    placeholder="Descripción corta"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] font-bold text-gray-400 uppercase">Épica 2 (Should)</label>
                  <input
                    type="text"
                    value={formState.epica_2_nombre || ""}
                    onChange={(e) => handleInputChange("epica_2_nombre", e.target.value)}
                    className="w-full bg-gray-900/40 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-200"
                    placeholder="Nombre Épica 2"
                  />
                  <textarea
                    value={formState.epica_2_desc || ""}
                    onChange={(e) => handleInputChange("epica_2_desc", e.target.value)}
                    className="w-full h-12 bg-gray-900/40 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 resize-none mt-1"
                    placeholder="Descripción corta"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] font-bold text-gray-400 uppercase">Épica 3 (Could)</label>
                  <input
                    type="text"
                    value={formState.epica_3_nombre || ""}
                    onChange={(e) => handleInputChange("epica_3_nombre", e.target.value)}
                    className="w-full bg-gray-900/40 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-200"
                    placeholder="Nombre Épica 3"
                  />
                  <textarea
                    value={formState.epica_3_desc || ""}
                    onChange={(e) => handleInputChange("epica_3_desc", e.target.value)}
                    className="w-full h-12 bg-gray-900/40 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 resize-none mt-1"
                    placeholder="Descripción corta"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Alcance del MVP y Roadmap</label>
                <textarea
                  value={formState.mvp_descripcion || ""}
                  onChange={(e) => handleInputChange("mvp_descripcion", e.target.value)}
                  className="w-full h-16 bg-gray-900/50 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-gray-100 transition-all placeholder-gray-600 outline-none resize-none mb-2"
                  placeholder="ej. Lanzamiento de catálogo interactivo con checkout básico"
                />
                <textarea
                  value={formState.roadmap || ""}
                  onChange={(e) => handleInputChange("roadmap", e.target.value)}
                  className="w-full h-16 bg-gray-900/50 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-gray-100 transition-all placeholder-gray-600 outline-none resize-none"
                  placeholder="ej. Q1 MVP, Q2 Dashboard de analítica, Q3 App móvil"
                />
              </div>
            </>
          )}

          {currentStep === 6 && (
            <>
              <div className="border border-gray-800 bg-gray-900/10 p-3.5 rounded-xl space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Historias de Usuario (MVP)</h4>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[9.5px] font-bold text-gray-400 uppercase">Historia 1</label>
                    <input
                      type="number"
                      value={formState.sp_1 || "3"}
                      onChange={(e) => handleInputChange("sp_1", e.target.value)}
                      className="w-14 bg-gray-900/40 border border-gray-800 rounded px-2 py-0.5 text-center text-xs text-gray-200"
                      placeholder="SP"
                    />
                  </div>
                  <textarea
                    value={formState.historia_1 || ""}
                    onChange={(e) => handleInputChange("historia_1", e.target.value)}
                    className="w-full h-12 bg-gray-900/40 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 resize-none"
                    placeholder="Como usuario quiero..."
                  />
                  <input
                    type="text"
                    value={formState.ca_1 || ""}
                    onChange={(e) => handleInputChange("ca_1", e.target.value)}
                    className="w-full bg-gray-900/40 border border-gray-800 rounded-lg px-2.5 py-1 text-xs text-gray-300"
                    placeholder="Criterio de aceptación..."
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[9.5px] font-bold text-gray-400 uppercase">Historia 2</label>
                    <input
                      type="number"
                      value={formState.sp_2 || "5"}
                      onChange={(e) => handleInputChange("sp_2", e.target.value)}
                      className="w-14 bg-gray-900/40 border border-gray-800 rounded px-2 py-0.5 text-center text-xs text-gray-200"
                      placeholder="SP"
                    />
                  </div>
                  <textarea
                    value={formState.historia_2 || ""}
                    onChange={(e) => handleInputChange("historia_2", e.target.value)}
                    className="w-full h-12 bg-gray-900/40 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 resize-none"
                    placeholder="Como usuario quiero..."
                  />
                  <input
                    type="text"
                    value={formState.ca_2 || ""}
                    onChange={(e) => handleInputChange("ca_2", e.target.value)}
                    className="w-full bg-gray-900/40 border border-gray-800 rounded-lg px-2.5 py-1 text-xs text-gray-300"
                    placeholder="Criterio de aceptación..."
                  />
                </div>
              </div>
            </>
          )}

          {currentStep === 7 && (
            <>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Duración y Cantidad Sprints</label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-[9px] text-gray-500">Cantidad Sprints</label>
                    <input
                      type="number"
                      value={formState.sprint_count || "4"}
                      onChange={(e) => handleInputChange("sprint_count", e.target.value)}
                      className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-100"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] text-gray-500">Duración Sprint 1</label>
                    <input
                      type="text"
                      value={formState.sprint_1_duracion || "2 semanas"}
                      onChange={(e) => handleInputChange("sprint_1_duracion", e.target.value)}
                      className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-100"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Equipo de Trabajo</label>
                <textarea
                  value={formState.equipo || ""}
                  onChange={(e) => handleInputChange("equipo", e.target.value)}
                  className="w-full h-16 bg-gray-900/50 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-100 resize-none"
                  placeholder="ej. 1 TL, 2 Devs, 1 QA, 1 Product Owner"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Objetivo Sprint 1</label>
                <input
                  type="text"
                  value={formState.sprint_1_goal || ""}
                  onChange={(e) => handleInputChange("sprint_1_goal", e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-100"
                  placeholder="ej. Diseñar mockup y configurar BD y repo inicial"
                />
              </div>
            </>
          )}

          {currentStep === 8 && (
            <>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Involucrados Principales</label>
                <textarea
                  value={formState.stakeholders_lista || ""}
                  onChange={(e) => handleInputChange("stakeholders_lista", e.target.value)}
                  className="w-full h-16 bg-gray-900/50 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-100 resize-none"
                  placeholder="ej. CEO, Gerente de Ventas, Administrador"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Decisor de Presupuesto y Cambios</label>
                <input
                  type="text"
                  value={formState.decisor_presupuesto || ""}
                  onChange={(e) => handleInputChange("decisor_presupuesto", e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-100 mb-2"
                  placeholder="Responsable de presupuesto (ej. CEO)"
                />
                <input
                  type="text"
                  value={formState.aprobador_cambios || ""}
                  onChange={(e) => handleInputChange("aprobador_cambios", e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-100"
                  placeholder="Aprobador de cambios en alcance (ej. Product Owner)"
                />
              </div>
            </>
          )}

          {currentStep === 9 && (
            <>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9.5px] font-bold text-gray-400 uppercase">Riesgo de Mercado</label>
                  <textarea
                    value={formState.riesgo_mercado || ""}
                    onChange={(e) => handleInputChange("riesgo_mercado", e.target.value)}
                    className="w-full h-14 bg-gray-900/40 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 resize-none"
                    placeholder="ej. Baja adopción digital por parte de clientes analógicos"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9.5px] font-bold text-gray-400 uppercase">Riesgo Legal / Cumplimiento</label>
                  <textarea
                    value={formState.riesgo_legal || ""}
                    onChange={(e) => handleInputChange("riesgo_legal", e.target.value)}
                    className="w-full h-14 bg-gray-900/40 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 resize-none"
                    placeholder="ej. Normativas de protección de datos locales (GDPR/LPDP)"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9.5px] font-bold text-gray-400 uppercase">Dependencias Tecnológicas</label>
                  <textarea
                    value={formState.riesgo_dependencia || ""}
                    onChange={(e) => handleInputChange("riesgo_dependencia", e.target.value)}
                    className="w-full h-14 bg-gray-900/40 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 resize-none"
                    placeholder="ej. Caídas en la API de pagos de terceros"
                  />
                </div>
              </div>
            </>
          )}

          {currentStep === 10 && (
            <>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Pitch Ejecutivo</label>
                <textarea
                  value={formState.pitch_ejecutivo || ""}
                  onChange={(e) => handleInputChange("pitch_ejecutivo", e.target.value)}
                  className="w-full h-20 bg-gray-900/50 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-gray-100 resize-none"
                  placeholder="Escribe un breve pitch que resuma el valor de negocio de la solución."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Competidores y Retorno (ROI)</label>
                <textarea
                  value={formState.competidores_alternativas || ""}
                  onChange={(e) => handleInputChange("competidores_alternativas", e.target.value)}
                  className="w-full h-14 bg-gray-900/50 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-gray-100 resize-none mb-2"
                  placeholder="Competidores y alternativas actuales en el mercado"
                />
                <input
                  type="text"
                  value={formState.roi || ""}
                  onChange={(e) => handleInputChange("roi", e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-gray-100"
                  placeholder="Retorno de inversión esperado (ej. 200% en 12 meses)"
                />
              </div>
            </>
          )}

          {currentStep === 11 && (
            <>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Métricas de Producto y Negocio</label>
                <textarea
                  value={formState.kpi_principales || ""}
                  onChange={(e) => handleInputChange("kpi_principales", e.target.value)}
                  className="w-full h-16 bg-gray-900/50 border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-gray-100 resize-none mb-2"
                  placeholder="Métricas de Producto (ej. NPS, Retención semanal)"
                />
                <textarea
                  value={formState.kpi_negocio || ""}
                  onChange={(e) => handleInputChange("kpi_negocio", e.target.value)}
                  className="w-full h-16 bg-gray-900/50 border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-gray-100 resize-none"
                  placeholder="Métricas de Negocio (ej. Reducción de costos de tipeo manual)"
                />
              </div>
            </>
          )}

          {isComplete && !completed && (
            <>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Tipo de Proyecto</label>
                <select
                  value={formState.tipo || "nuevo"}
                  onChange={(e) => handleInputChange("tipo", e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-gray-100 outline-none"
                >
                  <option value="nuevo">Proyecto Nuevo</option>
                  <option value="existente">Proyecto Existente</option>
                </select>
              </div>
            </>
          )}

          {isComplete && completed && (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border-2 border-emerald-500/30">
                <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-400">Proyecto Completado</h3>
                <p className="mt-1 text-xs text-gray-400 max-w-xs leading-relaxed">
                  Todos los datos han sido enviados al asistente. El proyecto se está generando y aparecerá en la barra lateral en unos segundos.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-500 bg-gray-900/40 border border-gray-800/60 rounded-lg px-4 py-2">
                <svg className="h-3.5 w-3.5 text-teal-400 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Generando documentación del proyecto...</span>
              </div>
            </div>
          )}

          {/* Submit controls — hide when completed */}
          {!(isComplete && completed) && (
          <div className="pt-4">
            <button
              type="submit"
              disabled={disabled}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-500 border-none px-4 py-3 text-center text-xs font-bold text-white transition-all duration-300 shadow-[0_4px_14px_rgba(16,185,129,0.2)] disabled:shadow-none"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Guardar y Continuar en Chat
            </button>
            <p className="mt-2 text-[10px] text-gray-500 text-center leading-relaxed">
              Presionar el botón enviará los campos completados al chat para que el asistente de IA los procese y avance a la siguiente sección.
            </p>
          </div>
          )}
        </form>
      </div>
    </div>
  )
}
