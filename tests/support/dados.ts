/**
 * Dados de teste da documentação da entrega VZS-142.
 */

export const PRODUTOS = {
  CAMISETA: { id: 'P001', nome: 'Camiseta Essencial', preco: 59.9 },
  CALCA: { id: 'P002', nome: 'Calça Jeans Slim', preco: 139.9 },
  TENIS: { id: 'P003', nome: 'Tênis Casual Urbano', preco: 189.9 },
  BONE: { id: 'P004', nome: 'Boné Aba Curva', preco: 49.9 },
  MOCHILA: { id: 'P005', nome: 'Mochila Urbana 20L', preco: 100 },
  MEIAS: { id: 'P006', nome: 'Kit 3 Pares de Meias', preco: 29.9 },
  JAQUETA: { id: 'P007', nome: 'Jaqueta Corta-Vento', preco: 229.9 },
  GARRAFA: { id: 'P008', nome: 'Garrafa Térmica 750ml', preco: 50 },
} as const;

export const CUPONS = {
  VALIDO: 'BEMVINDO10',
  EXPIRADO: 'VERAO2026',
  INEXISTENTE: 'XPTO',
} as const;

/** Cliente fictício usado nos pedidos. */
export const CLIENTE_VALIDO = {
  nome: 'Maria Silva',
  email: 'maria@exemplo.com',
  cep: '01310-100',
} as const;

/** Links dos bugs abertos, usados nas anotações dos testes que falham de propósito. */
export const BUGS = {
  BUG_01: 'bugs/BUG-01-frete-cobrado-com-subtotal-200.md',
  BUG_02: 'bugs/BUG-02-api-aceita-mais-de-5-unidades.md',
} as const;
