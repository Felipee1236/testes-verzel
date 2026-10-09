# language: pt
@frete
Funcionalidade: Frete grátis a partir de R$ 200,00
  Como cliente da Verzel Store
  Quero ganhar frete grátis em compras maiores
  Para pagar menos nas minhas compras

  Contexto:
    Dado que estou na página do carrinho com o carrinho vazio

  # Análise de valor limite em torno de R$ 200,00.
  # Com os preços do catálogo e o limite de 5 unidades por produto, os subtotais
  # possíveis mais próximos do limite são R$ 199,90 (maior abaixo), R$ 200,00 (exato)
  # e R$ 209,40 (menor acima). Não existe combinação entre R$ 200,01 e R$ 209,39.
  @CT06 @CA06 @CA07 @ui @smoke @automacao
  Esquema do Cenário: Regra do frete nos valores de fronteira
    Dado que tenho no carrinho <carrinho>
    Então o resumo deve exibir subtotal "<subtotal>", frete "<frete>" e total "<total>"
    E a mensagem de valor faltante deve ser "<mensagem faltante>"

    Exemplos:
      | carrinho                                                               | subtotal  | frete    | total     | mensagem faltante                   |
      | 1 "Mochila Urbana 20L", 1 "Garrafa Térmica 750ml" e 1 "Boné Aba Curva" | R$ 199,90 | R$ 19,90 | R$ 219,80 | Faltam R$ 0,10 para o frete grátis. |
      | 2 "Mochila Urbana 20L"                                                 | R$ 200,00 | Grátis   | R$ 200,00 | (não exibida)                       |
      | 1 "Camiseta Essencial" e 5 "Kit 3 Pares de Meias"                      | R$ 209,40 | Grátis   | R$ 209,40 | (não exibida)                       |

  @CT07 @CA08 @ui
  Cenário: Frete grátis considera o subtotal antes do desconto
    Dado que tenho no carrinho 1 "Tênis Casual Urbano" e 1 "Kit 3 Pares de Meias"
    Quando aplico o cupom "BEMVINDO10"
    Então o resumo deve exibir subtotal "R$ 219,80", desconto "- R$ 21,98", frete "Grátis" e total "R$ 197,82"
    # O total fica abaixo de R$ 200,00, mas o frete continua grátis porque o subtotal é R$ 219,80.
