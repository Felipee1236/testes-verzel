# language: pt
@quantidade
Funcionalidade: Limite de 5 unidades por produto
  Como loja
  Quero limitar cada produto a 5 unidades por pedido
  Para que a regra valha tanto na interface quanto na API

  @CT08 @CA10 @ui @automacao
  Cenário: A interface não deixa passar de 5 unidades de um produto
    Dado que estou na página de produtos com o carrinho vazio
    Quando clico 6 vezes em "Adicionar ao carrinho" no produto "Camiseta Essencial"
    Então o contador do carrinho deve exibir 5
    E na página do carrinho o botão de aumentar a quantidade de "Camiseta Essencial" deve estar desabilitado
    E devo ver o aviso "Limite de 5 unidades por produto."

  # Em /api/pedidos o corpo também leva um cliente válido (Maria Silva / maria@exemplo.com / 01310-100).
  @CT09 @CA10 @api @automacao
  Esquema do Cenário: A API valida o limite de 5 unidades por produto
    Quando envio POST "<rota>" com o item "P001" e quantidade <quantidade>
    Então o status da resposta deve ser <status>
    E <resultado>

    Exemplos:
      | rota                   | quantidade | status | resultado                                                    |
      | /api/carrinho/calcular | 5          | 200    | o subtotal deve ser 299.5                                    |
      | /api/carrinho/calcular | 6          | 422    | o erro deve ter código "QUANTIDADE_MAXIMA_EXCEDIDA"          |
      | /api/pedidos           | 6          | 422    | o erro deve ter código "QUANTIDADE_MAXIMA_EXCEDIDA" e nenhum pedido deve ser gerado |
