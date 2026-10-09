# language: pt
@cupom
Funcionalidade: Cupom de desconto no carrinho
  Como cliente da Verzel Store
  Quero aplicar um cupom de desconto no carrinho
  Para pagar menos nas minhas compras

  Contexto:
    Dado que estou na página do carrinho com o carrinho vazio

  @CT01 @CA01 @ui @smoke @automacao
  Cenário: Aplicar o cupom BEMVINDO10 com 10% de desconto sobre o subtotal
    Dado que tenho no carrinho 1 "Calça Jeans Slim" e 2 "Boné Aba Curva"
    Quando aplico o cupom "BEMVINDO10"
    Então devo ver a confirmação de que o cupom "BEMVINDO10" foi aplicado
    E o resumo deve exibir subtotal "R$ 239,70", desconto "- R$ 23,97", frete "Grátis" e total "R$ 215,73"

  @CT02 @CA02 @ui
  Cenário: Código em minúsculas e com espaços nas pontas é aceito
    Dado que tenho no carrinho 1 "Mochila Urbana 20L"
    Quando aplico o cupom "  bemvindo10  "
    Então devo ver a confirmação de que o cupom "BEMVINDO10" foi aplicado
    E o resumo deve exibir desconto "- R$ 10,00" e total "R$ 109,90"

  @CT03 @CA03 @CA04 @ui @automacao
  Esquema do Cenário: Cupom inexistente ou expirado não aplica desconto
    Dado que tenho no carrinho 1 "Mochila Urbana 20L"
    Quando aplico o cupom "<cupom>"
    Então devo ver a mensagem "<mensagem>"
    E o resumo deve exibir desconto "R$ 0,00" e total "R$ 119,90"

    Exemplos:
      | cupom     | mensagem         | caso        |
      | XPTO      | Cupom inválido.  | inexistente |
      | VERAO2026 | Cupom expirado.  | fora da validade |

  @CT04 @CA05 @ui
  Cenário: Apenas um cupom por vez e troca exige remover o atual
    Dado que tenho no carrinho 1 "Mochila Urbana 20L"
    E apliquei o cupom "BEMVINDO10"
    Então não deve ser possível aplicar outro cupom enquanto "BEMVINDO10" estiver aplicado
    Quando clico em "Remover cupom"
    Então o resumo deve exibir desconto "R$ 0,00" e total "R$ 119,90"
    E o campo de cupom deve voltar a ficar disponível

  @CT05 @CA09 @ui
  Cenário: O desconto do cupom não incide sobre o frete
    Dado que tenho no carrinho 1 "Camiseta Essencial"
    Quando aplico o cupom "BEMVINDO10"
    Então o resumo deve exibir subtotal "R$ 59,90", desconto "- R$ 5,99", frete "R$ 19,90" e total "R$ 73,81"
    # Se o desconto incidisse sobre o frete, ele seria de R$ 7,98 e o total R$ 71,82.
