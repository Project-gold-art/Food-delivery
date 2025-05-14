// Adicione um novo arquivo para lidar com o armazenamento do lado do cliente

// Função para verificar se estamos no navegador
export function isBrowser(): boolean {
  return typeof window !== "undefined"
}

// Função para salvar dados no localStorage
export function saveToStorage<T>(key: string, data: T): void {
  if (isBrowser()) {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error(`Erro ao salvar ${key} no localStorage:`, error)
    }
  }
}

// Função para carregar dados do localStorage
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (isBrowser()) {
    try {
      const savedData = localStorage.getItem(key)
      if (savedData) {
        return JSON.parse(savedData)
      }
    } catch (error) {
      console.error(`Erro ao carregar ${key} do localStorage:`, error)
    }
  }
  return defaultValue
}

// Função para remover dados do localStorage
export function removeFromStorage(key: string): void {
  if (isBrowser()) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Erro ao remover ${key} do localStorage:`, error)
    }
  }
}
