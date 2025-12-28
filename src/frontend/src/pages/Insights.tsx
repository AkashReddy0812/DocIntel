import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Lightbulb, TrendingUp, AlertTriangle, CheckCircle2, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Insight {
  id: string;
  type: "entity" | "trend" | "risk" | "opportunity";
  title: string;
  description: string;
  source: string;
  confidence: number;
  timestamp: string;
}

const insights: Insight[] = [
  {
    id: "1",
    type: "trend",
    title: "Revenue Growth Pattern",
    description: "Q4 2024 shows consistent 15% YoY growth, primarily driven by digital services. This trend has been accelerating since Q2.",
    source: "Financial Report Q4 2024.pdf",
    confidence: 0.94,
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    type: "entity",
    title: "Key Stakeholder Identified",
    description: "Multiple references to 'Acme Technologies' as a strategic partner across 3 documents. Consider consolidating partnership details.",
    source: "Contract Agreement.pdf",
    confidence: 0.89,
    timestamp: "4 hours ago",
  },
  {
    id: "3",
    type: "risk",
    title: "Compliance Gap Detected",
    description: "Section 4.2 of the contract references GDPR requirements but lacks specific data processing terms required by regulation.",
    source: "Contract Agreement.pdf",
    confidence: 0.85,
    timestamp: "1 day ago",
  },
  {
    id: "4",
    type: "opportunity",
    title: "Market Expansion Potential",
    description: "Research indicates untapped potential in Southeast Asian markets with 32% lower competition in the AI services sector.",
    source: "Research Paper - AI.pdf",
    confidence: 0.78,
    timestamp: "1 day ago",
  },
  {
    id: "5",
    type: "entity",
    title: "Cost Center Analysis",
    description: "Cloud infrastructure costs represent 23% of operational expenses. Optimization could yield $450K annual savings.",
    source: "Financial Report Q4 2024.pdf",
    confidence: 0.91,
    timestamp: "2 days ago",
  },
];

const insightConfig = {
  entity: { icon: Brain, color: "bg-primary/10 text-primary", badge: "Entity" },
  trend: { icon: TrendingUp, color: "bg-success/10 text-success", badge: "Trend" },
  risk: { icon: AlertTriangle, color: "bg-destructive/10 text-destructive", badge: "Risk" },
  opportunity: { icon: Lightbulb, color: "bg-warning/10 text-warning", badge: "Opportunity" },
};

export default function Insights() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
            <p className="text-muted-foreground mt-1">
              AI-extracted insights, entities, and key findings from your documents
            </p>
          </div>
          <Button
            className="gradient-primary glow"
            onClick={() => navigate("/upload")}
          >
            Analyze New Document
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Entities", value: 156, color: "text-primary" },
            { label: "Trends", value: 23, color: "text-success" },
            { label: "Risks", value: 8, color: "text-destructive" },
            { label: "Opportunities", value: 12, color: "text-warning" },
          ].map((stat) => (
            <Card key={stat.label} className="glass">
              <CardContent className="p-4 text-center">
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Insights List */}
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const config = insightConfig[insight.type];
            const Icon = config.icon;

            return (
              <Card
                key={insight.id}
                className="glass hover:shadow-lg transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${config.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{insight.title}</h3>
                        <Badge variant="outline" className={config.color}>
                          {config.badge}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        {insight.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <FileText className="w-4 h-4" />
                          <span>{insight.source}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-success" />
                          <span className="text-muted-foreground">
                            {(insight.confidence * 100).toFixed(0)}% confidence
                          </span>
                        </div>
                        <span className="text-muted-foreground">
                          {insight.timestamp}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate("/chat")}>
                      Ask More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
