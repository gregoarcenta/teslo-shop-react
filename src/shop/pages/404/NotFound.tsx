import { Link } from "react-router";

export const NotFound = () => {
  return (
    <div className="flex min-h-[calc(100vh-375px)] items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold font-montserrat">404</h1>
        <p className="mb-4 text-xl text-gray-600">
          ¡Vaya! Página no encontrada
        </p>
        <Link to="/" className="text-blue-500 underline hover:text-blue-700">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};
