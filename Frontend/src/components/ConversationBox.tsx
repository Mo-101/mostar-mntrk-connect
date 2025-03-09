
import { useState, useRef, useEffect } from "react";
import { Send, X, MinusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export function ConversationBox() {
  const { deepSeek, isLoading } = useApi();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "system-welcome",
      content: "Welcome to MNTRK-Agent. How can I assist you with monitoring and tracking?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    try {
      // Generate AI response
      const response = await deepSeek.analyze(input);
      
      if (response) {
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          content: response.response || "No analysis available",
          isUser: false,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Handle error
        toast.error("Failed to get response", {
          description: "The AI service is currently unavailable. Please try again later.",
          duration: 5000
        });
        
        // Add error message
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          content: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.",
          isUser: false,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "I'm sorry, something went wrong. Please try again later.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const minimizeChat = () => {
    setIsOpen(false);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "system-welcome",
        content: "Welcome to MNTRK-Agent. How can I assist you with monitoring and tracking?",
        isUser: false,
        timestamp: new Date()
      }
    ]);
  };

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-5 right-5 w-12 h-12 rounded-full p-0 bg-slate-800 hover:bg-slate-700"
        onClick={() => setIsOpen(true)}
      >
        <Send className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[70vh]">
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center">
        <h3 className="font-medium">MNTRK-Agent</h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={clearChat} className="h-8 w-8">
            <MinusCircle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={minimizeChat} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-3 bg-slate-50 dark:bg-slate-900">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isUser 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <span className="text-xs opacity-70 block mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[80px] resize-none"
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading} 
            className="self-end"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
