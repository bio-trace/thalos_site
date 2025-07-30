document.addEventListener('DOMContentLoaded', function () {
  var navToggle = document.getElementById('menu-toggle');
  var navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('open');
    });
  }
});
