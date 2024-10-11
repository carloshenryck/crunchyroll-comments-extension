import { waitForElement } from "./waitForElement";

export const addBodyObserver = async (
  bodyClass: string,
  callback: () => void
) => {
  const config = { attributes: false, childList: true, subtree: false };
  const observer = new MutationObserver(callback);
  const body = await waitForElement(bodyClass);
  if (!body) return;
  observer.observe(body, config);
};
