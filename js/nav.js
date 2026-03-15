(function () {
  // Detect if we're on index.html (or the root path)
  var path = window.location.pathname;
  var isIndex = path === '/' ||
    path === '' ||
    path.endsWith('/index.html');

  // Build anchor prefix: bare '#' on index, 'index.html#' elsewhere
  var prefix = isIndex ? '' : 'index.html';

  var navHTML = [
    '<nav class="main-nav">',
    '  <div class="nav-container">',
    '    <span class="nav-logo mobile-only">Daphne &amp; Conner</span>',
    '    <button class="nav-toggle" aria-label="Open menu">',
    '      <span class="hamburger"></span>',
    '      <span class="hamburger"></span>',
    '      <span class="hamburger"></span>',
    '    </button>',
    '    <ul class="nav-links">',
    '      <li><a href="' + prefix + '#home">Home</a></li>',
    '      <li><a href="' + prefix + '#schedule">Schedule</a></li>',
    '      <li><a href="' + prefix + '#location">Location</a></li>',
    '      <li><a href="' + prefix + '#accommodations">Accommodations</a></li>',
    '      <li><a href="' + prefix + '#excursions">Excursions</a></li>',
    '      <li><a href="' + prefix + '#faq">FAQ</a></li>',
    '      <li><a href="gallery.html">Gallery</a></li>',
    '      <li><a href="registry.html">Registry</a></li>',
    '    </ul>',
    '  </div>',
    '</nav>'
  ].join('\n');

  // Insert nav as the first child of <body>
  document.body.insertAdjacentHTML('afterbegin', navHTML);

  // Hamburger toggle
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('open');
    });
  }

  // Smooth scroll for anchor links (only meaningful on index, but harmless elsewhere)
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      // Only intercept pure hash links (the index page case)
      if (href.startsWith('#')) {
        e.preventDefault();
        if (href === '#home') {
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        } else {
          var target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
      }
    });
  });
})();
