const DEFAULTS = { enabled: true, prefixes: ["/", "\\"], keepSpace: false };

async function updateBadge() {
  const { enabled } = await chrome.storage.sync.get(DEFAULTS);
  await chrome.action.setBadgeText({ text: enabled ? "ON" : "OFF" });
  await chrome.action.setBadgeBackgroundColor({ color: enabled ? "#1a73e8" : "#80868b" });
}

chrome.runtime.onInstalled.addListener(updateBadge);
chrome.runtime.onStartup.addListener(updateBadge);
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && "enabled" in changes) updateBadge();
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "toggle") return;
  const { enabled } = await chrome.storage.sync.get(DEFAULTS);
  await chrome.storage.sync.set({ enabled: !enabled });
});
