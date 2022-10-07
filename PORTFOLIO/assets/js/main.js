/* ===== MENU SHOW Y HIDDEN ===== */
const nav_menu = document.getElementById('nav-menu'),
      nav_toggle = document.getElementById('nav-toggle'),
      nav_close = document.getElementById('nav-close');


/* ===== MENU SHOW ===== */
/* ===== VALIDATE IF CONSTANT EXISTS ===== */
if(nav_toggle){
    nav_toggle.addEventListener('click', ()=> {
        nav_menu.classList.add('show-menu')     // adding .show-menu in nav-menu of html, css of .show-menu alread described, that's why show hide is working
    })
}

/* ===== MENU hidden ===== */
/* ===== VALIDATE IF CONSTANT EXISTS ===== */
if(nav_close){
    nav_close.addEventListener('click', ()=> {
        nav_menu.classList.remove('show-menu')     // removing .show-menu from nav-menu of html, css of .show-menu alread described, but will not effect because not set in html
    })    
}


/* ===== REMOVE MENU MOBILE ==== */
const nav_link = document.querySelectorAll('.nav__link')    // automatically close the menu if click on links

function linkAction(){
    // const navm = document.getElementById('nav-menu');
    nav_menu.classList.remove('show-menu'); // when we click on each nav_link, we remove the show menu class
}
nav_link.forEach( n=> n.addEventListener('click', linkAction) );






/* ===== ACCORDION SKILLS ==== */
const skills_content = document.getElementsByClassName("skills__content"),
      skills_header = document.querySelectorAll(".skills__header");

function toggleSkills(){
    let items_class = this.parentNode.className ;

    for ( i=0 ; i < skills_content.length; i++ ){
        skills_content[i].className = 'skills__content skills__close';
    }
    if ( items_class === 'skills__content skills__close'){
        this.parentNode.className = "skills__content skills__open";
    }
}

skills_header.forEach( (el)=> {
    el.addEventListener('click', toggleSkills)
});