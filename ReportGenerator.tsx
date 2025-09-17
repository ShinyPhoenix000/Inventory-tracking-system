import React, { useState } from 'react';
import { FileText, Download, Calendar, BarChart3, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { useOrders } from './hooks/useOrders';
import { useAuth } from './hooks/useAuth';
import { formatCurrency, formatDate } from './lib/utils';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportGenerator: React.FC = () => {
  const { user } = useAuth();
  const { orders, loading: ordersLoading } = useOrders(user?.id ?? '');
  const [reportType, setReportType] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [format, setFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { value: 'sales', label: 'Sales Report', description: 'Revenue, orders, and sales trends' },
    { value: 'orders', label: 'Order Report', description: 'Order history and fulfillment data' },
    { value: 'summary', label: 'Summary Report', description: 'Overview of all activities' },
  ];

  const dateRanges = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'all', label: 'All Time' },
  ];

  const filterOrdersByDateRange = (orders: any[], range: string) => {
    if (range === 'all') return orders;
    const now = new Date();
    const filterDate = new Date();

    switch (range) {
      case 'today':
        return orders.filter(order =>
          new Date(order.created_at).toDateString() === now.toDateString()
        );
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return orders;
    }

    return orders.filter(order => new Date(order.created_at) >= filterDate);
  };

  const generateCSVReport = (data: any[], filename: string) => {
    const headers = ['Order ID', 'Product Name', 'SKU', 'Quantity', 'Date', 'Status', 'Total'];
    const csvContent = [
      headers.join(','),
      ...data.map(order => [
        order.id,
        `"${order.product_name}"`,
        order.product_sku,
        order.quantity,
        formatDate(order.created_at),
        order.status,
        order.total.toFixed(2),
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateExcelReport = (data: any[], filename: string) => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map(order => ({
        'Order ID': order.id,
        'Product Name': order.product_name,
        'SKU': order.product_sku,
        'Quantity': order.quantity,
        'Date': formatDate(order.created_at),
        'Status': order.status,
        'Total': formatCurrency(order.total),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const generatePDFReport = (data: any[], filename: string, reportTitle: string) => {
    try {
      const doc = new jsPDF();

      doc.setFontSize(20);
      doc.text(reportTitle, 20, 20);

      doc.setFontSize(12);
      const dateRangeLabel = dateRanges.find(r => r.value === dateRange)?.label || 'All Time';
      doc.text(`Date Range: ${dateRangeLabel}`, 20, 35);
      doc.text(`Generated: ${formatDate(new Date())}`, 20, 45);

      const totalOrders = data.length;
      const totalRevenue = data.reduce((sum, order) => sum + order.total, 0);
      doc.text(`Total Orders: ${totalOrders}`, 20, 60);
      doc.text(`Total Revenue: ${formatCurrency(totalRevenue)}`, 20, 70);

      const tableData = data.map(order => [
        order.id.slice(0, 8) + '...',
        order.product_name,
        order.product_sku,
        order.quantity.toString(),
        formatDate(order.created_at),
        order.status,
        formatCurrency(order.total),
      ]);

      // ✅ Correct usage
      autoTable(doc, {
        head: [['Order ID', 'Product', 'SKU', 'Qty', 'Date', 'Status', 'Total']],
        body: tableData,
        startY: 85,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] },
      });

      doc.save(`${filename}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Check the console for details.');
    }
  };

  const handleGenerateReport = async () => {
    if (!reportType || !dateRange) {
      alert('Please select both report type and date range');
      return;
    }

    if (ordersLoading) {
      alert('Please wait for orders to load');
      return;
    }

    setIsGenerating(true);

    try {
      const filteredOrders = filterOrdersByDateRange(orders, dateRange);

      if (filteredOrders.length === 0) {
        alert('No orders found for the selected date range');
        setIsGenerating(false);
        return;
      }

      const reportTypeLabel = reportTypes.find(r => r.value === reportType)?.label || 'Report';
      const dateRangeLabel = dateRanges.find(r => r.value === dateRange)?.label || 'All Time';
      const filename = `${reportType}_report_${dateRangeLabel.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;

      switch (format) {
        case 'csv':
          generateCSVReport(filteredOrders, filename);
          break;
        case 'excel':
          generateExcelReport(filteredOrders, filename);
          break;
        case 'pdf':
          generatePDFReport(filteredOrders, filename, `${reportTypeLabel} - ${dateRangeLabel}`);
          break;
        default:
          throw new Error('Unsupported format');
      }

      setTimeout(() => {
        alert(`${reportTypeLabel} generated successfully!`);
      }, 300);
    } catch (error) {
      console.error('Report error:', error);
      alert('Error generating report. See console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="dark:bg-gray-900 dark:text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>Custom Report Generator</span>
        </CardTitle>
        <CardDescription className="dark:text-gray-400">
          Generate detailed reports for your inventory and sales data
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {reportTypes.map((type) => (
            <div
              key={type.value}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                reportType === type.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-400'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
              onClick={() => setReportType(type.value)}
            >
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-semibold text-gray-800 dark:text-white">{type.label}</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{type.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Date Range</label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="dark:bg-gray-800 dark:text-white">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:text-white">
                {dateRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Format</label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="dark:bg-gray-800 dark:text-white">
                <FileText className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:text-white">
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                <SelectItem value="csv">CSV File</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {ordersLoading && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-blue-700 dark:text-blue-300">Loading order data...</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {reportType && dateRange && !ordersLoading && (
              <span>
                Ready to generate {reportTypes.find(r => r.value === reportType)?.label.toLowerCase()}
                for {dateRanges.find(r => r.value === dateRange)?.label.toLowerCase()}
                {orders.length > 0 && ` (${filterOrdersByDateRange(orders, dateRange).length} orders)`}
              </span>
            )}
          </div>

          <Button
            onClick={handleGenerateReport}
            disabled={!reportType || !dateRange || isGenerating || ordersLoading}
            className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </>
            )}
          </Button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">Report Features:</h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Real-time data from your Supabase database</li>
            <li>• Professional formatting with order details and totals</li>
            <li>• Export in multiple formats (PDF, Excel, CSV)</li>
            <li>• Customizable date ranges and filters</li>
            <li>• Automatic file download to your device</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;