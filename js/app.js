/* ==========================================
    CUTVERSE - Frontend JS
    Spin for Cute • Random • Fun ✨
========================================== */

/**
 * CONFIGURATION
 * Adjust the API URL for your backend deployment
 */
const CONFIG = {
    // Change this URL when deploying backend to remote server
    API_URL: window.CUTVERSE_API_URL || 'http://localhost:8000/api/random',
    // Fallback APIs if backend is not available
    FALLBACK_APIS: [
        'https://cataas.com/c?json',
        'https://api.thecatapi.com/v1/images/search?limit=1',
        'https://dog.ceo/api/breeds/image/random',
        'https://randomfox.ca/floof/?json',
        'https://random-d.uk/api/random',
        'https://shibe.online/api/shibes?count=1',
        'https://api.api-ninjas.com/v1/riddles?limit=1',
    ]
};

/**
 * DOM ELEMENTS
 */
const elements = {
    girarBtn: document.getElementById('btn-girar'),
    mediaContainer: document.getElementById('media-container'),
    loadingText: document.getElementById('loading-text'),
    contentLabel: document.getElementById('content-label'),
    contentSource: document.getElementById('content-source'),
    kawaiContainer: document.querySelector('.kawaii-container'),
};

/**
 * STATE MANAGEMENT
 */
let isLoading = false;
let lastContent = null;

/**
 * INITIALIZE APP
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎀 CutVerse initialized!');
    initializeEventListeners();
    createFloatingElements();
    console.log(`📡 API URL: ${CONFIG.API_URL}`);
});

/**
 * EVENT LISTENERS
 */
function initializeEventListeners() {
    if (elements.girarBtn) {
        elements.girarBtn.addEventListener('click', () => spinForContent());
        elements.girarBtn.addEventListener('mouseenter', () => {
            elements.girarBtn.style.transform = 'scale(1.05) rotate(2deg)';
        });
        elements.girarBtn.addEventListener('mouseleave', () => {
            elements.girarBtn.style.transform = 'scale(1) rotate(0deg)';
        });
    }
}

/**
 * SPIN FOR CONTENT
 * Main action triggered by the button
 */
async function spinForContent() {
    if (isLoading) return;

    isLoading = true;
    showLoading();
    resetDisplay();
    playSpinAnimation();

    try {
        const content = await fetchRandomContent();
        displayContent(content);
    } catch (error) {
        console.error('❌ Error fetching content:', error);
        showError('Oops! Algo deu errado. Tente novamente! 🎲');
    } finally {
        isLoading = false;
        hideLoading();
    }
}

/**
 * FETCH RANDOM CONTENT FROM BACKEND OR FALLBACK
 */
async function fetchRandomContent() {
    try {
        // Try primary backend first
        const response = await fetch(CONFIG.API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Content fetched from backend:', data);
        return data;

    } catch (primaryError) {
        console.warn('⚠️ Backend unavailable, using fallback APIs:', primaryError.message);
        return await fetchFallbackContent();
    }
}

/**
 * FALLBACK - USE PUBLIC APIs DIRECTLY
 */
async function fetchFallbackContent() {
    const randomIndex = Math.floor(Math.random() * CONFIG.FALLBACK_APIS.length);
    const selectedAPI = CONFIG.FALLBACK_APIS[randomIndex];

    try {
        const response = await fetch(selectedAPI);
        const data = await response.json();

        // Parse different API response formats
        return parseFallbackResponse(data, selectedAPI);
    } catch (error) {
        console.error('❌ Fallback API failed:', error);
        throw new Error('All APIs failed. Check your connection.');
    }
}

/**
 * PARSE DIFFERENT API RESPONSE FORMATS
 */
function parseFallbackResponse(data, apiUrl) {
    // CATAAS
    if (apiUrl.includes('cataas')) {
        return {
            media_url: `https://cataas.com${data.url}`,
            source: '🐱 CATAAS',
            type: 'image'
        };
    }

    // The Cat API
    if (apiUrl.includes('thecatapi')) {
        return {
            media_url: data[0]?.url || data.url,
            source: '🐱 The Cat API',
            type: 'image'
        };
    }

    // Dog CEO
    if (apiUrl.includes('dog.ceo')) {
        return {
            media_url: data.message,
            source: '🐕 Dog API',
            type: 'image'
        };
    }

    // Random Fox
    if (apiUrl.includes('randomfox')) {
        return {
            media_url: data.image,
            source: '🦊 Random Fox',
            type: 'image'
        };
    }

    // Random Duck
    if (apiUrl.includes('random-d.uk')) {
        return {
            media_url: data.url,
            source: '🦆 Random Duck',
            type: 'image'
        };
    }

    // Shibe Online
    if (apiUrl.includes('shibe.online')) {
        return {
            media_url: data[0],
            source: '🐕 Shibe Online',
            type: 'image'
        };
    }

    // Default fallback
    return {
        media_url: data.url || data.image || data.message,
        source: '🎲 Random Content',
        type: 'image'
    };
}

/**
 * DISPLAY CONTENT ON PAGE
 */
function displayContent(content) {
    if (!content || !content.media_url) {
        showError('Nenhuma mídia encontrada. Tente novamente! 🎲');
        return;
    }

    lastContent = content;

    // Update labels
    if (elements.contentLabel) {
        elements.contentLabel.textContent = content.label || '✨ Algo fofo apareceu!';
    }
    if (elements.contentSource) {
        elements.contentSource.textContent = content.source || 'CutVerse V1';
    }

    // Determine media type
    const mediaType = content.type || (content.media_url.includes('.gif') ? 'gif' : 'image');

    // Create and display media element
    if (elements.mediaContainer) {
        elements.mediaContainer.innerHTML = '';

        if (mediaType === 'video') {
            const video = document.createElement('video');
            video.src = content.media_url;
            video.autoplay = true;
            video.controls = true;
            video.onload = () => playAppearAnimation(video);
            elements.mediaContainer.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = content.media_url;
            img.alt = content.label || 'Random cute content';
            img.onload = () => playAppearAnimation(img);
            img.onerror = () => {
                showError('Erro ao carregar a imagem. Tente outra! 🎲');
            };
            elements.mediaContainer.appendChild(img);
        }

        // Play container animation
        const container = document.getElementById('resultado-box');
        if (container) {
            container.style.animation = 'none';
            setTimeout(() => {
                container.style.animation = 'pulseHeart 0.6s ease-out';
            }, 10);
        }
    }
}

/**
 * SHOW LOADING STATE
 */
function showLoading() {
    if (elements.loadingText) {
        elements.loadingText.classList.remove('hidden');
    }
    if (elements.mediaContainer) {
        elements.mediaContainer.innerHTML = '<p class="placeholder-text">Buscando fofuras...</p>';
    }
}

/**
 * HIDE LOADING STATE
 */
function hideLoading() {
    if (elements.loadingText) {
        elements.loadingText.classList.add('hidden');
    }
}

/**
 * RESET DISPLAY
 */
function resetDisplay() {
    if (elements.mediaContainer) {
        elements.mediaContainer.innerHTML = '<p class="placeholder-text">Sua surpresa aparece aqui.</p>';
    }
}

/**
 * SHOW ERROR MESSAGE
 */
function showError(message) {
    if (elements.mediaContainer) {
        elements.mediaContainer.innerHTML = `
            <div style="text-align: center; color: var(--text);">
                <p style="font-size: 3rem; margin-bottom: 12px;">😿</p>
                <p style="font-weight: 600;">${message}</p>
            </div>
        `;
    }
}

/**
 * PLAY SPIN ANIMATION ON BUTTON
 */
function playSpinAnimation() {
    if (elements.girarBtn) {
        elements.girarBtn.style.animation = 'none';
        setTimeout(() => {
            elements.girarBtn.style.animation = 'spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        }, 10);
    }
}

/**
 * PLAY APPEAR ANIMATION
 */
function playAppearAnimation(element) {
    element.style.animation = 'none';
    setTimeout(() => {
        element.style.animation = 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }, 10);
}

/**
 * CREATE FLOATING DECORATIVE ELEMENTS
 */
function createFloatingElements() {
    const cat = document.createElement('div');
    cat.className = 'floating-rainbow-cat';
    cat.style.position = 'fixed';
    cat.style.top = '24px';
    cat.style.left = '24px';
    cat.style.zIndex = '9999';
    cat.style.width = '140px';
    cat.style.background = 'transparent';
    cat.style.border = 'none';
    cat.style.pointerEvents = 'none';
    cat.style.userSelect = 'none';
    cat.style.willChange = 'transform';
    cat.style.transition = 'filter 0.3s ease';
    cat.innerHTML = `
        <div class="tenor-gif-embed" data-postid="15365300" data-share-method="host" data-aspect-ratio="2.19178" data-width="100%" style="background: transparent !important; border: none !important; box-shadow: none !important;">
            <a href="https://tenor.com/view/neon-cat-cat-rainbow-gif-15365300">Neon Cat Cat Sticker</a>
            from <a href="https://tenor.com/search/neon+cat-stickers">Neon Cat Stickers</a>
        </div>
    `;
    document.body.appendChild(cat);

    loadTenorEmbed();
    startFloatingCatPhysics(cat);

    // Create sparkles around container
    if (elements.kawaiContainer) {
        for (let i = 0; i < 3; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle-decor';
            sparkle.innerHTML = '✨';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.animationDelay = i * 0.5 + 's';
            elements.kawaiContainer.appendChild(sparkle);
        }
    }
}

function loadTenorEmbed() {
    if (window.TenorEmbed && typeof window.TenorEmbed.load === 'function') {
        window.TenorEmbed.load();
    } else {
        setTimeout(loadTenorEmbed, 200);
    }
}

function startFloatingCatPhysics(catEl) {
    const state = {
        x: 20,
        y: 20,
        vx: 3.2,
        vy: 2.6,
        width: 0,
        height: 0,
    };

    const padding = 12;

    function updateDimensions() {
        const rect = catEl.getBoundingClientRect();
        state.width = rect.width;
        state.height = rect.height;
    }

    function animate() {
        state.x += state.vx;
        state.y += state.vy;

        const maxX = window.innerWidth - state.width - padding;
        const maxY = window.innerHeight - state.height - padding;
        let bounced = false;

        if (state.x <= padding) {
            state.x = padding;
            state.vx = Math.abs(state.vx);
            bounced = true;
        }
        if (state.x >= maxX) {
            state.x = maxX;
            state.vx = -Math.abs(state.vx);
            bounced = true;
        }
        if (state.y <= padding) {
            state.y = padding;
            state.vy = Math.abs(state.vy);
            bounced = true;
        }
        if (state.y >= maxY) {
            state.y = maxY;
            state.vy = -Math.abs(state.vy);
            bounced = true;
        }

        const rotation = (state.vx + state.vy) * 7;
        const scale = bounced ? 1.05 : 1;
        catEl.style.transform = `translate(${state.x}px, ${state.y}px) rotate(${rotation}deg) scale(${scale})`;

        requestAnimationFrame(animate);
    }

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    requestAnimationFrame(animate);
}

/**
 * ADD SPIN ANIMATION TO CSS DYNAMICALLY
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(1.1); }
        100% { transform: rotate(360deg) scale(1); }
    }
    
    @keyframes popIn {
        0% {
            opacity: 0;
            transform: scale(0.3) rotate(-10deg);
        }
        70% {
            opacity: 1;
            transform: scale(1.1) rotate(5deg);
        }
        100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
        }
    }

    .floating-rainbow-cat,
    .floating-rainbow-cat * {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
    }

    @keyframes rainbowGlow {
        0% { filter: drop-shadow(0 0 10px rgba(255, 120, 220, 0.8)); }
        100% { filter: drop-shadow(0 0 22px rgba(120, 220, 255, 0.95)); }
    }
`;
document.head.appendChild(style);

/* ==========================================
    EXPORT FUNCTIONS (for testing)
========================================== */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        spinForContent,
        fetchRandomContent,
        displayContent,
        CONFIG
    };
}

console.log('🎀 CutVerse v1.0 - Cute • Random • Fun ✨');
