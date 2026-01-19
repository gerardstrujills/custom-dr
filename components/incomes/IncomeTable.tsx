import { IncomesQuery } from "@/gen/gql";
import { ApolloError } from "@apollo/client";
import { useEffect, useMemo } from "react";
import { useIncomeFiltersStore } from "../stores/useIncomeFilterStore";
import { IncomeFilters } from "./IncomeFilters";

interface Props {
  data: IncomesQuery | undefined;
  loading: boolean;
  error: ApolloError | undefined;
}

export const IncomeTable = ({ data, loading, error }: Props) => {
  const { searchTerm, searchType, setRawIncomeData, getCombinedFilters } =
    useIncomeFiltersStore();

  const combinedFilters = getCombinedFilters();

  useEffect(() => {
    if (data?.incomes) {
      const formattedData = data.incomes.map((item) => ({
        unitOfMeasurement: item.product.unitOfMeasurement,
        materialType: item.product.materialType,
        description: item.product.description || undefined,
      }));
      setRawIncomeData(formattedData);
    } else {
      setRawIncomeData(null);
    }
  }, [data?.incomes, setRawIncomeData]);

  // Procesar y calcular datos para la tabla
  const processedIncome = useMemo(() => {
    const income = data?.incomes || [];

    // Agrupar por producto y calcular métricas
    const productMap = new Map();

    income.forEach((item) => {
      const productId = item.product.id;

      if (!productMap.has(productId)) {
        productMap.set(productId, {
          id: productId,
          title: item.product.title,
          materialType: item.product.materialType,
          unitOfMeasurement: item.product.unitOfMeasurement,
          description: item.product.description,
          totalStock: 0,
          totalValue: 0,
          totalCost: 0,
          items: [],
        });
      }

      const product = productMap.get(productId);
      product.totalStock += item.quantity;
      product.totalCost += item.quantity * item.price;
      product.items.push(item);
    });

    // Calcular métricas finales
    const result = Array.from(productMap.values()).map((product) => ({
      ...product,
      averagePrice:
        product.totalStock > 0 ? product.totalCost / product.totalStock : 0,
      totalValue: product.totalCost,
    }));

    return result;
  }, [data?.incomes]);

  // Filtrar datos procesados para búsqueda de productos
  const filteredIncome = useMemo(() => {
    let income = processedIncome;

    // Si hay búsqueda de producto, aplicar filtro en cliente
    if (searchType === "product" && searchTerm) {
      income = income.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ??
            false)
      );
    }

    return income;
  }, [processedIncome, searchTerm, searchType]);

  if (loading) return <div>Cargando entradas...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const income = filteredIncome;

  return (
    <div className="s-table-container wmn100">
      <IncomeFilters />
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
          {income.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                <div className="fw-bold">{item.title}</div>
                <div className="fs-caption fc-light">
                  {item.materialType} • {item.unitOfMeasurement}
                </div>
              </td>
              <td className="text-sm">
                {item.description ? `${item.description}` : "-"}
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
        {income.length > 0 && (
          <tfoot>
            <tr>
              <td colSpan={3} className="ta-right fw-bold">
                Totales:
              </td>
              <td className="ta-right fw-bold">
                {income.reduce((sum, item) => sum + item.totalStock, 0)}
              </td>
              <td className="ta-right fw-bold">
                S/{" "}
                {(
                  income.reduce((sum, item) => sum + item.averagePrice, 0) /
                  income.length
                ).toFixed(2)}
              </td>
              <td className="ta-right fw-bold">
                S/{" "}
                {income
                  .reduce((sum, item) => sum + item.totalValue, 0)
                  .toFixed(2)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        )}
      </table>
      {income.length === 0 && (
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
