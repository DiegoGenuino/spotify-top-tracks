class SpotifyApp {
    constructor() {
        this.api = new SpotifyAPI();
        this.tracksContainer = document.getElementById('tracks-container');
        this.loginButton = document.getElementById('login-button');
        this.logoutButton = document.getElementById('logout-button');
        this.loadingElement = document.createElement('div');
        this.loadingElement.className = 'loading';
        this.loadingElement.textContent = 'Carregando...';
        
        this.init();
    }

    init() {
        if (this.loginButton) {
            this.loginButton.addEventListener('click', () => this.api.login());
        }

        if (this.logoutButton) {
            this.logoutButton.addEventListener('click', () => this.api.logout());
        }

        if (this.api.accessToken) {
            this.loadTopTracks();
            this.showLogoutButton();
        } else {
            this.showLoginButton();
        }
    }

    async loadTopTracks() {
        try {
            this.showLoading();
            const tracks = await this.api.getTopTracks();
            this.displayTracks(tracks);
        } catch (error) {
            this.showError('Erro ao carregar músicas. Por favor, faça login novamente.');
        } finally {
            this.hideLoading();
        }
    }

    displayTracks(tracks) {
        this.tracksContainer.innerHTML = '';
        
        tracks.forEach((track, index) => {
            const trackElement = this.createTrackElement(track, index + 1);
            this.tracksContainer.appendChild(trackElement);
            animateElement(trackElement, 'slide-in', index * 200);
        });
    }

    createTrackElement(track, position) {
        const element = document.createElement('div');
        element.className = 'track-item';
        element.innerHTML = `
            <span class="position">${position}</span>
            <img class="album-cover" src="${track.albumCover}" alt="${track.name}">
            <div class="track-info">
                <h3 class="track-title">${track.name}</h3>
                <p class="track-artist">${track.artist}</p>
                <p class="track-duration">${track.duration}</p>
            </div>
            ${track.previewUrl ? `<audio controls src="${track.previewUrl}"></audio>` : ''}
        `;
        return element;
    }

    showLoading() {
        this.tracksContainer.appendChild(this.loadingElement);
    }

    hideLoading() {
        if (this.loadingElement.parentNode) {
            this.loadingElement.parentNode.removeChild(this.loadingElement);
        }
    }

    showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        this.tracksContainer.appendChild(errorElement);
    }

    showLoginButton() {
        this.loginButton.style.display = 'block';
        this.logoutButton.style.display = 'none';
    }

    showLogoutButton() {
        this.loginButton.style.display = 'none';
        this.logoutButton.style.display = 'block';
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new SpotifyApp();
});