// Browser History Management
class BrowserHistory {
    constructor() {
        this.history = [];
        this.currentIndex = -1;
    }

    push(url) {
        // Remove forward history if we're not at the end
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }
        this.history.push(url);
        this.currentIndex++;
    }

    back() {
        if (this.canGoBack()) {
            this.currentIndex--;
            return this.history[this.currentIndex];
        }
        return null;
    }

    forward() {
        if (this.canGoForward()) {
            this.currentIndex++;
            return this.history[this.currentIndex];
        }
        return null;
    }

    canGoBack() {
        return this.currentIndex > 0;
    }

    canGoForward() {
        return this.currentIndex < this.history.length - 1;
    }

    getCurrentUrl() {
        if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
            return this.history[this.currentIndex];
        }
        return null;
    }
}

// Initialize
const history = new BrowserHistory();
const addressBar = document.getElementById('addressBar');
const contentFrame = document.getElementById('contentFrame');
const backBtn = document.getElementById('backBtn');
const forwardBtn = document.getElementById('forwardBtn');
const refreshBtn = document.getElementById('refreshBtn');
const goBtn = document.getElementById('goBtn');
const statusText = document.getElementById('statusText');
const errorMessage = document.getElementById('errorMessage');

// Navigate to URL
function navigateToUrl(url) {
    // Validate and format URL
    if (!url.trim()) {
        showError('Please enter a URL');
        return;
    }

    // Add protocol if missing
    if (!url.match(/^https?:\/\//)) {
        url = 'https://' + url;
    }

    // Try to load the URL
    try {
        contentFrame.src = url;
        history.push(url);
        addressBar.value = url;
        updateNavigationButtons();
        statusText.textContent = 'Loading...';
        hideError();
    } catch (error) {
        showError('Failed to load URL: ' + error.message);
    }
}

// Update navigation button states
function updateNavigationButtons() {
    backBtn.disabled = !history.canGoBack();
    forwardBtn.disabled = !history.canGoForward();
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

// Hide error message
function hideError() {
    errorMessage.classList.remove('show');
}

// Back button click
backBtn.addEventListener('click', () => {
    const url = history.back();
    if (url) {
        contentFrame.src = url;
        addressBar.value = url;
        updateNavigationButtons();
        hideError();
    }
});

// Forward button click
forwardBtn.addEventListener('click', () => {
    const url = history.forward();
    if (url) {
        contentFrame.src = url;
        addressBar.value = url;
        updateNavigationButtons();
        hideError();
    }
});

// Refresh button click
refreshBtn.addEventListener('click', () => {
    contentFrame.src = contentFrame.src;
    statusText.textContent = 'Reloading...';
    hideError();
});

// Go button click
goBtn.addEventListener('click', () => {
    navigateToUrl(addressBar.value);
});

// Enter key in address bar
addressBar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        navigateToUrl(addressBar.value);
    }
});

// Handle iframe load events
contentFrame.addEventListener('load', () => {
    statusText.textContent = 'Done';
    try {
        // Try to get the page title
        const frameTitle = contentFrame.contentDocument?.title;
        if (frameTitle) {
            document.title = frameTitle + ' - Simple Browser';
        }
    } catch (error) {
        // Cross-origin restriction - can't access title
    }
});

contentFrame.addEventListener('error', () => {
    statusText.textContent = 'Error loading page';
    showError('Failed to load the page. This may be due to CORS restrictions or an invalid URL.');
});

// Initialize with example
navigateToUrl('https://example.com');
