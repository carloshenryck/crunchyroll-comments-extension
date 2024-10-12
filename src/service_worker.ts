chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (!changeInfo.url) return;

  if (changeInfo.url.startsWith("https://www.crunchyroll.com/pt-br/series/")) {
    chrome.tabs.sendMessage(tabId, { action: "runAddSeasonsContentScript" });
  }

  if (changeInfo.url.startsWith("https://www.crunchyroll.com/pt-br/watch/")) {
    chrome.tabs.sendMessage(tabId, { action: "runAddCommentsContentScript" });
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "fetchComments") {
    const animeName = message.animeName;
    const episode = message.episode.toString().padStart(2, "0");
    const url = `https://disqus.com/api/3.0/threads/listPostsThreaded?limit=100&thread=link:https://betteranime.net/anime/legendado/${animeName}/episodio-${episode}&forum=betteranime&order=popular&api_key=E8Uh5l5fHZ6gD8U3KycjAIAk46f68Zw7C6eW8WSjZvCLXebZ7p0r1yrYDrLilk2F`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        sendResponse({ success: true, data });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });

    return true;
  }
});
