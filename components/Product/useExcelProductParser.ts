"use client";
import { useCallback } from "react";
import * as XLSX from "xlsx";
import { ProductData, useProductStore } from "./productStore";

type ExcelRow = {
  titulo: string;
  descripcion: string;
  um: string;
  tipomaterial: string;
};

export const useExcelProductParser = () => {
  const setProducts = useProductStore((state) => state.setProducts);

  const parseExcelFile = useCallback(
    async (file: File): Promise<ProductData[]> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const data = e.target?.result;
            if (!data) {
              reject(new Error("No se pudo leer el archivo"));
              return;
            }

            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const rows: ExcelRow[] = XLSX.utils.sheet_to_json(sheet);

            const parsedProducts: ProductData[] = rows.map((row) => {
              const titulo = row.titulo;
              const descripcion = row.descripcion;
              const um = row.um;
              const tipomaterial = row.tipomaterial;

              return {
                titulo,
                descripcion,
                um,
                tipomaterial,
              };
            });

            setProducts(parsedProducts);
            resolve(parsedProducts);
          } catch (error) {
            reject(error);
          }
        };

        reader.onerror = () => {
          reject(new Error("Error al leer el archivo"));
        };

        reader.readAsBinaryString(file);
      });
    },
    [setProducts],
  );

  return { parseExcelFile };
};
