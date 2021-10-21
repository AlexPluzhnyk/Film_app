import api from "./api.js";
import {
  films,
  favorite,
  inpValue,
  searchBtn,
  filmBox,
  langSelect,
  generesSelect,
  itemsShowOnPage,
  prevPage,
  nextPage,
  currentPage,
  inputPage,
  formBox,
  logName,
  logPass,
  logBtn,
  userName,
  userBtnOut,
  cast,
  paginWrap,
} from "./nodes.js";
import { renderFilmCard } from "./utils/createCard.js";
import { createModalCard } from "./utils/createModal.js";
import { clearContent } from "./utils/clearContent.js";

let allFilms = [];
let favorites = [];
let currentShowPage = 1;
let onPageFavorite = false;

export async function fetchFilms(page = 0) {
  try {
    return await api.get(`shows?page=${page}`);
  } catch (e) {
    console.log(e);
  }
}

function searchFilmsApi(query) {
  return fetch(`https://api.tvmaze.com/search/shows?q=${query}`)
    .then((data) => data.json())
    .then((items) => {
      allFilms = items.map((item) => item.show);
    });
}

function howManyShow(array, showNumber) {
  return array.slice(0, showNumber);
}

function filterFilms(lang, genre, arrayFilms) {
  if (arrayFilms.length) {
    if (lang && genre) {
      return arrayFilms.filter(
        (item) => item.language === lang && item.genres.includes(genre)
      );
    }

    if (lang) {
      return arrayFilms.filter((item) => item.language === lang);
    }

    if (genre) {
      return arrayFilms.filter((item) => item.genres.includes(genre));
    }

    return arrayFilms;
  }

  return [];
}

function renderCard(films = allFilms) {
  clearContent(filmBox);
  cast.style.display = "";
  paginWrap.style.display = "";
  if (onPageFavorite) {
    cast.style.display = "none";
    paginWrap.style.display = "none";
    renderFilmCard(films, filmBox, favorites);
    return;
  }

  const filteredFilms = filterFilms(
    langSelect.value,
    generesSelect.value,
    films
  );
  const paginatedFilms = howManyShow(filteredFilms, itemsShowOnPage.value);

  renderFilmCard(paginatedFilms, filmBox, favorites);
}

function toggleFavorite(item) {
  item.classList.toggle("active");

  const dataCardId = item.getAttribute("data-card-id");
  const favoriteFilmIndex = favorites.findIndex((item) => {
    return +item.id === +dataCardId;
  });

  if (favoriteFilmIndex === -1) {
    const film = allFilms.find((item) => {
      return +item.id === +dataCardId;
    });

    favorites = [...favorites, film];
  } else {
    favorites.splice(favoriteFilmIndex, 1);

    if (onPageFavorite) {
      renderCard(favorites);
    }
  }

  updateLocalStorage(favorites);
}

function loadFavoritesLocal() {
  const storageStringData = localStorage.getItem("favorites");

  if (storageStringData) {
    const storageData = JSON.parse(storageStringData);
    favorites = storageData;
  }
}

function updateLocalStorage(items) {
  localStorage.setItem("favorites", JSON.stringify(items));
}

function authorizedUser(item) {
  localStorage.setItem("userName", JSON.stringify(item));
  localStorage.setItem("isLog", JSON.stringify(true));
}

function removeFromLocalUser() {
  localStorage.removeItem("userName");
  localStorage.removeItem("isLog");
}

function showModal(item) {
  const currentItem = item.getAttribute("data-picture-id");
  let filmToShow = null;

  if (onPageFavorite) {
    filmToShow = favorites.find((item) => {
      return +item.id === +currentItem;
    });
  } else {
    filmToShow = allFilms.find((item) => {
      return +item.id === +currentItem;
    });
  }

  const modal = createModalCard(filmToShow);
  document.body.append(modal);
}

//-----------------------events

document.addEventListener("DOMContentLoaded", (e) => {
  const isLog = localStorage.getItem("isLog");
  if (isLog) {
    const name = localStorage.getItem("userName");
    userName.textContent = JSON.parse(name);
    fetchFilms().then((films) => {
      loadFavoritesLocal();
      allFilms = films;
      renderCard();
    });
  } else {
    formBox.style.display = "block";
  }
});

films.addEventListener("click", (e) => {
  fetchFilms().then((data) => {
    allFilms = data;
    onPageFavorite = false;
    renderCard();
  });
});

langSelect.addEventListener("change", (e) => {
  onPageFavorite = false;
  renderCard();
});

generesSelect.addEventListener("change", (e) => {
  onPageFavorite = false;
  renderCard();
});

itemsShowOnPage.addEventListener("change", (e) => {
  onPageFavorite = false;
  renderCard();
});

searchBtn.addEventListener("click", (e) => {
  onPageFavorite = false;
  if (inpValue.value.length > 2) {
    searchFilmsApi(inpValue.value).then(() => {
      if (allFilms.length) {
        inpValue.value = "";
        renderCard();
      } else {
        paginWrap.style.display = "none";
        filmBox.innerHTML = `${inpValue.value.toUpperCase()} - такого фильма нет!`;
        inpValue.value = "";
      }
    });
  }
});

favorite.addEventListener("click", (e) => {
  onPageFavorite = true;
  if (favorites.length) {
    loadFavoritesLocal();
    renderCard(favorites);
    return;
  } else {
    cast.style.display = "none";
    paginWrap.style.display = "none";
    filmBox.textContent = "Список пуст!";
  }
});

filmBox.addEventListener("click", ({ target }) => {
  console.log(target);
  if (target.classList.contains("like")) {
    toggleFavorite(target);
  }

  if (target.classList.contains("film-box__picture")) {
    showModal(target);
  }
});

nextPage.addEventListener("click", () => {
  if (currentShowPage < 5) {
    currentShowPage++;
    currentPage.textContent = currentShowPage;
    prevPage.disabled = false;
  }
  const isLastPage = currentShowPage === 5;
  if (isLastPage) {
    nextPage.disabled = true;
  }

  fetchFilms(currentShowPage).then((films) => {
    allFilms = films;
    renderCard();
  });
});

prevPage.addEventListener("click", (e) => {
  fetchFilms(currentShowPage).then((films) => {
    allFilms = films;
    currentShowPage--;
    currentPage.textContent = currentShowPage;
    nextPage.disabled = false;
    renderCard();

    const isFirstPage = currentShowPage === 1;

    if (isFirstPage) {
      prevPage.disabled = true;
      return;
    }
  });
});

inputPage.addEventListener("change", () => {
  if (+inputPage.value > 5) {
    inputPage.value = 5;
    prevPage.disabled = false;
    nextPage.disabled = true;
  }
  if (+inputPage.value < 1) {
    inputPage.value = 1;
  }
  currentShowPage = +inputPage.value;
  fetchFilms(currentShowPage).then((films) => {
    allFilms = films;
    onPageFavorite = false;
    renderCard();

    currentPage.textContent = currentShowPage;
    inputPage.value = "";
  });
});

logBtn.addEventListener("click", (e) => {
  if (logName.value.length > 2 && logPass.value.length > 2) {
    authorizedUser(logName.value);
    formBox.style.display = "none";
    userName.textContent = logName.value;
    return;
  } else {
    e.preventDefault();
    logName.value = "";
    logPass.value = "";
  }
});

userBtnOut.addEventListener("click", () => {
  formBox.style.display = "block";
  removeFromLocalUser();
  logName.value = "";
  logPass.value = "";
});
