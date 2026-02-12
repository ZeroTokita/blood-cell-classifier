const API_BASE = ""; // mismo dominio

document.addEventListener("DOMContentLoaded", () => {
    // Si ya hay sesión, mandamos directo al panel
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
        if (role === "admin") {
            window.location.href = "/static/admin.html";
        } else {
            window.location.href = "/static/user.html";
        }
        return;
    }

    const form = document.getElementById("loginForm");
    const msg = document.getElementById("loginMessage");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        msg.textContent = "Iniciando sesión...";

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        const params = new URLSearchParams();
        params.append("username", username);
        params.append("password", password);
        params.append("grant_type", "password");

        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: params,
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                msg.textContent = err.detail || "Error al iniciar sesión";
                msg.style.color = "#ff8080";
                return;
            }

            const data = await res.json();

            localStorage.setItem("token", data.access_token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("username", username);

            msg.textContent = "Login exitoso. Redirigiendo...";
            msg.style.color = "#7CFFAF";

            if (data.role === "admin") {
                window.location.href = "/static/admin.html";
            } else {
                window.location.href = "/static/user.html";
            }
        } catch (error) {
            console.error(error);
            msg.textContent = "Error de conexión con el servidor";
            msg.style.color = "#ff8080";
        }
    });
});
