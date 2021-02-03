//You can edit ALL of the code here
const container = document.getElementById("container");
const searchBar = document.getElementById("searchBar");
const allEpisodes = getAllEpisodes();

function setup() {
  //  allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

// function adds "0" to number to give it a double digit //
    function zeroPadded(episodeCode) {
      return episodeCode.toString().padStart(2, 0);
    }

function helperMarkup (episode) {
  const markUp = `<div><h2>${episode.name} - S${zeroPadded(
      episode.season
    )} E${zeroPadded(episode.number)}</h2>
    <img src= "${episode.image.medium}" alt "">${episode.summary}</div>`;
    return markUp;
}

function makePageForEpisodes(episodeList) {
  const innerHTMLArray = [];
  episodeList.forEach((episode) => {
    innerHTMLArray.push(helperMarkup(episode));
  });
  container.innerHTML = innerHTMLArray;
}

function searchFunction(e){
  let searchString = e.target.value.toLowerCase();
      let filteredInput = allEpisodes.filter((char) => {
        return (
          char.name.toLowerCase().includes(searchString) ||
          char.summary.toLowerCase().includes(searchString)
        );
      });
      container.innerHTML = "";
      makePageForEpisodes(filteredInput);
      
}

searchBar.addEventListener("input", searchFunction);

window.onload = setup;
