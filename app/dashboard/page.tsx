import ProductsChart from "@/components/products-chart";
import Sidebar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { 
  TrendingUp, 
  Package, 
  AlertCircle, 
  CheckCircle2,
  Clock
} from "lucide-react";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const userId = user.id;

  const [totalProducts, lowStock, allProducts] = await Promise.all([
    prisma.product.count({ where: { userId } }),
    prisma.product.count({
      where: {
        userId,
        lowStockAt: { not: null },
        quantity: { lte: 5 },
      },
    }),
    prisma.product.findMany({
      where: { userId },
      select: { price: true, quantity: true, createdAt: true },
    }),
  ]);

  const totalValue = allProducts.reduce(
    (sum, product) => sum + Number(product.price) * Number(product.quantity),
    0
  );

  const inStockCount = allProducts.filter((p) => Number(p.quantity) > 5).length;
  const lowStockCount = allProducts.filter(
    (p) => Number(p.quantity) <= 5 && Number(p.quantity) >= 1
  ).length;
  const outOfStockCount = allProducts.filter(
    (p) => Number(p.quantity) === 0
  ).length;

  const inStockPercentage =
    totalProducts > 0 ? Math.round((inStockCount / totalProducts) * 100) : 0;
  const lowStockPercentage =
    totalProducts > 0 ? Math.round((lowStockCount / totalProducts) * 100) : 0;
  const outOfStockPercentage =
    totalProducts > 0 ? Math.round((outOfStockCount / totalProducts) * 100) : 0;

  const now = new Date();
  const weeklyProductsData = [];

  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - i * 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekStart.setHours(23, 59, 59, 999);

    const weekLabel = `${String(weekStart.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(weekStart.getDate() + 1).padStart(2, "0")}`;

    const weekProducts = allProducts.filter((product) => {
      const productDate = new Date(product.createdAt);
      return productDate >= weekStart && productDate <= weekEnd;
    });

    weeklyProductsData.push({
      week: weekLabel,
      products: weekProducts.length,
    });
  }

  const recent = await prisma.product.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Sidebar currentPath="/dashboard" />
      <main className="ml-64 p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-500">
            Overview of your inventory performance and metrics.
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between pb-4">
              <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
              <div className="p-2 bg-green-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-gray-900">
                ${totalValue.toLocaleString()}
              </span>
              <span className="text-xs text-green-600 font-medium mt-1">
                Asset Valuation
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between pb-4">
              <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-gray-900">
                {totalProducts}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                In your inventory
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between pb-4">
              <h3 className="text-sm font-medium text-gray-500">Low Stock</h3>
              <div className="p-2 bg-orange-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-gray-900">
                {lowStockCount}
              </span>
              <span className="text-xs text-orange-600 font-medium mt-1">
                {lowStockPercentage}% below threshold
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between pb-4">
              <h3 className="text-sm font-medium text-gray-500">In Stock</h3>
              <div className="p-2 bg-indigo-50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-gray-900">
                {inStockCount}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                Available for sale ({inStockPercentage}%)
              </span>
            </div>
          </div>
        </div>

        {/* Charts & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Product Trends
              </h3>
              <p className="text-sm text-gray-500">
                New products added over time
              </p>
            </div>
            <div className="h-[300px]">
              <ProductsChart data={weeklyProductsData} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Products
              </h3>
              <Clock className="h-4 w-4 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recent.map((product) => {
                 const isLowStock = Number(product.quantity) <= (product.lowStockAt || 5);
                 const outOfStock = Number(product.quantity) === 0;
                 
                 return (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 truncate max-w-[120px]">
                      {product.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      Added {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${Number(product.price).toFixed(2)}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        outOfStock
                          ? "bg-red-100 text-red-700"
                          : isLowStock
                          ? "bg-orange-100 text-orange-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {Number(product.quantity)} units
                    </span>
                  </div>
                </div>
              )})}
              {recent.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No recent products found.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
