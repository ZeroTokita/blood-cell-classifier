const API_BASE = "";

function requireAuthUser() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");

    if (!token || !role) {
        window.location.href = "/web";
        return null;
    }
    if (role === "admin") {
        // si es admin pero entra aquí, lo mandamos a su panel
        window.location.href = "/static/admin.html";
        return null;
    }

    return { token, role, username };
}

document.addEventListener("DOMContentLoaded", () => {
    const session = requireAuthUser();
    if (!session) return;

    const { token, username } = session;

    const userInfo = document.getElementById("userInfo");
    userInfo.textContent = `Usuario: ${username}`;

    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "/web";
    });

    const imageInput = document.getElementById("imageInput");
    const preview = document.getElementById("preview");
    const predictBtn = document.getElementById("predictBtn");
    const resultBox = document.getElementById("predictionResult");
    const historyTableBody = document.querySelector("#historyTable tbody");

    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];
        if (file) {
            preview.src = URL.createObjectURL(file);
            preview.style.display = "block";
            predictBtn.disabled = false;
        } else {
            preview.src = "";
            preview.style.display = "none";
            predictBtn.disabled = true;
        }
    });

    predictBtn.addEventListener("click", async () => {
        const file = imageInput.files[0];
        if (!file) {
            alert("Selecciona una imagen primero");
            return;
        }

        resultBox.textContent = "Clasificando...";
        predictBtn.disabled = true;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`${API_BASE}/predict`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                resultBox.textContent =
                    err.detail || "Error al clasificar la imagen";
                predictBtn.disabled = false;
                return;
            }

            const data = await res.json();

            const confPercent = (data.confidence * 100).toFixed(2);

            resultBox.innerHTML = `
                <strong>Resultado:</strong> ${data.prediction}<br>
                <strong>Confianza:</strong> ${confPercent}%<br>
                <small>ID registro: ${data.prediction_id}</small>
            `;

            // recargar historial
            await loadHistory(token, historyTableBody);
        } catch (error) {
            console.error(error);
            resultBox.textContent = "Error de conexión con el servidor";
        } finally {
            predictBtn.disabled = false;
        }
    });

    // Cargar historial al entrar
    loadHistory(token, historyTableBody);
});

async function loadHistory(token, tbody) {
    tbody.innerHTML = "<tr><td colspan='4'>Cargando...</td></tr>";

    try {
        const res = await fetch(`${API_BASE}/my-predictions`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            tbody.innerHTML =
                "<tr><td colspan='4'>No se pudo cargar el historial</td></tr>";
            return;
        }

        const data = await res.json();
        if (!data.length) {
            tbody.innerHTML =
                "<tr><td colspan='4'>Aún no tienes predicciones</td></tr>";
            return;
        }

        tbody.innerHTML = "";
        data.forEach((item, index) => {
            const tr = document.createElement("tr");
            const confPercent = (item.confidence * 100).toFixed(2);
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.cell_type}</td>
                <td>${confPercent}%</td>
                <td>${new Date(item.created_at).toLocaleString()}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error(error);
        tbody.innerHTML =
            "<tr><td colspan='4'>Error de conexión</td></tr>";
    }
}
