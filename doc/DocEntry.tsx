import { Button } from "@chakra-ui/react";
import { useState } from "react";
import * as XLSX from "xlsx";

type Product = {
  __typename?: "Product";
  id: number;
  title: string;
  description?: string | null;
  unitOfMeasurement: string;
  materialType: string;
  createdAt: any;
  updatedAt: any;
  withdrawal: Array<{
    __typename?: "Withdrawal";
    id: number;
    title?: string | null;
    quantity: number;
    endTime: any;
    createdAt: any;
    updatedAt: any;
  }>;
  entry: Array<{
    __typename?: "Entry";
    id: number;
    quantity: number;
    price: number;
    startTime: any;
    createdAt: any;
    updatedAt: any;
    supplier: {
      __typename?: "Supplier";
      id: number;
      name: string;
      ruc?: string | null;
      district?: string | null;
      province?: string | null;
      department?: string | null;
      productCount: number;
      createdAt: any;
      updatedAt: any;
    };
  }>;
};

type Props = {
  tab: string;
  data: Product[];
};

export default function DocEntries({ tab, data }: Props) {
  const [loading, setLoading] = useState(false);

  const Doc = () => {
    setLoading(true);

    let map: any[] = [];

    if (tab === "news") {
      map = data
        ?.map((product) => {
          return product.entry.map((entry) => ({
            Code: product.id,
            "Nombre Producto": product.title,
            "Descripción Producto": product.description || "N/A",
            "U/M": product.unitOfMeasurement,
            "Tipo Material": product.materialType,
            Cantidad: entry.quantity,
            Precio: entry.price,
            "Razon Social": entry.supplier.name,
            RUC: entry.supplier.ruc || "N/A",
            Distrito: entry.supplier.district || "N/A",
            Provincia: entry.supplier.province || "N/A",
            Departamento: entry.supplier.department || "N/A",
          }));
        })
        .flat();
    } else if (tab === "all") {
      map = data?.map((product) => ({
        title: product.title,
        description: product.description || "N/A",
        unitOfMeasurement: product.unitOfMeasurement,
        materialType: product.materialType,
        createdAt: product.createdAt,
      }));
    } else if (tab === "valid") {
      map = data
        ?.map((product) => {
          return product.withdrawal.map((entry) => ({
            Code: product.id,
            "Nombre Producto": product.title,
            "Descripción Producto": product.description || "N/A",
            "U/M": product.unitOfMeasurement,
            "Tipo Material": product.materialType,
            Cantidad: entry.quantity,
            "Proyecto Salida": entry.title,
            "Fecha Salida": entry.endTime,
          }));
        })
        .flat();
    } else {
      map = data
        ?.map((product) => {
          return product.entry.map((entry) => ({
            Code: product.id,
            "Nombre Producto": product.title,
            "Descripción Producto": product.description || "N/A",
            "U/M": product.unitOfMeasurement,
            "Tipo Material": product.materialType,
            Cantidad: entry.quantity,
            Precio: entry.price,
            "Razon Social": entry.supplier.name,
            RUC: entry.supplier.ruc || "N/A",
            Distrito: entry.supplier.district || "N/A",
            Provincia: entry.supplier.province || "N/A",
            Departamento: entry.supplier.department || "N/A",
          }));
        })
        .flat();
    }

    const worksheet = XLSX.utils.json_to_sheet(map);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    XLSX.writeFile(workbook, `producto_${tab}.xlsx`);

    setLoading(false);
  };

  return (
    <Button
      onClick={Doc}
      isLoading={loading}
      className="d-flex s-btn s-btn__outlined s-btn__muted s-btn__icon s-btn__sm"
    >
      <svg
        height="16"
        viewBox="0 0 16 16"
        width="16"
        className="svg-icon iconTack d-block mx-auto"
      >
        <path d="m4.927 5.427 2.896 2.896a.25.25 0 0 0 .354 0l2.896-2.896A.25.25 0 0 0 10.896 5H8.75V.75a.75.75 0 1 0-1.5 0V5H5.104a.25.25 0 0 0-.177.427Z"></path>
        <path d="M1.573 2.573a.25.25 0 0 0-.073.177v7.5a.25.25 0 0 0 .25.25h12.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25h-3a.75.75 0 1 1 0-1.5h3A1.75 1.75 0 0 1 16 2.75v7.5A1.75 1.75 0 0 1 14.25 12h-3.727c.099 1.041.52 1.872 1.292 2.757A.75.75 0 0 1 11.25 16h-6.5a.75.75 0 0 1-.565-1.243c.772-.885 1.192-1.716 1.292-2.757H1.75A1.75 1.75 0 0 1 0 10.25v-7.5A1.75 1.75 0 0 1 1.75 1h3a.75.75 0 0 1 0 1.5h-3a.25.25 0 0 0-.177.073ZM6.982 12a5.72 5.72 0 0 1-.765 2.5h3.566a5.72 5.72 0 0 1-.765-2.5H6.982Z"></path>
      </svg>
      <div className="flex--item ml4">Excel</div>
    </Button>
  );
}
