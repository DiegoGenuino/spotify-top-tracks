const CLIENT_ID = '1c7d1de52668416fa79d21a4ecd4fa27';
const REDIRECT_URI = 'https://spotify-top-tracks-lemon.vercel.app/';

class SpotifyAPI {
    constructor() {
        this.accessToken = this.getAccessTokenFromURL();
        console.log('Access Token:', this.accessToken); // Adicione este log para verificar o token de acesso
    }

    login() {
        const scope = 'user-top-read';
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scope}`;
        window.location.href = authUrl;
    }

    logout() {
        this.accessToken = null;
        window.location.hash = '';
        window.location.reload();
    }

    getAccessTokenFromURL() {
        const hash = window.location.hash
            .substring(1)
            .split('&')
            .reduce((acc, item) => {
                const parts = item.split('=');
                acc[parts[0]] = decodeURIComponent(parts[1]);
                return acc;
            }, {});
        console.log('Hash:', hash); // Adicione este log para verificar o hash da URL
        return hash.access_token;
    }

    async getTopTracks() {
        try {
            const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=5', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Erro ao buscar músicas');

            const data = await response.json();
            return data.items.map(track => ({
                name: track.name,
                artist: track.artists[0].name,
                albumCover: track.album.images[0].url,
                duration: this.formatDuration(track.duration_ms),
                previewUrl: track.preview_url
            }));
        } catch (error) {
            console.error('Erro:', error);
            throw error;
        }
    }

    formatDuration(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds.padStart(2, '0')}`;
    }
}