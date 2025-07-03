let moviesData = [];

async function fetchMovies() {
    try {
        // Fetch from API endpoint
        const response = await fetch('/api/movies');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        moviesData = await response.json();
        
        // Fallback to sample data if API returns empty or invalid data
        if (!Array.isArray(moviesData) || moviesData.length === 0) {
            console.log('Using sample data as fallback');
            moviesData = [
                {
                    id: "0",
                    title: "The Batman",
                    image_url: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
                    release_date: "2022-03-04",
                    platforms: ["HBO Max", "Amazon Prime", "Vudu"],
                    year: "2022"
                },
                {
                    id: "1",
                    title: "Spider-Man: No Way Home",
                    image_url: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
                    release_date: "2021-12-17",
                    platforms: ["Netflix", "Sony Pictures"],
                    year: "2021"
                },
                {
                    id: "2",
                    title: "Dune",
                    image_url: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
                    release_date: "2021-10-22",
                    platforms: ["HBO Max", "Amazon Prime"],
                    year: "2021"
                },
                {
                    id: "3",
                    title: "Top Gun: Maverick",
                    image_url: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
                    release_date: "2022-05-27",
                    platforms: ["Paramount+", "Amazon Prime"],
                    year: "2022"
                },
                {
                    id: "4",
                    title: "Black Panther: Wakanda Forever",
                    image_url: "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
                    release_date: "2022-11-11",
                    platforms: ["Disney+", "Amazon Prime"],
                    year: "2022"
                },
                {
                    id: "5",
                    title: "Avatar: The Way of Water",
                    image_url: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
                    release_date: "2022-12-16",
                    platforms: ["Disney+", "Amazon Prime", "Apple TV"],
                    year: "2022"
                }
            ];
        }

        displayMovies(moviesData);
        
    } catch (error) {
        console.error('Error fetching movies:', error);
        showError('Failed to load movies. Please check your API configuration.');
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

async function searchMovies(query) {
    try {
        document.getElementById('loading').style.display = 'inline-block';

        // Fetch from API endpoint
        const response = await fetch('/api/search?q=' + encodeURIComponent(query));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        moviesData = await response.json();
        
        // Fallback to sample data if API returns empty or invalid data
        if (!Array.isArray(moviesData) || moviesData.length === 0) {
            console.log('Using sample data as fallback');
            
        }

        displayMovies(moviesData);
        
    } catch (error) {
        console.error('Error fetching movies:', error);
        showError('Failed to load movies. Please check your API configuration.');
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

async function onMovieCardClick(title, id, year) {
    console.log(title);
    console.log(id);
    try {
        const qs_text = `.movie-id-${id}`;
        const card = document.querySelector(qs_text);
        if (card) {
            const existing = card.querySelector('.selected-indicator');
            if (existing) {
                existing.remove();
            } else {
                const t_query = title + ' ' + year + ' 1080p x265';
                const prepared_url = `https://torrent-api-py-nx0x.onrender.com/api/v1/search?site=limetorrent&limit=5&query=${encodeURIComponent(title)}`
                // Fetch from API endpoint
                const response = await fetch(prepared_url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                all_data = await response.json();
                data = all_data.data;
                // Fallback to sample data if API returns empty or invalid data
                if (!Array.isArray(moviesData) || moviesData.length === 0) {
                    console.log('Using sample data as fallback');
                    data = [
                        {
                        "name": "Thunderbolts.2025.1080p.WEB-DL.DDP5.1.x265-NeoNoir",
                        "size": "1.93 GB",
                        "date": "2 days ago",
                        "seeders": "2,106",
                        "leechers": "609"
                        },
                        {
                        "name": "Thunderbolts 2025 1080p WEB-DL HEVC x265 5 1 BONE",
                        "size": "2.07 GB",
                        "date": "2 days ago",
                        "seeders": "994",
                        "leechers": "528"
                        }
                    ];
                }

                const selectedDiv = document.createElement('div');
                selectedDiv.className = 'selected-indicator';

                const table = document.createElement('table');
                table.style.marginTop = '10px';
                table.style.background = '#222';
                table.style.color = '#fff';
                table.style.borderCollapse = 'collapse';
                table.style.width = '100%';

                const thead = document.createElement('thead');
                const headerRow = document.createElement('tr');
                // Get all column keys except 'hash'
                const excludeColumns = ['hash', 'size', 'torrent', 'magnet', 'url', 'category']; // Add more column names to exclude as needed
                const columns = Object.keys(data[0]).filter(key => !excludeColumns.includes(key));
                columns.forEach(key => {
                    const th = document.createElement('th');
                    th.textContent = key.charAt(0).toUpperCase() + key.slice(1);                    
                    th.style.border = '1px solid #444';
                    th.style.padding = '4px 8px';
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);
                table.appendChild(thead);

                const tbody = document.createElement('tbody');
                data.forEach(row => {
                    const tr = document.createElement('tr');
                    columns.forEach(key => {
                        const td = document.createElement('td');
                        td.textContent = row[key];
                        if (key === 'name') {
                            td.innerHTML = `<a href="${row['torrent']}" target="_blank" style="color:#4fc3f7;text-decoration:underline;">${row[key]}</a>`;
                        }
                        td.style.border = '1px solid #444';
                        td.style.padding = '4px 8px';
                        tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                });
                table.appendChild(tbody);

                selectedDiv.appendChild(table);


                
                // selectedDiv.textContent = 'selected';
                // selectedDiv.style.position = 'relative';
                // selectedDiv.style.top = '0px';
                // selectedDiv.style.right = '10px';
                // selectedDiv.style.color = '#fff';
                // selectedDiv.style.borderRadius = '4px';
                // card.style.position = 'relative';
                card.appendChild(selectedDiv);
            }
        }
    } catch (error) {
        console.error('Error fetching movie details:', error);
    } finally {
        
    }
}

function displayMovies(movies) {
    const container = document.getElementById('movies-container');
    
    if (movies.length === 0) {
        showError('No movies found.');
        return;
    }
    hideError();
    container.innerHTML = movies.map(movie => `
        <div class="movie-card movie-id-${movie.id}" onclick="onMovieCardClick('${movie.title}','${movie.id}','${movie.year}')">
            <img 
                src="${movie.image_url || 'https://via.placeholder.com/300x400?text=No+Image'}" 
                alt="${movie.title}"
                class="movie-image"
                onerror="handleImageError(this)"
            >
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="release-date">
                    📅 ${formatDate(movie.release_date)} ${movie.year ? `(${movie.year})` : ''}
                </div>
                <div class="platforms">
                    <h4>Available on:</h4>
                    <div class="platform-tags">
                        ${movie.platforms.map(platform => 
                            `<span class="platform-tag">${platform}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function handleImageError(img) {
    img.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.className = 'movie-image error';
    placeholder.textContent = 'Image not available';
    img.parentNode.insertBefore(placeholder, img);
}

function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    } catch (error) {
        return dateString;
    }
}

function showError(message) {
    const errorElement = document.getElementById('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function hideError() {
    const errorElement = document.getElementById('error');
    errorElement.textContent = '';
    errorElement.style.display = 'none';
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const clearSearchBtn = document.getElementById('clearSearch');
    
    // Search functionality
    searchBtn.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
            searchMovies(query);
        }
        clearSearchBtn.style.display = 'inline-block';
    });
    
    // Enter key search
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                searchMovies(query);
            }
            clearSearchBtn.style.display = 'inline-block';
        }
    });

    // Enter key search
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                searchMovies(query);
            }
        }
    });
    
    // Clear search
    clearSearchBtn.addEventListener('click', function() {
        searchInput.value = '';
        fetchMovies();
        clearSearchBtn.style.display = 'none';
    });
    
    // Load initial mov
    fetchMovies();
});