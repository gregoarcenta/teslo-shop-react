import { Activity } from "react";
import { AdminTitle } from "@/admin/components/AdminTitle";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";
import { useProducts } from "@/shop/hooks/useProducts";
import { PencilIcon, PlusIcon } from "lucide-react";
import { Link } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export const AdminProductsPage = () => {
  const { data, isLoading } = useProducts();
  const products = data?.products;
  const totalPages = data?.totalPages || 1;

  return (
    <>
      {/* Header   */}
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

      {/* Products table */}
      <div className="bg-white mb-10 shadow-xs rounded-xl border border-gray-200 overflow-hidden">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              {/* <TableHead className="w-[100px] p-6">ID</TableHead> */}
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
            {/* Loading Skeleton */}
            <Activity mode={isLoading ? "visible" : "hidden"}>
              <ProductsSkeleton />
            </Activity>

            {/* Products */}
            <Activity
              mode={products && products.length > 0 ? "visible" : "hidden"}
            >
              {products?.map((product) => (
                <TableRow key={product.id}>
                  {/* <TableCell className="p-6 font-medium">
                    {product.id.slice(0, 8)}
                  </TableCell> */}
                  <TableCell>
                    <img
                      src={`${IMAGE_BASE_URL}/${product.images[0]}`}
                      alt={product.title}
                      crossOrigin="anonymous"
                      className="w-20 h-20 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="p-6">{product.title}</TableCell>
                  <TableCell className="p-6">${product.price}</TableCell>
                  <TableCell className="p-6 capitalize">
                    {product.type}
                  </TableCell>
                  <TableCell className="p-6">{product.stock}</TableCell>
                  <TableCell className="p-6">
                    {product.sizes.join(", ").toUpperCase()}
                  </TableCell>
                  <TableCell className="text-right p-4">
                    <Link to={`/admin/products/${product.id}`}>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-transparent"
                      >
                        <PencilIcon className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </Activity>
          </TableBody>
        </Table>
      </div>

      <CustomPagination totalPages={totalPages} />
    </>
  );
};

const ProductsSkeleton = () => {
  return Array.from({ length: 5 }).map((_, index) => (
    <TableRow key={index}>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-20 w-20 rounded-md" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-40" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-12" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-4 w-16 ml-auto" />
      </TableCell>
    </TableRow>
  ));
};
