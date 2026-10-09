# language: pt
@checkout
Funcionalidade: Finalização da compra
  Regras que já existiam antes desta entrega, testadas como regressão:
  nome com nome e sobrenome, e-mail em formato válido, CEP com 8 dígitos
  (com ou sem hífen) e pagamento na entrega.

  Contexto:
    Dado que tenho no carrinho 1 "Mochila Urbana 20L"
    E apliquei o cupom "BEMVINDO10"
    E estou na página "Finalizar compra"

  @CT10 @CA01 @CA09 @ui @smoke
  Esquema do Cenário: Confirmar um pedido com dados válidos
    Então o resumo deve exibir subtotal "R$ 100,00", desconto "- R$ 10,00", frete "R$ 19,90" e total "R$ 109,90"
    E devo ver a informação "O pagamento é feito na entrega."
    Quando preencho nome "Maria Silva", e-mail "maria@exemplo.com" e CEP "<cep>"
    E clico em "Confirmar pedido"
    Então devo ver a confirmação do pedido com número no formato "VZ-000000"
    E a confirmação deve exibir o total "R$ 109,90"

    Exemplos:
      | cep       | formato   |
      | 01310-100 | com hífen |
      | 01310100  | sem hífen |

  @CT11 @ui
  Esquema do Cenário: Dado de cliente inválido impede a confirmação
    Quando preencho nome "<nome>", e-mail "<email>" e CEP "<cep>"
    E clico em "Confirmar pedido"
    Então devo ver uma mensagem de validação no campo "<campo>"
    E o pedido não deve ser confirmado

    Exemplos:
      | nome        | email             | cep       | campo         | regra violada        |
      | Maria       | maria@exemplo.com | 01310-100 | Nome completo | falta o sobrenome    |
      | Maria Silva | maria@exemplo     | 01310-100 | E-mail        | formato inválido     |
      | Maria Silva | maria@exemplo.com | 0131010   | CEP           | só 7 dígitos         |

  @CT12 @exploratorio @ui
  Cenário: Acessar o checkout com o carrinho vazio
    Dado que esvaziei o carrinho
    Quando acesso diretamente a página "/checkout"
    Então não deve ser possível confirmar um pedido sem itens
