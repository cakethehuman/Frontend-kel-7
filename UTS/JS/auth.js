import { initDb } from './db.js';
import { login } from './login.js';
import { register } from './register.js';

$('#registerForm').on('submit', async function(e){
    e.preventDefault();

    const name = $('#Name').val();
    const email = $('#Email').val();
    const password = $('#Password').val();
    const confirmPassword = $('#confirmPassword').val();
    $("#result").remove();

    if(password !== confirmPassword){
        $(".result").html("<p class=text-danger id=result>Password tidak sama dengan confirm password</p>");

        setTimeout(function() {
            $("#result").remove();
        }, 3000);
        return;
    }

    const db = await initDb();
    const user = register(db, name, email, password);

    if (user){
        console.log("bisa");
        window.location.href = '/UTS/login.html';
    }
});

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
        $(".result").html("<p class=text-danger id=result>Email atau password kamu salah!</p>");
        
        setTimeout(function() {
            $("#result").remove();
        }, 3000);

    }
});


