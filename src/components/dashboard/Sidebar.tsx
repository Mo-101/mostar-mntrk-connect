
import { Home, BarChart3, Cpu, Settings, Gauge, Truck, Users, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

type SidebarProps = {
  className?: string;
};

const SidebarLink = ({ 
  icon: Icon, 
  label, 
  active = false,
  alert = false
}: { 
  icon: React.ElementType; 
  label: string; 
  active?: boolean;
  alert?: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-colors",
        active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
    >
      <div className="relative">
        <Icon className="h-5 w-5" />
        {alert && <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-industrial-alert" />}
      </div>
      <span>{label}</span>
    </div>
  );
};

const Sidebar = ({ className }: SidebarProps) => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return null;
  }

  return (
    <div className={cn("flex h-full w-64 flex-col bg-sidebar", className)}>
      <div className="flex-1 overflow-auto py-8 px-4">
        <div className="mb-10 px-3">
          <h2 className="mb-1 text-lg font-semibold tracking-tight text-sidebar-foreground">
            Monitoring
          </h2>
          <p className="text-xs text-sidebar-foreground/70">
            Track equipment and systems
          </p>
        </div>
        <nav className="space-y-1">
          <SidebarLink icon={Home} label="Dashboard" active />
          <SidebarLink icon={Gauge} label="Equipment Status" />
          <SidebarLink icon={BarChart3} label="Performance" />
          <SidebarLink icon={Cpu} label="Systems" alert />
          <SidebarLink icon={Truck} label="Fleet Tracking" />
          <SidebarLink icon={AlertCircle} label="Alerts" />
        </nav>
        <div className="mt-10 px-3">
          <h2 className="mb-1 text-lg font-semibold tracking-tight text-sidebar-foreground">
            Admin
          </h2>
        </div>
        <nav className="space-y-1">
          <SidebarLink icon={Users} label="Users" />
          <SidebarLink icon={Settings} label="Settings" />
        </nav>
      </div>
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white font-medium">
            MI
          </div>
          <div>
            <p className="text-sm font-medium text-sidebar-foreground">Mostar Industries</p>
            <p className="text-xs text-sidebar-foreground/70">Admin Portal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
