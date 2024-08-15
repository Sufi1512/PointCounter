// script.js

document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');

    // Toggle mobile menu visibility
    menuToggle.addEventListener('click', function () {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu
    closeMenu.addEventListener('click', function () {
        mobileMenu.classList.add('hidden');
    });

    // Hide mobile menu if clicked outside
    document.addEventListener('click', function (event) {
        if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
});
