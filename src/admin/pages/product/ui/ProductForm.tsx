import { useRef, useState } from "react";
import { Form, Link } from "react-router";
import { useForm, useWatch } from "react-hook-form";
import { AdminTitle } from "@/admin/components/AdminTitle";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product.interface";
import { Plus, SaveAll, Tag, Upload, X } from "lucide-react";
import { SIZE_OPTIONS } from "@/types/filters";
import type { Size } from "@/types/enums";
import { cn } from "@/lib/utils";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

interface Props {
  title: string;
  subtitle: string;
  product: Product | undefined;
  isLoadingSubmit: boolean;
  onSubmit: (productLike: Product) => Promise<void>;
}

export const ProductForm = ({
  title,
  subtitle,
  product,
  isLoadingSubmit,
  onSubmit
}: Props) => {
  const [dragActive, setDragActive] = useState(false);
  const inputTagRef = useRef<HTMLInputElement>(null);

  const defaultValuesProduct: Partial<Product> = product ?? {
    title: "",
    slug: "",
    description: "",
    price: "",
    stock: 0,
    gender: undefined,
    sizes: [],
    tags: [],
    images: []
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    control
  } = useForm<Product>({ defaultValues: defaultValuesProduct });

  register("sizes", {
    validate: (value) =>
      (value && value.length > 0) || "Debe seleccionar al menos una talla"
  });

  const selectedSizes = useWatch({ control, name: "sizes" });
  const selectedTags = useWatch({ control, name: "tags" });
  const currentStock = useWatch({ control, name: "stock" });

  const addTag = () => {
    const valueToAdd = inputTagRef.current!.value.trim().toLowerCase();

    if (valueToAdd.length === 0) return;

    const newTagSet = new Set(getValues("tags"));
    newTagSet.add(valueToAdd);
    setValue("tags", Array.from(newTagSet));

    inputTagRef.current!.value = "";
  };

  const removeTag = (tagToRemove: string) => {
    const newTagSet = new Set(getValues("tags"));
    newTagSet.delete(tagToRemove);
    setValue("tags", Array.from(newTagSet));
  };

  const addSize = (size: Size) => {
    const sizeSet = new Set(getValues("sizes"));
    sizeSet.add(size);
    setValue("sizes", Array.from(sizeSet));
  };

  const removeSize = (sizeToRemove: string) => {
    const updatedSizes = getValues("sizes").filter(
      (size) => size !== sizeToRemove
    );
    setValue("sizes", updatedSizes);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    console.log(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log(files);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <AdminTitle title={title} subtitle={subtitle} />
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" disabled={isLoadingSubmit}>
            <Link to="/admin/products" className="flex items-center gap-2">
              <X className="w-4 h-4" />
              Cancelar
            </Link>
          </Button>

          <Button disabled={isLoadingSubmit} type="submit">
            <SaveAll className="w-4 h-4" />
            Guardar cambios
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Información del producto
              </h2>

              <div className="space-y-6">
                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Título del producto
                  </label>
                  <input
                    type="text"
                    {...register("title", {
                      required: "El título es obligatorio",
                      minLength: {
                        value: 2,
                        message: "El título debe tener al menos 2 caracteres"
                      }
                    })}
                    className={`w-full px-4 py-3 rounded-lg transition-all duration-200 outline-none ${
                      errors.title
                        ? "border-2 border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                        : "border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    }`}
                    placeholder="Título del producto"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Precio y Stock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Precio */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Precio ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min={0.01}
                      {...register("price", {
                        required: "El precio es obligatorio",
                        min: {
                          value: 0.01,
                          message: "El precio debe ser mayor a 0"
                        },
                        setValueAs: (value) => {
                          // Convertir el valor a string con 2 decimales
                          if (!value) return "";
                          const numValue = parseFloat(value);
                          return numValue.toFixed(2);
                        }
                      })}
                      className={`w-full px-4 py-3 rounded-lg transition-all duration-200 outline-none ${
                        errors.price
                          ? "border-2 border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                          : "border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      }`}
                      placeholder="Precio del producto"
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Stock del producto
                    </label>
                    <input
                      type="number"
                      min={0}
                      {...register("stock", {
                        required: "El stock es obligatorio",
                        min: {
                          value: 0,
                          message: "El stock no puede ser negativo"
                        }
                      })}
                      className={`w-full px-4 py-3 rounded-lg transition-all duration-200 outline-none ${
                        errors.stock
                          ? "border-2 border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                          : "border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      }`}
                      placeholder="Stock del producto"
                    />
                    {errors.stock && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.stock.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Slug del producto{" "}
                    <span className="text-slate-500 font-normal">
                      (Opcional)
                    </span>
                  </label>
                  <input
                    type="text"
                    {...register("slug")}
                    className="w-full px-4 py-3 rounded-lg transition-all duration-200 outline-none border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="camisa-azul-algodon"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Si no lo especificas, se generará automáticamente desde el
                    título. También puedes escribir cualquier texto y se
                    convertirá al formato correcto.
                  </p>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Género del producto
                  </label>
                  <select
                    {...register("gender", {
                      required: "El género es obligatorio"
                    })}
                    className={`w-full px-4 py-3 rounded-lg transition-all duration-200 outline-none ${
                      errors.gender
                        ? "border-2 border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                        : "border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    }`}
                  >
                    <option value="">Selecciona un género</option>
                    <option value="men">Hombre</option>
                    <option value="women">Mujer</option>
                    <option value="unisex">Unisex</option>
                    <option value="kid">Niño</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.gender.message}
                    </p>
                  )}
                </div>

                {/* Category/Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Categoría del producto
                  </label>
                  <select
                    {...register("type", {
                      required: "La categoría es obligatoria"
                    })}
                    className={`w-full px-4 py-3 rounded-lg transition-all duration-200 outline-none ${
                      errors.type
                        ? "border-2 border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                        : "border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    }`}
                  >
                    <option value="">Selecciona una categoría</option>
                    <option value="shirts">Camisas</option>
                    <option value="pants">Pantalones</option>
                    <option value="hoodies">Sudaderas</option>
                    <option value="hats">Gorras</option>
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.type.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descripción del producto
                  </label>
                  <textarea
                    {...register("description", {
                      required: "La descripción es obligatoria",
                      minLength: {
                        value: 10,
                        message:
                          "La descripción debe tener al menos 10 caracteres"
                      }
                    })}
                    rows={5}
                    className={`w-full px-4 py-3 rounded-lg transition-all duration-200 outline-none resize-none ${
                      errors.description
                        ? "border-2 border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                        : "border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    }`}
                    placeholder="Descripción del producto"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Tallas disponibles
              </h2>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {SIZE_OPTIONS.map((size) => (
                    <span
                      key={size}
                      className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200",
                        {
                          hidden: !selectedSizes.includes(size)
                        }
                      )}
                    >
                      {size}
                      <button
                        type="button"
                        onClick={() => removeSize(size)}
                        className="cursor-pointer rounded-2xl p-1 hover:bg-blue-200 ml-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
                  <span className="text-sm text-slate-600 mr-2">
                    Añadir tallas:
                  </span>
                  {SIZE_OPTIONS.map((size) => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => addSize(size)}
                      disabled={selectedSizes?.includes(size)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedSizes?.includes(size)
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-slate-200 text-slate-700 hover:bg-slate-300 cursor-pointer"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {/* Error message for sizes */}
                {errors.sizes && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.sizes.message}
                  </p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Etiquetas
              </h2>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {selectedTags?.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 cursor-pointer hover:bg-green-200 rounded-2xl p-1 text-green-600 hover:text-green-800 transition-colors duration-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    ref={inputTagRef}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" ||
                        e.key === "," ||
                        e.key === "Tab" ||
                        e.key === " "
                      ) {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Añadir nueva etiqueta..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 rounded-lg "
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Images */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Imágenes del producto
              </h2>

              {/* Drag & Drop Zone */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                  dragActive
                    ? "border-blue-400 bg-blue-50"
                    : "border-slate-300 hover:border-slate-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                <div className="space-y-4">
                  <Upload className="mx-auto h-12 w-12 text-slate-400" />
                  <div>
                    <p className="text-lg font-medium text-slate-700">
                      Arrastra las imágenes aquí
                    </p>
                    <p className="text-sm text-slate-500">
                      o haz clic para buscar
                    </p>
                  </div>
                  <p className="text-xs text-slate-400">
                    PNG, JPG, WebP hasta 10MB cada una
                  </p>
                </div>
              </div>

              {/* Current Images */}
              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-medium text-slate-700">
                  Imágenes actuales
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {product?.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center">
                        <img
                          src={`${IMAGE_BASE_URL}/${image}`}
                          alt="Product"
                          className="w-full h-full object-cover rounded-lg"
                          crossOrigin="anonymous"
                        />
                      </div>
                      <button
                        type="button"
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <p className="mt-1 text-xs text-slate-600 truncate">
                        {image}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Status */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Estado del producto
              </h2>

              <div className="space-y-4">
                {/* Estado */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">
                    Estado
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Activo
                  </span>
                </div>

                {/* Inventario */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">
                    Inventario
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      currentStock > 5
                        ? "bg-green-100 text-green-800"
                        : currentStock > 0
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {currentStock > 5
                      ? "En stock"
                      : currentStock > 0
                      ? "Bajo stock"
                      : "Sin stock"}
                  </span>
                </div>

                {/* Imágenes actuales */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">
                    Imágenes
                  </span>
                  <span className="text-sm text-slate-600">
                    {product?.images.length} imágenes
                  </span>
                </div>

                {/* Tallas disponibles */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">
                    Tallas disponibles
                  </span>
                  <span className="text-sm text-slate-600">
                    {selectedSizes?.length} tallas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
};
