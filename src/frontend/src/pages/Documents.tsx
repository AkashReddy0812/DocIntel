import { useState } from "react";
import { Search, Filter, Grid3X3, List, FileText, MoreVertical, Download, Trash2, MessageSquare, Eye } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

type DocumentStatus = "uploaded" | "indexing" | "ready" | "error";

interface Document {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  status: DocumentStatus;
  pages: number;
  entities: number;
}

const documents: Document[] = [
  { id: "1", name: "Financial Report Q4 2024.pdf", size: "2.4 MB", uploadedAt: "2024-01-15", status: "ready", pages: 45, entities: 23 },
  { id: "2", name: "Research Paper - AI.pdf", size: "1.8 MB", uploadedAt: "2024-01-14", status: "ready", pages: 28, entities: 15 },
  { id: "3", name: "Contract Agreement.pdf", size: "856 KB", uploadedAt: "2024-01-13", status: "ready", pages: 12, entities: 8 },
  { id: "4", name: "Technical Documentation.pdf", size: "3.2 MB", uploadedAt: "2024-01-12", status: "indexing", pages: 67, entities: 0 },
  { id: "5", name: "Meeting Notes Jan.pdf", size: "124 KB", uploadedAt: "2024-01-11", status: "ready", pages: 5, entities: 12 },
  { id: "6", name: "Project Proposal.pdf", size: "1.1 MB", uploadedAt: "2024-01-10", status: "ready", pages: 18, entities: 9 },
  { id: "7", name: "Budget Analysis.pdf", size: "945 KB", uploadedAt: "2024-01-09", status: "uploaded", pages: 22, entities: 0 },
  { id: "8", name: "HR Policy Update.pdf", size: "678 KB", uploadedAt: "2024-01-08", status: "error", pages: 0, entities: 0 },
];

const statusConfig: Record<DocumentStatus, { label: string; color: string }> = {
  uploaded: { label: "Uploaded", color: "bg-warning/10 text-warning border-warning/20" },
  indexing: { label: "Indexing", color: "bg-info/10 text-info border-info/20" },
  ready: { label: "Ready", color: "bg-success/10 text-success border-success/20" },
  error: { label: "Error", color: "bg-destructive/10 text-destructive border-destructive/20" },
};

export default function Documents() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground mt-1">
              Manage and browse your uploaded documents
            </p>
          </div>
          <Button
            className="gradient-primary glow"
            onClick={() => navigate("/upload")}
          >
            Upload New
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="indexing">Indexing</SelectItem>
                <SelectItem value="uploaded">Uploaded</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={view === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setView("grid")}
                className="rounded-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={view === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setView("list")}
                className="rounded-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Documents Grid/List */}
        {view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDocuments.map((doc, index) => (
              <Card
                key={doc.id}
                className="glass hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="w-4 h-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" onClick={() => navigate("/chat")}>
                          <MessageSquare className="w-4 h-4" /> Ask Questions
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Download className="w-4 h-4" /> Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <Trash2 className="w-4 h-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h3 className="font-medium truncate mb-1 group-hover:text-primary transition-colors">
                    {doc.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {doc.size} • {doc.pages} pages
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={cn("text-xs", statusConfig[doc.status].color)}
                    >
                      {statusConfig[doc.status].label}
                    </Badge>
                    {doc.entities > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {doc.entities} entities
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="glass">
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Size</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Pages</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Entities</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc, index) => (
                    <tr
                      key={doc.id}
                      className="border-b border-border/50 hover:bg-muted/50 transition-colors animate-slide-up"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <FileText className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-medium">{doc.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{doc.size}</td>
                      <td className="p-4 text-muted-foreground">{doc.pages}</td>
                      <td className="p-4 text-muted-foreground">{doc.entities || "-"}</td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={cn("text-xs", statusConfig[doc.status].color)}
                        >
                          {statusConfig[doc.status].label}
                        </Badge>
                      </td>
                      <td className="p-4 text-muted-foreground">{doc.uploadedAt}</td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2">
                              <Eye className="w-4 h-4" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2" onClick={() => navigate("/chat")}>
                              <MessageSquare className="w-4 h-4" /> Ask Questions
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Download className="w-4 h-4" /> Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-destructive">
                              <Trash2 className="w-4 h-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
