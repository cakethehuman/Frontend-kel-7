import { initDb } from './db.js';
import { login } from './login.js';
import { register } from './register.js';

$('#registerForm').on('submit', async function(e){
    e.preventDefault();

    const name = $('#Name').val();
    const email = $('#Email').val();
    const password = $('#Password').val();

    const db = await initDb();
    const user = register(db, name, email, password);
    console.log('ea')

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
    const test = db.exec(`select * from users`);
    console.log(test[0].values)
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


