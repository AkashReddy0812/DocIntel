import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Ready", value: 12, color: "hsl(142 76% 36%)" },
  { name: "Indexing", value: 3, color: "hsl(199 89% 48%)" },
  { name: "Uploaded", value: 5, color: "hsl(38 92% 50%)" },
  { name: "Error", value: 1, color: "hsl(0 84% 60%)" },
];

export function ProcessingChart() {
  return (
    <Card className="glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Document Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
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
              <Legend
                formatter={(value) => (
                  <span className="text-sm text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center">
          <p className="text-3xl font-bold">21</p>
          <p className="text-sm text-muted-foreground">Total Documents</p>
        </div>
      </CardContent>
    </Card>
  );
}
