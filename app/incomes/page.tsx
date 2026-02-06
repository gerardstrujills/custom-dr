"use client";
import { withApollo } from "@/apollo/withApollo";
import Container from "@/components/Container";
import IncomeDateRangePicker from "@/components/incomes/IncomeDateRangePicker";
import { IncomeTable } from "@/components/incomes/IncomeTable";
import { useIncomeFiltersStore } from "@/components/stores/useIncomeFilterStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIncomesQuery, useMeQuery } from "@/gen/gql";
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
  } = useIncomeFiltersStore();

  const combinedFilters = getCombinedFilters();

  const { data, loading, error, refetch } = useIncomesQuery({
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

  const handleDownloadXLSX = () => {
    const rows = data?.incomes ?? [];
    if (!rows.length) return;

    const exportData = rows.map((i) => ({
      ID: i.id,
      Cantidad: i.quantity,
      Precio: i.price,
      "Hora Inicio": i.startTime ? new Date(i.startTime).toLocaleString() : "",
      "Creado En": i.createdAt ? new Date(i.createdAt).toLocaleString() : "",

      // Producto
      "Producto ID": i.product.id,
      "Producto Titulo": i.product.title,
      "Producto Descripcion": i.product.description ?? "",
      "Unidad de Medida": i.product.unitOfMeasurement,
      "Tipo de Material": i.product.materialType,

      // Proveedor
      "Proveedor ID": i.supplier.id,
      Proveedor: i.supplier.name,
      RUC: i.supplier.ruc ?? "",
      Distrito: i.supplier.district ?? "",
      Provincia: i.supplier.province ?? "",
      Departamento: i.supplier.department ?? "",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Entradas");

    const fileName = `entradas_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const handleClearFilters = () => {
    resetFilters();
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
          <h2 className="fs-title mb2">Entradas Almacén</h2>
          <p className="fc-black-500 mb16">
            Registra y controla las entradas de productos al almacén en tiempo
            real.
            <br />
            Supervisa el ingreso de materiales y asegura un control preciso y
            actualizado del inventario.
          </p>

          {/* Tabla */}
          <div className="d-flex gs24 md:fd-column">
            <div className="flex--item fl-grow1">
              <IncomeTable data={data} error={error} loading={loading} />
            </div>
            <div className="flex--item3 fl-shrink0 md:order-last mt0">
              <div className="d-grid">
                <div className="flex-1 mb-2">
                  <Label htmlFor="unit-filter">Rango de Fechas</Label>
                  <IncomeDateRangePicker />
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
                  disabled={loading || !data?.incomes?.length}
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
