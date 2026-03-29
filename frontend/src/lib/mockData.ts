export interface TimeEntry {
  id: string;
  created_at: string;
  hours: number;
  description: string;
}

export interface Freelancer {
  id: string;
  name: string;
  hourly_rate: number;
  avatar?: string;
}

export interface Worklog {
  id: string;
  freelancer_id: string;
  freelancer_name: string;
  hourly_rate: number;
  task_name: string;
  status: "pending" | "paid" | "excluded";
  time_entries: TimeEntry[];
  total_earnings: number;
  created_at: string;
}

const mockWorklogs: Worklog[] = [
  { id: "wl_001", freelancer_id: "fr_101", freelancer_name: "Alice Johnson", hourly_rate: 45, task_name: "Frontend Dashboard Integration", status: "pending", created_at: "2024-10-25T14:32:00.000Z", total_earnings: 315, time_entries: [{ id: "te_001", created_at: "2024-10-23T09:00:00.000Z", hours: 4, description: "Initial React layout" }, { id: "te_002", created_at: "2024-10-24T10:30:00.000Z", hours: 3, description: "API integration setup" }] },
  { id: "wl_002", freelancer_id: "fr_102", freelancer_name: "Bob Smith", hourly_rate: 60, task_name: "Backend Auth Fixes", status: "pending", created_at: "2024-10-26T08:15:00.000Z", total_earnings: 120, time_entries: [{ id: "te_003", created_at: "2024-10-25T13:00:00.000Z", hours: 2, description: "Resolved JWT token issue" }] },
  { id: "wl_003", freelancer_id: "fr_101", freelancer_name: "Alice Johnson", hourly_rate: 45, task_name: "Dashboard QA and Testing", status: "paid", created_at: "2024-10-18T16:00:00.000Z", total_earnings: 90, time_entries: [{ id: "te_004", created_at: "2024-10-17T14:00:00.000Z", hours: 2, description: "Playwright E2E tests" }] },
  { id: "wl_004", freelancer_id: "fr_103", freelancer_name: "Charlie Davis", hourly_rate: 35, task_name: "Documentation Updates", status: "pending", created_at: "2024-10-26T11:45:00.000Z", total_earnings: 175, time_entries: [{ id: "te_005", created_at: "2024-10-25T09:00:00.000Z", hours: 5, description: "Wrote user API docs" }] },
  { id: "wl_005", freelancer_id: "fr_104", freelancer_name: "Diana Prince", hourly_rate: 80, task_name: "Database Migration", status: "paid", created_at: "2024-09-12T10:00:00.000Z", total_earnings: 640, time_entries: [{ id: "te_006", created_at: "2024-09-11T09:00:00.000Z", hours: 8, description: "Postgres schema updates" }] },
  { id: "wl_006", freelancer_id: "fr_105", freelancer_name: "Evan Wright", hourly_rate: 55, task_name: "CI/CD Pipeline Setup", status: "pending", created_at: "2024-10-27T09:30:00.000Z", total_earnings: 440, time_entries: [{ id: "te_007", created_at: "2024-10-26T10:00:00.000Z", hours: 8, description: "GitHub Actions caching fix" }] },
  { id: "wl_007", freelancer_id: "fr_106", freelancer_name: "Fiona Gallagher", hourly_rate: 40, task_name: "CSS Refactoring", status: "pending", created_at: "2024-10-28T14:20:00.000Z", total_earnings: 160, time_entries: [{ id: "te_008", created_at: "2024-10-27T14:00:00.000Z", hours: 4, description: "Tailwind v4 migration" }] },
  { id: "wl_008", freelancer_id: "fr_107", freelancer_name: "George Miller", hourly_rate: 50, task_name: "Unit Tests for Utils", status: "paid", created_at: "2024-08-15T08:00:00.000Z", total_earnings: 250, time_entries: [{ id: "te_009", created_at: "2024-08-14T10:00:00.000Z", hours: 5, description: "Vitest config and tests" }] },
  { id: "wl_009", freelancer_id: "fr_108", freelancer_name: "Hannah Lee", hourly_rate: 65, task_name: "Redis Caching Layer", status: "excluded", created_at: "2024-10-21T11:00:00.000Z", total_earnings: 130, time_entries: [{ id: "te_010", created_at: "2024-10-20T10:00:00.000Z", hours: 2, description: "Redis basic setup" }] },
  { id: "wl_010", freelancer_id: "fr_101", freelancer_name: "Alice Johnson", hourly_rate: 45, task_name: "Component Library Storybook", status: "pending", created_at: "2024-10-29T10:30:00.000Z", total_earnings: 270, time_entries: [{ id: "te_011", created_at: "2024-10-28T09:00:00.000Z", hours: 6, description: "Storybook initial stories" }] },
  { id: "wl_011", freelancer_id: "fr_109", freelancer_name: "Ian Bell", hourly_rate: 70, task_name: "Security Audit", status: "pending", created_at: "2024-10-29T16:00:00.000Z", total_earnings: 700, time_entries: [{ id: "te_012", created_at: "2024-10-28T09:00:00.000Z", hours: 10, description: "Penetration testing" }] },
  { id: "wl_012", freelancer_id: "fr_110", freelancer_name: "Jane Doe", hourly_rate: 50, task_name: "Localization FR", status: "paid", created_at: "2024-09-01T12:00:00.000Z", total_earnings: 300, time_entries: [{ id: "te_013", created_at: "2024-08-31T10:00:00.000Z", hours: 6, description: "French translations" }] },
  { id: "wl_013", freelancer_id: "fr_111", freelancer_name: "Kevin Space", hourly_rate: 90, task_name: "Kubernetes Cluster Tuning", status: "pending", created_at: "2024-10-30T09:00:00.000Z", total_earnings: 1350, time_entries: [{ id: "te_014", created_at: "2024-10-29T09:00:00.000Z", hours: 15, description: "EKS cluster scaling" }] },
  { id: "wl_014", freelancer_id: "fr_102", freelancer_name: "Bob Smith", hourly_rate: 60, task_name: "OAuth2 Provider Setup", status: "pending", created_at: "2024-10-30T14:00:00.000Z", total_earnings: 480, time_entries: [{ id: "te_015", created_at: "2024-10-29T10:00:00.000Z", hours: 8, description: "Google and GitHub auth" }] },
  { id: "wl_015", freelancer_id: "fr_112", freelancer_name: "Laura Palmer", hourly_rate: 85, task_name: "Machine Learning Model API", status: "excluded", created_at: "2024-10-05T15:00:00.000Z", total_earnings: 1700, time_entries: [{ id: "te_016", created_at: "2024-10-04T09:00:00.000Z", hours: 20, description: "FastAPI inference endpoint" }] },
  { id: "wl_016", freelancer_id: "fr_113", freelancer_name: "Mike Ross", hourly_rate: 100, task_name: "Legal Compliance Review", status: "paid", created_at: "2024-07-20T10:00:00.000Z", total_earnings: 500, time_entries: [{ id: "te_017", created_at: "2024-07-19T10:00:00.000Z", hours: 5, description: "GDPR compliance checks" }] },
  { id: "wl_017", freelancer_id: "fr_114", freelancer_name: "Nina Simone", hourly_rate: 120, task_name: "High Availability Redux", status: "pending", created_at: "2024-10-31T08:00:00.000Z", total_earnings: 2400, time_entries: [{ id: "te_018", created_at: "2024-10-30T09:00:00.000Z", hours: 20, description: "Multi-region failover" }] },
  { id: "wl_018", freelancer_id: "fr_105", freelancer_name: "Evan Wright", hourly_rate: 55, task_name: "Vite Build Optimization", status: "pending", created_at: "2024-10-31T11:00:00.000Z", total_earnings: 220, time_entries: [{ id: "te_019", created_at: "2024-10-30T14:00:00.000Z", hours: 4, description: "Chunks separation" }] },
  { id: "wl_019", freelancer_id: "fr_106", freelancer_name: "Fiona Gallagher", hourly_rate: 40, task_name: "Dark Mode Fixes", status: "paid", created_at: "2024-10-15T15:30:00.000Z", total_earnings: 120, time_entries: [{ id: "te_020", created_at: "2024-10-14T10:00:00.000Z", hours: 3, description: "Fixed OKLCH text contrast" }] },
  { id: "wl_020", freelancer_id: "fr_115", freelancer_name: "Oscar Wilde", hourly_rate: 30, task_name: "Copywriting Landing Page", status: "pending", created_at: "2024-10-31T16:45:00.000Z", total_earnings: 150, time_entries: [{ id: "te_021", created_at: "2024-10-31T09:00:00.000Z", hours: 5, description: "Wrote hero section and descriptions" }] },
];

export const fetchWorklogs = async (): Promise<any> => {
  return new Promise((resolve) => setTimeout(() => resolve(mockWorklogs), 600));
};

export const fetchWorklogById = async (id: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const worklog = mockWorklogs.find((w) => w.id === id);
      if (worklog) resolve(worklog); else reject(new Error("Worklog not found"));
    }, 400);
  });
};

export const processPaymentBatch = async (worklogIds: string[]): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: `Successfully processed ${worklogIds.length} worklogs.`, paidIds: worklogIds });
    }, 1200);
  });
};
