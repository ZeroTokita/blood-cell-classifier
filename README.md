# 🩸 Blood Cell Classifier  
## Sistema Web Inteligente con Base de Datos en la Nube

---

## 📌 Descripción General

**Blood Cell Classifier** es una aplicación web desarrollada como proyecto académico, cuyo objetivo es integrar un modelo de **Inteligencia Artificial** para la clasificación automática de células sanguíneas dentro de una arquitectura moderna basada en servicios en la nube.

El sistema permite a los usuarios:

- Registrarse e iniciar sesión de forma segura.
- Subir imágenes de células sanguíneas.
- Obtener una predicción generada por una Red Neuronal Convolucional (CNN).
- Visualizar el historial de predicciones.

Además, el sistema incorpora un **Panel de Administrador**, que permite la gestión y análisis global de los datos almacenados.

La persistencia de datos se realiza mediante **MongoDB Atlas (DBaaS)**, cumpliendo con los criterios de implementación de Base de Datos en la Nube.

---

## 🎯 Objetivo del Proyecto

Desarrollar una solución tecnológica que integre:

- Inteligencia Artificial aplicada.
- Backend seguro basado en API REST.
- Base de Datos en la Nube (MongoDB Atlas).
- Control de acceso basado en roles.
- Buenas prácticas de arquitectura y seguridad informática.

---

## 🧱 Arquitectura del Sistema

El sistema sigue un modelo cliente-servidor con integración cloud:

```
Cliente (Frontend HTML/CSS/JS)
        ↓  HTTP + JWT
Backend (FastAPI - API REST)
        ↓
MongoDB Atlas (Base de Datos en la Nube - DBaaS)
        ↓
Modelo CNN (TensorFlow / Keras)
```

### Componentes Principales

- **Frontend:** HTML, CSS y JavaScript.
- **Backend:** FastAPI (Python).
- **Base de Datos:** MongoDB Atlas (NoSQL – DBaaS).
- **Modelo de IA:** Red Neuronal Convolucional entrenada con TensorFlow/Keras.
- **Seguridad:** OAuth2 Password Flow + JWT.

---

## ☁️ Base de Datos en la Nube

La aplicación utiliza **MongoDB Atlas**, un servicio de Base de Datos como Servicio (DBaaS), alojado en la nube.

### Características implementadas

- Conexión segura mediante `mongodb+srv://` (TLS habilitado).
- Gestión de usuarios de base de datos desde Atlas.
- Control de acceso por IP (Network Access).
- Persistencia remota de datos.
- Eliminación de base de datos local (SQLite).

### Colecciones implementadas

#### `users`
- `_id`
- `username`
- `password_hash`
- `role`

#### `predictions`
- `_id`
- `user_id`
- `username`
- `cell_type`
- `confidence`
- `created_at`

La relación entre colecciones se realiza mediante el campo `user_id`.

---

## 🔐 Seguridad Implementada

El sistema incorpora múltiples capas de seguridad:

### Autenticación
- OAuth2 Password Flow.
- Generación de JWT firmados con clave secreta.
- Tokens con expiración configurable.

### Autorización
- Roles:
  - `user`
  - `admin`
- Protección de endpoints sensibles.
- Respuestas 401 (No autenticado) y 403 (No autorizado).

### Protección de Credenciales
- Variables sensibles almacenadas en `.env`.
- Uso de hash de contraseñas (bcrypt/argon2).
- No exposición de credenciales en el repositorio.

### Modelo CIA

- **Confidencialidad:** Hash de contraseñas + JWT.
- **Integridad:** Firma criptográfica del token.
- **Disponibilidad:** DBaaS gestionado en la nube.

---

## 🧠 Inteligencia Artificial

El sistema integra un modelo de Red Neuronal Convolucional entrenado para clasificar los siguientes tipos de células:

- Eosinophil
- Lymphocyte
- Monocyte
- Neutrophil

El modelo recibe una imagen procesada y devuelve:
- Tipo de célula detectada.
- Nivel de confianza (probabilidad).

---

## 👤 Funcionalidades del Usuario

- Registro.
- Inicio de sesión.
- Subida de imágenes.
- Predicción automática.
- Historial personal de predicciones.

---

## 🛡️ Funcionalidades del Administrador

- Visualización de todos los usuarios.
- Consulta global de predicciones.
- Estadísticas por tipo de célula.
- Supervisión del uso del sistema.

---

## 🗂️ Estructura del Proyecto

```
backend/
│
├── app.py
├── core/
├── database/
├── models/
├── schemas/
├── routes/
├── utils/
├── static/
├── model/
└── .env (no incluido en repositorio)
```

---

## 🚀 Instalación y Ejecución

### 1. Clonar repositorio

```bash
git clone https://github.com/ZeroTokita/blood-cell-classifier.git
cd blood-cell-classifier/backend
```

### 2. Crear entorno virtual

```bash
python -m venv venv
venv\Scripts\activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno

Crear archivo `.env` en `backend/`:

```env
MONGODB_URI=tu_uri_de_mongodb_atlas
MONGODB_DB=blood_cell_classifier
SECRET_KEY=clave_secreta_segura
```

### 5. Ejecutar servidor

```bash
uvicorn app:app --reload
```

Acceder a:

- API Docs: `http://127.0.0.1:8000/docs`
- Aplicación Web: `http://127.0.0.1:8000/web`

---

## 📊 Cumplimiento Académico

El proyecto cumple con los criterios de:

- Implementación de Base de Datos en la Nube (DBaaS).
- Arquitectura Cliente-Servidor.
- Integración segura Aplicación ↔ Cloud.
- Gestión de roles.
- Seguridad informática básica.
- Modelo de datos NoSQL.
- Integración de Inteligencia Artificial.

---

## 🔮 Posibles Mejoras Futuras

- Implementación de índices en MongoDB.
- Despliegue del backend en la nube (Render / Railway).
- Implementación de HTTPS en producción.
- Dashboard con gráficos dinámicos.
- Escalamiento horizontal del backend.

---

## 👨‍💻 Autor

Proyecto académico desarrollado por:

**Alex Fabricio Anchundia Mero**  
Carrera de Ingeniería en Software  

---

## 📄 Licencia

Proyecto desarrollado con fines académicos.  
No destinado para uso clínico real.
