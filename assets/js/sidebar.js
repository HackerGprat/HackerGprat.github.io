// =============== SHOW MENU ===============
const show_menu = (headerToggle, navbarId) => {
    const toggleBtn = document.getElementById(headerToggle),
          nav = document.getElementById(navbarId);
    
    // if both existed
    if ( headerToggle && navbarId ){
        toggleBtn.addEventListener('click', ()=>{
            // add show-menu class to the div tag with the nav__menu class
            nav.classList.toggle('show-menu');

            // change icon
            toggleBtn.classList.toggle('bx-x');
        })
    }
}
show_menu('header-toggle', 'navbar');


// =============== LINK ACTIVE ===============
const all_links = document.querySelectorAll('.nav__link');

function F_color_link(){
    all_links.forEach( l => l.classList.remove('active') )
    this.classList.add('active');
}

all_links.forEach( l => l.addEventListener('click', F_color_link ) );

// =============== SHOW MENU ===============
// =============== SHOW MENU ===============