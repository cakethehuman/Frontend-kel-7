import { initDb } from './db.js';
import { login } from './login.js';

$('#loginForm').on('submit', async function(e){
    e.preventDefault();
    const email = $('#Email').val();
    const password = $('#Password').val();

    const db = await initDb();
    const user = login(db, email, password);

    if (user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = '/UTS/main.html';
    } else {
        alert('Invalid email or password');
    }
});