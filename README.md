# Sistema de Pagos – Prueba Técnica Backend

![NestJS](https://nestjs.com/img/logo-small.svg)
API RESTful desarrollada en **NestJS (Node.js + TypeScript)** para gestionar un sistema básico de pagos, con autenticación JWT, base de datos **PostgreSQL** y un microservicio de procesamiento de pagos en **Python (FastAPI)**.

---

## 📌 Descripción

Este proyecto cuenta:

- ✅ Crear y gestionar usuarios.
- ✅ Registrar tarjetas de crédito (con datos ficticios).
- ✅ Crear pagos asociados a un usuario y una tarjeta.
- ✅ Listar el historial de pagos de un usuario.
- ✅ Autenticación mediante **JWT**.
- ✅ Integración con un **microservicio en FastAPI** que simula la autorización de pagos (80% aprobado, 20% rechazado).

Cada vez que se crea un pago, la API en NestJS consume el servicio externo en Python para validar si el pago se aprueba o rechaza.

---

## 🧩 Tecnologías utilizadas

- **Backend principal**: [NestJS](https://nestjs.com/) (Node.js + TypeScript)
- **Base de datos**: PostgreSQL
- **Microservicio de pagos**: FastAPI (Python)
- **Autenticación**: JWT (JSON Web Tokens)
- **ORM**: TypeORM
- **Pruebas**: Colección de Postman incluida

---

## 🗂️ Estructura del proyecto

Api_pago
.
├── .env
├── .gitignore
├── nest-cli.json
├── package.json
├── tsconfig.build.json
├── tsconfig.json
├── README.md
├── src/
│ ├── main.ts
│ ├── app.module.ts
│ │
│ ├── common/
│ │ ├── dto/
│ │ │ └── pagination.dto.ts
│ │ └── entities/
│ │ ├── user.entity.ts
│ │ ├── card.entity.ts
│ │ └── payment.entity.ts
│ │
│ ├── config/
│ │ ├── envs.ts
│ │ └── index.ts
│ │
│ └── modules/
│ ├── auth/
│ │ ├── auth.controller.ts
│ │ ├── auth.service.ts
│ │ ├── auth.module.ts
│ │ └── dto/
│ │ ├── login.dto.ts
│ │
│ │
│ ├── user/
│ │ ├── user.controller.ts
│ │ ├── user.service.ts
│ │ ├── user.module.ts
│ │ └── dto/
│ │ └── create-user.dto.ts
│ │
│ ├── card/
│ │ ├── card.controller.ts
│ │ ├── card.service.ts
│ │ ├── card.module.ts
│ │ └── dto/
│ │ └── create-card.dto.ts
│ │
│ └── payment/
│ ├── payment.controller.ts
│ ├── payment.service.ts
│ ├── payment.module.ts
│ └── dto/
│ └── create-payment.dto.ts
│
└── test (no implementado)
Apro_pago
.
│
└──main.py
│
└──requirements.txt

---

## ⚙️ Requisitos previos

- Node.js ≥ 20.x
- npm o yarn
- Python ≥ 3.12
- pip
- PostgreSQL ≥ 16

---

## 🚀 Instalación y ejecución

### 1. Base de datos (PostgreSQL)

Crea una base de datos llamada `pagos_db`:

````bash
createdb pagos_db;

# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario_de_postgres
DB_PASSWORD=tu_contraseña
DB_NAME=pagos_db

# JWT
JWT_SECRET=mi_secreto_jwt_para_pagos_2025!
JWT_EXPIRES_IN=3600

# Microservicio de pagos
PAYMENT_SERVICE_URL=http://localhost:8000/process-payment

## Compile and run the project

```bash
##Api_pago(Api Nestjs)
#Instalar las dependencias y iniciar el servidor
cd Api_pago
npm install
npm run start:dev

##Apro_pago(Microservicio en fastapi)
#Instalar las dependencias y iniciar el servidor
cd Apro_pago
python -m venv venv
source venv/bin/activate      # Linux/macOS
# o
venv\Scripts\activate         # Windows

pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
````

## 🔐 Autenticación

El acceso a los endpoints protegidos (`/user`,`/cards`, `/payments`, etc.) requiere un **token JWT**. Este token se obtiene **tras registrarse y luego iniciar sesión**:

1. **Registrar un usuario** mediante el endpoint de registro:

   ```http
   POST /auth/register
   Content-Type: application/json

   {
     "nombre": "Ana López",
     "email": "ana@example.com",
     "password": "Clave123"
   }

   POST /auth/login
   Content-Type: application/json

   {
     "email": "ana@example.com",
     "password": "Clave123"
   }
   ```

```

```
