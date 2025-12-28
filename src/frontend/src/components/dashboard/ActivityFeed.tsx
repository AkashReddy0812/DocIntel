import { CheckCircle2, FileUp, MessageSquare, Brain, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "upload" | "index" | "query" | "insight" | "error";
  title: string;
  description: string;
  timestamp: string;
}

const activities: Activity[] = [
  { id: "1", type: "index", title: "Document Indexed", description: "Financial Report Q4 2024.pdf is ready", timestamp: "2 min ago" },
  { id: "2", type: "query", title: "Question Answered", description: "What are the key revenue drivers?", timestamp: "15 min ago" },
  { id: "3", type: "insight", title: "Insights Generated", description: "12 entities extracted from contract", timestamp: "1 hour ago" },
  { id: "4", type: "upload", title: "Document Uploaded", description: "Research Paper - AI.pdf uploaded", timestamp: "2 hours ago" },
  { id: "5", type: "error", title: "Processing Failed", description: "corrupted_file.pdf could not be processed", timestamp: "3 hours ago" },
];

const activityConfig = {
  upload: { icon: FileUp, color: "bg-info/10 text-info" },
  index: { icon: CheckCircle2, color: "bg-success/10 text-success" },
  query: { icon: MessageSquare, color: "bg-primary/10 text-primary" },
  insight: { icon: Brain, color: "bg-accent/10 text-accent" },
  error: { icon: AlertTriangle, color: "bg-destructive/10 text-destructive" },
};

export function ActivityFeed() {
  return (
    <Card className="glass">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />
          
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const config = activityConfig[activity.type];
              const Icon = config.icon;
              
              return (
                <div
                  key={activity.id}
                  className="relative flex gap-4 animate-slide-up"
                  style={{ animationDelay: `${index * 75}ms` }}
                >
                  <div className={cn("relative z-10 p-2 rounded-full", config.color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
