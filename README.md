# Teslo Shop - Modern E-Commerce Client

Plataforma de comercio electrónico moderna desarrollada con React 19 y las últimas tecnologías del ecosistema. Proyecto full-stack que demuestra el manejo de autenticación, gestión de estado complejo, y arquitectura escalable para aplicaciones de producción.


### 🚀 Tecnologías Principales

*   **Framework:** [React 19](https://react.dev/)
*   **Herramienta de Construcción:** [Vite](https://vitejs.dev/) + [Rolldown](https://rolldown.rs/)
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
*   **Gestión de Estado:** [Zustand](https://github.com/pmndrs/zustand)
*   **Manejo de Datos y Caché:** [TanStack Query v5](https://tanstack.com/query/latest)
*   **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Componentes UI:** [Shadcn/UI](https://ui.shadcn.com/) (Radix UI)
*   **Formularios:** [React Hook Form](https://react-hook-form.com/)
*   **Enrutamiento:** [React Router 7](https://reactrouter.com/)

### ✨ Características

*   **Autenticación Completa:** Flujos de login, registro y protección de rutas.
*   **Gestión de Catálogo:** Visualización de productos por categorías, tallas y filtros.
*   **Carrito de Compras:** Persistencia de productos y gestión de cantidades.
*   **Panel de Administración:** Gestión integral de productos e inventario.
*   **Diseño Adaptable:** Interfaz totalmente responsiva y optimizada para dispositivos móviles.

### 🛠️ Configuración Local

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/gregoarcenta/teslo-shop-react.git
    cd teslo-shop-react
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y configura la URL de la API:
    ```env
    VITE_API_URL=http://localhost:3000/api
    ```

4.  **Ejecutar en desarrollo:**
    ```bash
    npm run dev
    ```

### 🐳 Despliegue con Docker

El proyecto incluye soporte para Docker mediante Nginx para servir la aplicación estática:

1.  **Construir la imagen:**
    ```bash
    docker build -t teslo-shop-client .
    ```

2.  **Ejecutar contenedor:**
    ```bash
    docker run -p 80:80 teslo-shop-client
    ```

## 🔗 Links
- **Demo en vivo:** [react.tesloshop.arcentales.dev](https://react.tesloshop.arcentales.dev/)
- **API Repository:** [github.com/gregoarcenta/teslo-shop-backend](https://github.com/gregoarcenta/teslo-shop-backend)
- **Portafolio:** [arcentales.dev](https://arcentales.dev)

---
Desarrollado como parte de mi portafolio profesional.
