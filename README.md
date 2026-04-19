# Viajando X el Mundo — Aplicación de Sorteos

Esta es la aplicación web de sorteos de lujo para **Viajando X el Mundo**.

## Stack Tecnológico
- **Frontend**: React (v18) + Tailwind CSS
- **Backend/Realtime**: Firebase Realtime Database
- **Hosting**: Vercel
- **Version Control**: GitHub

## Configuración
1. Los archivos `index.html`, `app.js` y `styles.css` son autoportantes.
2. **Importante**: Debes configurar tus propias credenciales de Firebase en el objeto `firebaseConfig` dentro de `app.js`.
3. Para desplegar en Vercel, simplemente sube estos archivos a un repositorio de GitHub y conecta el repositorio en el panel de Vercel.

## Estructura de Firebase Recomendada
- `draws/active`: Información del sorteo actual.
- `tickets`: Estado de los 100 números (disponibles o tomados).
- `reservations`: Detalles de los participantes y sus números.
- `config`: Configuraciones de administración.

## Características
- Grilla de 100 aviones animada.
- Panel de itinerario dinámico.
- Registro tipo Boarding Pass.
- Panel de administración integrado.
