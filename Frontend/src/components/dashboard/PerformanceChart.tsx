
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const dailyData = [
  { time: "12 AM", value: 30 },
  { time: "3 AM", value: 25 },
  { time: "6 AM", value: 20 },
  { time: "9 AM", value: 42 },
  { time: "12 PM", value: 65 },
  { time: "3 PM", value: 55 },
  { time: "6 PM", value: 70 },
  { time: "9 PM", value: 45 },
  { time: "11 PM", value: 35 },
];

const weeklyData = [
  { time: "Mon", value: 45 },
  { time: "Tue", value: 52 },
  { time: "Wed", value: 49 },
  { time: "Thu", value: 63 },
  { time: "Fri", value: 58 },
  { time: "Sat", value: 48 },
  { time: "Sun", value: 50 },
];

const monthlyData = [
  { time: "Jan", value: 45 },
  { time: "Feb", value: 50 },
  { time: "Mar", value: 55 },
  { time: "Apr", value: 48 },
  { time: "May", value: 52 },
  { time: "Jun", value: 58 },
  { time: "Jul", value: 60 },
  { time: "Aug", value: 65 },
  { time: "Sep", value: 62 },
  { time: "Oct", value: 59 },
  { time: "Nov", value: 55 },
  { time: "Dec", value: 50 },
];

const PerformanceChart = () => {
  const [period, setPeriod] = useState("day");

  const getData = () => {
    switch (period) {
      case "day":
        return dailyData;
      case "week":
        return weeklyData;
      case "month":
        return monthlyData;
      default:
        return dailyData;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">System Performance</CardTitle>
        <Tabs defaultValue="day" value={period} onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={getData()}
              margin={{
                top: 5,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis
                dataKey="time"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)"
                }}
                itemStyle={{ color: "hsl(var(--card-foreground))" }}
                labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: "0.25rem" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
