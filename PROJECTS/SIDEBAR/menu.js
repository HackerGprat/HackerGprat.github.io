// menu.js

const menuData = [
  { title: 'Home', link: '/' },
  { title: 'About', link: '/about' },
  {
    title: 'Services',
    link: '',
    subItems: [
      { title: 'Web Development', link: '/services/web' },
      { title: 'Mobile Apps', link: '/services/mobile' }
    ]
  },
  {
    title: 'Products',
    link: '',
    subItems: [
      {
        title: 'Hardware',
        link: '',
        subItems: [
          { title: 'Laptops', link: '/products/hardware/laptops' },
          { title: 'Desktops', link: '/products/hardware/desktops' }
        ]
      },
      { title: 'Software', link: '/products/software' }
    ]
  },
  { title: 'Contact', link: '/contact' }
];