import type { DB, User } from "./types";
import { AREAS } from "./bugesera";

const KEY = "scn-demo-v2";
export const DEMO_PASSWORD = "Bugesera@2026";

const DISTRICT = "Bugesera";
const cellOf = (sector: string, i: number) => Object.keys(AREAS[sector])[i];
const villageOf = (sector: string, cell: string, i: number) => AREAS[sector][cell][i];

function user(
  id: string, name: string, email: string, phone: string, role: User["role"],
  sector?: string, cellIdx?: number, villageIdx?: number
): User {
  const cell = sector !== undefined && cellIdx !== undefined ? cellOf(sector, cellIdx) : undefined;
  const village =
    sector !== undefined && cell !== undefined && villageIdx !== undefined
      ? villageOf(sector, cell, villageIdx)
      : undefined;
  return {
    id, name, email, phone, password: DEMO_PASSWORD, role,
    area: { district: DISTRICT, sector, cell, village },
    status: "active", language: "en",
  };
}

function seed(): DB {
  const nyaCell = cellOf("Nyamata", 0);
  return {
    users: [
      user("u-admin", "Mugisha Eric", "admin@scns.rw", "0788000001", "admin"),
      user("u-district", "Uwimana Jeanne", "district@scns.rw", "0788000002", "district"),
      user("u-sector1", "Habimana Patrick", "sector.nyamata@scns.rw", "0788000003", "sector", "Nyamata"),
      user("u-sector2", "Mukamana Alice", "sector.rilima@scns.rw", "0788000004", "sector", "Rilima"),
      user("u-cell1", "Niyonzima Joseph", "cell.nyamata@scns.rw", "0788000005", "cell", "Nyamata", 0),
      user("u-cell2", "Uwera Grace", "cell.rilima@scns.rw", "0788000006", "cell", "Rilima", 0),
      user("u-res1", "Ishimwe Sandrine", "ishimwe.sandrine@scns.rw", "0788000011", "resident", "Nyamata", 0, 0),
      user("u-res2", "Nsengimana David", "nsengimana.david@scns.rw", "0788000012", "resident", "Nyamata", 0, 1),
      user("u-res3", "Mukeshimana Esther", "mukeshimana.esther@scns.rw", "0788000013", "resident", "Nyamata", 1, 0),
      user("u-res4", "Habyarimana Jean", "habyarimana.jean@scns.rw", "0788000014", "resident", "Rilima", 0, 0),
      user("u-res5", "Ingabire Diane", "ingabire.diane@scns.rw", "0788000015", "resident", "Gashora", 0, 0),
    ],
    notices: [
      {
        id: "n1", title: "Child vaccination day",
        content: "All parents and guardians are invited to bring children under five to the health centre for vaccination. Please carry the child's health card.",
        category: "health", priority: "urgent", status: "published",
        target: { district: DISTRICT, sector: "Nyamata" }, channels: ["sms", "push"],
        createdBy: "u-sector1", createdAt: "2026-11-10T08:00:00Z", expiresAt: "2026-12-31T00:00:00Z",
      },
      {
        id: "n2", title: "Market day moved to Thursday",
        content: "Because of road works, this week's market will be held on Thursday instead of Wednesday.",
        category: "administrative", priority: "normal", status: "pending",
        target: { district: DISTRICT, sector: "Nyamata", cell: nyaCell }, channels: ["sms"],
        createdBy: "u-cell1", createdAt: "2026-11-15T09:30:00Z",
      },
      {
        id: "n3", title: "Heavy rain warning",
        content: "Heavy rain is expected in the coming days. Avoid low-lying areas and rivers, and move livestock to higher ground.",
        category: "weather", priority: "emergency", status: "draft",
        target: { district: DISTRICT }, channels: ["sms", "push", "ussd"],
        createdBy: "u-district", createdAt: "2026-11-17T07:00:00Z",
      },
    ],
    approvals: [],
    feedback: [],
    deliveries: [],
    messages: [],
    groups: [],
    audit: [],
    loginAttempts: [],
    announcements: [
      {
        id: "a1",
        text: "Welcome to the Smart Community Notification System for Bugesera District. Notices for your area appear here.",
        createdAt: "2026-11-18T06:00:00Z",
      },
    ],
    settings: {
      sessionMinutes: 15,
      retentionDays: 365,
      approvalRules: [
        { priority: "normal", approverRole: "sector", escalate: false },
        { priority: "urgent", approverRole: "sector", escalate: true },
        { priority: "emergency", approverRole: "district", escalate: true },
      ],
    },
  };
}

export function readDB(): DB {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as DB;
  } catch {
    /* fall through and reseed */
  }
  const fresh = seed();
  window.localStorage.setItem(KEY, JSON.stringify(fresh));
  return fresh;
}

export function writeDB(db: DB): void {
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, JSON.stringify(db));
}

export function resetDB(): DB {
  const fresh = seed();
  writeDB(fresh);
  return fresh;
}

export function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}