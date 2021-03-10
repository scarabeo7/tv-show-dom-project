const mainElem = document.getElementById("main-container");
const showDropDown = document.getElementById("show-dropdown");
const searchWrapper = document.getElementById("search-wrapper");
const searchBar = document.getElementById("searchBar");
const showSearchBar = document.getElementById("searchShow");
const select = document.createElement("select");
const seeAllElements = document.createElement("option");
const paragraph = document.getElementById("display-text");
const homeButton = document.getElementById("button");
let allShows = getAllShows();

// function to display all shows on when page loads
function displayShows(allShows) {
  showsInformation(allShows);
  document.querySelectorAll(".show-container").forEach((show) => {
    let showId = show.getAttribute("data-id");
    show.addEventListener("click", () => {
      showDropDown.value = showId;
      showSearchBar.style.display = "none";
      select.style.display = "block";
      homeButton.style.display = "block";
      episodeSet(showId);
    });
  });
  paragraph.innerHTML = `Displaying ${allShows.length} of ${allShows.length} shows`;

  showSearchBar.addEventListener("input", searchShow);
}

function setup() {
  displayShows(allShows);

  // Creates show DropDown Options
  showList = allShows.forEach((show) => {
    showDropDown.innerHTML += `
  <option  value= "${show.id}">
  ${show.name}
  </option>
  `;
  });
}

// Return to all shows button event
homeButton.style.display = "none";
homeButton.addEventListener("click", ()=>{
  displayShows(allShows);
  select.style.display = "none";
  homeButton.style.display = "none";
  searchBar.style.display = "none";
  showSearchBar.style.display = "block";

});

// sorts the show dropDown in alphabetical order
allShows.sort((a, b) => {
  if (a.name.toLowerCase() > b.name.toLowerCase()) {
    return 1;
  } else if (b.name.toLowerCase() > a.name.toLowerCase()) {
    return -1;
  } else {
    return 0;
  }
});

// markup function that holds shows data to display (level 500)
function showListMarkup(show) {
  const imageMarkUp = show.image
    ? `<img src = "${show.image.medium}" alt "Show image">`
    : "";
  const showMarkUp = `<div class = "show-container" data-id = "${
    show.id
  }"><h2>${show.name}</h2>
  ${imageMarkUp} <div class = "show-summary">${
    show.summary
  }</div><div class = "ratings"><p><strong>Rated:</strong> ${
    show.rating.average
  }</p><p><strong>Genres:</strong> ${show.genres.join(
    " | "
  )}</p><p><strong>Status:</strong> ${
    show.status
  }</p><p><strong>Runtime:</strong> ${show.runtime}</p></div></div>`;
  return showMarkUp;
}

// function that loads shows contents (level 500)
function showsInformation(showList) {
  let showContent = "";
  showList.forEach((show) => {
    showContent += showListMarkup(show);
  });
  mainElem.innerHTML = showContent;
}

// function adds "0" to number to give it a double digit //
function zeroPadded(episodeCode) {
  return episodeCode.toString().padStart(2, 0);
}

// markup function that holds each shows episodes data to display
function helperMarkup(episode) {
  const imageMarkUp = episode.image
    ? `<img src = "${episode.image.medium}" alt "Show image">`
    : "";
  const markUp = `<div class = "episode-container"><h2>${episode.name} - S${zeroPadded(
    episode.season
  )} E${zeroPadded(episode.number)}</h2>
    ${imageMarkUp} ${episode.summary !== null ? episode.summary : ""}</div>`;
  return markUp;
}

// function to fetch shows from API and displays episodes
function episodeSet(selectedShow) {
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

showDropDown.addEventListener("change", (e) => {
  if (e.target.value === "all") {
    displayShows(allShows);
    searchBar.style.display = "none";
    paragraph.innerHTML = `Displaying ${allShows.length} of ${allShows.length} shows`;
    select.style.display = "none";
    showSearchBar.style.display = "block";
    homeButton.style.display = "none";
  } else {
    episodeSet(e.target.value);
    select.style.display = "block";
    showSearchBar.style.display = "none";
    homeButton.style.display = "block";
  }
});

// function to load episode contents
function makePageForEpisodes(episodeList) {
  let pageContent = "";
  episodeList.forEach((episode) => {
    pageContent += helperMarkup(episode);
  });
  mainElem.innerHTML = pageContent;
  searchBar.style.display = "block";
}

function episodeCount(filteredInput) {
  paragraph.innerHTML = `Displaying ${filteredInput.length} of ${allEpisodes.length} episodes`;
}

function showCount(filteredInput) {
  paragraph.innerHTML = `Displaying ${filteredInput.length} of ${allShows.length} shows`;
}

// function to search through episode list
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

// function to search through show list
function searchShow(e) {
  let searchString = e.target.value.toLowerCase();
  let filteredInput = allShows.filter((char) => {
    return (
      char.name.toLowerCase().includes(searchString) ||
      char.genres.join(" ").toLowerCase().includes(searchString) ||
      char.summary.toLowerCase().includes(searchString)
    );
  });
  mainElem.innerHTML = "";
  displayShows(filteredInput);
  showCount(filteredInput);
}

searchBar.style.display = "none";
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
