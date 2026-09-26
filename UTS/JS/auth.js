import { initDb } from './db.js';
import { login } from './login.js';

$('#loginForm').on('submit', async function(e){
    e.preventDefault();
    const email = $('#Email').val();
    const password = $('#Password').val();
    $("#result").remove();

    const db = await initDb();
    const user = login(db, email, password);

    if (user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = '/UTS/main.html';
    } else {
        $(".result").append("<p class=text-danger id=result>Email atau password kamu salah!</p>");
        
        setTimeout(function() {
            $("#result").remove();
        }, 3000);

    }
});