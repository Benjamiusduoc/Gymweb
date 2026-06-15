# GymWeb 🏋️

Sistema de gestión para gimnasio construido con Spring Boot. Incluye autenticación con roles, registro de usuarios, planes de suscripción, pagos simulados y control de asistencia. Diseño moderno con tema oscuro glassmorphism.

## Integrantes

- **Rodrigo Salinas**
- **Benjamin Salgado**
- **Alonso Gavilan**

## Funcionalidades

- **Login y Registro** con roles (Dueño/Admin y Miembro)
- **Panel de Administración**: gestión de usuarios, planes, suscripciones y asistencia
- **Portal de Miembro**: perfil, suscripción activa, selección de planes y pago simulado
- **Pago Simulado**: al pagar se crea automáticamente la suscripción en la base de datos
- **Control de Asistencia**: registro de entrada y salida
- **Diseño Responsivo**: tema oscuro con glassmorphism, Inter font, acentos naranjas

## Arquitectura

El proyecto funciona como **monolith** desplegado en un solo servicio:

| Componente | Puerto | Descripción |
|-----------|--------|-------------|
| `ms-gateway` | 8080 | Frontend + API completa (usuarios, suscripciones, pagos, asistencia) |

### Bases de datos (H2 en memoria)

| Tabla | Descripción |
|-------|-------------|
| `usuarios` | Usuarios con roles DUENO/MIEMBRO/ADMIN |
| `planes` | Planes de suscripción (Básico, Premium, Elite) |
| `suscripciones_usuario` | Suscripciones activas de cada usuario |
| `pagos` | Registro de pagos realizados |
| `asistencias` | Control de entrada/salida |

## Requisitos

- **Java 21** (JDK)
- **Maven** (o usar `mvnw.cmd` incluido)
- Navegador web moderno

## Cómo ejecutar localmente

```bash
cd ms-gateway
.\mvnw.cmd spring-boot:run
```

La aplicación iniciará en http://localhost:8080

### Credenciales de prueba

| Usuario | Email | Contraseña | Rol |
|---------|-------|------------|-----|
| Admin GymWeb | admin@gymweb.cl | admin123 | DUENO |
| Maria Lopez | maria@correo.cl | demo1234 | MIEMBRO |

## Deploy en Railway

El proyecto está desplegado en Railway como un servicio único:

| URL |
|-----|
| https://gateway-production-6556.up.railway.app |

## Cómo probar

| Página | URL |
|--------|-----|
| Landing Page | http://localhost:8080 |
| Login | http://localhost:8080/login |
| Registro | http://localhost:8080/registro |
| Admin Panel | http://localhost:8080/admin |
| Mi Cuenta | http://localhost:8080/mi-cuenta |

### Endpoints de API

```bash
# Login
curl -X POST http://localhost:8080/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@correo.cl","password":"demo1234"}'

# Listar planes
curl http://localhost:8080/api/suscripciones/planes

# Pago simulado (crea suscripción automáticamente)
curl -X POST http://localhost:8080/api/pagos/pagar \
  -H "Content-Type: application/json" \
  -d '{"usuarioId":2,"planId":2,"metodoPago":"tarjeta"}'

# Registrar asistencia
curl -X POST http://localhost:8080/api/asistencia/entrada/2

# Verificar suscripción activa
curl http://localhost:8080/api/suscripciones/usuario/2/activa
```

## Estructura del proyecto

```
GymWeb/
├── ms-gateway/                    # Monolith - todo en uno
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/gym/gateway/
│       │   ├── GatewayApplication.java
│       │   ├── model/             # Entidades JPA
│       │   │   ├── Usuario.java
│       │   │   ├── Plan.java
│       │   │   ├── SuscripcionUsuario.java
│       │   │   ├── Pago.java
│       │   │   └── Asistencia.java
│       │   ├── repository/        # Repositorios Spring Data
│       │   ├── service/           # Lógica de negocio
│       │   └── controller/        # Endpoints REST
│       └── resources/
│           ├── application.yml
│           └── static/            # Frontend
│               ├── index.html     # Landing page
│               ├── login.html
│               ├── registro.html
│               ├── admin.html     # Panel administración
│               ├── mi-cuenta.html # Portal miembro
│               ├── css/style.css  # Tema oscuro glassmorphism
│               └── js/
│                   ├── admin.js
│                   ├── micuenta.js
│                   └── ui.js
├── ms-suscripciones/              # Microservice (original)
├── ms-pagos/                      # Microservice (original)
├── ms-asistencia/                 # Microservice (original)
└── ms-usuarios/                   # Microservice (original)
```

## Stack Tecnológico

- **Backend**: Spring Boot 4.0.6, Java 21, Spring Data JPA
- **Base de datos**: H2 en memoria
- **Frontend**: HTML5, CSS3 (glassmorphism), JavaScript vanilla
- **Auth**: HttpSession con roles (DUENO/MIEMBRO/ADMIN)
- **Password hashing**: SHA-256
- **Deploy**: Railway (plan Free)
- **Repo**: GitHub
