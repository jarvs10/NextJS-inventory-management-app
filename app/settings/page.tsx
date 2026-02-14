import Sidebar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { AccountSettings } from "@stackframe/stack";
import { Settings } from "lucide-react";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Sidebar currentPath="/settings" />

      <main className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Settings
              </h1>
              <p className="text-sm text-gray-500">
                Manage your account preferences and security
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-6">
              <AccountSettings fullPage />
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
