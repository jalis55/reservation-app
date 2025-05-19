import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

export const generatePdf = (data, fromDate, toDate, orgDetails) => {
  const doc = new jsPDF();

  // Colors for professional look
  const primaryColor = '#2c3e50';  // Dark blue
  const secondaryColor = '#3498db'; // Light blue
  const lightGray = '#f5f5f5';

  // Organization Header
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, doc.internal.pageSize.width, 20, 'F');
  
  // Organization Name (centered)
  doc.setFontSize(16);
  doc.setTextColor('#ffffff');
  doc.setFont('helvetica', 'bold');
  doc.text(orgDetails.name, doc.internal.pageSize.width / 2, 15, { align: 'center' });

  // Organization Details (below header)
  let orgInfo = [];
  if (orgDetails.email) orgInfo.push(`Email: ${orgDetails.email}`);
  if (orgDetails.phone) orgInfo.push(`Phone: ${orgDetails.phone}`);
  if (orgDetails.address) orgInfo.push(`Address: ${orgDetails.address}`);

  doc.setFontSize(10);
  doc.setTextColor(primaryColor);
  doc.text(orgInfo.join(' | '), doc.internal.pageSize.width / 2, 25, { align: 'center' });

  // Report Title
  doc.setFontSize(14);
  doc.setTextColor(primaryColor);
  doc.text('Booking Report', doc.internal.pageSize.width / 2, 35, { align: 'center' });

  // Date Range
  doc.setFontSize(11);
  if (fromDate === toDate) {
    doc.text(`Date: ${fromDate}`, doc.internal.pageSize.width / 2, 42, { align: 'center' });
  } else {
    doc.text(`From: ${fromDate}  To: ${toDate}`, doc.internal.pageSize.width / 2, 42, { align: 'center' });
  }

  // Prepare table data
  const tableData = data.map((item) => [
    item.user.email,
    item.user.name,
    item.user.department.name,
    formatDate(item.booking_date),
  ]);

  // Calculate table width for centering
  const tableWidth = 180; // Approximate table width in points
  const marginLeft = (doc.internal.pageSize.width - tableWidth) / 2;

  // Generate centered table with professional styling
  autoTable(doc, {
    head: [['Email', 'Name', 'Department', 'Booking Date']],
    body: tableData,
    startY: 50,
    margin: { left: marginLeft },
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor,
      textColor: '#ffffff',
      fontStyle: 'bold',
      fontSize: 10,
      cellPadding: 3
    },
    bodyStyles: {
      textColor: '#333333',
      fontSize: 9,
      cellPadding: 2
    },
    alternateRowStyles: {
      fillColor: lightGray
    },
    columnStyles: {
      0: { cellWidth: 50, halign: 'left' },  // Email
      1: { cellWidth: 40, halign: 'left' },  // Name
      2: { cellWidth: 40, halign: 'left' },  // Department
      3: { cellWidth: 30, halign: 'center' } // Booking Date
    }
  });

  // Summary: Total Bookings
  doc.setFontSize(11);
  doc.setTextColor(primaryColor);
  const totalBookings = data.length;
  doc.text(
    `Total Bookings: ${totalBookings}`,
    doc.internal.pageSize.width / 2,
    doc.lastAutoTable.finalY + 10,
    { align: 'center' }
  );

  // Footer with page number
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor('#777777');
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width - 15,
      doc.internal.pageSize.height - 10,
      { align: 'right' }
    );
  }

  // Output the PDF
  const blob = doc.output('blob');
  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl);
};

// Helper function to format dates
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}