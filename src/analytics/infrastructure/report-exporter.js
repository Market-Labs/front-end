const filename = (report, extension) => `marketgo-${report.type.toLowerCase()}-${report.generatedAt.slice(0, 10)}.${extension}`;

export const exportReportXlsx = async (report) => {
  const { default: ExcelJS } = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(report.title);
  sheet.columns = report.columns.map(({ key, label, kind }) => ({ header: label, key, width: Math.max(16, label.length + 4), style: kind === 'money' ? { numFmt: '"S/ "#,##0.00' } : {} }));
  sheet.addRows(report.rows);
  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF023192' } };
  sheet.views = [{ state: 'frozen', ySplit: 1 }];
  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: Math.max(1, report.rows.length + 1), column: report.columns.length } };
  const buffer = await workbook.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename(report, 'xlsx');
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const exportReportPdf = async (report, element) => {
  const { default: html2pdf } = await import('html2pdf.js');
  await html2pdf().set({ margin: 10, filename: filename(report, 'pdf'), html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }, pagebreak: { mode: ['css', 'legacy'] } }).from(element).save();
};
