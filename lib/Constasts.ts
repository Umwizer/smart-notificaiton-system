import type { Category, Priority, Role } from "./types";

export const DISTRICT = "Bugesera";

export { AREAS } from "./bugesera";

export const ROLE_LABELS: Record<Role, string> = {
  admin: "System Admin",
  district: "District Official",
  sector: "Sector Official",
  cell: "Cell Official",
  resident: "Community Member",
};

// Officials who must pass the email-code security step
export const MFA_ROLES: Role[] = ["district", "sector"];

export const CATEGORIES: Record<Category, string> = {
  health: "Health",
  security: "Security",
  weather: "Weather",
  events: "Community events",
  administrative: "Administrative",
};

export const PRIORITIES: Record<Priority, string> = {
  normal: "Normal",
  urgent: "Urgent",
  emergency: "Emergency",
};

export const DASHBOARD_PATH: Record<Role, string> = {
  admin: "/dashboard/admin",
  district: "/dashboard/district",
  sector: "/dashboard/sector",
  cell: "/dashboard/cell",
  resident: "/dashboard/resident",
};