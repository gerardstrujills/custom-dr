"use client";

import { isValid, parse } from "date-fns";
import { useCallback } from "react";
import * as XLSX from "xlsx";
import { useWithdrawalStore, WithdrawalData } from "./withdrawalStore";

type ExcelRow = {
  endTime: string | Date;
  productId: number;
  quantity: number;
  title: string;
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

export const useWithdrawalExcelParser = () => {
  const setWithdrawals = useWithdrawalStore((state) => state.setWithdrawals);

  const parseExcelFile = useCallback(
    async (file: File): Promise<WithdrawalData[]> => {
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

            const parsedWithdrawals: WithdrawalData[] = rows.map((row) => {
              const quantity =
                typeof row.quantity === "string"
                  ? parseFloat(row.quantity)
                  : (row.quantity ?? 0);
              const productId =
                typeof row.productId === "string"
                  ? parseInt(row.productId)
                  : (row.productId ?? 0);
              const title = String(row.title ?? "");
              const endTime = parseDate(row.endTime);

              return {
                title,
                quantity,
                productId,
                endTime,
              };
            });

            setWithdrawals(parsedWithdrawals);
            resolve(parsedWithdrawals);
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
    [setWithdrawals],
  );

  return { parseExcelFile };
};
