import {
  ProductsDocument,
  ProductsQuery,
  useBulkCreateProductsMutation,
  useCreateProductMutation,
} from "@/gen/gql";
import { toErrorMap } from "@/utils/toErrorMap";
import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import {
  AlertCircle,
  Check,
  CheckCircle,
  Trash,
  Upload,
  X,
} from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
import { InputField } from "../InputField";
import ModalWrapper from "../ModalWrapper";
import { ProductData, useProductStore } from "./productStore";
import { useExcelProductParser } from "./useExcelProductParser";

type BulkProductError = {
  index: number;
  field: string;
  message: string;
};

type BulkProductResult = {
  index: number;
  product?: any;
  error?: BulkProductError | null;
};

type CreateProps = {
  title: string;
  description: string;
  unitOfMeasurement: string;
  materialType: string;
};

type Props = {
  isOpen: boolean;
  handleClose: () => void;
};

const ProductCreate = ({ isOpen, handleClose }: Props) => {
  const [manual, setManual] = useState(true);
  const [upload, setUpload] = useState(false);

  const [createProduct] = useCreateProductMutation();
  const [bulkCreateProducts] = useBulkCreateProductsMutation();
  const [bulkError, setBulkError] = useState<string | null>(null);

  const products = useProductStore((s) => s.products);
  const removeProduct = useProductStore((s) => s.removeProduct);
  const clearProducts = useProductStore((s) => s.clearProducts);
  const [bulkLoading, setBulkLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bulkSuccess, setBulkSuccess] = useState(false);
  const { parseExcelFile } = useExcelProductParser();

  const [bulkResults, setBulkResults] = useState<BulkProductResult[] | null>(
    null,
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getErrorForEntry = (index: number) => {
    if (!bulkResults || bulkResults.length <= index) return null;
    return bulkResults[index]?.error || null;
  };

  const getSuccessForEntry = (index: number) => {
    if (!bulkResults || bulkResults.length <= index) return false;
    return !!bulkResults[index]?.product;
  };

  const handleSubmitBulkProducts = async () => {
    if (products.length === 0) {
      setBulkError("No hay registros para enviar");
      return;
    }

    setBulkLoading(true);
    setBulkError(null);
    setBulkSuccess(false);
    setBulkResults(null);

    try {
      const formattedProducts = products.map((product) => ({
        title: product.titulo,
        description: product.descripcion || null,
        unitOfMeasurement: product.um,
        materialType: product.tipomaterial,
      }));

      const response = await bulkCreateProducts({
        variables: {
          input: {
            products: formattedProducts,
          },
        },
        update: (cache, { data }) => {
          const result = data?.bulkCreateProducts;

          if (result && result.totalCreated > 0) {
            // Obtener productos exitosos
            const successfulProducts = result.results
              .filter((r) => r.product && r.product.id && r.product.title)
              .map((r) => ({
                ...r.product!,
                withdrawal: [],
                entry: [],
              })) as Array<{
              __typename?: "Product";
              id: number;
              title: string;
              description?: string | null;
              unitOfMeasurement: string;
              materialType: string;
              createdAt: Date;
              updatedAt: Date;
              withdrawal: [];
              entry: [];
            }>;

            if (successfulProducts.length > 0) {
              // Leer productos existentes del cache
              const existingProducts = cache.readQuery<ProductsQuery>({
                query: ProductsDocument,
              });

              if (existingProducts?.products) {
                // Escribir los nuevos productos en el cache
                cache.writeQuery<ProductsQuery>({
                  query: ProductsDocument,
                  data: {
                    products: [
                      ...successfulProducts,
                      ...existingProducts.products,
                    ],
                  },
                });
              }
            }
          }
        },
      });

      if (response.data?.bulkCreateProducts) {
        const result = response.data.bulkCreateProducts;

        // Configurar resultados
        setBulkResults(result.results);

        // Mostrar errores globales si existen
        if (result.errors && result.errors.length > 0) {
          setBulkError(
            `Errores de validación: ${result.errors
              .map((e) => e.message)
              .join(", ")}`,
          );
        }

        // Mostrar éxito si se crearon productos
        if (result.totalCreated > 0) {
          setBulkSuccess(true);

          // Limpiar productos exitosos del store
          setTimeout(() => {
            const failedIndices = result.results
              .filter((r) => !r.product)
              .map((r) => r.index);

            // Mantener solo los productos que fallaron
            const newProducts = products.filter((_, index) =>
              failedIndices.includes(index),
            );

            useProductStore.getState().setProducts(newProducts);
          }, 2000);
        }

        // Si todos fallaron, mostrar mensaje
        if (result.totalCreated === 0 && result.totalFailed > 0) {
          setBulkError("No se pudo crear ningún producto");
        }
      }
    } catch (e) {
      if (e instanceof Error) {
        setBulkError(
          `Error al enviar productos: ${e.message || "Error desconocido"}`,
        );
      }
    } finally {
      setBulkLoading(false);
    }
  };

  const handleToggleManual = () => {
    if (!manual) {
      setManual(true);
      setUpload(false);
      clearProducts();
      setBulkResults(null);
      setBulkError(null);
      setBulkSuccess(false);
    }
  };

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsLoading(true);
      setError(null);
      setBulkResults(null);
      setBulkError(null);
      setBulkSuccess(false);

      try {
        const parsedEntries = await parseExcelFile(file);

        if (parsedEntries.length === 0) {
          setError("El archivo no contiene datos válidos");
        } else {
          console.log("Datos parseados exitosamente:", parsedEntries.length);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(`Error al procesar el archivo: ${errorMessage}`);
      } finally {
        setIsLoading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [parseExcelFile],
  );

  const handleToggleUpload = () => {
    if (!upload) {
      setManual(false);
      setUpload(true);
      clearProducts();
      setBulkResults(null);
      setBulkError(null);
      setBulkSuccess(false);
    }
  };

  const handleClearAll = () => {
    clearProducts();
    setBulkResults(null);
    setBulkError(null);
    setBulkSuccess(false);
  };

  // Calcular estadísticas
  const successfulCount = bulkResults
    ? bulkResults.filter((r) => r.product).length
    : 0;
  const failedCount = bulkResults
    ? bulkResults.filter((r) => r.error).length
    : 0;
  const pendingCount = products.length - successfulCount - failedCount;

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={handleClose}
      className={upload && products.length > 0 ? "ws8 p12" : "ws4 p12"}
    >
      <div className="d-flex jc-space-between my-4">
        <div className="flex--item mx-auto">
          <div id="tabs-interval" className="subtabs">
            <a
              onClick={handleToggleUpload}
              className={upload ? "youarehere is-selected" : ""}
            >
              <h3 className="fs-headline m0">Automatico</h3>
            </a>
            <a
              onClick={handleToggleManual}
              className={manual ? "youarehere is-selected" : ""}
            >
              <h3 className="fs-headline m0">Manual</h3>
            </a>
          </div>
        </div>
      </div>

      {manual && (
        <Formik
          initialValues={{
            title: "",
            description: "",
            unitOfMeasurement: "",
            materialType: "",
          }}
          onSubmit={async (values: CreateProps, { setErrors }) => {
            const response = await createProduct({
              variables: {
                input: {
                  ...values,
                },
              },
              update: (cache, { data }) => {
                const existingProducts = cache.readQuery<ProductsQuery>({
                  query: ProductsDocument,
                });

                if (existingProducts?.products && data?.createProduct.product) {
                  cache.writeQuery<ProductsQuery>({
                    query: ProductsDocument,
                    data: {
                      products: [
                        ...existingProducts.products,
                        {
                          ...data.createProduct.product,
                          withdrawal: [],
                          entry: [],
                        },
                      ],
                    },
                  });
                }
              },
            });

            if (response.data?.createProduct.errors) {
              setErrors(toErrorMap(response.data.createProduct.errors));
            } else if (response.data?.createProduct.product) {
              handleClose();
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="fs-headline1 mb8 fc-black-700">
                Crear Producto
              </div>
              <span className="fs-caption fc-black-400 ta-left">
                Desarrolla tus productos más innovadores para tu almacén y
                gestiona su seguimiento de manera eficiente.
              </span>
              <div className="d-flex fd-column gs4 gsy mt8">
                <InputField label="Título" name="title" />
                <InputField label="Descripción" name="description" />
                <InputField label="U/M" name="unitOfMeasurement" />
                <InputField label="Tipo Material" name="materialType" />
                <Button
                  isLoading={isSubmitting}
                  type="submit"
                  className="flex--item s-btn s-btn__primary p6"
                >
                  Crear Producto
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}

      {upload && (
        <div className="w-full space-y-4">
          {products.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 p-8">
              <div className="flex flex-col items-center justify-center text-center px-4">
                <Upload size={48} className="mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">Subir archivo Excel</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Sube un archivo Excel con los productos. El formato debe
                  incluir:
                </p>
                <div className="text-xs text-gray-500 mb-4 text-left">
                  <p>
                    • <span className="font-medium">titulo</span>: Nombre del
                    producto
                  </p>
                  <p>
                    • <span className="font-medium">descripcion</span>:
                    Descripción (opcional)
                  </p>
                  <p>
                    • <span className="font-medium">um</span>: Unidad de medida
                  </p>
                  <p>
                    • <span className="font-medium">tipomaterial</span>: Tipo de
                    material
                  </p>
                </div>
                <label htmlFor="excel-file-product">
                  <Button
                    className="flex--item s-btn s-btn__primary p6"
                    onClick={handleClick}
                    disabled={isLoading}
                  >
                    {isLoading ? "Procesando..." : "Seleccionar Excel"}
                  </Button>
                </label>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
                disabled={isLoading}
                id="excel-file-product"
              />
            </div>
          )}

          {error && (
            <div className="flex gap-2 rounded-md bg-red-50 p-3 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {bulkError && (
            <div className="flex gap-2 rounded-md bg-red-50 p-3 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{bulkError}</p>
            </div>
          )}

          {bulkSuccess && successfulCount > 0 && (
            <div className="flex gap-2 rounded-md bg-green-50 p-3 text-green-700">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">
                  {successfulCount} productos creados exitosamente
                </p>
                {failedCount > 0 && (
                  <p className="text-xs mt-1">
                    {failedCount} productos no se pudieron crear
                  </p>
                )}
              </div>
            </div>
          )}

          {products.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">
                    Registros Cargados ({products.length})
                  </h3>
                  {bulkResults && (
                    <div className="flex gap-3 mt-1">
                      {successfulCount > 0 && (
                        <span className="text-xs text-green-600">
                          ✓ {successfulCount} exitosos
                        </span>
                      )}
                      {failedCount > 0 && (
                        <span className="text-xs text-red-600">
                          ✗ {failedCount} fallados
                        </span>
                      )}
                      {pendingCount > 0 && (
                        <span className="text-xs text-gray-500">
                          ⏳ {pendingCount} pendientes
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {products.length > 0 && !bulkLoading && (
                    <Button
                      onClick={handleClearAll}
                      className="flex--item s-btn s-btn__muted p6"
                      variant="outline"
                    >
                      Limpiar Todo
                    </Button>
                  )}
                  <Button
                    onClick={handleSubmitBulkProducts}
                    isLoading={bulkLoading}
                    disabled={products.length === 0 || bulkLoading}
                    className="flex--item s-btn s-btn__primary p6"
                  >
                    {bulkLoading ? "Enviando..." : "Enviar Todos"}
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        #
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        Título
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        Descripción
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        U/M
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        Tipo Material
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {products.map((product: ProductData, index: number) => {
                      const error = getErrorForEntry(index);
                      const isSuccess = getSuccessForEntry(index);
                      const isFailed = !!error;

                      return (
                        <tr
                          key={index}
                          className={`hover:bg-gray-50 ${
                            isFailed
                              ? "bg-red-50"
                              : isSuccess
                                ? "bg-green-50"
                                : ""
                          }`}
                        >
                          <td className="px-4 py-3 font-medium">{index + 1}</td>
                          <td className="px-4 py-3">{product.titulo}</td>
                          <td className="px-4 py-3">
                            {product.descripcion || "-"}
                          </td>
                          <td className="px-4 py-3">{product.um}</td>
                          <td className="px-4 py-3">{product.tipomaterial}</td>
                          <td className="px-4 py-3">
                            {error ? (
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded-full bg-red-100">
                                  <X size={14} className="text-red-600" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-red-600 text-xs font-medium">
                                    Error
                                  </span>
                                  <span
                                    className="text-red-500 text-xs truncate max-w-xs"
                                    title={error.message}
                                  >
                                    {error.message}
                                  </span>
                                </div>
                              </div>
                            ) : isSuccess ? (
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded-full bg-green-100">
                                  <Check size={14} className="text-green-600" />
                                </div>
                                <span className="text-green-600 text-xs font-medium">
                                  Creado
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-500 text-xs">
                                Pendiente
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {!isSuccess && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeProduct(index)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash size={16} />
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-sm text-gray-500">
                  Total: {products.length} registros
                </span>
                <div className="flex gap-2">
                  <Button
                    onClick={handleClick}
                    leftIcon={<Upload size={16} />}
                    variant="outline"
                    size="sm"
                  >
                    Agregar Más
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="add-excel-file"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </ModalWrapper>
  );
};

export default ProductCreate;
