import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { FileText, MessageSquare, Brain, Clock, TrendingUp, Zap } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const usageData = [
  { name: "Mon", queries: 24, documents: 4 },
  { name: "Tue", queries: 35, documents: 6 },
  { name: "Wed", queries: 42, documents: 3 },
  { name: "Thu", queries: 28, documents: 8 },
  { name: "Fri", queries: 55, documents: 5 },
  { name: "Sat", queries: 18, documents: 2 },
  { name: "Sun", queries: 12, documents: 1 },
];

const topicsData = [
  { name: "Finance", value: 35, color: "hsl(199 89% 48%)" },
  { name: "Research", value: 25, color: "hsl(172 66% 50%)" },
  { name: "Legal", value: 20, color: "hsl(38 92% 50%)" },
  { name: "Technical", value: 15, color: "hsl(142 76% 36%)" },
  { name: "Other", value: 5, color: "hsl(215 20% 65%)" },
];

const responseTimeData = [
  { name: "0-1s", count: 45 },
  { name: "1-2s", count: 32 },
  { name: "2-3s", count: 18 },
  { name: "3-4s", count: 8 },
  { name: "4s+", count: 3 },
];

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track your document analysis and usage metrics
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Queries"
            value="1,247"
            subtitle="This month"
            icon={MessageSquare}
            trend={{ value: 23, isPositive: true }}
            color="primary"
          />
          <StatCard
            title="Documents Processed"
            value="89"
            subtitle="21 this week"
            icon={FileText}
            trend={{ value: 12, isPositive: true }}
            color="info"
          />
          <StatCard
            title="Avg. Response Time"
            value="1.8s"
            subtitle="Across all queries"
            icon={Clock}
            trend={{ value: 5, isPositive: true }}
            color="success"
          />
          <StatCard
            title="Insights Generated"
            value="432"
            subtitle="Entities & key points"
            icon={Brain}
            trend={{ value: 18, isPositive: true }}
            color="accent"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Usage Over Time */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Usage Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={usageData}>
                    <defs>
                      <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorDocs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(172 66% 50%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(172 66% 50%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="queries"
                      stroke="hsl(199 89% 48%)"
                      fillOpacity={1}
                      fill="url(#colorQueries)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="documents"
                      stroke="hsl(172 66% 50%)"
                      fillOpacity={1}
                      fill="url(#colorDocs)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Topic Distribution */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                Topic Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topicsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {topicsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {topicsData.map((topic) => (
                  <div key={topic.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: topic.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {topic.name} ({topic.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Response Time Distribution */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-success" />
              Response Time Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(142 76% 36%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
