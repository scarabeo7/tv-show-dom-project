const mainElem = document.getElementById("main-container");
const showDropDown = document.getElementById("show-dropdown");
const searchWrapper = document.getElementById("search-wrapper");
const searchBar = document.getElementById("searchBar");
let showTitle = document.getElementById("show-title");
let select = document.createElement("select");
let seeAllElements = document.createElement("option");
let paragraph = document.getElementById("display-text");
let allShows;
let showList;
let allEpisodes;

function setup() {
  showTitle.innerHTML = "24";
  fetch("https://api.tvmaze.com/shows/167/episodes")
    .then((response) => response.json())
    .then((data) => {
      allEpisodes = data;
      searchBar.addEventListener("input", searchFunction);
      addSelectOption(allEpisodes);
      makePageForEpisodes(allEpisodes);
      paragraph.innerHTML = `Displaying ${allEpisodes.length} of ${allEpisodes.length} episodes`;
    })
    .catch((error) => console.log(error));
}

// function adds "0" to number to give it a double digit //
function zeroPadded(episodeCode) {
  return episodeCode.toString().padStart(2, 0);
}

// markup function that holds page data to display
function helperMarkup(episode) {
  const markUp = `<div><h2>${episode.name} - S${zeroPadded(
    episode.season
  )} E${zeroPadded(episode.number)}</h2>
    <img src= "${episode.image.medium}" alt "episode image">${
    episode.summary
  }</div>`;
  return markUp;
}

// sorts the show dropDown in alphabetical order
allShows = getAllShows().sort((a, b) => {
  if (a.name.toLowerCase() > b.name.toLowerCase()) {
    return 1;
  } else if (b.name.toLowerCase() > a.name.toLowerCase()) {
    return -1;
  } else {
    return 0;
  }
});

// Creates show DropDown Options
allShows.forEach((show) => {
  showDropDown.innerHTML += `
  <option  value= "${show.id}">
  ${show.name}
  </option>
  `;
});

// function to fetch shows from API and displays episodes
function episodeSet(selectedShow) {
  let title = showDropDown.options[showDropDown.selectedIndex].text;
  if (title === "Select a show…") {
    showList.innerHTML = "";
  } else {
    showTitle.innerHTML = title;
  }
  fetch(`https://api.tvmaze.com/shows/${selectedShow}/episodes`)
    .then((response) => response.json())
    .then((data) => {
      allEpisodes = data;
      searchBar.addEventListener("input", searchFunction);
      addSelectOption(allEpisodes);
      makePageForEpisodes(allEpisodes);
      paragraph.innerHTML = `Displaying ${allEpisodes.length} of ${allEpisodes.length} episodes`;
    })
    .catch((error) => console.log(error));
}

showDropDown.addEventListener("change", (e) => episodeSet(e.target.value));

// function that loads page contents
function makePageForEpisodes(episodeList) {
  let pageContent = "";
  episodeList.forEach((episode) => {
    pageContent += helperMarkup(episode);
  });
  mainElem.innerHTML = pageContent;
}

function episodeCount(filteredInput) {
  paragraph.innerHTML = `Displaying ${filteredInput.length} of ${allEpisodes.length} episodes`;
}

// function to search
function searchFunction(e) {
  let searchString = e.target.value.toLowerCase();
  let filteredInput = allEpisodes.filter((char) => {
    return (
      char.name.toLowerCase().includes(searchString) ||
      char.summary.toLowerCase().includes(searchString)
    );
  });
  mainElem.innerHTML = "";
  makePageForEpisodes(filteredInput);
  episodeCount(filteredInput);
}

searchBar.addEventListener("input", searchFunction);

// function to select episode from episode dropdown
function addSelectOption(episodeList) {
  select.innerHTML = "";
  seeAllElements.innerHTML = `See all episodes`;
  select.appendChild(seeAllElements);
  episodeList.forEach((episode) => {
    let option = document.createElement("option");
    option.value = episode.name;
    option.innerHTML = `${episode.name} - S${zeroPadded(
      episode.season
    )} E${zeroPadded(episode.number)}`;
    select.appendChild(option);
  });
  select.addEventListener("change", (e) => {
    let selectedEpisode;
    if (e.target.value === "See all episodes") {
      selectedEpisode = episodeList;
    } else {
      selectedEpisode = episodeList.filter((episode) => {
        return episode.name === e.target.value;
      });
    }
    makePageForEpisodes(selectedEpisode);
    episodeCount(selectedEpisode);
  });
  searchWrapper.appendChild(select);
}

window.onload = setup;
