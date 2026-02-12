# 🩸 Blood Cell Classifier – Sistema de Clasificación con IA

Sistema web para la **clasificación automática de células sanguíneas** usando un modelo de *Deep Learning (CNN)*, con autenticación de usuarios, roles (usuario / administrador), historial de predicciones y panel administrativo.

El proyecto integra **Machine Learning + Backend + Frontend**, siguiendo una arquitectura moderna y segura.

---

## 📌 Características principales

- 🧠 Modelo CNN entrenado para clasificación de células sanguíneas
- 🔐 Autenticación con **JWT (OAuth2 Password Flow)**
- 👤 Roles de usuario:
  - **Usuario**: clasificar imágenes y ver su historial
  - **Administrador**: ver usuarios, predicciones globales y estadísticas
- 📊 Historial de predicciones por usuario
- 🛡️ Endpoints protegidos por rol
- 🌐 Frontend web en **HTML + CSS + JavaScript**
- ⚙️ Backend en **FastAPI**
- 🗄️ Base de datos **SQLite**
- 📑 API documentada con **Swagger**

---

## 🧱 Arquitectura del sistema

Frontend (HTML / CSS / JS)
↓ (HTTP + JWT)
Backend (FastAPI)
↓
Base de Datos (SQLite)
↓
Modelo IA (TensorFlow / Keras)


---

## 🛠️ Tecnologías utilizadas

### Backend
- Python 3.10+
- FastAPI
- SQLAlchemy
- SQLite
- Passlib (bcrypt / argon2)
- python-jose (JWT)
- TensorFlow / Keras
- Pillow, NumPy

### Frontend
- HTML5
- CSS3 (layout responsive)
- JavaScript (Fetch API)

---

## 📁 Estructura del proyecto

Frontend (HTML / CSS / JS)
↓ (HTTP + JWT)
Backend (FastAPI)
↓
Base de Datos (SQLite)
↓
Modelo IA (TensorFlow / Keras)
---

## 🛠️ Tecnologías utilizadas

### Backend
- Python 3.10+
- FastAPI
- SQLAlchemy
- SQLite
- Passlib (bcrypt / argon2)
- python-jose (JWT)
- TensorFlow / Keras
- Pillow, NumPy

### Frontend
- HTML5
- CSS3 (layout responsive)
- JavaScript (Fetch API)

---

## 📁 Estructura del proyecto

backend/
│
├── app.py
├── core/
│ ├── security.py
│ └── dependencies.py
│
├── database/
│ └── db.py
│
├── models/
│ ├── user.py
│ └── prediction.py
│
├── schemas/
│ ├── user.py
│ └── prediction.py
│
├── routes/
│ ├── auth.py
│ └── admin.py
│
├── utils/
│ └── preprocess.py
│
├── model/
│ └── blood_cells_cnn.h5
│
├── static/
│ ├── index.html # Login
│ ├── user.html # Panel usuario
│ ├── admin.html # Panel admin
│ ├── css/
│ │ └── main.css
│ └── js/
│ ├── auth.js
│ ├── user.js
│ └── admin.js
│
└── app.db


---

## 🚀 Instalación y ejecución

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/ZeroTokita/blood-cell-classifier.git
cd blood-cell-classifier/backend
```
## Crear entorno
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate  # Linux / Mac

## Instalar dependencias
pip install -r requirements.txt

## Ejecutar servidor
uvicorn app:app --reload

## frontend
http://127.0.0.1:8000/web

## Swagger API Docs:
http://127.0.0.1:8000/docs

