let prism = document.querySelector(".rec-prism");

function showSignup() {
    prism.style.transform = "translateZ(-100px) rotateY(-90deg)";
}

function showLogin() {
    prism.style.transform = "translateZ(-100px)";
}

function showForgotPassword() {
    prism.style.transform = "translateZ(-100px) rotateY(-180deg)";
}

function showSubscribe() {
    prism.style.transform = "translateZ(-100px) rotateX(-90deg)";
}

function showContactUs() {
    prism.style.transform = "translateZ(-100px) rotateY(90deg)";
}

function showThankYou() {
    prism.style.transform = "translateZ(-100px) rotateX(90deg)";
}

// Handle Sign Up
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('signup-email').value;
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const password2 = document.getElementById('signup-password2').value;

    const response = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password, password2 })
    });

    const data = await response.json();
    alert(data.message);
});

// Handle Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    alert(data.message);

    // If login is successful, redirect to books page
    if (data.message === 'Login successful') {
        window.location.href = '/front_end/main/books.html'; // Redirect to books page
    }
});

// Handle Forgot Password
document.getElementById('forgot-password-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('forgot-email').value;

    const response = await fetch('http://127.0.0.1:5000/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });

    const data = await response.json();
    alert(data.message);
});

// Handle Subscribe
document.getElementById('subscribe-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('subscribe-email').value;

    const response = await fetch('http://127.0.0.1:5000/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });

    const data = await response.json();
    alert(data.message);
});

// Handle Contact Us
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-message').value;

    const response = await fetch('http://127.0.0.1:5000/contact-us', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
    });

    const data = await response.json();
    alert(data.message);
});
