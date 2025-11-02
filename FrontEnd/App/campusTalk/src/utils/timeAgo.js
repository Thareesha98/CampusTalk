// src/utils/timeAgo.js
export function timeAgo(dateString) {
  const diff = Math.floor((Date.now() - new Date(dateString)) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}
