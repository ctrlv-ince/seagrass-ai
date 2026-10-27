import type jsPDF from "jspdf";

export const PDF_THEME = {
  primary: [13, 148, 136] as [number, number, number], // #0D9488 Teal
  primaryDark: [15, 118, 110] as [number, number, number], // #0F766E
  secondary: [6, 182, 212] as [number, number, number], // #06B6D4 Cyan
  textDark: [15, 23, 42] as [number, number, number], // #0F172A Slate 900
  textMuted: [100, 116, 139] as [number, number, number], // #64748B Slate 500
  border: [226, 232, 240] as [number, number, number], // #E2E8F0 Slate 200
  backgroundLight: [248, 250, 252] as [number, number, number], // #F8FAFC Slate 50
  accentPurple: [139, 92, 246] as [number, number, number], // #8B5CF6 Purple
};

/**
 * Draws a standardized executive report header on the active page of a jsPDF document.
 * Returns the Y coordinate where subsequent content can begin.
 */
export function addReportHeader(
  doc: jsPDF,
  title: string,
  subtitle?: string,
  meta?: Record<string, string>
): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  // Top accent bar
  doc.setFillColor(...PDF_THEME.primary);
  doc.rect(0, 0, pageWidth, 4, "F");

  let y = 14;

  // Platform Tag
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...PDF_THEME.primaryDark);
  doc.text("SEAGRASS AI  •  COASTAL TELEMETRY & ANALYTICAL INTELLIGENCE", margin, y);

  y += 7;

  // Document Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...PDF_THEME.textDark);
  doc.text(title, margin, y);

  y += 5.5;

  // Subtitle
  if (subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...PDF_THEME.textMuted);
    const splitSubtitle = doc.splitTextToSize(subtitle, pageWidth - margin * 2);
    doc.text(splitSubtitle, margin, y);
    y += splitSubtitle.length * 4.5 + 2;
  }

  // Metadata pills / key-values
  if (meta && Object.keys(meta).length > 0) {
    doc.setFontSize(8);
    const metaEntries = Object.entries(meta);
    let xOffset = margin;

    metaEntries.forEach(([key, val]) => {
      const label = `${key}: ${val}`;
      const textWidth = doc.getTextWidth(label) + 8;

      if (xOffset + textWidth > pageWidth - margin) {
        xOffset = margin;
        y += 6;
      }

      // Draw light pill background
      doc.setFillColor(...PDF_THEME.backgroundLight);
      doc.setDrawColor(...PDF_THEME.border);
      doc.roundedRect(xOffset, y - 4, textWidth, 5.5, 1.5, 1.5, "FD");

      doc.setFont("helvetica", "bold");
      doc.setTextColor(...PDF_THEME.textDark);
      doc.text(key + ":", xOffset + 3, y - 0.5);

      const keyWidth = doc.getTextWidth(key + ": ");
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...PDF_THEME.primaryDark);
      doc.text(val, xOffset + 3 + keyWidth, y - 0.5);

      xOffset += textWidth + 4;
    });

    y += 6;
  }

  // Divider line
  y += 3;
  doc.setDrawColor(...PDF_THEME.border);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);

  return y + 6;
}

/**
 * Loops through all pages in the PDF and prints a uniform footer with page numbering and timestamp.
 */
export function addPageFooters(doc: jsPDF): void {
  const totalPages = doc.getNumberOfPages();
  const timestamp = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;

    // Divider line
    doc.setDrawColor(...PDF_THEME.border);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    // Left: branding & timestamp
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...PDF_THEME.textMuted);
    doc.text(
      `Seagrass AI Intelligence Platform  •  Generated: ${timestamp}`,
      margin,
      pageHeight - 7
    );

    // Right: Page number
    const pageText = `Page ${i} of ${totalPages}`;
    const pageTextWidth = doc.getTextWidth(pageText);
    doc.text(pageText, pageWidth - margin - pageTextWidth, pageHeight - 7);
  }
}
