let darkmode = localStorage.getItem('darkmode');


let body = document.body;
let h1 = document.querySelector('h1');
let h2 = document.querySelector('h2');
let form = document.querySelector('form');
let textarea = document.querySelector('textarea');
let result_box = document.querySelector('.result-box');
let table = document.querySelector('table');
let th = document.querySelector('th');
let td = document.querySelector('td');
let nav = document.querySelector('nav')
let nav_a = document.querySelectorAll('nav a');

const enableDarkmode = () => {
    body.classList.add('darkmode');
    
    if (h1) {
        h1.classList.add('darkmode');
    }
    if (form) {
        form.classList.add('darkmode');
    }
    if (h2) {
        h2.classList.add('darkmode');
    }
    if (th) {
        th.classList.add('darkmode');
    }
    if (td) {
        td.classList.add('darkmode');
    }
    if (textarea) {
        textarea.classList.add('darkmode');
    }
    if (result_box) {
        result_box.classList.add('darkmode');
    }
    if (table) {
        table.classList.add('darkmode');
    }

    if (nav) {
        nav.classList.add('darkmode');
    }
    if (nav_a) {
        nav_a.forEach(a => {
            a.classList.add('darkmode');
        });
    }
    localStorage.setItem('darkmode', 'active');
}

const disableDarkmode = () => {
    body.classList.remove('darkmode');
    if (h1) {
        h1.classList.remove('darkmode');
    }
    if (form) {
        form.classList.remove('darkmode');
    }
    if (h2) {
        h2.classList.remove('darkmode');
    }
    if (th) {
        th.classList.remove('darkmode');
    }
    if (td) {
        td.classList.remove('darkmode');
    }
    if (textarea) {
        textarea.classList.remove('darkmode');
    }
    if (result_box) {
        result_box.classList.remove('darkmode');
    }
    if (table) {
        table.classList.remove('darkmode');
    }

    if (nav) {
        nav.classList.remove('darkmode');
    }
    if (nav_a) {
        nav_a.forEach(a => {
            a.classList.remove('darkmode');
        });
    }
    localStorage.setItem('darkmode', null);
}

if (darkmode === "active") enableDarkmode();

document.addEventListener('navbarLoaded', () => {
    const themeSwitcher = document.getElementById('theme-switcher');
    themeSwitcher.addEventListener("click", () => {

        console.log(darkmode);
        darkmode  = localStorage.getItem('darkmode');
        if (darkmode !== "active") {
            console.log("Dark mode tidak aktif");
            enableDarkmode();
        }
        else {
            console.log("Dark mode matiin");
            disableDarkmode();
        }
    });
});
