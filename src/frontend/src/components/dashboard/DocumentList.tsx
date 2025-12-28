import { FileText, MoreVertical, Clock, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type DocumentStatus = "uploaded" | "indexing" | "ready" | "error";

interface Document {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  status: DocumentStatus;
  pages?: number;
}

const mockDocuments: Document[] = [
  { id: "1", name: "Financial Report Q4 2024.pdf", size: "2.4 MB", uploadedAt: "2 hours ago", status: "ready", pages: 45 },
  { id: "2", name: "Research Paper - AI.pdf", size: "1.8 MB", uploadedAt: "5 hours ago", status: "indexing", pages: 28 },
  { id: "3", name: "Contract Agreement.pdf", size: "856 KB", uploadedAt: "1 day ago", status: "ready", pages: 12 },
  { id: "4", name: "Technical Documentation.pdf", size: "3.2 MB", uploadedAt: "2 days ago", status: "uploaded", pages: 67 },
  { id: "5", name: "Meeting Notes.pdf", size: "124 KB", uploadedAt: "3 days ago", status: "error" },
];

const statusConfig: Record<DocumentStatus, { icon: React.ElementType; label: string; color: string }> = {
  uploaded: { icon: Clock, label: "Uploaded", color: "bg-warning/10 text-warning border-warning/20" },
  indexing: { icon: Loader2, label: "Indexing", color: "bg-info/10 text-info border-info/20" },
  ready: { icon: CheckCircle2, label: "Ready", color: "bg-success/10 text-success border-success/20" },
  error: { icon: AlertCircle, label: "Error", color: "bg-destructive/10 text-destructive border-destructive/20" },
};

export function DocumentList() {
  return (
    <Card className="glass">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Recent Documents</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockDocuments.map((doc, index) => {
          const StatusIcon = statusConfig[doc.status].icon;
          return (
            <div
              key={doc.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-200 group animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate group-hover:text-primary transition-colors">
                  {doc.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{doc.size}</span>
                  <span>•</span>
                  <span>{doc.uploadedAt}</span>
                  {doc.pages && (
                    <>
                      <span>•</span>
                      <span>{doc.pages} pages</span>
                    </>
                  )}
                </div>
              </div>
              <Badge
                variant="outline"
                className={cn("gap-1.5", statusConfig[doc.status].color)}
              >
                <StatusIcon className={cn("w-3 h-3", doc.status === "indexing" && "animate-spin")} />
                {statusConfig[doc.status].label}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Ask Questions</DropdownMenuItem>
                  <DropdownMenuItem>Re-index</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
