import type { Category, Channel, NoticeStatus, Priority, Role } from "./types";

export { AREAS } from "./bugesera";

export const DISTRICT = "Bugesera";

// Display names for these values are in lib/translations.ts (labels), in both languages.
export const ROLES: Role[] = ["admin", "district", "sector", "cell", "resident"];
export const CATEGORIES: Category[] = ["health", "security", "weather", "events", "administrative"];
export const PRIORITIES: Priority[] = ["normal", "urgent", "emergency"];
export const CHANNELS: Channel[] = ["sms", "push", "email", "ussd"];
export const STATUSES: NoticeStatus[] = [
  "draft", "pending", "revision", "rejected", "approved", "published", "expired",
];

// Officials who must pass the email-code security step
export const MFA_ROLES: Role[] = ["district", "sector"];

export const DASHBOARD_PATH: Record<Role, string> = {
  admin: "/dashboard/admin",
  district: "/dashboard/district",
  sector: "/dashboard/sector",
  cell: "/dashboard/cell",
  resident: "/dashboard/resident",
};