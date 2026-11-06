const YELLOW_AT = 80;
const RED_AT = 90;

async function updateBadge() {
  const { capacity, availableCapacity } = await chrome.system.memory.getInfo();
  const used = Math.round((1 - availableCapacity / capacity) * 100);
  const color = used >= RED_AT ? "#d32f2f" : used >= YELLOW_AT ? "#f9a825" : "#2e7d32";
  await chrome.action.setBadgeBackgroundColor({ color });
  await chrome.action.setBadgeTextColor({ color: used >= RED_AT || used < YELLOW_AT ? "#ffffff" : "#000000" });
  await chrome.action.setBadgeText({ text: `${used}%` });
  await chrome.action.setTitle({ title: `Stale Tab Closer — memory in use: ${used}%` });
}

chrome.alarms.create("mem", { periodInMinutes: 0.5 });
chrome.alarms.onAlarm.addListener((a) => a.name === "mem" && updateBadge());
chrome.runtime.onInstalled.addListener(updateBadge);
chrome.runtime.onStartup.addListener(updateBadge);
updateBadge();
