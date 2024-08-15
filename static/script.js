// Toggle mobile menu visibility
document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.toggle('hidden');
});

document.getElementById('closeMenu').addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.add('hidden');
});

// URL validation and error handling
document.getElementById('profile_url').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    if (query === '') {
        clearError();
    } else if (validateURL(query)) {
        clearError();
    } else {
        showError('Invalid URL format. Please enter a valid Cloud Skills Boost URL.');
    }
});

function validateURL(url) {
    const regex = /^https:\/\/www\.cloudskillsboost\.google\/public_profiles\/[a-f0-9-]+$/;
    return regex.test(url);
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function clearError() {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = '';
    errorDiv.classList.add('hidden');
}
