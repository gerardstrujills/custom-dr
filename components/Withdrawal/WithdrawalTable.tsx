import { WithdrawalsQuery } from "@/gen/gql";
import { ApolloError } from "@apollo/client";
import { useEffect, useMemo } from "react";
import { useWithdrawalFiltersStore } from "../stores/useWithdrawalsFiltersStore";
import { WithdrawalFilters } from "./WithdrawalFilters";

interface Props {
  data: WithdrawalsQuery | undefined;
  loading: boolean;
  error: ApolloError | undefined;
}

export const WithdrawalTable = ({ data, loading, error }: Props) => {
  const { searchTerm, searchType, setRawWithdrawalData, getCombinedFilters } =
    useWithdrawalFiltersStore();

  const combinedFilters = getCombinedFilters();

  useEffect(() => {
    if (data?.withdrawals) {
      const formattedData = data.withdrawals.map((item) => ({
        unitOfMeasurement: item.product.unitOfMeasurement,
        materialType: item.product.materialType,
        description: item.product.description || undefined,
      }));
      setRawWithdrawalData(formattedData);
    } else {
      setRawWithdrawalData(null);
    }
  }, [data?.withdrawals, setRawWithdrawalData]);

  const processedWithdrawal = useMemo(() => {
    const withdrawals = data?.withdrawals || [];

    const productMap = new Map();

    withdrawals.forEach((item) => {
      const productId = item.product.id;

      if (!productMap.has(productId)) {
        productMap.set(productId, {
          id: productId,
          title: item.product.title,
          materialType: item.product.materialType,
          unitOfMeasurement: item.product.unitOfMeasurement,
          description: item.product.description,
          totalWithdrawn: 0,
          totalTransactions: 0,
          items: [],
        });
      }

      const product = productMap.get(productId);
      product.totalWithdrawn += item.quantity;
      product.totalTransactions += 1;
      product.items.push(item);
    });

    const result = Array.from(productMap.values()).map((product) => ({
      ...product,

      totalStock: product.totalWithdrawn,
      averagePrice: 0,
      totalValue: 0,
    }));

    return result;
  }, [data?.withdrawals]);

  const filteredWithdrawal = useMemo(() => {
    let withdrawals = processedWithdrawal;

    if (searchType === "product" && searchTerm) {
      withdrawals = withdrawals.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ??
            false)
      );
    }

    return withdrawals;
  }, [processedWithdrawal, searchTerm, searchType]);

  if (loading) return <div>Cargando salidas...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const withdrawals = filteredWithdrawal;

  return (
    <div className="s-table-container wmn100">
      <WithdrawalFilters />{" "}
      {/* Cambiado de IncomeFilters a WithdrawalFilters */}
      <table className="s-table s-table__sortable s-table__bx">
        <thead>
          <tr>
            <th scope="col">ID Producto</th>
            <th scope="col">Producto</th>
            <th scope="col">Descripción</th>
            <th scope="col" className="ta-right">
              Total Retirado
            </th>
            <th scope="col" className="ta-right">
              Transacciones
            </th>
            <th scope="col">Tipo de Material</th>
            <th scope="col">Unidad</th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.map((item) => (
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
                    item.totalWithdrawn === 0
                      ? "fc-red-600"
                      : item.totalWithdrawn < 5
                      ? "fc-yellow-600"
                      : "fc-green-600"
                  }`}
                >
                  {item.totalWithdrawn}
                </span>
              </td>
              <td className="ta-right">
                <span className="fw-bold">{item.totalTransactions}</span>
              </td>
              <td>
                <span className="s-tag s-tag__info">{item.materialType}</span>
              </td>
              <td>
                <span className="s-tag">{item.unitOfMeasurement}</span>
              </td>
            </tr>
          ))}
        </tbody>
        {withdrawals.length > 0 && (
          <tfoot>
            <tr>
              <td colSpan={3} className="ta-right fw-bold">
                Totales:
              </td>
              <td className="ta-right fw-bold">
                {withdrawals.reduce(
                  (sum, item) => sum + item.totalWithdrawn,
                  0
                )}
              </td>
              <td className="ta-right fw-bold">
                {withdrawals.reduce(
                  (sum, item) => sum + item.totalTransactions,
                  0
                )}
              </td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        )}
      </table>
      {withdrawals.length === 0 && (
        <div className="s-empty-state p24">
          <div className="s-empty-state--title">
            {searchTerm || Object.keys(combinedFilters).length > 0
              ? "No se encontraron productos con los filtros aplicados"
              : "No hay registros de salidas"}
          </div>
          <div className="s-empty-state--description">
            {searchTerm || Object.keys(combinedFilters).length > 0
              ? "Intenta ajustar los filtros de búsqueda"
              : "Las salidas de productos aparecerán aquí cuando existan registros."}
          </div>
        </div>
      )}
    </div>
  );
};
