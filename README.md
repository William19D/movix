# 🚚 Movix - Plataforma de Envíos

**Movix** es una moderna plataforma web que facilita la gestión integral de servicios de envío. La plataforma permite a los usuarios registrarse, solicitar recogidas, hacer seguimiento en tiempo real y a los administradores controlar el estado de cada pedido.

## ✨ Tecnologías Usadas

Este proyecto fue desarrollado con el siguiente stack tecnológico:

- ⚛️ **React** + **TypeScript** – Frontend moderno, tipado y mantenible.
- ⚡ **Vite** – Empaquetador ultrarrápido para desarrollo y producción.
- 🎨 **Tailwind CSS** – Utilidades para estilos rápidos, responsivos y personalizables.
- 🔥 **Firebase** – Backend as a Service para:
  - Autenticación (Firebase Auth)
  - Base de datos en tiempo real (Firestore)
  - Hosting (opcional)
  - Cloud Functions (opcional)

## 🔐 Funcionalidades

### 🧑‍💼 Usuario

- Registro e inicio de sesión con autenticación segura vía Firebase Auth.
- Solicitud de recogida de paquetes: dirección de origen, destino, peso, etc.
- Visualización de estado actual del pedido.
- Tracking en tiempo real del envío.
- Historial de pedidos anteriores.
- Edición de perfil y datos de contacto.

### 🛠 Administrador

- Panel de administración con login restringido.
- Visualización de todos los pedidos activos y completados.
- Cambio del estado del pedido: `Pendiente` → `Recogido` → `En tránsito` → `Entregado`.
- Gestión de usuarios registrados.
- Notificaciones internas o por correo electrónico (opcional, vía Firebase Functions).

### 🧩 Extra

- Diseño responsive adaptado a móviles, tabletas y escritorio.
- Animaciones suaves y experiencia fluida.
- Validación de formularios y mensajes de error amigables.
- Modo oscuro (opcional en configuración del usuario).


## 🚀 Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/William19D/movix.git
