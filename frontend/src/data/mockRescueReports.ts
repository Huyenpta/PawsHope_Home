import type { RescueReport } from "@/types/rescue";

export const mockRescueReports: RescueReport[] = [
  {
    reportId: 1,
    userId: null,
    reporterName: "Nguyễn Văn An",
    reporterPhone: "0901234567",
    locationText: "Đầu hẻm 234 Lê Văn Sỹ, Q.3, TP.HCM",
    description: "Bé mèo con bị thương ở chân, lông xám trắng, đang trú dưới ô tô.",
    imageUrl:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=500",
    status: "Rescued",
    assignedTo: 2,
    assignedUserName: "TNV Trần Bình",
    trackingCode: "RP-MOCK-001",
    createdAt: "2026-05-01T08:30:00Z",
    updatedAt: "2026-05-02T14:15:00Z",
  },
  {
    reportId: 2,
    userId: null,
    reporterName: "Phạm Thị Lan",
    reporterPhone: "0987654321",
    locationText: "Công viên Tao Đàn, Q.1, TP.HCM",
    description: "Một bé chó vàng nhỏ đi lang thang, có vẻ đói khát, không có vòng cổ.",
    imageUrl:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=500",
    status: "In Progress",
    assignedTo: 3,
    assignedUserName: "TNV Lê Hương",
    trackingCode: "RP-MOCK-002",
    createdAt: "2026-05-08T17:20:00Z",
    updatedAt: "2026-05-09T09:00:00Z",
  },
  {
    reportId: 3,
    userId: null,
    reporterName: null,
    reporterPhone: "0911222333",
    locationText: "Gầm cầu Sài Gòn, P. Thảo Điền, Q.2",
    description: "Đàn 4 bé mèo con sơ sinh bị bỏ rơi trong thùng giấy.",
    imageUrl:
      "https://images.unsplash.com/photo-1599443015574-be5fe8a05783?q=80&w=500",
    status: "Pending",
    assignedTo: null,
    assignedUserName: null,
    trackingCode: "RP-MOCK-003",
    createdAt: "2026-05-13T07:45:00Z",
    updatedAt: "2026-05-13T07:45:00Z",
  },
  {
    reportId: 4,
    userId: 5,
    reporterName: "Hoàng Văn Bình",
    reporterPhone: "0933444555",
    locationText: "Khu vực bãi rác, đường Trần Phú, TP. Thủ Đức",
    description: "Bé chó già, lông đen, hình như bị xe đụng, không di chuyển được.",
    imageUrl: null,
    status: "Rescued",
    assignedTo: 2,
    assignedUserName: "TNV Trần Bình",
    trackingCode: "RP-MOCK-004",
    createdAt: "2026-04-25T22:10:00Z",
    updatedAt: "2026-04-27T11:30:00Z",
  },
  {
    reportId: 5,
    userId: null,
    reporterName: "Đỗ Minh",
    reporterPhone: "0944555666",
    locationText: "Trường mầm non Sao Mai, Q. Bình Thạnh",
    description: "Mèo mẹ và 3 mèo con đang trú trong sân trường.",
    imageUrl: null,
    status: "In Progress",
    assignedTo: 4,
    assignedUserName: "TNV Vũ Mai",
    trackingCode: "RP-MOCK-005",
    createdAt: "2026-05-11T13:00:00Z",
    updatedAt: "2026-05-12T08:30:00Z",
  },
  {
    reportId: 6,
    userId: null,
    reporterName: "Trịnh Quốc",
    reporterPhone: "0955666777",
    locationText: "Hẻm 12 Nguyễn Trãi, Q.5",
    description: "Bé chó bị nhốt trong cũi nhỏ ngoài trời nắng nhiều ngày.",
    imageUrl: null,
    status: "Failed",
    assignedTo: 2,
    assignedUserName: "TNV Trần Bình",
    trackingCode: "RP-MOCK-006",
    createdAt: "2026-04-15T10:00:00Z",
    updatedAt: "2026-04-17T18:00:00Z",
  },
];

export const getRescueStats = () => {
  const total = mockRescueReports.length;
  const rescued = mockRescueReports.filter((r) => r.status === "Rescued").length;
  const inProgress = mockRescueReports.filter((r) => r.status === "In Progress").length;
  const pending = mockRescueReports.filter((r) => r.status === "Pending").length;
  return { total, rescued, inProgress, pending };
};
