// Configuração da API
const API_BASE_URL = '/api';

// Elementos do DOM
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const moviesContainer = document.getElementById('moviesContainer');
const addMovieBtn = document.getElementById('addMovieBtn');
const movieModal = document.getElementById('movieModal');
const closeModal = document.querySelector('.close');
const movieForm = document.getElementById('movieForm');

// Função para mostrar notificações
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Função para mostrar confirmação
function showConfirm(message) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'confirm-modal';
        modal.innerHTML = `
            <div class="confirm-content">
                <h3>${message}</h3>
                <div class="confirm-buttons">
                    <button class="confirm-btn confirm-yes">Sim</button>
                    <button class="confirm-btn confirm-no">Não</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
        
        modal.querySelector('.confirm-yes').onclick = () => {
            document.body.removeChild(modal);
            resolve(true);
        };
        
        modal.querySelector('.confirm-no').onclick = () => {
            document.body.removeChild(modal);
            resolve(false);
        };
    });
}

// Função para fazer requisições à API
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Erro na requisição');
        }
        
        return data;
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
}

// Função para criar um card de filme
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.dataset.movieId = movie.id;
    
    card.innerHTML = `
        <button class="delete-btn" onclick="deleteMovie(${movie.id})" title="Excluir filme">×</button>
        <div class="movie-poster">
            <img src="${movie.poster}" alt="${movie.title}" 
                 onerror="this.style.display='none'; this.parentElement.innerHTML='Sem Imagem';"
                 style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <p class="movie-year">${movie.year} • ${movie.genre}</p>
            <p class="movie-duration">${movie.duration} min • ${movie.ageRating}</p>
        </div>
        <div class="movie-description"><strong>Sinopse:</strong> ${movie.description || ''}</div>
    `;
    
    return card;
}

// Função para renderizar filmes
function renderMovies(movies) {
    moviesContainer.innerHTML = '';
    
    if (!movies || movies.length === 0) {
        moviesContainer.innerHTML = '<div class="loading">Nenhum filme encontrado</div>';
        return;
    }
    
    movies.forEach(movie => {
        const card = createMovieCard(movie);
        moviesContainer.appendChild(card);
    });
}

// Função para buscar todos os filmes
async function fetchMovies(searchTerm = '') {
    try {
        moviesContainer.innerHTML = '<div class="loading">Carregando filmes...</div>';
        
        const response = await apiRequest('/movies');
        let movies = response.data || [];
        
        // Filtrar filmes se houver termo de busca
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            movies = movies.filter(movie => {
                const title = (movie.title || '').toLowerCase();
                const description = (movie.description || '').toLowerCase();
                const genre = (movie.genre || '').toLowerCase();
                
                return title.includes(searchLower) || 
                       description.includes(searchLower) || 
                       genre.includes(searchLower);
            });
        }
        
        renderMovies(movies);
        
    } catch (error) {
        console.error('Erro ao buscar filmes:', error);
        moviesContainer.innerHTML = '<div class="loading">Erro ao carregar filmes. Verifique se o servidor está rodando.</div>';
    }
}

// Função para adicionar filme
async function addMovie(movieData) {
    try {
        await apiRequest('/movies', {
            method: 'POST',
            body: JSON.stringify(movieData)
        });
        
        // Recarregar lista de filmes
        await fetchMovies();
        
        // Fechar modal
        movieModal.style.display = 'none';
        movieForm.reset();
        
        showNotification('Filme adicionado com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao adicionar filme:', error);
        showNotification('Erro ao adicionar filme: ' + error.message, 'error');
    }
}

// Função para deletar filme
async function deleteMovie(movieId) {
    const confirmed = await showConfirm('Tem certeza que deseja excluir este filme?');
    if (!confirmed) {
        return;
    }
    
    try {
        await apiRequest(`/movies/${movieId}`, {
            method: 'DELETE'
        });
        
        // Remover card do DOM
        const movieCard = document.querySelector(`[data-movie-id="${movieId}"]`);
        if (movieCard) {
            movieCard.remove();
        }
        
        showNotification('Filme excluído com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao deletar filme:', error);
        showNotification('Erro ao excluir filme: ' + error.message, 'error');
    }
}

// Função para realizar busca
async function performSearch() {
    const searchTerm = searchInput.value.trim();
    await fetchMovies(searchTerm);
}

// Event Listeners
searchBtn.addEventListener('click', performSearch);

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Modal events
addMovieBtn.addEventListener('click', () => {
    movieModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    movieModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === movieModal) {
        movieModal.style.display = 'none';
    }
});

// Form submit
movieForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(movieForm);
    const movieData = {
        title: formData.get('title') || document.getElementById('title').value,
        description: formData.get('description') || document.getElementById('description').value,
        year: parseInt(formData.get('year') || document.getElementById('year').value),
        genre: formData.get('genre') || document.getElementById('genre').value,
        duration: parseInt(formData.get('duration') || document.getElementById('duration').value),
        ageRating: formData.get('ageRating') || document.getElementById('ageRating').value,
        poster: formData.get('poster') || document.getElementById('poster').value
    };
    
    // Validar dados
    if (!movieData.title || !movieData.description || !movieData.year || 
        !movieData.genre || !movieData.duration || !movieData.ageRating || !movieData.poster) {
        showNotification('Por favor, preencha todos os campos', 'error');
        return;
    }
    
    await addMovie(movieData);
});

// Carregar filmes ao inicializar a página
document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();
});

// Tornar deleteMovie global para ser chamada pelo onclick
window.deleteMovie = deleteMovie;