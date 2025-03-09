"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Send, X, MessageCircle } from "lucide-react"

export function Chatbox() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isPopping, setIsPopping] = useState(false)

  useEffect(() => {
    const popInterval = setInterval(() => {
      setIsPopping(true)
      setTimeout(() => setIsPopping(false), 5000)
    }, 30000) // Pop out every 30 seconds

    return () => clearInterval(popInterval)
  }, [])

  const toggleChatbox = () => setIsOpen(!isOpen)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Sending message:", message)
    setMessage("")
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="container-panel w-80 h-96 flex flex-col">
          <div className="flex justify-between items-center p-3 border-b border-[#0af0ff]/20">
            <h3 className="text-[#0af0ff] font-bold">AI Assistant</h3>
            <button onClick={toggleChatbox} className="text-[#0af0ff] hover:text-[#0af0ff]/80">
              <X size={20} />
            </button>
          </div>
          <div className="flex-grow p-3 overflow-y-auto">{/* Chat messages would go here */}</div>
          <form onSubmit={handleSubmit} className="p-3 border-t border-[#0af0ff]/20">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow bg-[#001a1a] text-white border border-[#0af0ff]/20 rounded p-2 focus:outline-none focus:border-[#0af0ff]"
              />
              <button type="submit" className="bg-[#0af0ff] text-[#001a1a] p-2 rounded hover:bg-[#0af0ff]/80">
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={toggleChatbox}
          className={`container-panel p-3 rounded-full hover:bg-[#0af0ff]/10 transition-all duration-200 ${
            isPopping ? "animate-bounce" : ""
          }`}
        >
          <MessageCircle size={24} className="text-[#0af0ff] animate-pulse" />
        </button>
      )}
    </div>
  )
}

