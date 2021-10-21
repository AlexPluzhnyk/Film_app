import { createElement } from "./createNode.js";

export function renderFilmCard(item, rendBoxContainer, favorites = []) {
  item.forEach((film) => {
    const cardWrapper = createElement("div", {
      class: "card-wrapper",
      id: `film-${film.id}`,
    });
    const cardImage = createElement("img", {
      class: "film-box__picture",
      "data-picture-id": film.id,
      src: film.image ? film.image.medium : "../../images/placehold.png",
      alt: "Film Image",
    });

    const isFavorite = favorites.find(({ id }) => id === film.id);

    const heart = createElement("span", {
      class: isFavorite
        ? "icon icon-heart like active"
        : "icon icon-heart like",
      "data-card-id": film.id,
    });

    cardWrapper.append(cardImage);
    cardWrapper.append(heart);
    rendBoxContainer.append(cardWrapper);
  });
}
