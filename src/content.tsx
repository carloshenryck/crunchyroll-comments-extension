import { createRoot } from "react-dom/client";
import { waitForElement } from "./utils/waitForElement";
import AddComments from "./components/AddComments";
import Comments from "./components/Comments";

const rootId = "crx-root";

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "runAddSeasonsContentScript") {
    addSeasonsContentScript();
  }

  if (request.action === "runAddCommentsContentScript") {
    addCommentsContentScript();
  }

  document.getElementById(rootId)?.remove();
});

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

  const bodyWrapper = await waitForElement(".body-wrapper");
  if (!bodyWrapper) return;

  bodyWrapper.insertAdjacentElement("afterend", root);
  createRoot(document.getElementById(rootId)!).render(<Comments />);
}
