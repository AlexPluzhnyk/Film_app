import { createElement } from "./createNode.js";

export function createModalCard(item) {
  console.log(item);
  const name = item.name;
  const genre = item.genres.join(", ");
  const lang = item.language;
  const age = item.premiered;
  const summary = item.summary;

  const wrapper = createElement("div", {
    class: "modal-wrapper",
    id: "modal-wrapper",
  });
  const modalCard = createElement("div", { class: "modal-wrapper__box" });
  wrapper.append(modalCard);
  const picture = createElement("img", {
    class: "modal-wrapper__picture",
    src: item.image ? item.image.original : "../../images/placehold.png",
  });
  modalCard.append(picture);
  const modalBoxInfo = createElement("div", {
    class: "box-info",
  });
  modalCard.append(modalBoxInfo);
  const filmName = createElement("span", { class: "box-info__name" });
  filmName.innerText = name;
  const filmGenre = createElement("span", { class: "box-info__description" });
  filmGenre.innerText = genre;
  const filmLang = createElement("span", { class: "box-info__description" });
  filmLang.innerText = lang;
  const filmAge = createElement("span", { class: "box-info__description" });
  filmAge.innerText = age;
  const filmDesc = createElement("span", { class: "box-info__description" });
  filmDesc.innerHTML = summary;
  const filmBtnClose = createElement("button", {
    class: "box-info__close-btn",
    id: "closeBtn",
  });

  modalBoxInfo.append(filmBtnClose);
  modalBoxInfo.append(filmName);
  modalBoxInfo.append(filmGenre);
  modalBoxInfo.append(filmLang);
  modalBoxInfo.append(filmAge);
  modalBoxInfo.append(filmDesc);

  wrapper.addEventListener("click", ({ target }) => {
    if (target.id === "modal-wrapper" || target.id === "closeBtn") {
      wrapper.style.display = "none";
    }
  });

  return wrapper;
}
