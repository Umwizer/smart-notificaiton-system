export interface Bilingual {
  en: string;
  rw: string;
}

export type Role = "admin" | "district" | "sector" | "cell" | "resident";
export type Category = "health" | "security" | "weather" | "events" | "administrative";
export type Priority = "normal" | "urgent" | "emergency";
export type Channel = "sms" | "push" | "email" | "ussd";
export type NoticeStatus =
  | "draft" | "pending" | "revision" | "rejected" | "approved" | "published" | "expired";

export interface Target {
  district: string;
  sector?: string;
  cell?: string;
  village?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string; // prototype only: never store passwords like this in the real system
  role: Role;
  area: Target;
  status: "active" | "suspended";
  language: "en" | "rw";
}

export interface Notice {
  id: string;
  title: Bilingual;
  content: Bilingual;
  category: Category;
  priority: Priority;
  status: NoticeStatus;
  target: Target;
  channels: Channel[];
  scheduledFor?: string; // ISO date, empty = send immediately
  attachmentName?: string;
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
}

export interface ApprovalRecord {
  id: string;
  noticeId: string;
  reviewerId: string;
  decision: "approved" | "rejected" | "revision" | "escalated";
  comment: string;
  createdAt: string;
}

export interface Feedback {
  id: string;
  noticeId: string;
  userId: string | null; // null when anonymous
  type: "acknowledgment" | "question" | "concern" | "suggestion";
  rating?: number;
  comment: string;
  status: "received" | "reviewed" | "responded";
  response?: string;
  createdAt: string;
}

export interface DeliveryRecord {
  id: string;
  noticeId: string;
  userId: string;
  channel: Channel;
  status: "queued" | "sent" | "delivered" | "failed";
  readAt?: string;
  updatedAt: string;
}

export interface Message { id: string; fromId: string; toId: string; text: string; createdAt: string }
export interface RecipientGroup { id: string; name: string; target: Target; userIds: string[]; createdBy: string }
export interface AuditLog { id: string; userId: string; action: string; detail: string; createdAt: string }
export interface LoginAttempt { email: string; failed: number; lockedUntil?: string }
export interface Announcement { id: string; text: Bilingual; createdAt: string }

export interface Settings {
  sessionMinutes: number;
  retentionDays: number;
  approvalRules: { priority: Priority; approverRole: Role; escalate: boolean }[];
}

export interface DB {
  users: User[];
  notices: Notice[];
  approvals: ApprovalRecord[];
  feedback: Feedback[];
  deliveries: DeliveryRecord[];
  messages: Message[];
  groups: RecipientGroup[];
  audit: AuditLog[];
  loginAttempts: LoginAttempt[];
  announcements: Announcement[];
  settings: Settings;
}