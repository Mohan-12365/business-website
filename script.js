
document.getElementById("signupForm")?.addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.querySelector("input[name='username']").value;
    const email = document.querySelector("input[name='email']").value;
    const password = document.querySelector("input[name='password']").value;

    const response = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();
    alert(data.message);
});

document.getElementById("loginForm")?.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.querySelector("input[name='email']").value;
    const password = document.querySelector("input[name='password']").value;

    const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    alert(data.message);

    // ✅ Fix: Redirect to index.html after successful login
    if (response.status === 200) {
        window.location.href = data.redirect;
    }
});
