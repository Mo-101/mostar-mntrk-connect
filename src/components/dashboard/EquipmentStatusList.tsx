
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type EquipmentStatus = "operational" | "maintenance" | "warning" | "critical" | "offline";

type EquipmentItem = {
  id: string;
  name: string;
  location: string;
  status: EquipmentStatus;
  lastUpdated: string;
};

const getStatusColor = (status: EquipmentStatus) => {
  switch (status) {
    case "operational":
      return "bg-industrial-success text-white";
    case "maintenance":
      return "bg-blue-500 text-white";
    case "warning":
      return "bg-industrial-accent text-white";
    case "critical":
      return "bg-industrial-alert text-white";
    case "offline":
      return "bg-gray-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const EquipmentStatusList = () => {
  const equipmentList: EquipmentItem[] = [
    {
      id: "P001",
      name: "Pump Unit 3",
      location: "Sector A",
      status: "operational",
      lastUpdated: "10 min ago",
    },
    {
      id: "C002",
      name: "Compressor C2",
      location: "Sector B",
      status: "critical",
      lastUpdated: "2 min ago",
    },
    {
      id: "H003",
      name: "Heat Exchanger 2",
      location: "Sector C",
      status: "warning",
      lastUpdated: "25 min ago",
    },
    {
      id: "P004",
      name: "Pump Unit 5",
      location: "Sector A",
      status: "operational",
      lastUpdated: "5 min ago",
    },
    {
      id: "V005",
      name: "Control Valve 7",
      location: "Sector D",
      status: "maintenance",
      lastUpdated: "1 hr ago",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Equipment Status</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-hidden rounded-md border">
          <table className="w-full caption-bottom text-sm">
            <thead className="border-b bg-muted/50">
              <tr className="[&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-medium [&_th]:text-muted-foreground">
                <th>ID</th>
                <th>Equipment</th>
                <th className="hidden md:table-cell">Location</th>
                <th>Status</th>
                <th className="hidden md:table-cell">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {equipmentList.map((equipment) => (
                <tr
                  key={equipment.id}
                  className="transition-colors hover:bg-muted/50 [&_td]:px-4 [&_td]:py-3"
                >
                  <td className="font-medium">{equipment.id}</td>
                  <td>{equipment.name}</td>
                  <td className="hidden md:table-cell">{equipment.location}</td>
                  <td>
                    <Badge className={cn(getStatusColor(equipment.status))}>
                      {equipment.status.charAt(0).toUpperCase() + equipment.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="hidden md:table-cell">{equipment.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentStatusList;
