# GymWeb 🏋️

Sistema de gestión para gimnasio basado en microservicios con Spring Boot. Permite registrar usuarios, controlar asistencia, administrar suscripciones y gestionar pagos.

## Integrantes

- **Rodrigo Salinas**
- **Benjamin Salgado**
- **Alonso Gavilan**

## Microservicios

| # | Microservicio | Puerto | Descripción |
|---|--------------|--------|-------------|
| 1 | `ms-gateway` | 8080 | API Gateway + Frontend web |
| 2 | `ms-usuarios` | 8081 | CRUD de usuarios del gimnasio |
| 3 | `ms-asistencia` | 8082 | Registro de entrada y salida |
| 4 | `ms-suscripciones` | 8083 | Planes y suscripciones |
| 5 | `ms-pagos` | 8084 | Registro de pagos |

## Requisitos

- **Java 21** (JDK)
- **Maven** (o usar `mvnw.cmd` incluido)
- **MySQL 8+** (solo para perfil dev/prod)
- Navegador web moderno

## Cómo ejecutar localmente (perfil default con H2)

No necesitas MySQL. Cada microservicio usa H2 en memoria por defecto.

### Opción 1: Una terminal por servicio (recomendado para desarrollo)

Abre 5 terminales y ejecuta en cada una:

```bash
cd ms-usuarios && .\mvnw.cmd spring-boot:run
cd ms-asistencia && .\mvnw.cmd spring-boot:run
cd ms-suscripciones && .\mvnw.cmd spring-boot:run
cd ms-pagos && .\mvnw.cmd spring-boot:run
cd ms-gateway && .\mvnw.cmd spring-boot:run
```

### Opción 2: Docker Compose

```bash
docker compose up --build
```


## Deploy en Railway

El proyecto está desplegado en Railway (plan Free, límite 3 servicios):

| Servicio | URL |
|----------|-----|
| **Gateway** (frontend + API usuarios) | https://gateway-production-6556.up.railway.app |
| Usuarios API (incluido en gateway) | https://gateway-production-6556.up.railway.app/api/usuarios |

> Para agregar más servicios (asistencia, suscripciones, pagos, MySQL) se necesita **upgrade a Hobby ($5/mes)**.

### Opción 3: Script PowerShell

```powershell
$base = "C:\ruta\a\GymWeb"
$services = @('ms-usuarios','ms-asistencia','ms-suscripciones','ms-pagos','ms-gateway')
foreach ($s in $services) {
    Start-Process powershell -WindowStyle Normal -ArgumentList "-NoExit", "-Command", "cd '$base\$s'; .\mvnw.cmd spring-boot:run -q"
}
```

## Cómo probar

Una vez que todos los servicios estén levantados:

| Página | URL |
|--------|-----|
| Frontend (menú principal) | http://localhost:8080 |
| Usuarios | http://localhost:8080/# (click en Usuarios) |
| Asistencia | http://localhost:8080/# (click en Asistencia) |
| Suscripciones | http://localhost:8080/# (click en Suscripciones) |
| Pagos | http://localhost:8080/# (click en Pagos) |

### APIs directas (sin frontend)

```bash
# Listar usuarios
curl http://localhost:8081/api/usuarios

# Crear usuario
curl -X POST http://localhost:8081/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan Pérez","email":"juan@email.com","telefono":"123456789"}'

# Registrar asistencia (entrada)
curl -X POST http://localhost:8082/api/asistencia/entrada/1

# Ver suscripciones activas
curl http://localhost:8083/api/suscripciones/usuario/1/activa

# Registrar pago
curl -X POST http://localhost:8084/api/pagos \
  -H "Content-Type: application/json" \
  -d '{"usuarioId":1,"monto":29990,"metodoPago":"tarjeta"}'
```

## Perfiles de Spring

| Perfil | Base de datos | Uso |
|--------|--------------|-----|
| `default` | H2 en memoria | Desarrollo sin MySQL |
| `dev` | MySQL local | Desarrollo con MySQL |
| `prod` | MySQL (variables entorno) | Producción (Railway, Render) |

Para usar un perfil específico:

```bash
# Windows PowerShell
$env:SPRING_PROFILES_ACTIVE="dev"; .\mvnw.cmd spring-boot:run

# Linux/Mac
SPRING_PROFILES_ACTIVE=dev ./mvnw spring-boot:run
```

## Estructura del proyecto

```
GymWeb/
├── docker-compose.yml
├── .gitignore
├── ms-gateway/              # Frontend + proxy (Spring MVC)
│   └── src/main/resources/static/
│       ├── index.html        # Página principal
│       ├── css/style.css     # Estilos Bootstrap
│       └── js/               # Lógica del frontend
│           ├── api.js        # Cliente HTTP genérico
│           ├── app.js        # Navegación SPA
│           ├── usuarios.js   # CRUD usuarios
│           ├── asistencia.js # Registro entrada/salida
│           ├── suscripciones.js # Planes y suscripciones
│           └── pagos.js      # Registro de pagos
├── ms-usuarios/              # API REST de usuarios
├── ms-asistencia/            # API REST de asistencia
├── ms-suscripciones/         # API REST de suscripciones
└── ms-pagos/                 # API REST de pagos
```
