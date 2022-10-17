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


/* ===== QUALIFICATION TABS ==== */
const tabs = document.querySelectorAll('[data-target]'),
      tabContents = document.querySelectorAll('[data-content]')

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.target)

        tabContents.forEach( tabContent => {
            tabContent.classList.remove('qualification__active')
        })

        target.classList.add('qualification__active');

        tabs.forEach( tab=> {
            tab.classList.remove('qualification__active')
        })

        tab.classList.add('qualification__active')
    })
})


/* ===== SERVICES MODAL ==== */
const modal_views = document.querySelectorAll('.services__modal'),
      modal_btns = document.querySelectorAll('.services__button'),
      modal_closes = document.querySelectorAll('.services__modal-close');


// Whenever click on any modal, it will add a class "active-modal" in "services__modal", its css property already described in css
let modal = function( modalClick ){
    modal_views[ modalClick ].classList.add("active-modal");
};

// click on any "services__button" it will add "active-modal" class on it
modal_btns.forEach( (modal_btn, i) =>  {
    modal_btn.addEventListener('click', ()=>{
        modal(i);
    })
})

modal_closes.forEach( (modal_close) => {    
    modal_close.addEventListener('click', ()=> {    
        
            modal_views.forEach( (modal_view) => {  
                modal_view.classList.remove('active-modal');
            })
 
        })
})



/* ===== PORTFOLIO SWIPER ==== */
// copied from https://swiperjs.com/demos 
var swiperPortfolio = new Swiper(".portfolio__container", {
    // slidesPerView: 1,
    // spaceBetween: 30,
    grabCursor:true,
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    // mousewheel:true,
    keyboard:true,
});



/* ===== TESTIMONIAL ==== */
// https://codesandbox.io/s/hoyjrj?file=/index.html:2000-2037
var swiperTestimonial = new Swiper(".testimonial__container", {
    grabCursor:true,
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets:true,
    },
    // mousewheel:true,
    keyboard:true,
});

/* ===== SCROLL SECTIONS ACTIVE LINK ==== */
/* ===== CHANGE BACKGROUND HEADER ==== */
/* ===== SHOW SCROLL TOP ==== */
/* ===== DARK LIGHT THEME ==== */


