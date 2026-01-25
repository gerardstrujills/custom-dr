import {
  ProductsDocument,
  ProductsQuery,
  useCreateBulkEntriesMutation,
  useCreateEntryMutation,
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
import { useCallback, useEffect, useRef, useState } from "react";
import { InputField } from "../InputField";
import ModalWrapper from "../ModalWrapper";
import { EntryData, useEntryStore } from "./entryStore";
import { useExcelParser } from "./useExcelParser";

type Product = {
  id: number;
  description?: string | null;
  materialType: string;
  title: string;
  unitOfMeasurement: string;
  createdAt: any;
  updatedAt: any;
};

type CreateProps = {
  ruc: string;
  quantity: number;
  price: number;
  startTime: string;
};

type Props = {
  product: Product;
  isOpen: boolean;
  handleClose: () => void;
};

type BulkEntryError = {
  index: number;
  field: string;
  message: string;
  ruc?: string;
  productId?: number;
};

type BulkEntryResult = {
  entry?: any;
  errors?: BulkEntryError[];
};

type BulkEntryResponse = {
  createBulkEntries: {
    results: BulkEntryResult[];
    total: number;
    successCount: number;
    errorCount: number;
  };
};

const EntryCreate = ({ isOpen, product, handleClose }: Props) => {
  const [manual, setManual] = useState<boolean>(true);
  const [upload, setUpload] = useState<boolean>(false);
  const [createEntry] = useCreateEntryMutation();
  const [createBulkEntries] = useCreateBulkEntriesMutation();
  const productId = product.id;

  const handleToggleManual = () => {
    if (!manual) {
      setManual(true);
      setUpload(false);
    }
  };

  const handleToggleUpload = () => {
    if (!upload) {
      setManual(false);
      setUpload(true);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [bulkResults, setBulkResults] = useState<BulkEntryResult[] | null>(
    null,
  );
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkSuccess, setBulkSuccess] = useState(false);
  const { parseExcelFile } = useExcelParser();
  const entries = useEntryStore((state) => state.entries);
  const removeEntry = useEntryStore((state) => state.removeEntry);
  const clearEntries = useEntryStore((state) => state.clearEntries);

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
          console.log("Datos parseados exitosamente:", parsedEntries);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(`Error al procesar el archivo: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    },
    [parseExcelFile],
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmitBulkEntries = async () => {
    if (entries.length === 0) {
      setBulkError("No hay registros para enviar");
      return;
    }

    setBulkLoading(true);
    setBulkError(null);
    setBulkSuccess(false);
    setBulkResults(null);

    try {
      // Transformar los datos al formato esperado por GraphQL
      const formattedEntries = entries.map((entry) => ({
        productId: entry.productId,
        ruc: entry.ruc,
        quantity: entry.quantity,
        price: entry.price,
        startTime:
          entry.startTime instanceof Date
            ? entry.startTime.toISOString()
            : new Date(entry.startTime).toISOString(),
      }));

      const response = await createBulkEntries({
        variables: {
          input: {
            entries: formattedEntries,
          },
        },
        update: (cache, { data }) => {
          const result = data?.createBulkEntries;

          if (result && result.successCount > 0) {
            // Leer la caché actual
            const existing = cache.readQuery<ProductsQuery>({
              query: ProductsDocument,
            });

            if (existing?.products) {
              // Obtener todas las entradas exitosas
              const successfulEntries = result.results
                .filter((r) => r.entry)
                .map((r) => r.entry!);

              // Crear un mapa para agrupar entradas por productId
              const entriesByProductId = new Map<
                number,
                (typeof successfulEntries)[0][]
              >();

              successfulEntries.forEach((entry) => {
                const productId = entry.product.id;
                if (!entriesByProductId.has(productId)) {
                  entriesByProductId.set(productId, []);
                }
                entriesByProductId.get(productId)!.push(entry);
              });

              // Actualizar la caché para cada producto
              const updatedProducts = existing.products.map((product) => {
                const productEntries = entriesByProductId.get(product.id);
                if (productEntries && productEntries.length > 0) {
                  // Mapear las nuevas entradas al formato de caché
                  const mappedEntries = productEntries.map((entry) => ({
                    __typename: "Entry" as const,
                    id: entry.id,
                    quantity: entry.quantity,
                    price: entry.price,
                    startTime: entry.startTime,
                    createdAt: entry.createdAt,
                    updatedAt: entry.updatedAt,
                    supplier: {
                      __typename: "Supplier" as const,
                      id: entry.supplier.id,
                      name: entry.supplier.name,
                      ruc: entry.supplier.ruc,
                      district: entry.supplier.district,
                      province: entry.supplier.province,
                      department: entry.supplier.department,
                      productCount: entry.supplier.productCount,
                      createdAt: entry.supplier.createdAt,
                      updatedAt: entry.supplier.updatedAt,
                    },
                  }));

                  return {
                    ...product,
                    entry: [...(product.entry || []), ...mappedEntries],
                  };
                }
                return product;
              });

              // Escribir los datos actualizados en la caché
              cache.writeQuery<ProductsQuery>({
                query: ProductsDocument,
                data: {
                  products: updatedProducts,
                },
              });
            }
          }
        },
      });

      const result = response.data
        ?.createBulkEntries as BulkEntryResponse["createBulkEntries"];

      if (result) {
        setBulkResults(result.results);

        if (result.successCount > 0) {
          setBulkSuccess(true);

          // Eliminar solo los registros exitosos del store
          // Mantener los registros fallidos
          const successfulIndices = result.results
            .filter((r) => r.entry)
            .map((_, index) => index);

          // Eliminar los exitosos del store en orden inverso para no afectar los índices
          successfulIndices.reverse().forEach((index) => {
            removeEntry(index);
          });

          // Si todos fueron exitosos, limpiar todo
          if (result.errorCount === 0) {
            clearEntries();
          }
        }

        // Mostrar resumen
        if (result.errorCount > 0) {
          setBulkError(
            `${result.errorCount} registro(s) fallaron. Revise los errores.`,
          );
        }
      }

      if (response.errors) {
        setBulkError("Error en la conexión con el servidor");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setBulkError(`Error al enviar los registros: ${errorMessage}`);
    } finally {
      setBulkLoading(false);
    }
  };

  const getErrorForEntry = (index: number) => {
    if (!bulkResults || bulkResults.length <= index) return null;

    const result = bulkResults[index];
    return result.errors?.[0];
  };

  useEffect(() => {
    if (!isOpen) {
      clearEntries();
    }
  }, [isOpen, clearEntries]);

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={handleClose}
      className={upload && entries.length > 0 ? "ws8 p12" : "ws4 p12"}
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
            productId,
            ruc: "",
            quantity: 0,
            price: 0,
            startTime: new Date().toISOString().split("T")[0],
          }}
          onSubmit={async (values: CreateProps, { setErrors }) => {
            const response = await createEntry({
              variables: {
                input: {
                  productId,
                  ...values,
                  quantity: Number(values.quantity),
                  startTime: new Date(values.startTime).toISOString(),
                },
              },
              update: (cache, { data }) => {
                const existing = cache.readQuery<ProductsQuery>({
                  query: ProductsDocument,
                });

                if (existing?.products && data?.createEntry.entry) {
                  const newEntry = data.createEntry.entry;

                  const mappedEntry = {
                    __typename: "Entry" as const,
                    id: newEntry.id,
                    quantity: newEntry.quantity,
                    price: newEntry.price,
                    startTime: newEntry.startTime,
                    createdAt: newEntry.createdAt,
                    updatedAt: newEntry.updatedAt,
                    supplier: {
                      __typename: "Supplier" as const,
                      id: newEntry.supplier.id,
                      name: newEntry.supplier.name,
                      ruc: newEntry.supplier.ruc,
                      district: newEntry.supplier.district,
                      province: newEntry.supplier.province,
                      department: newEntry.supplier.department,
                      productCount: newEntry.supplier.productCount,
                      createdAt: newEntry.supplier.createdAt,
                      updatedAt: newEntry.supplier.updatedAt,
                    },
                  };

                  const updatedProducts = existing.products.map((product) => {
                    if (product.id === productId) {
                      return {
                        ...product,
                        entry: [...product.entry, mappedEntry],
                      };
                    }
                    return product;
                  });

                  cache.writeQuery<ProductsQuery>({
                    query: ProductsDocument,
                    data: {
                      products: updatedProducts,
                    },
                  });
                }
              },
            });

            if (response.data?.createEntry.errors) {
              setErrors(toErrorMap(response.data.createEntry.errors));
            } else if (response.data?.createEntry.entry) {
              handleClose();
            }
          }}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <div className="fs-headline1 mb8 fc-black-700">Proveedor</div>
              <span className="fs-caption fc-black-400 ta-left">
                Coordina con tu proveedor la gestión del producto de entrada
                para obtener más detalles y seguimiento.
              </span>
              <div className="d-flex fd-column gs4 gsy mt8">
                <InputField label="Ruc" name="ruc" />
                <InputField label="Cantidad" name="quantity" type="number" />
                <InputField
                  label="Precio"
                  name="price"
                  type="number"
                  step="0.01"
                />
                <InputField
                  label="Fecha Ingreso"
                  name="startTime"
                  type="date"
                  value={values.startTime}
                  onChange={(e) => {
                    setFieldValue("startTime", e.target.value);
                  }}
                />
                <Button
                  isLoading={isSubmitting}
                  type="submit"
                  className="flex--item s-btn s-btn__primary p6"
                >
                  Continuar
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
      {upload && (
        <div className="w-full space-y-4">
          {entries.length === 0 && (
            <div className="flex justify-center items-center gap-2">
              <div className="flex flex-col items-center justify-center text-center px-4">
                <Upload size={32} />
                <p className="text-sm mt-4">Arrastra tu archivo Excel aquí</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  o haz clic para seleccionarlo
                </p>
                <label htmlFor="excel-file-input">
                  <Button
                    className="flex--item s-btn s-btn__primary p6"
                    onClick={handleClick}
                    disabled={isLoading}
                  >
                    Seleccionar Excel
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
                id="excel-file-input"
              />
            </div>
          )}

          {error && (
            <div className="flex gap-2 rounded-md bg-red-50 p-3 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {bulkError && entries.length > 0 && (
            <div className="flex gap-2 rounded-md bg-red-50 p-3 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{bulkError}</p>
            </div>
          )}

          {bulkSuccess && (
            <div className="flex gap-2 rounded-md bg-green-50 p-3 text-green-700">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">
                {bulkResults?.filter((r) => r.entry).length} registros enviados
                exitosamente
              </p>
            </div>
          )}

          {entries.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="flex-1 font-semibold text-sm">
                  Registros Cargados ({entries.length})
                </h3>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleSubmitBulkEntries}
                    isLoading={bulkLoading}
                    disabled={entries.length === 0 || bulkLoading}
                    className="flex--item s-btn s-btn__primary p6"
                  >
                    {bulkLoading ? "Enviando..." : "Enviar Todos"}
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="px-2 py-2 text-left">Producto ID</th>
                      <th className="px-2 py-2 text-left">Cantidad</th>
                      <th className="px-2 py-2 text-left">Precio</th>
                      <th className="px-2 py-2 text-left">RUC</th>
                      <th className="px-2 py-2 text-left">Fecha</th>
                      <th className="px-2 py-2 text-left">Estado</th>
                      <th className="px-2 py-2 text-left">Eliminar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry: EntryData, index: number) => {
                      const error = getErrorForEntry(index);
                      const isSuccess = bulkResults?.[index]?.entry;

                      return (
                        <tr
                          key={index}
                          className={`border-b hover:bg-gray-50 ${
                            error ? "bg-red-50" : isSuccess ? "bg-green-50" : ""
                          }`}
                        >
                          <td className="px-2 py-2">{entry.productId}</td>
                          <td className="px-2 py-2">{entry.quantity}</td>
                          <td className="px-2 py-2">
                            S/ {entry.price.toFixed(2)}
                          </td>
                          <td className="px-2 py-2">{entry.ruc}</td>
                          <td className="px-2 py-2">
                            {entry.startTime instanceof Date
                              ? entry.startTime.toLocaleDateString("es-PE")
                              : new Date(entry.startTime).toLocaleDateString(
                                  "es-PE",
                                )}
                          </td>
                          <td className="px-2 py-2">
                            {error ? (
                              <div className="flex items-center">
                                <div className="flex-col">
                                  <X size={18} color="red" />
                                </div>

                                <span
                                  className="text-red-600 text-xs"
                                  title={error.message.toUpperCase()}
                                >
                                  {error.message.toUpperCase()}
                                </span>
                              </div>
                            ) : isSuccess ? (
                              <span className="text-green-600 text-xs">
                                <Check /> Exitoso
                              </span>
                            ) : (
                              <span className="text-gray-500 text-xs">
                                Pendiente
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-2">
                            <Button
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => removeEntry(index)}
                            >
                              <Trash size={16} color="red" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </ModalWrapper>
  );
};

export default EntryCreate;
