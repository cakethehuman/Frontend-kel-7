fetch('../HTML/navbar.html')
    .then(reponse => reponse.text())
    .then(data => {
        document.getElementById('navbar-placeholder').innerHTML = data;
    }); 