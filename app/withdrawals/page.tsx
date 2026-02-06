"use client";
import { withApollo } from "@/apollo/withApollo";
import Container from "@/components/Container";
import { useWithdrawalFiltersStore } from "@/components/stores/useWithdrawalsFiltersStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WithdrawalDateRangePicker from "@/components/Withdrawal/WithdrawalDateRangePicker";
import { WithdrawalTable } from "@/components/Withdrawal/WithdrawalTable";
import { useMeQuery, useWithdrawalsQuery } from "@/gen/gql";
import { FilterX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import * as XLSX from "xlsx";

const Page = () => {
  const {
    resetFilters,
    uniqueFilterValues,
    selectedFilters,
    setSelectedFilters,
    getCombinedFilters,
    searchType,
  } = useWithdrawalFiltersStore();

  const combinedFilters = getCombinedFilters();

  const { data, loading, error, refetch } = useWithdrawalsQuery({
    variables: {
      filters: {
        ...combinedFilters,
        // No incluimos description en los filtros de API si es búsqueda de producto
        // A menos que esté en selectedFilters
        ...(searchType === "supplier" || selectedFilters.description
          ? {}
          : { description: undefined }),
      },
    },
  });

  const { data: user, refetch: userFetch, error: userError } = useMeQuery();
  const router = useRouter();

  const handleFilterChange = (
    key: keyof typeof selectedFilters,
    value: string,
  ) => {
    setSelectedFilters({
      ...selectedFilters,
      [key]: value === "all" ? undefined : value,
    });
  };

  const handleClearFilters = () => {
    resetFilters();
  };

  const handleDownloadXLSX = () => {
    const rows = data?.withdrawals ?? [];
    if (!rows.length) return;

    const exportData = rows.map((w) => ({
      ID: w.id,
      Titulo: w.title ?? "",
      Cantidad: w.quantity,
      "Hora Fin": w.endTime ? new Date(w.endTime).toLocaleString() : "",
      "Creado En": w.createdAt ? new Date(w.createdAt).toLocaleString() : "",

      // Producto (anidado)
      "Producto ID": w.product.id,
      "Producto Titulo": w.product.title,
      "Producto Descripcion": w.product.description ?? "",
      "Unidad de Medida": w.product.unitOfMeasurement,
      "Tipo de Material": w.product.materialType,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Salidas");

    const fileName = `salidas_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  useEffect(() => {
    if (userError) {
      if (userError.message === "not authenticated") {
        router.push("/");
      }
    } else {
      refetch();
      userFetch();
    }
  }, [userError, router, userFetch, refetch]);

  return (
    <Container user={user!}>
      <div id="mainbar-full" className="user-show-new">
        <div id="main-content">
          <h2 className="fs-title mb2">Salidas Almacén</h2>
          <p className="fc-black-500 mb16">
            Supervisa y controla las salidas de productos del almacén en tiempo
            real.
            <br />
            Mantén un registro actualizado de los movimientos para garantizar
            una gestión eficiente y transparente del inventario.
          </p>

          {/* Tabla */}
          <div className="d-flex gs24 md:fd-column">
            <div className="flex--item fl-grow1">
              <WithdrawalTable data={data} error={error} loading={loading} />
            </div>
            <div className="flex--item3 fl-shrink0 md:order-last mt0">
              <div className="d-grid">
                <div className="flex-1 mb-2">
                  <Label htmlFor="unit-filter">Rango de Fechas</Label>
                  <WithdrawalDateRangePicker />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="unit-filter">Unidad de Medida</Label>
                    <Select
                      value={selectedFilters.unitOfMeasurement || "all"}
                      onValueChange={(value) =>
                        handleFilterChange("unitOfMeasurement", value)
                      }
                    >
                      <SelectTrigger id="unit-filter">
                        <SelectValue placeholder="Todas las unidades" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las unidades</SelectItem>
                        {uniqueFilterValues.unitOfMeasurement.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="material-filter">Tipo de Material</Label>
                    <Select
                      value={selectedFilters.materialType || "all"}
                      onValueChange={(value) =>
                        handleFilterChange("materialType", value)
                      }
                    >
                      <SelectTrigger id="material-filter">
                        <SelectValue placeholder="Todos los materiales" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          Todos los materiales
                        </SelectItem>
                        {uniqueFilterValues.materialType.map((material) => (
                          <SelectItem key={material} value={material}>
                            {material}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description-filter">Descripción</Label>
                    <Select
                      value={selectedFilters.description || "all"}
                      onValueChange={(value) =>
                        handleFilterChange("description", value)
                      }
                    >
                      <SelectTrigger id="description-filter">
                        <SelectValue placeholder="Todas las descripciones" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          Todas las descripciones
                        </SelectItem>
                        {uniqueFilterValues.description.map((desc) => (
                          <SelectItem key={desc} value={desc}>
                            {desc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="whitespace-nowrap my-4"
                >
                  <FilterX className="h-4 w-4 mr-2" />
                  Limpiar
                </Button>

                <Button
                  onClick={handleDownloadXLSX}
                  className="whitespace-nowrap"
                  disabled={loading || !data?.withdrawals?.length}
                >
                  Descargar XLSX
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default withApollo({ ssr: false })(Page);
