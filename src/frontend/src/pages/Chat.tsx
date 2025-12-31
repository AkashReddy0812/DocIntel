import { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { getDocuments, askChat, getInsights } from "@/lib/api";


/* -------------------- TYPES -------------------- */
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: { text: string; page: number; relevance: number }[];
  timestamp: Date;
}

interface DocumentFile {
  id: string;
  name: string;
  selected: boolean;
}
interface DocumentInsights {
  summary: string;
  key_points: string[];
  entities: string[];
}

/* -------------------- INITIAL MESSAGE -------------------- */
const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hello! I'm ready to help you analyze your documents. You can ask me questions about the uploaded PDFs, and I'll provide answers with source references. What would you like to know?",
    timestamp: new Date(),
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [insights, setInsights] = useState<DocumentInsights | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);


  /* -------------------- AUTO SCROLL -------------------- */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  /* -------------------- FETCH DOCUMENTS (🔥 FIX) -------------------- */
  useEffect(() => {
    getDocuments()
      .then((docs) => {
        setDocuments(
          docs.map((d: any) => ({
            id: d.id,
            name: d.name,
            selected: true,
          }))
        );
      })
      .catch((err) => {
        console.error("Failed to load documents", err);
      });
  }, []);

  /* -------------------- SEND MESSAGE -------------------- */
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await askChat(userMessage.content);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res.answer,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "❌ Failed to get response from backend.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------- TOGGLE DOC -------------------- */
const toggleDocument = async (id: string) => {
  // select only one document
  setDocuments((prev) =>
    prev.map((doc) =>
      doc.id === id
        ? { ...doc, selected: true }
        : { ...doc, selected: false }
    )
  );

  setSelectedDocId(id);
  setLoadingInsights(true);

  try {
    const data = await getInsights(id);
    setInsights(data);
    console.log("INSIGHTS LOADED:", data); // 🔥 debug
  } catch (err) {
    console.error("Failed to load insights", err);
    setInsights(null);
  } finally {
    setLoadingInsights(false);
  }
};

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex gap-6">
        {/* ---------------- LEFT PANEL ---------------- */}
        <Card className="w-72 glass flex-shrink-0 hidden lg:flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Document Context
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto space-y-2">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => toggleDocument(doc.id)}
                className={cn(
                  "w-full p-3 rounded-lg text-left text-sm transition-all duration-200",
                  doc.selected
                    ? "bg-primary/10 border border-primary/30"
                    : "bg-background/50 border border-transparent hover:bg-background/80"
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                      doc.selected
                        ? "bg-primary border-primary"
                        : "border-muted-foreground/30"
                    )}
                  >
                    {doc.selected && (
                      <svg
                        className="w-3 h-3 text-primary-foreground"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="truncate">{doc.name}</span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* ---------------- CHAT PANEL ---------------- */}
        <Card className="flex-1 glass flex flex-col">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg gradient-primary">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg">RAG Chat</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {documents.filter((d) => d.selected).length} documents
                    selected
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                New Chat
              </Button>
            </div>
          </CardHeader>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 animate-slide-up",
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-xl p-4",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border"
                    )}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border/50">
            <div className="flex gap-3">
              <Button variant="outline" size="icon">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask a question about your documents..."
                className="resize-none"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="gradient-primary"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* ---------------- RIGHT PANEL (STATIC FOR NOW) ---------------- */}
        <Card className="w-80 glass hidden xl:flex flex-col">
  <CardHeader>
    <CardTitle className="text-sm flex items-center gap-2">
      <Sparkles className="w-4 h-4" />
      Extracted Insights
    </CardTitle>
  </CardHeader>

  <CardContent className="flex-1 overflow-auto space-y-5 text-sm">

    {/* Loading */}
    {loadingInsights && (
      <p className="text-muted-foreground">Loading insights…</p>
    )}

    {/* No document selected */}
    {!selectedDocId && !loadingInsights && (
      <p className="text-muted-foreground">
        Select a document to view insights
      </p>
    )}

    {/* Insights Loaded */}
    {insights && !loadingInsights && (
      <>
        {/* SUMMARY */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">
            SUMMARY
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {insights.summary}
          </p>
        </div>

        {/* KEY POINTS */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">
            KEY POINTS
          </h4>
          <ul className="space-y-2">
            {insights.key_points.map((point, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-primary">•</span>
                <span className="text-muted-foreground">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ENTITIES */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">
            ENTITIES
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {insights.entities.map((entity, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {entity}
              </Badge>
            ))}
          </div>
        </div>
      </>
    )}
  </CardContent>
</Card>

      </div>
    </DashboardLayout>
  );
}
