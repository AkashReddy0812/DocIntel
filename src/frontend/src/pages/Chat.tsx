import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, RefreshCw, Copy, ThumbsUp, ThumbsDown, FileText, Sparkles, ChevronDown } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

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

const mockDocuments: DocumentFile[] = [
  { id: "1", name: "Financial Report Q4 2024.pdf", selected: true },
  { id: "2", name: "Research Paper - AI.pdf", selected: true },
  { id: "3", name: "Contract Agreement.pdf", selected: false },
];

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm ready to help you analyze your documents. You can ask me questions about the uploaded PDFs, and I'll provide answers with source references. What would you like to know?",
    timestamp: new Date(),
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState(mockDocuments);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Based on my analysis of the selected documents, here's what I found regarding your question:\n\nThe Q4 2024 financial report indicates strong performance with revenue growth of 15% year-over-year. Key drivers include:\n\n1. **Digital Transformation**: Increased adoption of cloud services contributed $2.3M in new revenue\n2. **Market Expansion**: Entry into 3 new geographic markets\n3. **Cost Optimization**: Operational efficiency improvements reduced costs by 8%\n\nThe research paper on AI complements this by highlighting how AI-driven analytics helped identify these growth opportunities.`,
        sources: [
          { text: "Revenue growth reached 15% YoY, primarily driven by digital services expansion...", page: 12, relevance: 0.95 },
          { text: "Cloud services revenue increased by $2.3M following strategic partnerships...", page: 23, relevance: 0.89 },
          { text: "AI analytics platform deployment resulted in 8% cost reduction...", page: 45, relevance: 0.82 },
        ],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const toggleDocument = (id: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, selected: !doc.selected } : doc
      )
    );
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex gap-6">
        {/* Left sidebar - Document selection */}
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

        {/* Main chat area */}
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
                    {documents.filter((d) => d.selected).length} documents selected
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
                    message.role === "user" ? "justify-end" : "justify-start"
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
                    
                    {/* Sources */}
                    {message.sources && message.sources.length > 0 && (
                      <Collapsible className="mt-4">
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-xs text-muted-foreground hover:text-foreground p-0 h-auto"
                          >
                            <FileText className="w-3 h-3" />
                            {message.sources.length} sources
                            <ChevronDown className="w-3 h-3" />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3 space-y-2">
                          {message.sources.map((source, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                  Page {source.page}
                                </Badge>
                                <span className="text-muted-foreground">
                                  {(source.relevance * 100).toFixed(0)}% relevant
                                </span>
                              </div>
                              <p className="text-muted-foreground italic">
                                "{source.text}"
                              </p>
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    )}

                    {/* Actions for assistant messages */}
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border/50">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-primary-foreground animate-pulse" />
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border/50">
            <div className="flex gap-3">
              <Button variant="outline" size="icon" className="flex-shrink-0">
                <Paperclip className="w-4 h-4" />
              </Button>
              <div className="flex-1 relative">
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
                  className="min-h-[44px] max-h-32 pr-12 resize-none bg-background/50"
                  rows={1}
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="gradient-primary glow flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Right sidebar - Metadata/Insights */}
        <Card className="w-80 glass flex-shrink-0 hidden xl:flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Extracted Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto space-y-4">
            {/* Key Entities */}
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-2">
                KEY ENTITIES
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {["Q4 2024", "Revenue Growth", "Cloud Services", "AI Analytics", "$2.3M", "15% YoY"].map(
                  (entity) => (
                    <Badge
                      key={entity}
                      variant="secondary"
                      className="text-xs"
                    >
                      {entity}
                    </Badge>
                  )
                )}
              </div>
            </div>

            {/* Key Points */}
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-2">
                KEY POINTS
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Strong revenue growth at 15% YoY</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Digital transformation driving success</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>3 new market expansions completed</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>8% cost reduction achieved</span>
                </li>
              </ul>
            </div>

            {/* Document Summary */}
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-2">
                DOCUMENT SUMMARY
              </h4>
              <p className="text-sm text-muted-foreground">
                The Q4 2024 financial report demonstrates exceptional company
                performance with significant growth in digital services and
                successful market expansion strategies.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
