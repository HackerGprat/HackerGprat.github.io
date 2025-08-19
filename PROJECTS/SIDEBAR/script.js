// script.js
document.addEventListener('DOMContentLoaded', () => {
  const sidebar   = document.getElementById('sidebar');
  const content   = document.getElementById('content');
  const hamburger = document.getElementById('hamburger');
  const menuRoot  = document.getElementById('menu');

  // toggle entire sidebar
  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('show');
    content.classList.toggle('shift');
  });

  // recursive menu builder
  function createMenuItems(items, parentNav) {
    items.forEach(item => {
      const link = document.createElement('a');
      link.textContent = item.title;
      link.href        = item.link || '#';
      link.className   = 'nav-link';
      parentNav.appendChild(link);

      // if this item has children, build a hidden submenu
      if (item.subItems && item.subItems.length) {
        link.classList.add('has-submenu');
        const subNav = document.createElement('nav');
        subNav.className = 'nav flex-column ms-3 submenu';
        parentNav.appendChild(subNav);

        // toggle submenu on click
        link.addEventListener('click', e => {
          e.preventDefault();
          subNav.classList.toggle('show');
          link.classList.toggle('active');
        });

        createMenuItems(item.subItems, subNav);
      }
    });
  }

  // assume menuData is defined in menu.js
  createMenuItems(menuData, menuRoot);
});