export const STORAGE_KEY = "dwt.v1";

export const DEMO_USER = {
  email: "maya@orbit.dev",
  password: "orbit123",
  name: "Maya Chen",
  role: "Product Engineer",
  team: "Platform",
};

const today = new Date();

function iso(offsetDays, hour = 10, minute = 0) {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function dayKey(offsetDays) {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export function seedState() {
  return {
    session: null,
    theme: "light",
    tasks: [
      {
        id: "t1",
        title: "Ship sprint planning board",
        description: "Finalize the board columns and acceptance criteria for the tracker epic.",
        priority: "high",
        status: "in_progress",
        due: dayKey(0),
        tags: ["planning", "sprint"],
        createdAt: iso(-4, 9),
        updatedAt: iso(0, 8, 40),
        completedAt: null,
      },
      {
        id: "t2",
        title: "Review API error budget",
        description: "Check last week's 5xx rate and propose a threshold for the gateway.",
        priority: "critical",
        status: "todo",
        due: dayKey(-1),
        tags: ["reliability"],
        createdAt: iso(-6, 11),
        updatedAt: iso(-1, 16),
        completedAt: null,
      },
      {
        id: "t3",
        title: "Write onboarding checklist",
        description: "Document local setup, sample accounts, and first-week goals.",
        priority: "medium",
        status: "done",
        due: dayKey(-2),
        tags: ["docs"],
        createdAt: iso(-8, 10),
        updatedAt: iso(-2, 15, 20),
        completedAt: iso(-2, 15, 20),
      },
      {
        id: "t4",
        title: "Pair on filter performance",
        description: "Profile task search on a 2k-row fixture and drop the hot path.",
        priority: "high",
        status: "todo",
        due: dayKey(1),
        tags: ["perf"],
        createdAt: iso(-1, 14),
        updatedAt: iso(-1, 14),
        completedAt: null,
      },
      {
        id: "t5",
        title: "Design empty states",
        description: "Empty lists, first login, and no-results should feel intentional.",
        priority: "low",
        status: "done",
        due: dayKey(-5),
        tags: ["design"],
        createdAt: iso(-10, 9),
        updatedAt: iso(-5, 17),
        completedAt: iso(-5, 17),
      },
      {
        id: "t6",
        title: "Close billing regression",
        description: "Invoice totals drift when a credit memo is applied mid-cycle.",
        priority: "critical",
        status: "in_progress",
        due: dayKey(0),
        tags: ["billing", "bug"],
        createdAt: iso(-3, 8),
        updatedAt: iso(0, 9, 15),
        completedAt: null,
      },
      {
        id: "t7",
        title: "Update release notes",
        description: "Draft notes for the weekly digest and flag breaking changes.",
        priority: "medium",
        status: "todo",
        due: dayKey(3),
        tags: ["comms"],
        createdAt: iso(-1, 11),
        updatedAt: iso(-1, 11),
        completedAt: null,
      },
      {
        id: "t8",
        title: "Archive stale tickets",
        description: "Close or reassign tickets idle for more than 30 days.",
        priority: "low",
        status: "done",
        due: dayKey(-7),
        tags: ["hygiene"],
        createdAt: iso(-12, 10),
        updatedAt: iso(-7, 12),
        completedAt: iso(-7, 12),
      },
      {
        id: "t9",
        title: "Instrument productivity events",
        description: "Emit completion and status-change events for the analytics view.",
        priority: "high",
        status: "todo",
        due: dayKey(-3),
        tags: ["analytics"],
        createdAt: iso(-9, 13),
        updatedAt: iso(-3, 18),
        completedAt: null,
      },
      {
        id: "t10",
        title: "Sync design tokens",
        description: "Align light and dark palettes with the brand token sheet.",
        priority: "medium",
        status: "done",
        due: dayKey(-1),
        tags: ["design"],
        createdAt: iso(-4, 15),
        updatedAt: iso(0, 7, 50),
        completedAt: iso(0, 7, 50),
      },
    ],
    logs: [
      { id: "l1", date: dayKey(0), mood: "focused", hours: 6.5, note: "Deep work on billing regression and planning board." },
      { id: "l2", date: dayKey(-1), mood: "steady", hours: 7.5, note: "Token sync and API budget review prep." },
      { id: "l3", date: dayKey(-2), mood: "energized", hours: 8, note: "Finished onboarding checklist and paired on filters." },
      { id: "l4", date: dayKey(-3), mood: "blocked", hours: 5, note: "Waiting on billing fixture data. Docs instead." },
      { id: "l5", date: dayKey(-4), mood: "steady", hours: 7, note: "Sprint grooming and ticket triage." },
      { id: "l6", date: dayKey(-6), mood: "focused", hours: 8, note: "Closed empty-state designs." },
    ],
    activity: [
      { id: "a1", at: iso(0, 9, 15), text: "Moved “Close billing regression” to In progress", kind: "status" },
      { id: "a2", at: iso(0, 8, 40), text: "Updated “Ship sprint planning board”", kind: "edit" },
      { id: "a3", at: iso(0, 7, 50), text: "Completed “Sync design tokens”", kind: "done" },
      { id: "a4", at: iso(-1, 16), text: "Logged 7.5 focused hours", kind: "log" },
      { id: "a5", at: iso(-2, 15, 20), text: "Completed “Write onboarding checklist”", kind: "done" },
      { id: "a6", at: iso(-5, 17), text: "Completed “Design empty states”", kind: "done" },
      { id: "a7", at: iso(-7, 12), text: "Completed “Archive stale tickets”", kind: "done" },
    ],
  };
}
