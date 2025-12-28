import { FileText, MessageSquare, Brain, TrendingUp, Upload, Zap } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { DocumentList } from "@/components/dashboard/DocumentList";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { ProcessingChart } from "@/components/dashboard/ProcessingChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Good afternoon, <span className="gradient-text">John</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your documents today.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => navigate("/chat")}
            >
              <MessageSquare className="w-4 h-4" />
              Start Chat
            </Button>
            <Button
              className="gap-2 gradient-primary glow"
              onClick={() => navigate("/upload")}
            >
              <Upload className="w-4 h-4" />
              Upload PDF
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Documents"
            value={21}
            subtitle="5 uploaded this week"
            icon={FileText}
            trend={{ value: 12, isPositive: true }}
            color="primary"
          />
          <StatCard
            title="Questions Asked"
            value={147}
            subtitle="23 today"
            icon={MessageSquare}
            trend={{ value: 8, isPositive: true }}
            color="info"
          />
          <StatCard
            title="Insights Generated"
            value={89}
            subtitle="Entities & key points"
            icon={Brain}
            trend={{ value: 15, isPositive: true }}
            color="accent"
          />
          <StatCard
            title="Accuracy Rate"
            value="94.2%"
            subtitle="Based on feedback"
            icon={TrendingUp}
            trend={{ value: 2.1, isPositive: true }}
            color="success"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Documents List - Takes 2 columns */}
          <div className="lg:col-span-2">
            <DocumentList />
          </div>

          {/* Right sidebar - Stats & Activity */}
          <div className="space-y-6">
            <ProcessingChart />
            <ActivityFeed />
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="glass border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl gradient-primary glow">
                  <Zap className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Quick Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload a document and get instant AI-powered insights
                  </p>
                </div>
              </div>
              <Button
                size="lg"
                className="gradient-primary glow"
                onClick={() => navigate("/upload")}
              >
                Try Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
