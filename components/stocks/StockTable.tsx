// components/Withdrawal/StockTable.tsx
"use client";
import { StockQuery } from "@/gen/gql";
import { ApolloError } from "@apollo/client";
import { useEffect, useMemo } from "react";
import { useStockFiltersStore } from "../stores/useStockFilterStore";
import { StockFilters } from "./StockFilters";

interface Props {
  data: StockQuery | undefined;
  loading: boolean;
  error: ApolloError | undefined;
}

export const StockTable = ({ data, loading, error }: Props) => {
  const { searchTerm, searchType, setRawStockData, getCombinedFilters } =
    useStockFiltersStore();

  const combinedFilters = getCombinedFilters();

  useEffect(() => {
    if (data?.stock) {
      const formattedData = data.stock.map((item) => ({
        unitOfMeasurement: item.unitOfMeasurement,
        materialType: item.materialType,
        description: item.description || undefined,
      }));
      setRawStockData(formattedData);
    } else {
      setRawStockData(null);
    }
  }, [data?.stock, setRawStockData]);

  // Filtrar datos en cache para búsqueda de productos
  const filteredStock = useMemo(() => {
    const stock = data?.stock || [];

    // Si hay búsqueda de producto, aplicar filtro en cliente
    if (searchType === "product" && searchTerm) {
      return stock.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ??
            false)
      );
    }

    return stock;
  }, [data?.stock, searchTerm, searchType]);

  if (loading) return <div>Cargando stock...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const stock = filteredStock;

  return (
    <div className="s-table-container wmn100">
      <StockFilters />
      <table className="s-table s-table__sortable s-table__bx">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Producto</th>
            <th scope="col">Descripción</th>
            <th scope="col" className="ta-right">
              Stock Actual
            </th>
            <th scope="col" className="ta-right">
              Precio Promedio
            </th>
            <th scope="col" className="ta-right">
              Valor Total
            </th>
            <th scope="col">Estado</th>
          </tr>
        </thead>
        <tbody>
          {stock.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                <div className="fw-bold">{item.title}</div>
                <div className="fs-caption fc-light">
                  {item.materialType} • {item.unitOfMeasurement}
                </div>
              </td>
              <td className="text-sm">
                {`${item.description}` || "-"}
              </td>
              <td className="ta-right">
                <span
                  className={`fw-bold ${
                    item.totalStock === 0
                      ? "fc-red-600"
                      : item.totalStock < 10
                      ? "fc-yellow-600"
                      : "fc-green-600"
                  }`}
                >
                  {item.totalStock}
                </span>
              </td>
              <td className="ta-right">S/ {item.averagePrice.toFixed(2)}</td>
              <td className="ta-right fw-bold">
                S/ {item.totalValue.toFixed(2)}
              </td>
              <td>
                <span
                  className={`s-tag ${
                    item.totalStock === 0
                      ? "s-tag__danger"
                      : item.totalStock < 10
                      ? "s-tag__warning"
                      : "s-tag__success"
                  }`}
                >
                  {item.totalStock === 0
                    ? "Sin Stock"
                    : item.totalStock < 10
                    ? "Stock Bajo"
                    : "En Stock"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
        {stock.length > 0 && (
          <tfoot>
            <tr>
              <td colSpan={3} className="ta-right fw-bold">
                Totales:
              </td>
              <td className="ta-right fw-bold">
                {stock.reduce((sum, item) => sum + item.totalStock, 0)}
              </td>
              <td className="ta-right fw-bold">
                S/{" "}
                {(
                  stock.reduce((sum, item) => sum + item.averagePrice, 0) /
                  stock.length
                ).toFixed(2)}
              </td>
              <td className="ta-right fw-bold">
                S/{" "}
                {stock
                  .reduce((sum, item) => sum + item.totalValue, 0)
                  .toFixed(2)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        )}
      </table>
      {stock.length === 0 && (
        <div className="s-empty-state p24">
          <div className="s-empty-state--title">
            {searchTerm || Object.keys(combinedFilters).length > 0
              ? "No se encontraron productos con los filtros aplicados"
              : "No hay productos en stock"}
          </div>
          <div className="s-empty-state--description">
            {searchTerm || Object.keys(combinedFilters).length > 0
              ? "Intenta ajustar los filtros de búsqueda"
              : "Los productos aparecerán aquí cuando tengan stock disponible."}
          </div>
        </div>
      )}
    </div>
  );
};
