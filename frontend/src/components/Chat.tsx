import { useEffect, useRef } from "react"
import type { Message, OpenModel } from "../types"
import MessageBubble from "./MessageBubble"
import ChatInput from "./ChatInput"
import ModelSelector from "./ModelSelector"
import Stepper from "./Stepper"

interface Props {
  messages: Message[]
  loading: boolean
  error: string
  onSend: (text: string) => void
  models: OpenModel[]
  selectedModel: string
  onModelChange: (m: string) => void
  onToggleSidebar?: () => void
}

export default function Chat({
  messages,
  loading,
  error,
  onSend,
  models,
  selectedModel,
  onModelChange,
  onToggleSidebar,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex h-full w-full flex-col bg-gray-950/20 overflow-hidden">
      {/* Premium Header */}
      <div className="flex items-center justify-between border-b border-gray-800/80 bg-gray-900/30 px-5 py-3 shrink-0">
        {/* Mobile menu button */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            aria-label="Abrir menú lateral"
            className="md:hidden mr-2 p-2 rounded-md hover:bg-gray-800/40 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <svg className="h-5 w-5 text-gray-200" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-gray-200 tracking-wide">
            pm-navigator
          </span>
          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest leading-none">
            Orquestador IA
          </span>
        </div>
        {models.length > 0 && (
          <ModelSelector
            models={models}
            selected={selectedModel}
            onChange={onModelChange}
          />
        )}
      </div>

      {/* Dynamic Interview Stepper */}
      <Stepper messages={messages} />

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 space-y-4 w-full">
        {messages.length === 0 && !loading && (
          <div className="flex h-full items-center justify-center py-20">
            <div className="text-center animate-slide-up">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-400 shadow-inner mb-4">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Entrevista Agile PM</h3>
              <p className="mt-2 text-xs text-gray-500 max-w-xs leading-relaxed">
                Escribí <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">"hola"</span> para iniciar tu entrevista y preparar tu proyecto ágil de inmediato.
              </p>
            </div>
          </div>
        )}
        
        {messages.map((m) => (
          <MessageBubble key={m.info.id} role={m.info.role} parts={m.parts} />
        ))}
        
        {loading && (
          <div className="flex items-start gap-3 pl-2.5 animate-pulse">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600/10 to-teal-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold shadow-inner">
              PM
            </div>
            <div className="flex flex-col gap-2 bg-gray-900/60 border border-gray-800/80 px-4 py-3 rounded-2xl rounded-bl-none shadow-md">
              <div className="flex gap-1.5 items-center">
                <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs text-emerald-300 font-medium">Procesando información del proyecto...</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="rounded-xl border border-red-800 bg-red-950/30 px-4 py-3 text-xs text-red-400 shadow-md">
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input container */}
      <ChatInput onSend={onSend} disabled={loading} />
    </div>
  )
}
