import { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("1D"); // 1H | 1D | 1W

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard");
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);


  const chartData = useMemo(() => {
    if (!data?.recentTrades) return [];

    let multiplier = 1;

    if (range === "1H") multiplier = 5;
    if (range === "1D") multiplier = 10;
    if (range === "1W") multiplier = 20;

    const trades = data.recentTrades.slice(0, multiplier);

    let cumulative = 0;

    return trades.map((trade, index) => {
      const value = trade.amount * trade.price;

      cumulative += trade.type === "Buy" ? value : -value;

      return {
        name: `T${index + 1}`,
        value: cumulative,
      };
    });
  }, [range, data]);

  const totalBalance = data?.totalBalance || 0;

  if (loading) {
    return <div className="text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">
          Overview
        </h1>
        <p className="text-gray-500 mt-1">
          Trading & Portfolio
        </p>
      </div>

      {/* Top Grid */}
      <div className="grid grid-cols-3 gap-8">

        {/* Chart Card */}
        <div className="col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">

          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                BTC / USDT
              </h2>
              <p className="text-sm text-gray-500">
                Bitcoin · Tether · Binance
              </p>
            </div>

            {/* Toggle Buttons */}
            <div className="flex gap-2">
              {["1H", "1D", "1W"].map((btn) => (
                <button
                  key={btn}
                  onClick={() => setRange(btn)}
                  className={`px-3 py-1 text-xs rounded-md transition ${range === btn
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>

          {/* Real Chart */}
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Balance Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">

          <p className="text-sm text-gray-500 uppercase tracking-wide">
            Total Balance
          </p>

          <h2 className="text-3xl font-bold mt-3 text-gray-900">
            ${totalBalance.toFixed(2)}
          </h2>

          <p
            className={`text-sm mt-2 font-medium ${totalBalance >= 0
                ? "text-green-600"
                : "text-red-600"
              }`}
          >
            {totalBalance >= 0 ? "+ Profit" : "- Loss"}
          </p>

          {/* Mini Chart Placeholder */}
          <div className="mt-6 h-24 bg-blue-50 rounded-xl flex items-center justify-center text-blue-400 text-sm">
            Portfolio Trend
          </div>

        </div>

      </div>

      {/* Transactions */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Transactions
          </h2>
          <button className="text-sm text-blue-600 hover:underline">
            View All
          </button>
        </div>

        <table className="w-full text-sm">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="text-left py-3">Coin</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {data?.recentTrades?.map((trade) => (
              <tr key={trade._id} className="border-b hover:bg-gray-50 transition">
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

                <td className="text-gray-500">
                  {new Date(trade.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
};

export default Dashboard;
