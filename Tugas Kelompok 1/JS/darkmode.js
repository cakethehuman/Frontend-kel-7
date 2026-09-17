let darkmode = localStorage.getItem('darkmode');
let body = document.body;

const enableDarkmode = () => {
    body.classList.add('darkmode');
    localStorage.setItem('darkmode', 'active');
}

const disableDarkmode = () => {
    body.classList.remove('darkmode');
    localStorage.setItem('darkmode', 'inactive'); 
}
if (darkmode === "active") enableDarkmode();

document.addEventListener('click', (e) => {
    const themeSwitcher = e.target.closest('#theme-switcher');
    
    if (themeSwitcher) {
        console.log(darkmode);
        darkmode = localStorage.getItem('darkmode');
        
        if (darkmode !== "active") {
            console.log("Dark mode diaktifkan");
            enableDarkmode();
        } else {
            console.log("Dark mode dimatikan");
            disableDarkmode();
        }
    }
});