/**
 * Seagrass AI — Client-side Data & Document Export Utilities
 * Exports rendered frontend datasets to CSV, JSON, or PDF without server/database dependencies.
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { PDF_THEME, addReportHeader, addPageFooters } from "./pdf-theme";

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

/**
 * Captures a DOM container (e.g. Recharts ResponsiveContainer) as an image data URL
 */
export async function captureChartImage(element: HTMLElement): Promise<string> {
  const canvas = await html2canvas(element, {
    scale: 2, // 2x resolution for high-DPI rendering in PDF
    useCORS: true,
    logging: false,
    backgroundColor: null, // Transparent or inherits container background
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  return canvas.toDataURL("image/png");
}

export interface PDFTableSection {
  title?: string;
  headers?: string[];
  rows: Record<string, any>[] | (string | number)[][];
}

export interface PDFChartSection {
  title?: string;
  subtitle?: string;
  imageData: string; // PNG base64 data URL
  height?: number; // Optional height in mm
}

export interface PDFKpiItem {
  label: string;
  value: string | number;
  change?: string;
}

export interface PDFExportOptions {
  filename: string;
  title: string;
  subtitle?: string;
  meta?: Record<string, string>;
  orientation?: "portrait" | "landscape";
  kpis?: PDFKpiItem[];
  charts?: PDFChartSection[];
  tables?: PDFTableSection[];
}

/**
 * Generates and downloads a branded Seagrass AI PDF report.
 */
export async function downloadPDF(options: PDFExportOptions): Promise<void> {
  const orientation = options.orientation || "portrait";
  const doc = new jsPDF({
    orientation,
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Add Branded Header
  let y = addReportHeader(doc, options.title, options.subtitle, options.meta);

  // Helper to ensure vertical room before placing next section
  const ensureSpace = (requiredHeight: number): void => {
    if (y + requiredHeight > pageHeight - 16) {
      doc.addPage();
      y = 16;
    }
  };

  // Render KPIs if provided
  if (options.kpis && options.kpis.length > 0) {
    ensureSpace(24);
    const numCards = options.kpis.length;
    const gap = 3;
    const cardWidth = (contentWidth - gap * (numCards - 1)) / numCards;
    const cardHeight = 18;

    options.kpis.forEach((kpi, idx) => {
      const cardX = margin + idx * (cardWidth + gap);

      // Card background & border
      doc.setFillColor(...PDF_THEME.backgroundLight);
      doc.setDrawColor(...PDF_THEME.border);
      doc.roundedRect(cardX, y, cardWidth, cardHeight, 2, 2, "FD");

      // Accent pill on top of card
      doc.setFillColor(...PDF_THEME.primary);
      doc.rect(cardX + 2, y, cardWidth - 4, 1.2, "F");

      // Label
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...PDF_THEME.textMuted);
      const splitLabel = doc.splitTextToSize(kpi.label.toUpperCase(), cardWidth - 6);
      doc.text(splitLabel[0] || "", cardX + 3, y + 5.5);

      // Value
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(...PDF_THEME.textDark);
      doc.text(String(kpi.value), cardX + 3, y + 12);

      // Optional change/badge
      if (kpi.change) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(...PDF_THEME.primaryDark);
        doc.text(kpi.change, cardX + 3, y + 15.5);
      }
    });

    y += cardHeight + 6;
  }

  // Render Charts if provided
  if (options.charts && options.charts.length > 0) {
    for (const chart of options.charts) {
      const chartHeight = chart.height || (orientation === "landscape" ? 75 : 70);
      const titleHeight = chart.title ? 10 : 0;
      ensureSpace(chartHeight + titleHeight + 4);

      if (chart.title) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...PDF_THEME.textDark);
        doc.text(chart.title, margin, y + 4);

        if (chart.subtitle) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(...PDF_THEME.textMuted);
          doc.text(chart.subtitle, margin, y + 8);
        }

        y += titleHeight;
      }

      try {
        // Draw image bounded inside page width
        doc.addImage(
          chart.imageData,
          "PNG",
          margin,
          y,
          contentWidth,
          chartHeight,
          undefined,
          "FAST"
        );
        y += chartHeight + 6;
      } catch (err) {
        console.error("Failed to render chart image in PDF:", err);
      }
    }
  }

  // Render Tables if provided
  if (options.tables && options.tables.length > 0) {
    for (const table of options.tables) {
      if (table.rows.length === 0) continue;

      let headers: string[] = [];
      let body: (string | number)[][] = [];

      if (Array.isArray(table.rows[0])) {
        headers = table.headers || [];
        body = table.rows as (string | number)[][];
      } else {
        const objectRows = table.rows as Record<string, any>[];
        headers = table.headers || Array.from(new Set(objectRows.flatMap((r) => Object.keys(r))));
        body = objectRows.map((row) =>
          headers.map((h) => {
            const val = row[h];
            if (val === null || val === undefined) return "";
            if (Array.isArray(val)) return val.join("; ");
            return String(val);
          })
        );
      }

      if (table.title) {
        ensureSpace(12);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...PDF_THEME.textDark);
        doc.text(table.title, margin, y + 3);
        y += 6;
      }

      autoTable(doc, {
        head: [headers],
        body,
        startY: y,
        margin: { left: margin, right: margin, bottom: 16 },
        styles: {
          font: "helvetica",
          fontSize: 8,
          textColor: PDF_THEME.textDark,
          cellPadding: 2.2,
          lineColor: PDF_THEME.border,
          lineWidth: 0.2,
        },
        headStyles: {
          fillColor: PDF_THEME.primary,
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 8,
        },
        alternateRowStyles: {
          fillColor: PDF_THEME.backgroundLight,
        },
      });

      y = (doc as any).lastAutoTable.finalY + 8;
    }
  }

  // Add page numbers and footers across all generated pages
  addPageFooters(doc);

  // Trigger download
  const cleanFilename = options.filename.endsWith(".pdf")
    ? options.filename
    : `${options.filename}.pdf`;
  doc.save(cleanFilename);
}
