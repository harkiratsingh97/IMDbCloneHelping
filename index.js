
const apiKey = '5a8545bd';
const searchInput = document.getElementById('searchInput');
const search = document.getElementById("searchInput");
const searchDropdown = document.getElementById("searchDropdown");

const searchButton = document.querySelector('.fa-magnifying-glass');
const movieDetails = document.querySelector('#detailContainer');
const favoriteBtn = document.querySelector('#favoriteButton');
const viewFavoritesButton = document.getElementById('like');
const favoritesList = document.getElementById('favoritesList');

console.log(favoritesList)

// Function to search movies
let searchTimeout;

async function searchMovies() {
    const searchTerm = searchInput.value;
    
    // Clear the previous timeout to prevent unnecessary requests
    clearTimeout(searchTimeout);

    // Delay the search by a short duration to wait for user input
    searchTimeout = setTimeout(async () => {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}`);
        const data = await response.json();
        console.log(data.Search);
      
        const movieList = document.querySelector("#movieList")
        movieList.innerHTML = '';

        if (data.Search) {
            data.Search.forEach(movie => {
                const movieElement = createMovieElement(movie, true);
                movieList.appendChild(movieElement);
            });
        }
    }, 300); // Adjust the delay duration as needed
}
// Add event listeners
if (searchButton) {
    searchButton.addEventListener('click', searchMovies);
}

// Add event listener for enter key
if(searchInput){
    searchInput.addEventListener('keyup', (e) => {
        if( e.key === "Enter") {
            searchMovies();
            searchDropdown.style.visibility = "hidden";
        }
});
}





// Function to create a movie element
function createMovieElement(movie, isSearchResult) {
    const movieElement = document.createElement('div');
    
    movieElement.classList.add('movie');    

    // --------------------------------------------- You can find Lorem Ipsum Line in <p> tag -----------------------------------------------
    movieElement.innerHTML = `
    <div class="container">
        <div class="wrapper">
            <img src="${movie.Poster}" alt="Movie Poster" class="banner-image">
            <h1>${movie.Title}</h1>
            <p>
                Lorem ipsum dolor sit amet, <br/> consectetur adipiscing elit.
            </p>
        </div>
        <div class="button-wrapper"> 
            <button class="btn outline view-details">DETAILS</button>
            <button class="btn fill" id="add-to-favorites"><i class="fa-regular fa-heart"></i></button>
        </div>
    </div>
            `;
         

    const viewDetailsBtn = movieElement.querySelector('.view-details');
    viewDetailsBtn.addEventListener('click', () => {
        window.location.href = `moviedetail.html?id=${movie.imdbID}`;

    });
const favoriteBtn = movieElement.querySelector('#add-to-favorites');
    if (favoriteBtn) {
        console.log("Check1")
        favoriteBtn.addEventListener('click', () => {
            console.log("Check2")
            addToFavorites(movie, favoriteBtn, isSearchResult);
        });
    }
    return movieElement;
}



if(window.location.pathname.includes('/moviedetail.html')){
    document.addEventListener('DOMContentLoaded',()=>{
        viewDetailPage();
    });
}


async function viewDetailPage() {
    const queryParams = new URLSearchParams(window.location.search);
    const movieId = queryParams.get('id');
    const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}`);
    const movieDetail = await response.json();
    movieDetails.innerHTML = `
        <div id="detailContainer">
                        <div>
                            <img src="${movieDetail.Poster}" id="moviePoster">
                        </div>
                        <div class="movie-name">
                            <h1 id="title">${movieDetail.Title}</h1>
                            <p id="rating">RATING: ${movieDetail.Rated}</p>
                            <p id="year">YEAR: ${movieDetail.Year}</p>
                            <p id="director">DIRECTOR: ${movieDetail.Director}</p>
                            <P id="actors">ACTORS: ${movieDetail.Actors}</P>
                            <p id="plot">${movieDetail.Plot}</p>
                        </div>
        </div>
        `;
}

if (viewFavoritesButton) {
    console.log("Check-Test")
    viewFavoritesButton.addEventListener('click', () => {
        window.location.href = 'favoritespage.html';
    });
}

// Add event listener on my-favorites.html
if (window.location.pathname === '/movieSearch/favoritespage.html') {
    console.log("Check5")
    document.addEventListener('DOMContentLoaded', () => {
        const favorites = JSON.parse(sessionStorage.getItem('favorites')) || [];
        displayFavorites(favorites);
    });
}

        
// Function to add a movie to favorites
function addToFavorites(movie, button, isSearchResult) {
    console.log("Check3")
    const favorites = JSON.parse(sessionStorage.getItem('favorites')) || [];
    console.log(favorites)
    const isAlreadyAdded = favorites.some(favMovie => favMovie.imdbID === movie.imdbID);

    if (!isAlreadyAdded) {
        favorites.push(movie);
        sessionStorage.setItem('favorites', JSON.stringify(favorites));

        button.textContent = 'Added to Favorites';
        button.disabled = true;

        if (!isSearchResult) {
            displayFavorites(favorites);
        }
    }
}

// console.log(window.location.pathname)


// Add event listener on my-favorites.html
if (window.location.pathname.includes('favoritespage.html')) {
    console.log('Condition matched');
    document.addEventListener('DOMContentLoaded', () => {
        const favorites = JSON.parse(sessionStorage.getItem('favorites')) || [];
        displayFavorites(favorites);
        console.log(favorites);
    });
}


// Function to display favorites
function displayFavorites(favorites) {
    favoritesList.innerHTML = '';
console.log("Test2")
    if (favorites.length > 0) {
        favorites.forEach(movie => {
            const favoriteMovieElement = createFavoriteMovieElement(movie);
            favoritesList.appendChild(favoriteMovieElement);
        });
    } else {
        favoritesList.innerHTML = '<p>You have no favorite movies.</p>';
    }
}

// Function to create a favorite movie element
function createFavoriteMovieElement(movie) {
    const favoriteMovieElement = document.createElement('div');
    favoriteMovieElement.classList.add('movie');
    favoriteMovieElement.innerHTML = `
        <h3>${movie.Title}</h3>
        <img src="${movie.Poster}" alt="${movie.Title}">
        <button class="remove-from-favorites">Remove from Favorites</button>
    `;

    const removeFromFavoritesBtn = favoriteMovieElement.querySelector('.remove-from-favorites');
    removeFromFavoritesBtn.addEventListener('click', () => {
        removeFromFavorites(movie, favoriteMovieElement);
    });

    return favoriteMovieElement;
}

// Function to remove a movie from favorites
function removeFromFavorites(movie, element) {
    const favorites = JSON.parse(sessionStorage.getItem('favorites')) || [];
    const updatedFavorites = favorites.filter(favMovie => favMovie.imdbID !== movie.imdbID);
    sessionStorage.setItem('favorites', JSON.stringify(updatedFavorites));

    element.remove();
}




// ------------------------------------------------Dropdown-----------------------------------------------------------------------------

//Event listener for keyboard input and making an API call to get the movie name from Title
search.addEventListener("keyup", (data) => {
	// search.value.replace(" ", "_");
	// console.log(search.value);
	fetch(
        `https://www.omdbapi.com/?apikey=${apiKey}&s=${search.value}`
        )
        // `http://www.omdbapi.com/?i=tt3896198&apikey=c0f0e6d3&s=${search.value}&plot=full`
		.then((data) => {
			return data.json();
		})
		.then((data) => {
			if (data.Response == "False") {
				searchDropdown.innerHTML = "Not found";
				return;
			}
			searchDropdown.style.visibility = "visible";

			searchDropdown.innerText = "";
			for (let movie of data.Search) {
				let dropdownElement = document.createElement("searchInput");
				dropdownElement.href = `/movie.html?title=${movie.Title}&imdbID=${movie.imdbID}`;
				dropdownElement.innerText = movie.Title;
				console.log(searchDropdown);
				searchDropdown.appendChild(dropdownElement);
			}
		});
});

//Removing the dropdown of movie suggestion if clicked somewhere else on the page
document.addEventListener("click", (data) => {
	if (!data.target.classList.contains("dont-close-dropdown"))
		searchDropdown.style.visibility = "hidden";
});