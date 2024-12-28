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

  const updateStock = async (product_code: string, amount: number) => {
    try {
      await api.post(`/sushi/stock/${product_code}`, {
        quantity: amount,
      });
    } catch (error: any) {
      setError("Some error happened :(");
    } finally {
      fetchProducts();
    }
  };

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
        <StockTable products={products} onUpdateStock={updateStock} />
      )}
    </div>
  );
};

export default Admin;
