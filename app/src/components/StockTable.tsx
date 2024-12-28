import { useState } from "react";
import { SushiProduct } from "../types";

interface StockTableProps {
  products: SushiProduct[];
  onUpdateStock: (product_code: string, amount: number) => void;
}

const StockTable = ({ products, onUpdateStock }: StockTableProps) => {
  const [stockInputs, setStockInputs] = useState<{ [key: string]: number }>({});

  const handleInputChange = (product_code: string, value: string) => {
    setStockInputs((prev) => ({
      ...prev,
      [product_code]: parseInt(value) || 0,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Current Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Add Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.product_code}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {product.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.product_code}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.stock}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${product.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <input
                  type="number"
                  min="1"
                  value={stockInputs[product.product_code] || ""}
                  onChange={(e) =>
                    handleInputChange(product.product_code, e.target.value)
                  }
                  className="mt-1 block w-24 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() =>
                    onUpdateStock(
                      product.product_code,
                      stockInputs[product.product_code] || 0
                    )
                  }
                  className="text-indigo-600 hover:text-indigo-900 px-4 py-2 bg-indigo-100 rounded-md"
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
