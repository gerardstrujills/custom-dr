// /Users/gerardotrujillo/Documents/Stack/GitHub/almacen/customs/components/Withdrawal/WithdrawalCreate.tsx
import {
  ProductsDocument,
  ProductsQuery,
  useCreateBulkWithdrawalsMutation,
  useCreateWithdrawalMutation,
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
import React, { useCallback, useEffect, useRef, useState } from "react";
import { InputField } from "../InputField";
import ModalWrapper from "../ModalWrapper";
import { useWithdrawalExcelParser } from "./useWithdrawalExcelParser";
import { useWithdrawalStore, WithdrawalData } from "./withdrawalStore";

type Product = {
  id: number;
  description?: string | null;
  materialType: string;
  title: string;
  unitOfMeasurement: string;
  createdAt: any;
  updatedAt: any;
  withdrawal?: Array<{
    id: number;
    title: string | null;
    quantity: number;
    endTime: string;
    createdAt: string;
    updatedAt: string;
  }>;
};

type CreateProps = {
  title: string;
  quantity: number;
  endTime: string;
};

type Props = {
  product: Product;
  isOpen: boolean;
  handleClose: () => void;
};

// Usa los tipos exactos de GraphQL
type BulkWithdrawalError = {
  index?: number | null;
  field: string;
  message: string;
  productId?: number | null;
};

type BulkWithdrawalResult = {
  withdrawal?: {
    id: number;
    title?: string | null;
    quantity: number;
    endTime: any; // Usar 'any' para evitar problemas de tipo con DateTimeISO
    createdAt: any;
    updatedAt: any;
  } | null;
  errors?: BulkWithdrawalError[] | null;
};

const WithdrawalCreate = ({ isOpen, product, handleClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createBulkWithdrawals] = useCreateBulkWithdrawalsMutation();
  const [manual, setManual] = useState<boolean>(true);
  const [upload, setUpload] = useState<boolean>(false);
  const [createWithdrawal] = useCreateWithdrawalMutation();
  const { id: productId } = product;
  const [bulkResults, setBulkResults] = useState<BulkWithdrawalResult[] | null>(
    null,
  );
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkSuccess, setBulkSuccess] = useState(false);
  const { parseExcelFile } = useWithdrawalExcelParser();
  const withdrawals = useWithdrawalStore((state) => state.withdrawals);
  const removeWithdrawal = useWithdrawalStore(
    (state) => state.removeWithdrawal,
  );
  const clearWithdrawals = useWithdrawalStore((state) => state.clearWithdrawal);

  const handleSubmitBulkWithdrawals = async () => {
    if (withdrawals.length === 0) {
      setBulkError("No hay registros para enviar");
      return;
    }

    setBulkLoading(true);
    setBulkError(null);
    setBulkSuccess(false);
    setBulkResults(null);

    try {
      // Transformar los datos al formato esperado por GraphQL
      const formattedWithdrawals = withdrawals.map((withdrawal) => ({
        productId: withdrawal.productId,
        title: withdrawal.title,
        quantity: withdrawal.quantity,
        endTime:
          withdrawal.endTime instanceof Date
            ? withdrawal.endTime.toISOString()
            : new Date(withdrawal.endTime).toISOString(),
      }));

      const response = await createBulkWithdrawals({
        variables: {
          input: { withdrawals: formattedWithdrawals },
        },
        update: (cache, { data }) => {
          const result = data?.createBulkWithdrawals;
          if (!result?.results?.length) return;

          const existing = cache.readQuery<ProductsQuery>({
            query: ProductsDocument,
          });

          if (!existing?.products) return;

          // 1) arma una lista de "nuevas salidas" exitosas con su productId
          const successful = result.results
            .map((r, index) => {
              if (!r.withdrawal) return null;

              const productIdFromInput = formattedWithdrawals[index]?.productId;
              if (!productIdFromInput) return null;

              const w = r.withdrawal;

              const mappedWithdrawal = {
                __typename: "Withdrawal" as const,
                id: w.id,
                title: w.title ?? null,
                quantity: w.quantity,
                endTime: w.endTime,
                createdAt: w.createdAt,
                updatedAt: w.updatedAt,
              };

              return {
                productId: productIdFromInput,
                withdrawal: mappedWithdrawal,
              };
            })
            .filter(Boolean) as Array<{
            productId: number;
            withdrawal: {
              __typename: "Withdrawal";
              id: number;
              title: string | null;
              quantity: number;
              endTime: any;
              createdAt: any;
              updatedAt: any;
            };
          }>;

          if (successful.length === 0) return;

          // 2) actualiza products agregando withdrawals sin duplicar por id
          const updatedProducts = existing.products.map((p) => {
            const additions = successful
              .filter((s) => s.productId === p.id)
              .map((s) => s.withdrawal);

            if (additions.length === 0) return p;

            const current = p.withdrawal || [];
            const seen = new Set(current.map((x) => x.id));

            const merged = [...current];
            for (const add of additions) {
              if (!seen.has(add.id)) {
                merged.push(add);
                seen.add(add.id);
              }
            }

            return { ...p, withdrawal: merged };
          });

          cache.writeQuery<ProductsQuery>({
            query: ProductsDocument,
            data: { products: updatedProducts },
          });
        },
      });

      const result = response.data?.createBulkWithdrawals;

      if (result) {
        // Convertir los resultados al tipo correcto
        const typedResults: BulkWithdrawalResult[] = result.results.map(
          (r) => ({
            withdrawal: r.withdrawal
              ? {
                  id: r.withdrawal.id,
                  title: r.withdrawal.title ?? null,
                  quantity: r.withdrawal.quantity,
                  endTime: r.withdrawal.endTime,
                  createdAt: r.withdrawal.createdAt,
                  updatedAt: r.withdrawal.updatedAt,
                }
              : null,
            errors: r.errors
              ? r.errors.map((e) => ({
                  index: e?.index ?? undefined,
                  field: e?.field ?? "",
                  message: e?.message ?? "",
                  productId: e?.productId ?? undefined,
                }))
              : null,
          }),
        );

        setBulkResults(typedResults);

        if (result.successCount > 0) {
          setBulkSuccess(true);

          // Eliminar solo los registros exitosos del store
          // Mantener los registros fallidos
          const successfulIndices = typedResults
            .filter((r) => r.withdrawal)
            .map((_, index) => index);

          // Eliminar los exitosos del store en orden inverso para no afectar los índices
          successfulIndices.reverse().forEach((index) => {
            removeWithdrawal(index);
          });

          // Si todos fueron exitosos, limpiar todo
          if (result.errorCount === 0) {
            clearWithdrawals();
            handleClose(); // Cerrar el modal si todo fue exitoso
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

  const getErrorForWithdrawal = (index: number) => {
    if (!bulkResults || bulkResults.length <= index) return null;

    const result = bulkResults[index];
    return result.errors?.[0];
  };

  useEffect(() => {
    if (!isOpen) {
      clearWithdrawals();
      setBulkResults(null);
      setBulkError(null);
      setBulkSuccess(false);
    }
  }, [isOpen, clearWithdrawals]);

  const handleClick = () => {
    fileInputRef.current?.click();
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
        const parsed = await parseExcelFile(file);

        if (parsed.length === 0) {
          setError("El archivo no contiene datos válidos");
        } else {
          console.log("Datos parseados exitosamente:", parsed);
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

  const handleToggleManual = () => {
    if (!manual) {
      setManual(true);
      setUpload(false);
      clearWithdrawals();
      setBulkResults(null);
      setBulkError(null);
      setBulkSuccess(false);
    }
  };

  const handleToggleUpload = () => {
    if (!upload) {
      setManual(false);
      setUpload(true);
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={handleClose}
      className={upload && withdrawals.length > 0 ? "ws8 p12" : "ws4 p12"}
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
            title: "",
            quantity: 0,
            endTime: new Date().toISOString(),
          }}
          onSubmit={async (values: CreateProps, { setErrors }) => {
            const response = await createWithdrawal({
              variables: {
                input: {
                  productId,
                  title: values.title,
                  quantity: Number(values.quantity),
                  endTime: new Date(values.endTime).toISOString(),
                },
              },
              update: (cache, { data }) => {
                const existing = cache.readQuery<ProductsQuery>({
                  query: ProductsDocument,
                });

                if (existing?.products && data?.createWithdrawal.withdrawal) {
                  const newWithdrawal = data.createWithdrawal.withdrawal;

                  // Mapear la nueva salida al formato de caché (sin product)
                  const mappedWithdrawal = {
                    __typename: "Withdrawal" as const,
                    id: newWithdrawal.id,
                    title: newWithdrawal.title ?? null,
                    quantity: newWithdrawal.quantity,
                    endTime: newWithdrawal.endTime,
                    createdAt: newWithdrawal.createdAt,
                    updatedAt: newWithdrawal.updatedAt,
                  };

                  const updatedProducts = existing.products.map((product) => {
                    if (product.id === productId) {
                      const withdrawals = product.withdrawal || [];

                      // Verificar si ya existe esta salida
                      const isExistingWithdrawal = withdrawals.some(
                        (withdrawal) => withdrawal.id === newWithdrawal.id,
                      );

                      return {
                        ...product,
                        withdrawal: isExistingWithdrawal
                          ? withdrawals
                          : [...withdrawals, mappedWithdrawal],
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

            if (response.data?.createWithdrawal.errors) {
              setErrors(toErrorMap(response.data.createWithdrawal.errors));
            } else if (response.data?.createWithdrawal.withdrawal) {
              handleClose();
            }
          }}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <div className="fs-headline1 mb8 fc-black-700">Crear Salida</div>
              <span className="fs-caption fc-black-400 ta-left">
                Optimiza la gestión de tu almacén en las salidas de productos.
              </span>
              <div className="d-flex fd-column gs4 gsy mt8">
                <InputField label="Proyecto" name="title" />
                <InputField label="Cantidad" name="quantity" type="number" />
                <InputField
                  label="Fecha Salida"
                  name="endTime"
                  type="datetime-local"
                  value={values.endTime.split(".")[0]}
                  onChange={(e) => {
                    const isoDateTime = new Date(e.target.value).toISOString();
                    setFieldValue("endTime", isoDateTime);
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
          {withdrawals.length === 0 && (
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

          {bulkError && withdrawals.length > 0 && (
            <div className="flex gap-2 rounded-md bg-red-50 p-3 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{bulkError}</p>
            </div>
          )}

          {bulkSuccess && (
            <div className="flex gap-2 rounded-md bg-green-50 p-3 text-green-700">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">
                {bulkResults?.filter((r) => r.withdrawal).length} registros
                enviados exitosamente
              </p>
            </div>
          )}

          {withdrawals.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="flex-1 font-semibold text-sm">
                  Registros Cargados ({withdrawals.length})
                </h3>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleSubmitBulkWithdrawals}
                    isLoading={bulkLoading}
                    disabled={withdrawals.length === 0 || bulkLoading}
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
                      <th className="px-2 py-2 text-left">Título</th>
                      <th className="px-2 py-2 text-left">Cantidad</th>
                      <th className="px-2 py-2 text-left">Fecha Salida</th>
                      <th className="px-2 py-2 text-left">Estado</th>
                      <th className="px-2 py-2 text-left">Eliminar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map((w: WithdrawalData, index: number) => {
                      const error = getErrorForWithdrawal(index);
                      const isSuccess = bulkResults?.[index]?.withdrawal;

                      return (
                        <tr
                          key={index}
                          className={`border-b hover:bg-gray-50 ${
                            error ? "bg-red-50" : isSuccess ? "bg-green-50" : ""
                          }`}
                        >
                          <td className="px-2 py-2">{w.productId}</td>
                          <td className="px-2 py-2">{w.title}</td>
                          <td className="px-2 py-2">{w.quantity.toFixed(2)}</td>
                          <td className="px-2 py-2">
                            {new Date(w.endTime).toLocaleDateString("es-PE")}
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
                          <td className="px-2 py-2">
                            <Button
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => removeWithdrawal(index)}
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

export default WithdrawalCreate;
