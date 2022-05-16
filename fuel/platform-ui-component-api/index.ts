import { clientSideScript } from "../client-script";

export function getManyVueComponents() {
  clientSideScript(function _vueComponents() {
    const allElements = document.querySelectorAll("*");
    console.log(Array.from(allElements).filter((el) => "__vue__" in el));
  });
}

export function getOneVueComponent(id) {
  clientSideScript(function _vueComponents() {
    const allElements = document.querySelectorAll("*");
    console.log(Array.from(allElements).filter((el) => "__vue__" in el));
  });
}
