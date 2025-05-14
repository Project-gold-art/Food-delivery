import { cookies } from "next/headers"
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"
import { v4 as uuidv4 } from "uuid"

// Simulação de banco de dados para usuários administradores
const adminUsers = [
  {
    id: "1",
    username: "admin",
    // Em um sistema real, isso seria um hash da senha
    password: "admin123",
  },
]

// Simulação de sessões ativas
const activeSessions: Record<string, { userId: string; username: string; expiresAt: Date }> = {}

// Função para autenticar um administrador
export async function loginAdmin(username: string, password: string): Promise<boolean> {
  const user = adminUsers.find((u) => u.username === username && u.password === password)

  if (!user) {
    return false
  }

  // Criar uma sessão
  const sessionId = uuidv4()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 1) // Expira em 1 dia

  activeSessions[sessionId] = {
    userId: user.id,
    username: user.username,
    expiresAt,
  }

  // Salvar o cookie de sessão
  cookies().set("admin_session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  })

  return true
}

// Função para obter a sessão atual
export async function getAdminSession(cookieStore: ReadonlyRequestCookies) {
  const sessionId = cookieStore.get("admin_session")?.value

  if (!sessionId) {
    return null
  }

  const session = activeSessions[sessionId]

  if (!session) {
    return null
  }

  // Verificar se a sessão expirou
  if (new Date() > session.expiresAt) {
    delete activeSessions[sessionId]
    return null
  }

  return {
    userId: session.userId,
    username: session.username,
  }
}
