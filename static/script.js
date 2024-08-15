document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');
    const profileForm = document.getElementById('profileForm');
    const profileUrlInput = document.getElementById('profileUrl');
    const validationMessage = document.getElementById('validationMessage');

    // Toggle mobile menu visibility
    menuToggle.addEventListener('click', function () {
        mobileMenu.classList.toggle('show');
    });

    // Close mobile menu
    closeMenu.addEventListener('click', function () {
        mobileMenu.classList.remove('show');
    });

    // Hide mobile menu if clicked outside
    document.addEventListener('click', function (event) {
        if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            mobileMenu.classList.remove('show');
        }
    });

    // Validate public profile URL
    profileForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const profileUrl = profileUrlInput.value.trim();
        if (isValidPublicProfileUrl(profileUrl)) {
            validationMessage.textContent = 'Valid URL!';
            validationMessage.style.color = 'green';
        } else {
            validationMessage.textContent = 'Invalid URL. Please enter a valid public profile URL.';
            validationMessage.style.color = 'red';
        }
    });

    // Function to validate the public profile URL
    function isValidPublicProfileUrl(url) {
        const regex = /^https:\/\/www\.cloudskillsboost\.google\/public_profiles\/[a-f0-9-]+$/;
        return regex.test(url);
    }
});
