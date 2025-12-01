import { AdminTitle } from "@/admin/components/AdminTitle";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router";

export const AdminProductsPage = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <AdminTitle
          title="Productos"
          subtitle="Aquí puedes ver y administrar tus productos."
        />
        <div className="flex justify-end gap-4">
          <Link to={"/admin/products/new"}>
            <Button variant={"default"}>
              <PlusIcon />
              Nuevo Producto
            </Button>
          </Link>
        </div>
      </div>

      {/* Porducts table */}
      <Table className="bg-white mb-10 shadow-xs rounded-xl border border-gray-200">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] p-6">ID</TableHead>
            <TableHead className="p-6">Imagen</TableHead>
            <TableHead className="p-6">Nombre</TableHead>
            <TableHead className="p-6">Precio</TableHead>
            <TableHead className="p-6">Categoría</TableHead>
            <TableHead className="p-6">Inventario</TableHead>
            <TableHead className="p-6">Tallas</TableHead>
            <TableHead className="p-6 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">PROD001</TableCell>
            <TableCell>
              <img
                src="https://placehold.co/250x250"
                alt="Product"
                className="w-20 h-20 rounded-md object-cover"
              />
            </TableCell>
            <TableCell>Producto 1</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>100 Stock</TableCell>
            <TableCell>Categoria 1</TableCell>
            <TableCell>XS,S,L</TableCell>
            <TableCell className="text-right">
              <Link to={"/admin/products/t-shirt-teslo"}>Editar</Link>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};
