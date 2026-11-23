import { readDB, writeDB, newId } from "./mockStore";
import type { Notice, User } from "./types";

export type NoticeInput = {
  title: { en: string; rw: string };
  content: { en: string; rw: string };
  category: "health" | "security" | "weather" | "events" | "administrative";
  priority: "normal" | "urgent" | "emergency";
  target: { district: string; sector?: string; cell?: string; village?: string };
  channels: ("sms" | "push" | "email" | "ussd")[];
  attachment?: { name: string; size: string };
};

// Get notices based on role and area
export function getNoticesForUser(user: User): Notice[] {
  const db = readDB();
  if (user.role === "admin" || user.role === "district") return db.notices;
  if (user.role === "sector") return db.notices.filter(n => n.target.sector === user.area.sector || !n.target.sector);
  if (user.role === "cell") return db.notices.filter(n => n.target.cell === user.area.cell);
  
  // For residents: Only show PUBLISHED notices matching their exact area
  return db.notices.filter(n => {
    if (n.status !== "published") return false;
    if (n.target.sector && n.target.sector !== user.area.sector) return false;
    if (n.target.cell && n.target.cell !== user.area.cell) return false;
    if (n.target.village && n.target.village !== user.area.village) return false;
    return true;
  });
}

// Check if a user has the right role to approve a specific notice
export function canUserApprove(user: User, notice: Notice): boolean {
  if (user.role === "admin") return true; // Admin can override

  // Emergency notices MUST be approved by District (unless the author is already District)
  if (notice.priority === "emergency") {
    return user.role === "district";
  }

  // Urgent and Normal notices need Sector approval
  if (notice.priority === "urgent" || notice.priority === "normal") {
    return user.role === "sector" || user.role === "district";
  }

  // Cell officials can only approve notices targeted specifically to their cell 
  if (user.role === "cell") {
    return notice.target.cell === user.area.cell;
  }

  return false;
}

// Create a new notice (Defaults to 'draft')
export function createNotice(user: User, input: NoticeInput): Notice {
  const db = readDB();
  const notice: Notice = {
    id: newId("n"),
    ...input,
    status: "draft",
    createdBy: user.id,
    createdAt: new Date().toISOString(),
  };
  db.notices.push(notice);
  
  // Audit log
  db.audit.push({ 
    id: newId("log"), userId: user.id, action: "notice_created", 
    detail: `Created notice: ${input.title.en}`, createdAt: new Date().toISOString() 
  });
  
  writeDB(db);
  return notice;
}

// Submit for approval
export function submitForApproval(noticeId: string, userId: string) {
  const db = readDB();
  const notice = db.notices.find(n => n.id === noticeId);
  if (notice) {
    notice.status = "pending";
    db.audit.push({ 
      id: newId("log"), userId, action: "notice_submitted", 
      detail: `Submitted notice for approval: ${notice.title.en}`, createdAt: new Date().toISOString() 
    });
    writeDB(db);
  }
}

// Approve or Reject
export function updateNoticeStatus(noticeId: string, status: Notice["status"], userId: string) {
  const db = readDB();
  const notice = db.notices.find(n => n.id === noticeId);
  if (notice) {
    notice.status = status;
    db.audit.push({ 
      id: newId("log"), userId, action: `notice_${status}`, 
      detail: `Notice marked as ${status}: ${notice.title.en}`, createdAt: new Date().toISOString() 
    });
    writeDB(db);
  }
}

// Mark a notice as read by a user
export function markAsRead(noticeId: string, userId: string) {
  const db = readDB();
  const notice = db.notices.find(n => n.id === noticeId);
  if (!notice) return;

  if (!notice.readBy) notice.readBy = [];
  
  if (!notice.readBy.includes(userId)) {
    notice.readBy.push(userId);
    writeDB(db);
  }
}

// Add feedback to a notice
export function addFeedback(noticeId: string, userId: string, comment: string) {
  const db = readDB();
  const notice = db.notices.find(n => n.id === noticeId);
  if (!notice) return;

  db.feedback.push({
    id: newId("f"),
    noticeId,
    userId,
    type: "question",
    comment,
    status: "received",
    createdAt: new Date().toISOString(),
  });

  writeDB(db);
}

// Get all feedback for officials
export function getFeedbackForOfficial() {
  const db = readDB();
  return db.feedback.map(f => {
    const user = db.users.find(u => u.id === f.userId);
    const notice = db.notices.find(n => n.id === f.noticeId);
    return {
      ...f,
      userName: user?.name || "Unknown User",
      noticeTitle: notice?.title.en || "Unknown Notice",
    };
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Simulate Delivery Channels
export function simulateDelivery(noticeId: string) {
  const db = readDB();
  const notice = db.notices.find(n => n.id === noticeId);
  if (!notice) return;

  const targetUsers = db.users.filter(u => {
    if (u.role !== "resident") return false;
    if (notice.target.sector && u.area.sector !== notice.target.sector) return false;
    if (notice.target.cell && u.area.cell !== notice.target.cell) return false;
    if (notice.target.village && u.area.village !== notice.target.village) return false;
    return true;
  });

  targetUsers.forEach(u => {
    notice.channels.forEach(channel => {
      db.deliveries.push({
        id: newId("d"),
        noticeId,
        userId: u.id,
        channel,
        status: "delivered",
        updatedAt: new Date().toISOString(),
      });
    });
  });

  writeDB(db);
}

// Reply to feedback
export function replyToFeedback(feedbackId: string, replyText: string) {
  const db = readDB();
  const fb = db.feedback.find(f => f.id === feedbackId);
  if (fb) {
    fb.response = replyText;
    fb.status = "responded";
    writeDB(db);
  }
}

// Get deliveries for a specific notice
export function getDeliveryStatus(noticeId: string) {
  const db = readDB();
  return db.deliveries.filter(d => d.noticeId === noticeId);
}