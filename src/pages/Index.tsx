
import { Cpu, BarChart3, AlertCircle, Truck } from "lucide-react";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import StatCard from "@/components/dashboard/StatCard";
import ActivityLog from "@/components/dashboard/ActivityLog";
import EquipmentStatusList from "@/components/dashboard/EquipmentStatusList";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-muted-foreground">
                Monitor and manage industrial equipment and systems
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Active Equipment"
                value="42/50"
                description="Total operational units"
                icon={<Cpu className="h-4 w-4" />}
                trend="up"
                trendValue="2 from yesterday"
                status="active"
              />
              <StatCard
                title="Average Performance"
                value="87%"
                description="Across all systems"
                icon={<BarChart3 className="h-4 w-4" />}
                trend="up"
                trendValue="3% from last week"
              />
              <StatCard
                title="Active Alerts"
                value="3"
                description="2 critical, 1 warning"
                icon={<AlertCircle className="h-4 w-4" />}
                trend="down"
                trendValue="1 from yesterday"
                status="alert"
              />
              <StatCard
                title="Fleet Status"
                value="12/15"
                description="Vehicles in operation"
                icon={<Truck className="h-4 w-4" />}
                trend="neutral"
                trendValue="Same as yesterday"
                status="active"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-7">
              <div className="md:col-span-4">
                <PerformanceChart />
              </div>
              <div className="md:col-span-3">
                <ActivityLog />
              </div>
            </div>

            <div>
              <EquipmentStatusList />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
