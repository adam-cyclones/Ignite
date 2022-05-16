export function getElementByExactText(text) {
  return document.evaluate(
    `//*[normalize-space(text()) = '${text}']`,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}
