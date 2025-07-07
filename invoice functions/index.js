const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const { PDFDocument, StandardFonts } = require("pdf-lib");
const { v4: uuidv4 } = require("uuid");

admin.initializeApp();

exports.processSpa2InvoiceRequest = onDocumentCreated("spa2InvoiceRequests/{docId}", async (event) => {
  const snap = event.data;
  if (!snap) return logger.log("No data");

  const invoiceData = snap.data();
  const { docId } = event.params;

  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = 750, margin = 36;

    // Header
    page.drawText("Tax Invoice", { x: margin, y, font: boldFont, size: 18 });
    y -= 20;
    page.drawText(`Invoice #: ${invoiceData.invoiceNumber || ""}`, { x: margin, y, font, size: 12 });
    y -= 15;
    page.drawText(
      `Date: ${(invoiceData.createdAt && invoiceData.createdAt.toDate ? new Date(invoiceData.createdAt.toDate()) : new Date()).toLocaleDateString("en-AU")}`,
      { x: margin, y, font, size: 12 }
    );
    y -= 24;

    // FROM / TO
    page.drawText("From:", { x: margin, y, font: boldFont, size: 12 });
    page.drawText("Bill To:", { x: width/2, y, font: boldFont, size: 12 });
    y -= 15;
    page.drawText(invoiceData.support.fullName || "", { x: margin, y, font, size: 10 });
    page.drawText(invoiceData.client.fullName || "", { x: width/2, y, font, size: 10 });
    y -= 12;
    page.drawText(`ABN: ${invoiceData.support.abn || ""}`, { x: margin, y, font, size: 10 });
    if (invoiceData.client.ndisNumber)
      page.drawText(`NDIS: ${invoiceData.client.ndisNumber}`, { x: width/2, y, font, size: 10 });
    y -= 12;
    page.drawText(invoiceData.support.address || "", { x: margin, y, font, size: 10 });
    page.drawText(invoiceData.client.address || "", { x: width/2, y, font, size: 10 });
    y -= 24;

    // Table headers
    const tableX = margin;
    let tableY = y;
    const col = [tableX, tableX+80, tableX+235, tableX+330, tableX+400, tableX+475];
    const head = ["Date", "Support Item", "Item Code", "Qty", "Rate", "Total"];
    head.forEach((h, i) => {
      page.drawText(h, { x: col[i], y: tableY, font: boldFont, size: 10 });
    });
    tableY -= 13;

    let grandTotal = 0;
    for (const item of (invoiceData.lineItems || [])) {
      [
        item.date ? new Date(item.date).toLocaleDateString('en-AU') : "",
        item.support || "",
        item.itemCode || "",
        String(item.qty),
        "$"+(item.rate ? item.rate.toFixed(2) : "0.00"),
        "$"+(item.total ? item.total.toFixed(2) : "0.00")
      ].forEach((txt, i) => {
        page.drawText(txt, { x: col[i], y: tableY, font, size: 10 });
      });
      tableY -= 13;
      grandTotal += Number(item.total || 0);

      if (tableY < 70) { // new page if near bottom
        page.drawText("...continued", { x: margin, y: tableY, font, size: 10 });
        const newPage = pdfDoc.addPage();
        tableY = 750;
        head.forEach((h, i) => newPage.drawText(h, { x: col[i], y: tableY, font: boldFont, size: 10 }));
        tableY -= 13;
      }
    }
    tableY -= 8;
    page.drawText(`Grand Total: $${grandTotal.toFixed(2)}`, { x: col[4], y: tableY, font: boldFont, size: 12 });

    // Payment details
    tableY -= 25;
    page.drawText("Payment Details:", { x: margin, y: tableY, font: boldFont, size: 12 });
    tableY -= 15;
    page.drawText(`Account: ${invoiceData.support.accountName || ""}`, { x: margin, y: tableY, font, size: 10 });
    tableY -= 12;
    page.drawText(`BSB: ${invoiceData.support.bsb || ""} | Acc: ${invoiceData.support.accountNumber || ""}`, { x: margin, y: tableY, font, size: 10 });

    // PDF to storage/email logic (same as before)
    const pdfBytes = await pdfDoc.save();
    const file = admin.storage().bucket().file(`invoices/${docId}.pdf`);
    const token = uuidv4();

    await file.save(pdfBytes, {
      metadata: { contentType: "application/pdf", metadata: { firebaseStorageDownloadTokens: token } }
    });

    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${admin.storage().bucket().name}/o/invoices%2F${docId}.pdf?alt=media&token=${token}`;

    await admin.firestore().collection("mail").add({
      to: [invoiceData.recipientEmail],
      message: {
        subject: `Your Invoice ${invoiceData.invoiceNumber}`,
        html: `<p>Please find your invoice attached.</p>`,
        attachments: [{ filename: `${invoiceData.invoiceNumber}.pdf`, path: downloadUrl }]
      },
    });

    await snap.ref.update({ status: "success", pdfPath: file.name, downloadUrl });
  } catch (error) {
    logger.error(`Failed invoice ${docId}`, error);
    await snap.ref.update({ status: "error", errorMessage: error.message });
  }
});
