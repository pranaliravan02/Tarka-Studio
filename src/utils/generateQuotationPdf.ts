import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import {
  quoteTerms,
  tarkaContact,
  type ServiceItem,
} from "../data/services";

export interface QuotePdfItem {
  service: ServiceItem;
  quantity: number;
}

export interface QuotePdfClient {
  name: string;
  email: string;
  projectName: string;
  notes: string;
}

export interface QuotePdfData {
  quoteNumber: string;
  date: Date;
  client: QuotePdfClient;
  items: QuotePdfItem[];
  subtotal: number;
  gst: number;
  grandTotal: number;
  includeGst: boolean;
}

const COLORS = {
  blue: [0, 127, 143] as [number, number, number],
  blueDeep: [0, 95, 107] as [number, number, number],
  black: [5, 5, 5] as [number, number, number],
  grey: [105, 105, 105] as [number, number, number],
  lightGrey: [230, 230, 230] as [number, number, number],
  softBlue: [239, 249, 250] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
};

/*
 * jsPDF's built-in Helvetica font does not reliably support
 * the Indian Rupee symbol (₹).
 *
 * To keep the PDF fully self-contained and avoid depending
 * on an external font file, the quotation uses "INR" internally
 * when drawing money values.
 *
 * The website itself continues to use the ₹ currency symbol.
 */
function money(value: number) {
  return `INR ${Math.round(value).toLocaleString("en-IN")}`;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function generateQuotationPdf(data: QuotePdfData) {
  const doc = new jsPDF({
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const margin = 48;
  const contentWidth = pageWidth - margin * 2;

  const drawHeaderFooter = () => {
    const currentPage = doc.getCurrentPageInfo().pageNumber;
    const totalPages = doc.getNumberOfPages();

    doc.setFillColor(...COLORS.black);
    doc.rect(0, 0, pageWidth, 68, "F");

    doc.setTextColor(...COLORS.white);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);

    doc.text("TARKA", margin, 42);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(205, 205, 205);

    doc.text(
      "Design Studio — You think. We build.",
      margin + 76,
      42
    );

    doc.setTextColor(...COLORS.white);
    doc.setFontSize(9);

    doc.text(
      `Quotation ${data.quoteNumber}`,
      pageWidth - margin,
      30,
      {
        align: "right",
      }
    );

    doc.setTextColor(190, 190, 190);

    doc.text(
      formatDate(data.date),
      pageWidth - margin,
      46,
      {
        align: "right",
      }
    );

    const footerY = pageHeight - 32;

    doc.setDrawColor(...COLORS.blue);
    doc.setLineWidth(1);

    doc.line(
      margin,
      footerY - 13,
      pageWidth - margin,
      footerY - 13
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.grey);

    doc.text(
      `${tarkaContact.email}   ·   ${tarkaContact.phone}   ·   ${tarkaContact.web}`,
      margin,
      footerY
    );

    doc.text(
      `Page ${currentPage} / ${totalPages}`,
      pageWidth - margin,
      footerY,
      {
        align: "right",
      }
    );
  };

  const refreshPageHeaders = () => {
    const totalPages = doc.getNumberOfPages();

    for (let page = 1; page <= totalPages; page += 1) {
      doc.setPage(page);
      drawHeaderFooter();
    }

    doc.setPage(totalPages);
  };

  const addNewPage = () => {
    doc.addPage();
    drawHeaderFooter();
  };

  const ensureSpace = (
    currentY: number,
    requiredHeight: number
  ) => {
    if (currentY + requiredHeight > pageHeight - 70) {
      addNewPage();
      return 100;
    }

    return currentY;
  };

  drawHeaderFooter();

  let y = 105;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(25);
  doc.setTextColor(...COLORS.black);

  doc.text("Project Quotation", margin, y);

  y += 34;

  doc.setDrawColor(...COLORS.lightGrey);
  doc.setLineWidth(0.7);

  doc.line(
    margin,
    y,
    pageWidth - margin,
    y
  );

  y += 25;

  const columnGap = 28;

  const columnWidth =
    (contentWidth - columnGap) / 2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.blueDeep);

  doc.text("BILLED TO", margin, y);

  doc.text(
    "PROJECT",
    margin + columnWidth + columnGap,
    y
  );

  y += 17;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.black);

  const clientLines = [
    data.client.name,
    data.client.email,
  ].filter(Boolean);

  let clientY = y;

  clientLines.forEach((line) => {
    doc.text(line, margin, clientY);
    clientY += 15;
  });

  const projectLines = doc.splitTextToSize(
    data.client.projectName,
    columnWidth
  );

  let projectY = y;

  doc.setFont("helvetica", "bold");

  projectLines.forEach((line: string) => {
    doc.text(
      line,
      margin + columnWidth + columnGap,
      projectY
    );

    projectY += 15;
  });

  y = Math.max(clientY, projectY) + 22;

  const rows = data.items.map((item) => [
    item.service.name,
    `${item.quantity} ${item.service.unit}`,
    money(item.service.price),
    money(
      item.service.price *
        item.quantity
    ),
  ]);

  autoTable(doc, {
    startY: y,

    margin: {
      left: margin,
      right: margin,
      top: 82,
      bottom: 60,
    },

    head: [
      [
        "Service",
        "Quantity",
        "Unit Price",
        "Subtotal",
      ],
    ],

    body: rows,

    theme: "grid",

    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 8,
      textColor: COLORS.black,
      lineColor: COLORS.lightGrey,
      lineWidth: 0.45,
      valign: "middle",
    },

    headStyles: {
      fillColor: COLORS.blue,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 8.5,
    },

    alternateRowStyles: {
      fillColor: COLORS.softBlue,
    },

    columnStyles: {
      0: {
        cellWidth: "auto",
      },

      1: {
        cellWidth: 82,
        halign: "center",
      },

      2: {
        cellWidth: 88,
        halign: "right",
      },

      3: {
        cellWidth: 88,
        halign: "right",
      },
    },

    didDrawPage: () => {
      drawHeaderFooter();
    },
  });

  const finalTableY =
    (
      doc as unknown as {
        lastAutoTable: {
          finalY: number;
        };
      }
    ).lastAutoTable.finalY;

  y = finalTableY + 25;

  y = ensureSpace(y, 125);

  const totalsWidth = 225;

  const totalsX =
    pageWidth -
    margin -
    totalsWidth;

  doc.setDrawColor(...COLORS.lightGrey);
  doc.setLineWidth(0.7);

  doc.line(
    totalsX,
    y,
    pageWidth - margin,
    y
  );

  y += 19;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...COLORS.black);

  doc.text(
    "Subtotal",
    totalsX,
    y
  );

  doc.text(
    money(data.subtotal),
    pageWidth - margin,
    y,
    {
      align: "right",
    }
  );

  y += 18;

  if (data.includeGst) {
    doc.text(
      "GST (18%)",
      totalsX,
      y
    );

    doc.text(
      money(data.gst),
      pageWidth - margin,
      y,
      {
        align: "right",
      }
    );

    y += 18;
  }

  doc.setDrawColor(...COLORS.blue);
  doc.setLineWidth(1.2);

  doc.line(
    totalsX,
    y,
    pageWidth - margin,
    y
  );

  y += 21;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.blueDeep);

  doc.text(
    "Grand Total",
    totalsX,
    y
  );

  doc.text(
    money(data.grandTotal),
    pageWidth - margin,
    y,
    {
      align: "right",
    }
  );

  y += 38;

  if (data.client.notes.trim()) {
    y = ensureSpace(y, 95);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.black);

    doc.text(
      "PROJECT NOTES",
      margin,
      y
    );

    y += 17;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...COLORS.grey);

    const noteLines = doc.splitTextToSize(
      data.client.notes,
      contentWidth
    );

    noteLines.forEach(
      (line: string) => {
        y = ensureSpace(
          y,
          15
        );

        doc.text(
          line,
          margin,
          y
        );

        y += 14;
      }
    );

    y += 15;
  }

  y = ensureSpace(y, 110);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.black);

  doc.text(
    "TERMS & CONDITIONS",
    margin,
    y
  );

  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.8);
  doc.setTextColor(...COLORS.grey);

  quoteTerms.forEach((term) => {
    const lines =
      doc.splitTextToSize(
        `•  ${term}`,
        contentWidth
      );

    lines.forEach(
      (line: string) => {
        y = ensureSpace(
          y,
          14
        );

        doc.text(
          line,
          margin,
          y
        );

        y += 13;
      }
    );

    y += 2;
  });

  y = ensureSpace(y, 40);

  doc.setDrawColor(...COLORS.lightGrey);
  doc.setLineWidth(0.6);

  doc.line(
    margin,
    y,
    pageWidth - margin,
    y
  );

  y += 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.blue);

  doc.text(
    "TARKA DESIGN STUDIO",
    margin,
    y
  );

  /*
   * Re-draw page headers/footers after the complete document
   * exists so multi-page quotations receive correct numbering.
   */
  refreshPageHeaders();

  doc.save(
    `Tarka-Quotation-${data.quoteNumber}.pdf`
  );
}