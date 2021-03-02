const mainElem = document.getElementById("main-container");
const showDropDown = document.getElementById("show-dropdown");
const searchWrapper = document.getElementById("search-wrapper");
const searchBar = document.getElementById("searchBar");
const showSearchBar = document.getElementById("searchShow");
let select = document.createElement("select");
let seeAllElements = document.createElement("option");
let paragraph = document.getElementById("display-text");
let allShows = getAllShows();
let allEpisodes;

function displayShows(allShows) {
  showsInformation(allShows);
  document.querySelectorAll(".show-container").forEach((show) => {
    let showId = show.getAttribute("data-id");
    show.addEventListener("click", () => {
      showDropDown.value = showId;
      episodeSet(showId);
      addSelectOption(allEpisodes);
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

// markup function that holds shows data to display (level 500)
function showListMarkup(show) {
  const imageMarkUp = (show.image) ?  `<img src = "${show.image.medium}" alt "Show image">`: "";
  const showMarkUp = `<div class = "show-container" data-id = "${show.id}"><h2>${show.name}</h2>
  ${imageMarkUp} ${show.summary}<p class = "ratings">Rated: ${show.rating.average} | | 
    Genres: ${show.genres} | | Status: ${show.status} | | Runtime: ${show.runtime}</p></div>`;
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

// markup function that holds page data to display
function helperMarkup(episode) {
 const imageMarkUp = episode.image
   ? `<img src = "${episode.image.medium}" alt "Show image">`
   : "";
 const markUp = `<div><h2>${episode.name} - S${zeroPadded(
   episode.season
 )} E${zeroPadded(episode.number)}</h2>
    ${imageMarkUp} ${episode.summary !== null ? episode.summary : ""}</div>`;
 return markUp;
}

// sorts the show dropDown in alphabetical order
allShows.sort((a, b) => {
  if(a.name.toLowerCase() > b.name.toLowerCase()) {
    return 1;
  }else if(b.name.toLowerCase() > a.name.toLowerCase()) {
    return -1;
  }
  else
  {
    return 0;
  }
});


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
    paragraph.innerHTML = "";
    select.style.display = "none";
    showSearchBar.style.display = "block";
  } else {
    episodeSet(e.target.value);
    select.style.display = "block";
    showSearchBar.style.display = "none";
  }
});

// showDropDown.addEventListener("change", (e) =>  episodeSet(e.target.value));

// function that loads page contents
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

function showCount(filteredInput){
  paragraph.innerHTML = `Displaying ${filteredInput.length} of ${allShows.length} shows`;
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

function searchShow(e) {
  let searchString = e.target.value.toLowerCase();
  let filteredInput = allShows.filter((char) => {
    return (
      char.name.toLowerCase().includes(searchString) ||
      char.genres.join(" ").toLowerCase().includes(searchString)||
      char.summary.toLowerCase().includes(searchString)
    );
  });
  mainElem.innerHTML = "";
  displayShows(filteredInput);
  showCount(filteredInput);
}

searchBar.style.display = "none"
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