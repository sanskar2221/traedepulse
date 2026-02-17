import { useEffect, useState } from "react";
import api from "../services/api";

const TradeHistory = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTrade, setEditingTrade] = useState(null);

  const fetchTrades = async () => {
    try {
      const res = await api.get("/trades");
      setTrades(res.data);
    } catch (err) {
      console.error("Error fetching trades:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/trades/${id}`);
      fetchTrades();
    } catch (err) {
      console.error("Error deleting trade:", err);
    }
  };

  const handleAddTrade = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      await api.post("/trades", {
        coin: formData.get("coin"),
        type: formData.get("type"),
        amount: Number(formData.get("amount")),
        price: Number(formData.get("price")),
      });

      setShowModal(false);
      fetchTrades();
    } catch (err) {
      console.error("Error adding trade:", err);
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading trades...</div>;
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Trade History
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Add Trade
        </button>
      </div>

      {/* Empty State */}
      {!trades.length ? (
        <div className="text-gray-400">No trades yet.</div>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

          <table className="w-full text-sm">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="text-left py-3">Coin</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Price</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {trades.map((trade) => (
                <tr
                  key={trade._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-4 font-medium text-gray-900">
                    {trade.coin}
                  </td>

                  <td>
                    <span
                      className={`px-2 py-1 text-xs rounded-md ${trade.type === "Buy"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                        }`}
                    >
                      {trade.type}
                    </span>
                  </td>

                  <td>{trade.amount}</td>
                  <td>${trade.price}</td>

                  <td className="text-gray-500">
                    {new Date(trade.createdAt).toLocaleDateString()}
                  </td>

                  <td className="flex gap-3">
                    <button
                      onClick={() => setEditingTrade(trade)}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(trade._id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      {/* Add Trade Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-lg">

            <h2 className="text-lg font-semibold mb-4">
              Add Trade
            </h2>

            <form onSubmit={handleAddTrade} className="space-y-3">

              <input
                name="coin"
                placeholder="Coin (e.g. BTC)"
                required
                className="w-full border p-2 rounded-lg"
              />

              <select
                name="type"
                className="w-full border p-2 rounded-lg"
              >
                <option value="Buy">Buy</option>
                <option value="Sell">Sell</option>
              </select>

              <input
                name="amount"
                type="number"
                placeholder="Amount"
                required
                className="w-full border p-2 rounded-lg"
              />

              <input
                name="price"
                type="number"
                placeholder="Price"
                required
                className="w-full border p-2 rounded-lg"
              />

              <div className="flex justify-end gap-2 mt-4">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Save
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {editingTrade && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-lg">

            <h2 className="text-lg font-semibold mb-4">
              Edit Trade
            </h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);

                await api.put(`/trades/${editingTrade._id}`, {
                  coin: formData.get("coin"),
                  type: formData.get("type"),
                  amount: Number(formData.get("amount")),
                  price: Number(formData.get("price")),
                });

                setEditingTrade(null);
                fetchTrades();
              }}
              className="space-y-3"
            >

              <input
                name="coin"
                defaultValue={editingTrade.coin}
                className="w-full border p-2 rounded-lg"
              />

              <select
                name="type"
                defaultValue={editingTrade.type}
                className="w-full border p-2 rounded-lg"
              >
                <option value="Buy">Buy</option>
                <option value="Sell">Sell</option>
              </select>

              <input
                name="amount"
                type="number"
                defaultValue={editingTrade.amount}
                className="w-full border p-2 rounded-lg"
              />

              <input
                name="price"
                type="number"
                defaultValue={editingTrade.price}
                className="w-full border p-2 rounded-lg"
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingTrade(null)}
                  className="px-3 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Update
                </button>
              </div>

            </form>
          </div>
        </div>
      )}


    </div>




  );
};

export default TradeHistory;
