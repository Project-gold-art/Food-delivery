"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { loginAdmin } from "@/lib/actions"

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/admin/dashboard"

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    try {
      console.log("Tentando fazer login...")
      const success = await loginAdmin(username, password)

      if (success) {
        console.log("Login bem-sucedido, redirecionando para:", redirect)
        // Forçar redirecionamento com window.location para garantir
        window.location.href = redirect
      } else {
        console.log("Login falhou: credenciais inválidas")
        setError("Usuário ou senha inválidos")
        setLoading(false)
      }
    } catch (err) {
      console.error("Erro ao fazer login:", err)
      setError("Ocorreu um erro ao fazer login. Tente novamente.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center text-rose-600 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o site
        </Link>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Acesso do Estabelecimento</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input id="username" name="username" required autoFocus />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700"
                disabled={loading}
                onClick={(e) => {
                  if (!loading) {
                    // Previne múltiplos cliques
                    setLoading(true)
                    // Garante que o formulário seja submetido
                    e.currentTarget.form?.requestSubmit()
                  }
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Entrando...
                  </span>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Após o login, você terá acesso a:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="bg-rose-100 text-rose-600 rounded-full p-1 mr-2 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span>Cadastro com dados comerciais (CNPJ, nome, endereço)</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-rose-100 text-rose-600 rounded-full p-1 mr-2 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span>Dashboard com visão geral de pedidos e métricas</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-rose-100 text-rose-600 rounded-full p-1 mr-2 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span>Criação e gerenciamento do cardápio com adicionais e disponibilidade</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-rose-100 text-rose-600 rounded-full p-1 mr-2 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span>Recebimento e gestão de pedidos com controle de preparo e impressão</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-rose-100 text-rose-600 rounded-full p-1 mr-2 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span>Integração com sistema de entrega (entregadores próprios ou terceirizados)</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-rose-100 text-rose-600 rounded-full p-1 mr-2 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span>Relatórios financeiros detalhados, incluindo taxas e comissões</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-rose-100 text-rose-600 rounded-full p-1 mr-2 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span>Gestão de cupons promocionais e campanhas</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-rose-100 text-rose-600 rounded-full p-1 mr-2 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span>Visualização e resposta a avaliações</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-rose-100 text-rose-600 rounded-full p-1 mr-2 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span>Configurações de funcionamento, raio de entrega e suporte técnico</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
