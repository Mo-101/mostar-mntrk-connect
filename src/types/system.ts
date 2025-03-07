
export interface SystemIndicator {
  id: string;
  label: string;
  status: "active" | "inactive" | "warning" | "error";
}
