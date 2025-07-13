import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { format } from "date-fns";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export default function Reports() {
  const [loading, setLoading] = useState(false);

  const generateCSVReport = async () => {
    setLoading(true);
    const { data: orders, error } = await supabase
      .from("orders")
      .select("id, product_id, quantity, timestamp, status");

    if (error || !orders || orders.length === 0) {
      alert("Error generating report. Please try again.");
      setLoading(false);
      return;
    }

    const headers = ["Order ID", "Product ID", "Quantity", "Date", "Status"];
    const rows = orders.map(order => [
      order.id,
      order.product_id,
      order.quantity,
      format(new Date(order.timestamp), "yyyy-MM-dd"),
      order.status || "Completed"
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `sales_report_${Date.now()}.csv`);
    setLoading(false);
  };

  const generatePDFReport = async () => {
    setLoading(true);
    const { data: orders, error } = await supabase
      .from("orders")
      .select("id, product_id, quantity, timestamp, status");

    if (error || !orders || orders.length === 0) {
      alert("Error generating report. Please try again.");
      setLoading(false);
      return;
    }

    const doc = new jsPDF();
    doc.text("Sales Report", 14, 16);

    autoTable(doc, {
      startY: 22,
      head: [["Order ID", "Product ID", "Quantity", "Date", "Status"]],
      body: orders.map(order => [
        order.id,
        order.product_id,
        order.quantity,
        format(new Date(order.timestamp), "yyyy-MM-dd"),
        order.status || "Completed"
      ]),
      styles: { fontSize: 10 }
    });

    doc.save(`sales_report_${Date.now()}.pdf`);
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold mb-4">Sales Report</h2>

      <button
        onClick={generateCSVReport}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Generating CSV..." : "Download CSV Report"}
      </button>

      <button
        onClick={generatePDFReport}
        disabled={loading}
        className="ml-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        {loading ? "Generating PDF..." : "Download PDF Report"}
      </button>
    </div>
  );
}