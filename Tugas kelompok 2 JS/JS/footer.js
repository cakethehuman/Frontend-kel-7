fetch('../HTML/footer.html')
    .then(reponse => reponse.text())
    .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
    }); 