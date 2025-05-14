"use server"

import { cookies } from "next/headers"

// Função para fazer logout
export async function logoutAdmin() {
  const sessionId = cookies().get("admin_session")?.value

  if (sessionId) {
    cookies().delete("admin_session")
  }

  return { success: true }
}
