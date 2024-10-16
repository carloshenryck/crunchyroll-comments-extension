import { createRoot } from "react-dom/client";
import { waitForElement } from "./utils/waitForElement";
import AddComments from "./components/AddComments";
import Comments from "./components/Comments";

const rootId = "crx-root";

chrome.runtime.onMessage.addListener((request) => {
  runActions(request.action);
});

const runActions = (action: string) => {
  if (action === "runAddSeasonsContentScript") {
    addSeasonsContentScript();
  }

  if (action === "runAddCommentsContentScript") {
    addCommentsContentScript();
  }

  document.getElementById(rootId)?.remove();
};

runActions(
  window.location.href.includes("series")
    ? "runAddSeasonsContentScript"
    : window.location.href.includes("watch")
    ? "runAddCommentsContentScript"
    : ""
);

async function addSeasonsContentScript() {
  const root = document.createElement("div");
  root.setAttribute("id", rootId);

  const seasonSelect = await Promise.race([
    waitForElement(".erc-seasons-select"),
    waitForElement(".seasons-select h4"),
  ]);

  if (!seasonSelect) return;

  seasonSelect.insertAdjacentElement("afterend", root);
  createRoot(document.getElementById(rootId)!).render(<AddComments />);
}

async function addCommentsContentScript() {
  const root = document.createElement("div");
  root.setAttribute("id", rootId);

  const videosWrapper = await waitForElement(".videos-wrapper");
  const bodyWrapper = videosWrapper?.parentElement;
  if (!bodyWrapper) return;

  bodyWrapper.insertAdjacentElement("afterend", root);
  createRoot(document.getElementById(rootId)!).render(<Comments />);
}
