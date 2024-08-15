document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');

    // Toggle mobile menu visibility
    menuToggle.addEventListener('click', function () {
        console.log('Toggle clicked');
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu
    closeMenu.addEventListener('click', function () {
        console.log('Close button clicked');
        mobileMenu.classList.add('hidden');
    });

    // Hide mobile menu if clicked outside
    document.addEventListener('click', function (event) {
        if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            console.log('Clicked outside');
            mobileMenu.classList.add('hidden');
        }
    });
});
