import type React from "react"
import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { logoutAdmin } from "@/lib/actions/admin-actions"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Verificar se estamos na página de login
  const isLoginPage = children.props?.childProp?.segment === "login"

  if (isLoginPage) {
    return children
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-rose-600 mr-4">FoodExpress Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Olá, admin</span>
            <form action={logoutAdmin}>
              <Button variant="ghost" size="sm" type="submit" className="flex items-center gap-1">
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-gray-50 border-r hidden md:block">{/* Navigation removed as requested */}</aside>

        <main className="flex-1 bg-gray-100">{children}</main>
      </div>
    </div>
  )
}
