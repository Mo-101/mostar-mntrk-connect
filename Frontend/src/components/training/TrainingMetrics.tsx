import { Line } from "react-chartjs-2";
import { Card } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { cn } from "@/lib/utils";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MetricsData {
  label: string;
  value: string;
  color: string;
  trend?: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
    }[];
  };
}

interface TrainingMetricsProps {
  title: string;
  metrics: MetricsData[];
  className?: string;
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        color: "rgba(255, 255, 255, 0.1)",
      },
      ticks: {
        color: "rgba(255, 255, 255, 0.7)",
      }
    },
    y: {
      grid: {
        color: "rgba(255, 255, 255, 0.1)",
      },
      ticks: {
        color: "rgba(255, 255, 255, 0.7)",
      }
    },
  },
};

export const TrainingMetrics = ({ title, metrics, className }: TrainingMetricsProps) => {
  return (
    <Card className={cn(
      "p-1 bg-widgetcontentbg backdrop-blur supports-[backdrop-filter]:bg-black/20",
      className
    )}>
      <h3 className="text-xl font-semibold text-themewhite mb-4">{title}</h3>
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="p-4 rounded-lg border border-elementcontentborder">
            <h4 className={`font-medium mb-2 text-${metric.color}`}>{metric.label}</h4>
            <p className="text-2xl font-bold text-themewhite">{metric.value}</p>
            {metric.trend && (
              <div className="h-[100px] mt-2">
                <Line data={metric.trend} options={chartOptions} />
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};