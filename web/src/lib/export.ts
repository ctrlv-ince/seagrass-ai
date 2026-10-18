/**
 * Seagrass AI — Client-side Data Export Utilities
 * Exports rendered frontend datasets to CSV or JSON without server/database dependencies.
 */

export function downloadCSV(rows: Record<string, any>[], filename: string): void {
  if (!rows || rows.length === 0) {
    console.warn("downloadCSV: No data rows to export");
    return;
  }

  // Extract all unique headers across objects
  const headers = Array.from(
    new Set(
      rows.flatMap((row) => Object.keys(row))
    )
  );

  const escapeCSVValue = (val: any): string => {
    if (val === null || val === undefined) return "";
    let str = String(val);
    if (Array.isArray(val)) {
      str = val.join("; ");
    }
    // Escape double quotes and enclose in quotes if it contains commas, newlines, or quotes
    if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvRows: string[] = [];
  // Header row
  csvRows.push(headers.map(escapeCSVValue).join(","));

  // Data rows
  for (const row of rows) {
    const values = headers.map((header) => escapeCSVValue(row[header]));
    csvRows.push(values.join(","));
  }

  const csvString = csvRows.join("\r\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, filename.endsWith(".csv") ? filename : `${filename}.csv`);
}

export function downloadJSON(data: any, filename: string): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json;charset=utf-8;" });
  triggerDownload(blob, filename.endsWith(".json") ? filename : `${filename}.json`);
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
