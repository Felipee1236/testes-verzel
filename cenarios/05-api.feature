# language: pt
@api
Funcionalidade: Regras de cálculo e contrato da API
  A API fica em /api, recebe e responde JSON e não guarda estado entre chamadas.
  O total do pedido segue a fórmula total = subtotal - desconto + frete.
  Cliente válido usado nos cenários: nome "Maria Silva", e-mail "maria@exemplo.com", CEP "01310-100".

  @CT13 @CA11 @api
  Esquema do Cenário: Valores com cupom ficam com 2 casas decimais e fecham a fórmula do total
    Quando envio POST "/api/carrinho/calcular" com os itens <itens> e o cupom "BEMVINDO10"
    Então o status da resposta deve ser 200
    E a resposta deve ter subtotal <subtotal>, desconto <desconto>, frete <frete> e total <total>
    E todos os valores monetários devem ter no máximo 2 casas decimais

    Exemplos:
      | itens            | subtotal | desconto | frete | total  |
      | P006 x3          | 89.7     | 8.97     | 19.9  | 100.63 |
      | P007 x3, P003 x1 | 879.6    | 87.96    | 0     | 791.64 |

  @CT14 @CA03 @CA04 @api
  Esquema do Cenário: Cálculo do carrinho com cupom inválido ou expirado responde sem erro
    Quando envio POST "/api/carrinho/calcular" com os itens P005 x1 e o cupom "<cupom>"
    Então o status da resposta deve ser 200
    E a resposta deve ter desconto 0 e total 119.9
    E cupom.aplicado deve ser false e cupom.mensagem deve ser "<mensagem>"

    Exemplos:
      | cupom     | mensagem        |
      | XPTO      | Cupom inválido. |
      | VERAO2026 | Cupom expirado. |

  @CT15 @CA03 @CA04 @api @automacao
  Esquema do Cenário: Pedido com cupom inválido ou expirado é recusado
    Quando envio POST "/api/pedidos" com um cliente válido, os itens P005 x1 e o cupom "<cupom>"
    Então o status da resposta deve ser 422
    E o erro deve ter código "<código>" e campo "cupom"

    Exemplos:
      | cupom     | código         |
      | XPTO      | CUPOM_INVALIDO |
      | VERAO2026 | CUPOM_EXPIRADO |

  @CT16 @CA02 @api @smoke
  Cenário: Confirmar pedido válido pela API
    Quando envio POST "/api/pedidos" com um cliente válido, os itens P005 x1 e o cupom " bemvindo10 "
    Então o status da resposta deve ser 201
    E o numero do pedido deve seguir o formato "VZ-" seguido de 6 dígitos
    E o CEP do cliente deve voltar normalizado como "01310100"
    E a resposta deve ter subtotal 100, desconto 10, frete 19.9 e total 109.9

  @CT17 @api
  Esquema do Cenário: Itens inválidos são recusados com o código de erro documentado
    Quando envio POST "/api/carrinho/calcular" com os itens <itens>
    Então o status da resposta deve ser 422
    E o erro deve ter código "<código>"

    Exemplos:
      | itens                | código                 |
      | (lista vazia)        | ITENS_OBRIGATORIOS     |
      | P999 x1              | PRODUTO_NAO_ENCONTRADO |
      | P001 x1, P001 x1     | ITEM_DUPLICADO         |
      | P001 x0              | QUANTIDADE_INVALIDA    |

  @CT18 @api
  Cenário: Pedido com dados do cliente inválidos lista todos os campos com erro
    Quando envio POST "/api/pedidos" com os itens P005 x1 e o cliente com nome "", e-mail "x" e CEP "1"
    Então o status da resposta deve ser 422
    E o erro deve ter código "DADOS_INVALIDOS"
    E a lista "campos" deve conter "cliente.nome", "cliente.email" e "cliente.cep"
