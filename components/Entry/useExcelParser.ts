"use client";

import { isValid, parse } from "date-fns";
import { useCallback } from "react";
import * as XLSX from "xlsx";
import { EntryData, useEntryStore } from "./entryStore";

type ExcelRow = {
  precio?: number | string;
  price?: number | string;
  productoId?: number | string;
  productId?: number | string;
  cantidad?: number | string;
  quantity?: number | string;
  ruc?: string;
  fecha?: string | Date;
  startTime?: string | Date;
};

const parseDate = (cellValue: string | Date | number | undefined): Date => {
  if (!cellValue) {
    return new Date();
  }

  // Si es un Date object
  if (cellValue instanceof Date) {
    return cellValue;
  }

  // Si es un string, intentamos parsearlo en varios formatos comunes
  if (typeof cellValue === "string") {
    const dateString = cellValue.trim();

    // Intenta formatos: DD/MM/YYYY, DD/MM/YY, YYYY-MM-DD
    const formats = ["dd/MM/yyyy", "dd/MM/yy", "yyyy-MM-dd"];

    for (const format of formats) {
      const parsed = parse(dateString, format, new Date());
      if (isValid(parsed)) {
        return parsed;
      }
    }

    // Si ninguno funciona, intenta con new Date
    const fallback = new Date(dateString);
    if (isValid(fallback)) {
      return fallback;
    }
  }

  return new Date();
};

export const useExcelParser = () => {
  const setEntries = useEntryStore((state) => state.setEntries);

  const parseExcelFile = useCallback(
    async (file: File): Promise<EntryData[]> => {
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

            const parsedEntries: EntryData[] = rows.map((row) => {
              const price =
                typeof row.precio === "string"
                  ? parseFloat(row.precio)
                  : row.precio ?? 0;
              const productId =
                typeof row.productoId === "string"
                  ? parseInt(row.productoId)
                  : row.productoId ?? 0;
              const quantity =
                typeof row.cantidad === "string"
                  ? parseFloat(row.cantidad)
                  : row.cantidad ?? 0;
              const ruc = String(row.ruc ?? "");
              const startTime = parseDate(row.fecha);

              return {
                price,
                productId,
                quantity,
                ruc,
                startTime,
              };
            });

            setEntries(parsedEntries);
            resolve(parsedEntries);
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
    [setEntries],
  );

  return { parseExcelFile };
};
