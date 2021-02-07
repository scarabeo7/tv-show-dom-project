//You can edit ALL of the code here
const container = document.getElementById("container");
const searchWrapper = document.getElementById("searchWrapper");
const searchBar = document.getElementById("searchBar");
let allEpisodes;

function setup() {
 fetch("https://api.tvmaze.com/shows/82/episodes")
  .then(response => response.json())
  .then(data => {
    allEpisodes = data;
  searchBar.addEventListener("input", searchFunction);
  addSelectOption(allEpisodes);
  makePageForEpisodes(allEpisodes);
  })
  .catch(error => console.log(error));
}

// function adds "0" to number to give it a double digit //
function zeroPadded(episodeCode) {
  return episodeCode.toString().padStart(2, 0);
}

function helperMarkup(episode) {
  const markUp = `<h2>${episode.name} - S${zeroPadded(
    episode.season
  )} E${zeroPadded(episode.number)}<div></h2>
    <img src= "${episode.image.medium}" alt "">${episode.summary}</div>`;
  return markUp;
}

function makePageForEpisodes(episodeList) {
  let innerHTMLArray = "";
  episodeList.forEach((episode) => {
    innerHTMLArray += helperMarkup(episode);
  });
  container.innerHTML = innerHTMLArray;
}

function episodeCount(filteredInput) {
  if (document.getElementById("p")) {
    document.getElementById("p").remove();
  }
  let pEl = document.createElement("p");
  pEl.id = "p";
  pEl.innerHTML = `Displaying ${filteredInput.length} of ${allEpisodes.length}`;
  searchWrapper.appendChild(pEl);
}

function searchFunction(e) {
  let searchString = e.target.value.toLowerCase();
  let filteredInput = allEpisodes.filter((char) => {
    return (
      char.name.toLowerCase().includes(searchString) ||
      char.summary.toLowerCase().includes(searchString)
    );
  });
  container.innerHTML = "";
  makePageForEpisodes(filteredInput);
  episodeCount(filteredInput);
}

function addSelectOption(episodeList) {
  let select = document.createElement("select");
  let seeAllElements = document.createElement("option");
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
