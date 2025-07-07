const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const { v4: uuidv4 } = require("uuid");

admin.initializeApp();

exports.processInvoiceRequest = onDocumentCreated("invoiceRequests/{docId}", async (event) => {
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

    const margin = 50;
    let y = 750;

    page.drawText("Tax Invoice", { x: margin, y, font: boldFont, size: 18 });
    y -= 20;

    page.drawText(`Invoice #: ${invoiceData.invoiceNumber}`, { x: margin, y, font, size: 12 });
    y -= 15;

    page.drawText(`Date: ${new Date(invoiceData.createdAt.toDate()).toLocaleDateString("en-AU")}`, { x: margin, y, font, size: 12 });
    y -= 30;

    page.drawText("From:", { x: margin, y, font: boldFont, size: 12 });
    page.drawText("Bill To:", { x: width / 2, y, font: boldFont, size: 12 });
    y -= 15;

    page.drawText(invoiceData.support.fullName, { x: margin, y, font, size: 10 });
    page.drawText(invoiceData.client.fullName, { x: width / 2, y, font, size: 10 });
    y -= 12;

    page.drawText(`ABN: ${invoiceData.support.abn}`, { x: margin, y, font, size: 10 });
    if (invoiceData.client.ndisNumber)
      page.drawText(`NDIS: ${invoiceData.client.ndisNumber}`, { x: width / 2, y, font, size: 10 });
    y -= 12;

    page.drawText(invoiceData.support.address, { x: margin, y, font, size: 10 });
    page.drawText(invoiceData.client.address, { x: width / 2, y, font, size: 10 });
    y -= 20;

    page.drawText("Payment Details:", { x: margin, y, font: boldFont, size: 12 });
    y -= 15;

    page.drawText(`Account: ${invoiceData.support.accountName}`, { x: margin, y, font, size: 10 });
    y -= 12;
    page.drawText(`BSB: ${invoiceData.support.bsb} | Acc: ${invoiceData.support.accountNumber}`, { x: margin, y, font, size: 10 });

    y -= 25;

    let total = 0;
    invoiceData.lineItems.forEach((item) => {
      const lineTotal = item.quantity * item.price;
      page.drawText(`${item.description} | Qty: ${item.quantity} | Unit: $${item.price.toFixed(2)} | Total: $${lineTotal.toFixed(2)}`, { x: margin, y, font, size: 10 });
      y -= 15;
      total += lineTotal;
    });

    y -= 10;
    page.drawText(`Grand Total: $${total.toFixed(2)}`, { x: margin, y, font: boldFont, size: 12 });

    const pdfBytes = await pdfDoc.save();

    const file = admin.storage().bucket().file(`invoices/${docId}.pdf`);
    const token = uuidv4();

    await file.save(pdfBytes, {
      metadata: { contentType: "application/pdf", metadata: { firebaseStorageDownloadTokens: token } },
    });

    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${admin.storage().bucket().name}/o/invoices%2F${docId}.pdf?alt=media&token=${token}`;

    await admin.firestore().collection("mail").add({
      to: [invoiceData.recipientEmail],
      message: {
        subject: `Your Invoice ${invoiceData.invoiceNumber}`,
        html: `<p>Please find your invoice attached.</p>`,
        attachments: [{ filename: `${invoiceData.invoiceNumber}.pdf`, path: downloadUrl }],
      },
    });

    await snap.ref.update({ status: "success", pdfPath: file.name, downloadUrl });
  } catch (error) {
    logger.error(`Failed invoice ${docId}`, error);
    await snap.ref.update({ status: "error", errorMessage: error.message });
  }
});
