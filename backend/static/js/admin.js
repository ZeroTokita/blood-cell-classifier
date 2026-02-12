const API_BASE = "";

function requireAuthAdmin() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");

    if (!token || !role) {
        window.location.href = "/web";
        return null;
    }
    if (role !== "admin") {
        window.location.href = "/static/user.html";
        return null;
    }

    return { token, role, username };
}

document.addEventListener("DOMContentLoaded", () => {
    const session = requireAuthAdmin();
    if (!session) return;

    const { token, username } = session;

    const adminInfo = document.getElementById("adminInfo");
    adminInfo.textContent = `Admin: ${username}`;

    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "/web";
    });

    const usersTableBody = document.querySelector("#usersTable tbody");
    const predsTableBody = document.querySelector("#adminPredictionsTable tbody");
    const statsBox = document.getElementById("statsBox");

    loadUsers(token, usersTableBody);
    loadAdminPredictions(token, predsTableBody);
    loadStats(token, statsBox);
});

async function loadUsers(token, tbody) {
    tbody.innerHTML = "<tr><td colspan='4'>Cargando usuarios...</td></tr>";
    try {
        const res = await fetch("/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            tbody.innerHTML =
                "<tr><td colspan='4'>No se pudo cargar usuarios</td></tr>";
            return;
        }

        const data = await res.json();
        if (!data.length) {
            tbody.innerHTML =
                "<tr><td colspan='4'>No hay usuarios registrados</td></tr>";
            return;
        }

        tbody.innerHTML = "";
        data.forEach((u) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${u.id}</td>
                <td>${u.username}</td>
                <td>${u.role}</td>
                <td>${new Date(u.created_at).toLocaleString()}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error(error);
        tbody.innerHTML =
            "<tr><td colspan='4'>Error de conexión</td></tr>";
    }
}

async function loadAdminPredictions(token, tbody) {
    tbody.innerHTML =
        "<tr><td colspan='5'>Cargando predicciones...</td></tr>";
    try {
        const res = await fetch("/admin/predictions", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            tbody.innerHTML =
                "<tr><td colspan='5'>No se pudo cargar predicciones</td></tr>";
            return;
        }

        const data = await res.json();
        if (!data.length) {
            tbody.innerHTML =
                "<tr><td colspan='5'>No hay predicciones registradas</td></tr>";
            return;
        }

        tbody.innerHTML = "";
        data.forEach((p) => {
            const tr = document.createElement("tr");
            const confPercent = (p.confidence * 100).toFixed(2);
            tr.innerHTML = `
                <td>${p.id}</td>
                <td>${p.username}</td>
                <td>${p.cell_type}</td>
                <td>${confPercent}%</td>
                <td>${new Date(p.created_at).toLocaleString()}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error(error);
        tbody.innerHTML =
            "<tr><td colspan='5'>Error de conexión</td></tr>";
    }
}

async function loadStats(token, container) {
    container.innerHTML = "Cargando estadísticas...";
    try {
        const res = await fetch("/admin/stats", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            container.textContent =
                "No se pudieron cargar las estadísticas.";
            return;
        }

        const data = await res.json();

        const cells = data.predictions_by_cell_type || {};

        const cellStatsHtml = Object.keys(cells).length
            ? Object.entries(cells)
                  .map(
                      ([cell, count]) =>
                          `<div class="stat-card">
                              <div class="stat-label">Predicciones de ${cell}</div>
                              <div class="stat-value">${count}</div>
                           </div>`
                  )
                  .join("")
            : `<div class="stat-card">
                   <div class="stat-label">Predicciones de células</div>
                   <div class="stat-value">0</div>
               </div>`;

        container.innerHTML = `
            <div class="stat-card">
                <div class="stat-label">Usuarios totales</div>
                <div class="stat-value">${data.total_users}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Predicciones totales</div>
                <div class="stat-value">${data.total_predictions}</div>
            </div>
            ${cellStatsHtml}
        `;
    } catch (error) {
        console.error(error);
        container.textContent = "Error de conexión.";
    }
}
