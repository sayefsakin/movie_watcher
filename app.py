from flask import Flask, render_template, jsonify, request
import requests
import os
from datetime import datetime

app = Flask(__name__)

# Configuration
WATCHMODE_API_KEY = 'Ne17hVf1kZiaIFXYKfLX06XcRJfkA7KFgq4g9MPn'
WATCHMODE_BASE_URL = 'https://api.watchmode.com/v1'

def get_new_releases(self, limit=20):
    url = 'https://api.watchmode.com/v1/releases/'
    params = {
        'apiKey': WATCHMODE_API_KEY,
        'release_date_gte': datetime.today().strftime('%Y-%m-%d'),
        'limit': limit
    }

    response = requests.get(url, params=params)
    if response.status_code != 200:
        print("Error:", response.status_code, response.text)
        return

    data = response.json().get('releases', [])
    # print(f"\n🎬 New Releases Today ({datetime.today().date()}):\n")

    # for item in data:
    #     print(f"- {item['title']} ({item['type'].capitalize()})")
    #     print(f"  ➤ Released on: {item['source_release_date']}")
    #     if 'source_name' in item:
    #         print(f"  ➤ Available on Platform: {item['source_name']}")
    #     if 'imdb_id' in item:
    #         print(f"  ➤ IMDB ID: {item['imdb_id']}")
    #     if 'tmdb_id' in item:
    #         print(f"  ➤ TMDB ID: {item['tmdb_id']}")
    #     print("")
    return data

def get_streaming_releases():
    """Fetch streaming releases from Watchmode API"""
    try:
        url = f"{WATCHMODE_BASE_URL}/releases/"
        params = {
            'apiKey': WATCHMODE_API_KEY,
            # 'types': 'movie',
            'regions': 'US',
            'limit': 25
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        return data.get('releases', [])
    
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return []

def search_movies(query):
    """Search movies using Watchmode API"""
    try:
        url = f"{WATCHMODE_BASE_URL}/autocomplete-search/"
        params = {
            'apiKey': WATCHMODE_API_KEY,
            # 'search_field': 'name',
            'search_value': query,
            # 'types': 'movie'
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        return data.get('results', [])
    
    except requests.exceptions.RequestException as e:
        print(f"Error searching movies: {e}")
        return []

def get_movie_details(movie_id):
    """Get detailed movie information including platforms"""
    try:
        url = f"{WATCHMODE_BASE_URL}/title/{movie_id}/details/"
        params = {
            'apiKey': WATCHMODE_API_KEY,
            'append_to_response': 'sources'
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        return response.json()
    
    except requests.exceptions.RequestException as e:
        print(f"Error fetching movie details: {e}")
        return None

def format_movie_data(releases):
    """Format movie data for display"""
    movies = []
    
    for release in releases:
        # Get detailed info for each movie
        movie_details = get_movie_details(release.get('id'))
        
        if movie_details:
            # Extract platform information
            platforms = []
            sources = movie_details.get('sources', [])
            for source in sources[:3]:  # Limit to first 3 platforms
                platforms.append(source.get('name', 'Unknown'))
            
            movie = {
                'title': movie_details.get('title', 'Unknown'),
                'image_url': movie_details.get('poster', ''),
                'release_date': movie_details.get('release_date', ''),
                'platforms': platforms if platforms else ['Not Available'],
                'year': movie_details.get('year', ''),
                'plot': movie_details.get('plot_overview', '')[:200] + '...' if movie_details.get('plot_overview') else ''
            }
            movies.append(movie)
    
    return movies

@app.route('/')
def index():
    """Main dashboard page"""
    return render_template('index.html')

@app.route('/api/movies')
def api_movies():
    """API endpoint to get movie data"""
    releases = get_streaming_releases()
    movies = format_movie_data(releases)
    return jsonify(movies)

@app.route('/api/search')
def api_search():
    """API endpoint to search movies"""
    query = request.args.get('q', '').strip()
    print("received query ---------------->")
    print(query)
    
    if not query:
        return jsonify({'error': 'Search query is required'}), 400
    
    search_results = search_movies(query)
    movies = format_movie_data(search_results)
    return jsonify(movies)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)


# TODO:
# add data from these
# https://yts.mx/api/v2/movie_details.json?imdb_id=31193180
# API doc https://github.com/BrokenEmpire/YTS/blob/master/API.md
# https://eztvx.to/api/get-torrents?imdb_id=13623126&limit=5

# https://torrent-api-py-nx0x.onrender.com/api/v1/search?site=limetorrent&query=avengers
# https://github.com/Ryuk-me/Torrent-Api-py?tab=readme-ov-file
# https://torrent-api-py-nx0x.onrender.com/api/v1/search?site=limetorrent&query=thunderbolts%20%282025%29%201080p%20x265&limit=2

# https://torrent-api-py-nx0x.onrender.com/api/v1/sites
# {
#   "supported_sites": [
#     "1337x",
#     "torlock",
#     "zooqle",
#     "magnetdl",
#     "tgx",
#     "nyaasi",
#     "piratebay",
#     "bitsearch",
#     "kickass",
#     "libgen",
#     "yts",
#     "limetorrent",
#     "torrentfunk",
#     "glodls",
#     "torrentproject",
#     "ybt"
#   ]
# }