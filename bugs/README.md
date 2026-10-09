# Bugs encontrados — VZS-142

| ID | Título | Severidade | Prioridade | Critério | Cenário | Camada |
|---|---|---|---|---|---|---|
| [BUG-01](BUG-01-frete-cobrado-com-subtotal-200.md) | Frete de R$ 19,90 é cobrado quando o subtotal é exatamente R$ 200,00 | Alta | Alta | CA06 | CT06 | API + interface |
| [BUG-02](BUG-02-api-aceita-mais-de-5-unidades.md) | API aceita mais de 5 unidades do mesmo produto no cálculo e no pedido | Média | Alta | CA10 | CT09 | API |

## Critérios de classificação

| Severidade | Quando usar |
|---|---|
| Alta | Regra de negócio de preço ou pedido quebrada para o cliente comum, sem contorno |
| Média | Regra de negócio quebrada, mas com impacto limitado ou mitigado em outra camada |
| Baixa | Problema cosmético, de texto ou de usabilidade, sem efeito no valor ou no pedido |

A prioridade considera também o risco para o negócio e o que o critério de aceite pede explicitamente.

## Cobertura da exploração na interface

Os dois bugs têm origem na API. O BUG-01 aparece também na tela (carrinho e checkout); o BUG-02 é bloqueado pela tela. Foi feita uma rodada exploratória específica na interface para procurar defeitos só de tela, sem nenhum encontrado.

O que foi verificado na interface:
- **Cálculos:** a tela não calcula valores por conta própria. Subtotal, desconto, frete, total e valor faltante vêm da API e só são formatados em reais. Por isso, qualquer erro de cálculo aparece igual na API e na tela.
- **Cupom:** maiúsculas, minúsculas e espaços nas pontas; inválido; expirado; campo vazio ("Informe um cupom."); campo escondido enquanto há cupom aplicado; remover cupom.
- **Quantidade:** limite de 5 na vitrine e no carrinho; botão "−" desabilitado em 1; remover item.
- **Checkout:**
  - a validação de nome, e-mail e CEP na tela usa as mesmas regras da API;
  - checkout com carrinho vazio redireciona para o carrinho;
  - os espaços extras no nome são removidos antes da confirmação.
- **Persistência:** carrinho e cupom mantidos ao recarregar a página na mesma aba.

## Observações (não são bugs)

Pontos registrados durante os testes que não violam a documentação, mas merecem atenção do time.

### OBS-01 — Texto da página inicial diverge da documentação sobre o cupom

- O banner da página inicial diz que o cupom BEMVINDO10 vale "na primeira compra".
- A documentação da entrega não traz essa restrição.
- O ambiente não tem login nem histórico de pedidos, então não há como aplicar essa regra.
- O cupom funciona em qualquer pedido, conforme a documentação.
- **Sugestão:** alinhar o texto do banner com a regra real, ou documentar a restrição se ela for desejada.

### Comportamentos verificados e considerados corretos

- O id de produto diferencia maiúsculas e minúsculas: `p001` retorna "produto não encontrado". A documentação não especifica esse comportamento, e ele foi considerado aceitável.
- Comportamentos listados na seção "Sobre este ambiente" da documentação não foram reportados, por serem esperados:
  - carrinho por aba;
  - pedidos não armazenados;
  - ausência de e-mails.
