import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Verificar se a rota é administrativa
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Exceção para a página de login
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next()
    }

    // Verificar se o usuário está autenticado
    const session = request.cookies.get("admin_session")

    if (!session) {
      // Redirecionar para a página de login se não estiver autenticado
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

// Configurar para executar o middleware apenas nas rotas administrativas
export const config = {
  matcher: ["/admin/:path*"],
}
