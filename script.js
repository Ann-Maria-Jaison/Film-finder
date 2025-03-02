const API_KEY = "e9f4e0f1e02432b8cad11c72c3883ce5";
async function loadGenres() {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;
    const response = await fetch(url);
    const data = await response.json();

    const genreDropdown = document.getElementById("genre");
    genreDropdown.innerHTML = "<option value=''>Select Genre</option>";

    data.genres.forEach(genre => {
        let option = document.createElement("option");
        option.value = genre.id;
        option.textContent = genre.name;
        genreDropdown.appendChild(option);
    });
}

async function loadLanguages() {
    const url = `https://api.themoviedb.org/3/configuration/languages?api_key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    const languageDropdown = document.getElementById("language");
    languageDropdown.innerHTML = "<option value=''>Select Language</option>";

    data.forEach(lang => {
        let option = document.createElement("option");
        option.value = lang.iso_639_1;
        option.textContent = lang.english_name;
        languageDropdown.appendChild(option);
    });
}

// Fetch movies
async function fetchMovies() {
    const genre = document.getElementById("genre").value;
    const language = document.getElementById("language").value;

    if (!genre || !language) {
        alert("Please select both genre and language!");
        return;
    }

    const moviesList = document.getElementById("moviesList");
    moviesList.innerHTML = "<p>Loading movies...</p>";

    let allMovies = [];
    let page = 1;
    let maxPages = 5; 

    while (page <= maxPages) {
        const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre}&language=${language}&page=${page}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.results) {
            allMovies = allMovies.concat(data.results);
        }
        
        if (page >= data.total_pages) break;
        page++;
    }

    moviesList.innerHTML = "";

    if (allMovies.length === 0) {
        moviesList.innerHTML = "<p>No movies found for this selection.</p>";
        return;
    }

    allMovies.forEach(movie => {
        let movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}" onclick="showMovieDetails(${movie.id})">
            <div class="movie-title">${movie.title}</div>
        `;
        moviesList.appendChild(movieCard);
    });
}

// Attach event listener to button
document.getElementById("searchBtn").addEventListener("click", fetchMovies);

// Load genres and languages on page load
window.onload = function () {
    loadGenres();
    loadLanguages();
};
