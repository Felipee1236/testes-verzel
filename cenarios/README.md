# Cenários de teste — VZS-142 (cupom de desconto e frete grátis)

Cenários levantados a partir da [documentação da entrega](https://verzel-store.qa-test-verzel-store.workers.dev/documentacao) (versão 2.3.0, publicada em 30/09/2026), escritos em Gherkin (pt-BR).

São 18 cenários e 32 execuções (17 de interface e 15 de API), contando cada linha de exemplo dos Esquemas do Cenário. A seleção priorizou cobrir todos os critérios de aceite da entrega com o menor número de execuções, usando valores de fronteira em vez de repetir casos equivalentes.

| Arquivo | Funcionalidade | Cenários |
|---|---|---|
| [01-cupom.feature](01-cupom.feature) | Cupom de desconto | CT01 a CT05 |
| [02-frete.feature](02-frete.feature) | Frete grátis | CT06 e CT07 |
| [03-quantidade.feature](03-quantidade.feature) | Limite de 5 unidades | CT08 e CT09 |
| [04-checkout.feature](04-checkout.feature) | Finalização da compra (regressão) | CT10 a CT12 |
| [05-api.feature](05-api.feature) | Cálculo e contrato da API | CT13 a CT18 |

## Tags

| Tag | Significado |
|---|---|
| `@CTxx` | Identificador do cenário, usado na execução, nos bugs e na automação |
| `@CAxx` | Critério de aceite coberto |
| `@ui` / `@api` | Camada testada |
| `@smoke` | Fluxo principal, executado primeiro |
| `@exploratorio` | Comportamento não especificado na documentação; o resultado esperado é uma interpretação registrada |
| `@automacao` | Cenário escolhido para automação com Playwright |

## Rastreabilidade: critérios de aceite × cenários

| Critério | Descrição resumida | Cenários |
|---|---|---|
| CA01 | BEMVINDO10 dá 10% sobre o subtotal | CT01, CT10 |
| CA02 | Código sem diferenciar maiúsculas e minúsculas, espaços nas pontas ignorados | CT02, CT16 |
| CA03 | Cupom inexistente: "Cupom inválido." e sem desconto | CT03, CT14, CT15 |
| CA04 | Cupom vencido: "Cupom expirado." e sem desconto | CT03, CT14, CT15 |
| CA05 | Um cupom por vez; trocar exige remover | CT04 |
| CA06 | Frete grátis com subtotal a partir de R$ 200,00, inclusive | CT06 |
| CA07 | Abaixo de R$ 200,00: frete R$ 19,90 e aviso do valor faltante | CT06 |
| CA08 | Frete grátis considera o subtotal antes do desconto | CT07 |
| CA09 | Desconto não incide sobre o frete | CT05, CT10 |
| CA10 | Máximo de 5 unidades por produto, na interface e na API | CT08, CT09 |
| CA11 | Valores arredondados para 2 casas decimais | CT13 |
| Regras existentes | Nome e sobrenome, e-mail válido, CEP com 8 dígitos, pagamento na entrega | CT10, CT11, CT18 |
| Contrato da API | Formato de resposta e códigos de erro | CT14 a CT18 |

## Técnicas usadas

- **Partição de equivalência:** um representante por classe (cupom válido, inexistente e expirado; um dado inválido por regra do checkout) em vez de várias variações da mesma classe.
- **Análise de valor limite:** frete em torno de R$ 200,00 e quantidade em torno de 5.
  - Com os preços do catálogo e o limite de 5 unidades, o maior subtotal possível abaixo de R$ 200,00 é **R$ 199,90** (Mochila + Garrafa + Boné).
  - O menor acima é **R$ 209,40** (Camiseta + 5 Kits de Meias). Não existe combinação entre R$ 200,01 e R$ 209,39.
  - Por isso a fronteira foi testada com R$ 199,90, R$ 200,00 e R$ 209,40.
- **Tabela de decisão:** combinação de cupom × subtotal × frete (CT07).

## Dados de teste

Produtos e cupons da documentação:
- **Produtos:**
  - P001 Camiseta Essencial: R$ 59,90
  - P002 Calça Jeans Slim: R$ 139,90
  - P003 Tênis Casual Urbano: R$ 189,90
  - P004 Boné Aba Curva: R$ 49,90
  - P005 Mochila Urbana 20L: R$ 100,00
  - P006 Kit 3 Pares de Meias: R$ 29,90
  - P007 Jaqueta Corta-Vento: R$ 229,90
  - P008 Garrafa Térmica 750ml: R$ 50,00
- **Cupons:** BEMVINDO10 (10%, válido) e VERAO2026 (15%, expirado em 31/03/2026).
- **Cliente válido:** Maria Silva / maria@exemplo.com / 01310-100.

## Interpretações registradas

Pontos em que a documentação é ambígua ou silenciosa, e a interpretação adotada.

1. **"Primeira compra":** o banner da página inicial diz que o BEMVINDO10 vale "na primeira compra", mas a documentação não traz essa restrição e não existe login nem histórico de pedidos. Segui a documentação: o cupom é válido em qualquer pedido. A divergência de texto fica registrada como observação para o time de produto.
2. **Checkout com carrinho vazio:** não especificado. Esperado que não seja possível confirmar um pedido sem itens (CT12).
3. **Id de produto:** a documentação não diz se o id diferencia maiúsculas e minúsculas. `p001` retorna "produto não encontrado", e isso foi tratado como comportamento aceitável, não como bug.
4. **Mensagens de validação do checkout na interface:** a documentação só traz as mensagens da API. Na interface, o CT11 verifica apenas que a mensagem de validação aparece no campo certo e que o pedido não é confirmado.

## Fora do escopo

Conforme o enunciado e a seção "Sobre este ambiente" da documentação, ficam fora do escopo:
- testes de carga, estresse e segurança;
- login, cadastro, pagamento online e consulta de pedidos;
- carrinho vazio em outra aba ou janela anônima, pedidos não armazenados e ausência de e-mails, que são comportamentos esperados do ambiente.
