chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (!changeInfo.url) return;
  console.log(changeInfo.url);

  if (changeInfo.url.startsWith("https://www.crunchyroll.com/pt-br/series/")) {
    chrome.tabs.sendMessage(tabId, { action: "runAddSeasonsContentScript" });
  }

  if (changeInfo.url.startsWith("https://www.crunchyroll.com/pt-br/watch/")) {
    chrome.tabs.sendMessage(tabId, { action: "runAddCommentsContentScript" });
  }
});
