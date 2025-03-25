// Signup form handler
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const formData = {
        username: form.username.value,
        email: form.email.value,
        password: form.password.value
    };

    try {
        const response = await fetch("http://localhost:3000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || "Signup failed");
        }
        
        alert(data.message);
        if (data.redirect) {
            window.location.href = data.redirect;
        }
    } catch (error) {
        console.error("Signup Error:", error);
        alert(error.message || "Cannot connect to server");
    }
});

// Login form handler
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const formData = {
        email: form.email.value,
        password: form.password.value
    };

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }
        
        alert(data.message);
        if (data.redirect) {
            window.location.href = data.redirect;
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert(error.message || "Cannot connect to server");
    }
});