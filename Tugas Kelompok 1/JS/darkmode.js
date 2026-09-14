let darkmode = localStorage.getItem('darkmode');

let body = document.body;

const enableDarkmode = () => {
    body.classList.add('darkmode');
    localStorage.setItem('darkmode', 'active');
}

const disableDarkmode = () => {
    body.classList.remove('darkmode');
    
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
