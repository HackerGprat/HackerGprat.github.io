// ================ SHOW MENU ================
const nav_menu = document.getElementById('nav-menu'),
      nav_toggle = document.getElementById('nav-toggle'),
      nav_close = document.getElementById('nav-close');

// validate if constant exists
// show if, click on show menu
if( nav_toggle ){
    nav_toggle.addEventListener('click', ()=>{
        nav_menu.classList.add('show-menu');
    })
}

// hide menu , if click on "nav close"
if ( nav_close ){
    nav_close.addEventListener('click', ()=>{
        nav_menu.classList.remove('show-menu');
    })
}

// ================ REMOVE MENU MOBILE ================
const nav_link = document.querySelectorAll('.nav__link');

const F_link_action = () => {
    const nav_menu = document.getElementById('nav-menu');

    // When we click on each nav__link, we remove the show-menu
    nav_menu.classList.remove('show-menu');
}
nav_link.forEach( n => n.addEventListener('click', F_link_action ) );


// ================ CHANGE BACKGROUND HEADER ================
const F_scroll_header = () => {
    const header = document.getElementById('header');

    // when the scroll is greater than 50 viewport height, add the scroll-header class
    this.scrollY >= 50 ? header.classList.add('header-bg')
                        : header.classList.remove('header-bg');
}
window.addEventListener( 'scroll', F_scroll_header );


// ================ SCROLL REVEAL ANIMATION ================
// GO TO SCROLLREVEALJS.ORG
const sr = ScrollReveal({
    origin: 'bottom',
    distance: '60px',
    duration: 2500,
})

sr.reveal( `.home__images`, {distance: '120px', delay: 400});
sr.reveal( `.home__title`, {delay: 1000});
sr.reveal( `.home__description`, {delay: 1200});
sr.reveal( `.home__button`, {delay: 1400});
sr.reveal( `.home__footer`, {delay: 1600});
sr.reveal( `.home__data div`, {origin: 'right', interval: 100, delay: 1800});


// ================ SHOW MENU ================
