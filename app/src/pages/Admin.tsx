import { useState, useEffect } from "react";
import { SushiProduct } from "../types";
import AdminHeader from "../components/AdminHeader";
import StockTable from "../components/StockTable";
import { api } from "../api";
import CreateSushiForm from "../components/CreateSushiForm";

const Admin = () => {
  const [products, setProducts] = useState<SushiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/sushi/stock");
      const { stock } = data;
      setProducts(stock);
    } catch (error) {
      console.log(error);
      setError("Some error happened :(");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto h-screen">
      <AdminHeader />

      <CreateSushiForm onSuccess={fetchProducts} />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <StockTable
          products={products}
          onUpdateStock={(productId, amount) => {
            // You'll implement the stock update logic
            console.log("Update stock:", productId, amount);
          }}
        />
      )}
    </div>
  );
};

export default Admin;
