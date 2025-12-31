import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { uploadPDF } from "@/lib/api";

interface UploadedFile {
  id: string;
  file: File;
  status: "uploading" | "processing" | "indexed" | "error";
  progress: number;
  error?: string;
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const startUpload = async (file: File) => {
    const id = crypto.randomUUID();

    // Add initial state
    setFiles((prev) => [
      ...prev,
      { id, file, status: "uploading", progress: 0 },
    ]);

    let progress = 0;
    const interval = setInterval(() => {
      progress = Math.min(progress + 15, 90);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, progress } : f
        )
      );
    }, 200);

    try {
      // Visual processing state
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, status: "processing", progress: 95 }
            : f
        )
      );

      // REAL backend call
      await uploadPDF(file);

      clearInterval(interval);

      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, status: "indexed", progress: 100 }
            : f
        )
      );

      toast({
        title: "Document Ready",
        description: `${file.name} has been indexed and is ready for Q&A.`,
      });
    } catch (err: any) {
      clearInterval(interval);

      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                status: "error",
                error: err?.message || "Upload failed",
              }
            : f
        )
      );

      toast({
        title: "Upload failed",
        description: file.name,
        variant: "destructive",
      });
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const pdfFiles = acceptedFiles.filter(
        (file) => file.type === "application/pdf"
      );

      if (pdfFiles.length !== acceptedFiles.length) {
        toast({
          title: "Unsupported files",
          description: "Only PDF files are supported.",
          variant: "destructive",
        });
      }

      pdfFiles.forEach(startUpload);
    },
    [toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: true,
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const indexedFiles = files.filter((f) => f.status === "indexed");

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Upload Documents
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload PDF documents to analyze with AI-powered RAG
          </p>
        </div>

        <Card className="glass">
          <CardContent className="p-8">
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all",
                isDragActive
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-border hover:border-primary/50 hover:bg-primary/5"
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <p className="text-lg font-medium">
                  Drag & drop PDF files here
                </p>
                <Button variant="outline">Browse Files</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {files.length > 0 && (
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">Uploaded Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {files.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-background/50"
                >
                  <FileText className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium truncate">{f.file.name}</p>
                    {f.status !== "indexed" && (
                      <Progress value={f.progress} className="w-32 h-1.5 mt-1" />
                    )}
                  </div>

                  <Badge
                    variant="outline"
                    className={cn(
                      f.status === "indexed" &&
                        "bg-success/10 text-success",
                      f.status === "processing" &&
                        "bg-info/10 text-info",
                      f.status === "uploading" &&
                        "bg-warning/10 text-warning",
                      f.status === "error" &&
                        "bg-destructive/10 text-destructive"
                    )}
                  >
                    {f.status === "indexed" ? (
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                    ) : f.status === "error" ? (
                      <AlertCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <Loader2 className="w-3 h-3 animate-spin mr-1" />
                    )}
                    {f.status}
                  </Badge>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(f.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {indexedFiles.length > 0 && (
          <div className="flex justify-center">
            <Button
              size="lg"
              className="gap-2 gradient-primary glow"
              onClick={() => navigate("/chat")}
            >
              Start Asking Questions
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
