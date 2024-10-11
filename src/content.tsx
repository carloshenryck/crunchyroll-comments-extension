import { createRoot } from "react-dom/client";
import { waitForElement } from "./utils/waitForElement";
import { addBodyObserver } from "./utils/observerBody";
import AddComments from "./components/AddComments";

let currentUrl: string = "";
const rootId = "crx-root";

const observerCallback = () => {
  const updatedUrl = window.location.href;
  const hasChangedUrl = currentUrl !== updatedUrl;
  if (!hasChangedUrl) return;

  document.getElementById(rootId)?.remove();

  if (updatedUrl.startsWith("https://www.crunchyroll.com/pt-br/series/")) {
    addSeasonsContentScript();
  }

  currentUrl = updatedUrl;
};

addBodyObserver(".app-body-wrapper", observerCallback);
observerCallback();

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
