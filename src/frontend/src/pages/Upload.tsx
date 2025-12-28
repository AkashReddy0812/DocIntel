import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, CheckCircle2, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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

  const simulateUpload = (file: File) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newFile: UploadedFile = {
      id,
      file,
      status: "uploading",
      progress: 0,
    };
    
    setFiles((prev) => [...prev, newFile]);

    // Simulate upload progress
    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(uploadInterval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, status: "processing", progress: 100 } : f
          )
        );
        
        // Simulate processing
        setTimeout(() => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === id ? { ...f, status: "indexed" } : f
            )
          );
          toast({
            title: "Document Ready",
            description: `${file.name} has been indexed and is ready for Q&A.`,
          });
        }, 2000);
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, progress } : f))
        );
      }
    }, 200);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
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

    pdfFiles.forEach(simulateUpload);
  }, []);

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
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Documents</h1>
          <p className="text-muted-foreground mt-1">
            Upload PDF documents to analyze with AI-powered RAG
          </p>
        </div>

        {/* Upload Zone */}
        <Card className="glass">
          <CardContent className="p-8">
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300",
                isDragActive
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-border hover:border-primary/50 hover:bg-primary/5"
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                <div
                  className={cn(
                    "p-4 rounded-full transition-all duration-300",
                    isDragActive
                      ? "bg-primary/20 scale-110"
                      : "bg-primary/10"
                  )}
                >
                  <Upload
                    className={cn(
                      "w-8 h-8 transition-colors",
                      isDragActive ? "text-primary" : "text-primary/70"
                    )}
                  />
                </div>
                <div>
                  <p className="text-lg font-medium">
                    {isDragActive
                      ? "Drop your files here"
                      : "Drag & drop PDF files here"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    or click to browse from your computer
                  </p>
                </div>
                <Button variant="outline" className="mt-2">
                  Browse Files
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File List */}
        {files.length > 0 && (
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">Uploaded Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {files.map((uploadedFile, index) => (
                <div
                  key={uploadedFile.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-background/50 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {uploadedFile.file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      {uploadedFile.status === "uploading" && (
                        <Progress
                          value={uploadedFile.progress}
                          className="w-24 h-1.5"
                        />
                      )}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "gap-1.5",
                      uploadedFile.status === "indexed" &&
                        "bg-success/10 text-success border-success/20",
                      uploadedFile.status === "processing" &&
                        "bg-info/10 text-info border-info/20",
                      uploadedFile.status === "uploading" &&
                        "bg-warning/10 text-warning border-warning/20",
                      uploadedFile.status === "error" &&
                        "bg-destructive/10 text-destructive border-destructive/20"
                    )}
                  >
                    {uploadedFile.status === "uploading" && (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Uploading
                      </>
                    )}
                    {uploadedFile.status === "processing" && (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Indexing
                      </>
                    )}
                    {uploadedFile.status === "indexed" && (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Ready
                      </>
                    )}
                    {uploadedFile.status === "error" && (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        Error
                      </>
                    )}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeFile(uploadedFile.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        {indexedFiles.length > 0 && (
          <div className="flex justify-center">
            <Button
              size="lg"
              className="gap-2 gradient-primary glow animate-pulse-glow"
              onClick={() => navigate("/chat")}
            >
              Start Asking Questions
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Workflow Steps */}
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {[
                { step: 1, label: "Upload", active: true },
                { step: 2, label: "Index", active: files.some((f) => f.status === "processing" || f.status === "indexed") },
                { step: 3, label: "Ask", active: indexedFiles.length > 0 },
                { step: 4, label: "Analyze", active: false },
              ].map((item, idx, arr) => (
                <div key={item.step} className="flex items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
                        item.active
                          ? "gradient-primary text-primary-foreground glow"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {item.step}
                    </div>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        item.active ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                  {idx < arr.length - 1 && (
                    <div
                      className={cn(
                        "w-16 md:w-24 h-0.5 mx-2",
                        item.active && arr[idx + 1].active
                          ? "bg-primary"
                          : "bg-border"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
