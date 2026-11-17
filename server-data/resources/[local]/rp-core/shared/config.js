/**
 * Shared FiveM RP configuration loaded on both server and client runtimes.
 * Also exported via CommonJS so local Node.js tests and dev preview reuse the exact config.
 */
const RpConfig = {
  startingCash: 2500,
  startingBank: 15000,
  maxTransferAmount: 1000000,
  salaryIntervalMs: 10 * 60 * 1000, // 10 phút nhận lương một lần
  maxTransactionHistory: 20,
  defaultJob: 'unemployed',
  jobs: {
    unemployed: {
      label: 'Thất nghiệp',
      salary: 150,
      grades: ['Công dân'],
    },
    delivery: {
      label: 'Giao hàng',
      salary: 450,
      grades: ['Thực tập', 'Tài xế', 'Điều phối'],
    },
    mechanic: {
      label: 'Thợ sửa xe',
      salary: 700,
      grades: ['Học việc', 'Thợ chính', 'Quản lý xưởng'],
    },
    police: {
      label: 'Cảnh sát',
      salary: 1100,
      grades: ['Học viên', 'Sĩ quan', 'Trung úy', 'Cảnh sát trưởng'],
    },
  },
};

globalThis.RpConfig = RpConfig;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = RpConfig;
}
