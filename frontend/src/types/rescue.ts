export type RescueStatus = "Pending" | "In Progress" | "Rescued" | "Failed";

export interface RescueReport {
  reportId: number;
  userId: number | null;
  reporterName: string | null;
  reporterPhone: string;
  locationText: string;
  description: string | null;
  imageUrl: string | null;
  status: RescueStatus;
  assignedTo: number | null;
  assignedUserName: string | null;
  trackingCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface RescueReportCreateInput {
  reporterName?: string;
  reporterPhone: string;
  locationText: string;
  description?: string;
}

export const RESCUE_STATUS_LABEL: Record<RescueStatus, string> = {
  Pending: "Chờ tiếp nhận",
  "In Progress": "Đang cứu hộ",
  Rescued: "Đã cứu hộ",
  Failed: "Không thành công",
};

export const RESCUE_STATUS_COLOR: Record<RescueStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  "In Progress": "bg-blue-100 text-blue-800 border-blue-300",
  Rescued: "bg-green-100 text-green-800 border-green-300",
  Failed: "bg-red-100 text-red-800 border-red-300",
};
