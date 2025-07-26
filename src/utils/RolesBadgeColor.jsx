// utils/roleBadges.js
export const roleBadgeClasses = {
  Admin: { bg: "bg-red-100", text: "text-red-800" },
  Deposit: { bg: "bg-blue-100", text: "text-blue-800" },
  Manager: { bg: "bg-yellow-100", text: "text-yellow-800" },
  Withdrawal: { bg: "bg-purple-100", text: "text-purple-800" },
  Auditor: { bg: "bg-gray-100", text: "text-gray-800" },
  CreateID: { bg: "bg-teal-100", text: "text-teal-800" },
  // fallback
  default: { bg: "bg-gray-50", text: "text-gray-600" },
};

export function getBadgeClasses(role) {
  return roleBadgeClasses[role] || roleBadgeClasses.default;
}
