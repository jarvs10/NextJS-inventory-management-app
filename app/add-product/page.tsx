import Sidebar from "@/components/sidebar";
import { createProduct } from "@/lib/actions/products";
import Link from "next/link";
import { PackagePlus, Save, X, DollarSign, Package } from "lucide-react";

export default async function AddProductPage() {

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Sidebar currentPath="/add-product" />

      <main className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <PackagePlus className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Add New Product
              </h1>
              <p className="text-sm text-gray-500">
                Create a new item in your inventory system
              </p>
            </div>
          </div>

          <form action={createProduct} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      General Information
                    </h2>
                    <p className="text-sm text-gray-500">
                      Basic details about your product
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-gray-400"
                        placeholder="e.g. Wireless Headphones"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="sku"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        SKU <span className="text-gray-400 font-normal">(Stock Keeping Unit)</span>
                      </label>
                      <input
                        type="text"
                        id="sku"
                        name="sku"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-gray-400"
                        placeholder="e.g. WH-1000XM4"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
                   <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Pricing & Inventory
                    </h2>
                    <p className="text-sm text-gray-500">
                      Set your prices and stock levels
                    </p>
                  </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Price <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          step="0.01"
                          min="0"
                          required
                          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-gray-400"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="quantity"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                         Initial Quantity <span className="text-red-500">*</span>
                      </label>
                       <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Package className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          id="quantity"
                          name="quantity"
                          min="0"
                          required
                          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-gray-400"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

               {/* Side Panel */}
               <div className="space-y-6">
                 <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Stock Alerts</h3>
                  <div>
                    <label
                      htmlFor="lowStockAt"
                      className="block text-sm text-gray-600 mb-2"
                    >
                      Low Stock Threshold
                    </label>
                    <input
                      type="number"
                      id="lowStockAt"
                      name="lowStockAt"
                      min="0"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-gray-400"
                      placeholder="e.g. 5"
                    />
                    <p className="mt-2 text-xs text-gray-400">
                      We ll alert you when stock falls below this number.
                    </p>
                  </div>
                 </div>

                 <div className="flex flex-col gap-3">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Product
                    </button>
                    <Link
                      href="/inventory"
                      className="w-full inline-flex justify-center items-center px-4 py-3 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Link>
                 </div>
               </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
