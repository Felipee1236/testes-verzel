# Execução dos testes — VZS-142

| Item | Valor |
|---|---|
| **Data da execução** | 09/10/2026 |
| **Ambiente** | https://verzel-store.qa-test-verzel-store.workers.dev/ (versão 2.3.0) |
| **Navegador** | Chromium, janela de 1280x720 |
| **Cenários** | [`../cenarios/`](../cenarios/) |
| **Evidências** | interface em [`../evidencias/execucao/ui/`](../evidencias/execucao/ui/), API em [`../evidencias/execucao/api/`](../evidencias/execucao/api/) |

## Resumo

| | Cenários | Execuções |
|---|---|---|
| ✅ Passou | 16 | 29 |
| ❌ Falhou | 2 | 3 |
| **Total** | **18** | **32** |

As 3 execuções que falharam correspondem aos 2 bugs reportados:
- **CT06**, linha do subtotal R$ 200,00 → [BUG-01](../bugs/BUG-01-frete-cobrado-com-subtotal-200.md);
- **CT09**, linhas com 6 unidades no cálculo e no pedido → [BUG-02](../bugs/BUG-02-api-aceita-mais-de-5-unidades.md).

Cobertura por critério de aceite:

| Critério | Resultado |
|---|---|
| CA01, CA02, CA03, CA04, CA05, CA07, CA08, CA09, CA11 | ✅ Atendidos |
| CA06 (frete grátis a partir de R$ 200,00, inclusive) | ❌ Falha no valor exato de R$ 200,00 (BUG-01) |
| CA10 (máximo de 5 unidades na interface e na API) | ❌ Atendido na interface, não na API (BUG-02) |

## Resultado por execução

### Interface

As pré-condições de carrinho foram montadas pela vitrine, clicando em "Adicionar ao carrinho".

| Cenário | Linha | Execução | Esperado | Obtido | Resultado | Evidência |
|---|---|---|---|---|---|---|
| CT01 | — | 1 Calça + 2 Bonés + BEMVINDO10 | Subtotal R$ 239,70, desconto R$ 23,97, frete grátis, total R$ 215,73 | Igual ao esperado | ✅ Passou | [print](../evidencias/execucao/ui/CT01_cupom-bemvindo10-aplicado.jpg) |
| CT02 | — | 1 Mochila + `"  bemvindo10  "` | Cupom BEMVINDO10 aplicado, desconto R$ 10,00, total R$ 109,90 | Igual ao esperado | ✅ Passou | [print](../evidencias/execucao/ui/CT02_cupom-minusculas-com-espacos.jpg) |
| CT03 | a | 1 Mochila + XPTO | "Cupom inválido.", desconto R$ 0,00, total R$ 119,90 | Igual ao esperado | ✅ Passou | [print](../evidencias/execucao/ui/CT03a_cupom-inexistente.jpg) |
| CT03 | b | 1 Mochila + VERAO2026 | "Cupom expirado.", desconto R$ 0,00, total R$ 119,90 | Igual ao esperado | ✅ Passou | [print](../evidencias/execucao/ui/CT03b_cupom-expirado.jpg) |
| CT04 | — | Aplicar BEMVINDO10 e depois remover | Sem campo para outro cupom enquanto há um aplicado; após remover, desconto R$ 0,00 e campo de volta | Igual ao esperado | ✅ Passou | [aplicado](../evidencias/execucao/ui/CT04a_cupom-aplicado-sem-campo-para-outro.jpg) · [removido](../evidencias/execucao/ui/CT04b_cupom-removido-campo-disponivel.jpg) |
| CT05 | — | 1 Camiseta + BEMVINDO10 | Desconto R$ 5,99, frete R$ 19,90, total R$ 73,81 | Igual ao esperado | ✅ Passou | [print](../evidencias/execucao/ui/CT05_desconto-nao-incide-no-frete.jpg) |
| CT06 | a | Mochila + Garrafa + Boné (R$ 199,90) | Frete R$ 19,90, total R$ 219,80, "Faltam R$ 0,10 para o frete grátis." | Igual ao esperado | ✅ Passou | [print](../evidencias/execucao/ui/CT06a_frete-subtotal-199-90.jpg) |
| CT06 | b | 2 Mochilas (R$ 200,00) | Frete grátis, total R$ 200,00, sem mensagem de valor faltante | Frete R$ 19,90, total R$ 219,90, "Faltam R$ 0,00 para o frete grátis." | ❌ Falhou ([BUG-01](../bugs/BUG-01-frete-cobrado-com-subtotal-200.md)) | [print](../evidencias/execucao/ui/CT06b_frete-subtotal-200-00_FALHOU.jpg) |
| CT06 | c | 1 Camiseta + 5 Kits de Meias (R$ 209,40) | Frete grátis, total R$ 209,40 | Igual ao esperado | ✅ Passou | [print](../evidencias/execucao/ui/CT06c_frete-subtotal-209-40.jpg) |
| CT07 | — | Tênis + Kit de Meias + BEMVINDO10 | Subtotal R$ 219,80, desconto R$ 21,98, frete grátis, total R$ 197,82 | Igual ao esperado | ✅ Passou | [print](../evidencias/execucao/ui/CT07_frete-gratis-subtotal-antes-do-desconto.jpg) |
| CT08 | — | 6 cliques em "Adicionar ao carrinho" na Camiseta | Contador em 5, botão "+" do carrinho desabilitado, aviso de limite | Contador em 5; botão da vitrine também desabilitado no 5º clique; no carrinho, "+" desabilitado e "Limite de 5 unidades por produto." | ✅ Passou | [vitrine](../evidencias/execucao/ui/CT08a_vitrine-limite-5-unidades.jpg) · [carrinho](../evidencias/execucao/ui/CT08b_carrinho-botao-aumentar-desabilitado.jpg) |
| CT10 | a | Pedido com CEP `01310-100` | Resumo igual ao carrinho, pagamento na entrega, pedido VZ-000000 com total R$ 109,90 | Pedido **VZ-022372**, total R$ 109,90; carrinho esvaziado após a confirmação | ✅ Passou | [resumo](../evidencias/execucao/ui/CT10_1_checkout-resumo.jpg) · [preenchido](../evidencias/execucao/ui/CT10a_2_checkout-preenchido-cep-com-hifen.jpg) · [confirmado](../evidencias/execucao/ui/CT10a_3_pedido-confirmado.jpg) |
| CT10 | b | Pedido com CEP `01310100` | Pedido confirmado | Pedido **VZ-544370**, total R$ 109,90 | ✅ Passou | [preenchido](../evidencias/execucao/ui/CT10b_1_checkout-preenchido-cep-sem-hifen.jpg) · [confirmado](../evidencias/execucao/ui/CT10b_2_pedido-confirmado.jpg) |
| CT11 | a | Nome `Maria` | Validação no campo Nome e pedido não confirmado | "Informe nome e sobrenome." e permaneceu no checkout | ✅ Passou | [print](../evidencias/execucao/ui/CT11a_nome-sem-sobrenome.jpg) |
| CT11 | b | E-mail `maria@exemplo` | Validação no campo E-mail e pedido não confirmado | "Informe um e-mail válido." e permaneceu no checkout | ✅ Passou | [print](../evidencias/execucao/ui/CT11b_email-invalido.jpg) |
| CT11 | c | CEP `0131010` | Validação no campo CEP e pedido não confirmado | "Informe um CEP com 8 dígitos." e permaneceu no checkout | ✅ Passou | [print](../evidencias/execucao/ui/CT11c_cep-7-digitos.jpg) |
| CT12 | — | Acessar `/checkout` com o carrinho vazio | Não permitir confirmar pedido sem itens | Redirecionou para o carrinho com "Seu carrinho está vazio" | ✅ Passou | [print](../evidencias/execucao/ui/CT12_checkout-carrinho-vazio-redireciona.jpg) |

### API

Cada arquivo de evidência traz, por linha, a requisição enviada, a resposta recebida, o resultado esperado e a data e hora da execução.

| Cenário | Linha | Execução | Esperado | Obtido | Resultado | Evidência |
|---|---|---|---|---|---|---|
| CT09 | a | Calcular com 5 unidades de P001 | 200, subtotal 299.5 | 200, subtotal 299.5 | ✅ Passou | [CT09.json](../evidencias/execucao/api/CT09.json) |
| CT09 | b | Calcular com 6 unidades de P001 | 422 `QUANTIDADE_MAXIMA_EXCEDIDA` | 200, subtotal 359.4 | ❌ Falhou ([BUG-02](../bugs/BUG-02-api-aceita-mais-de-5-unidades.md)) | [CT09.json](../evidencias/execucao/api/CT09.json) |
| CT09 | c | Pedido com 6 unidades de P001 | 422 `QUANTIDADE_MAXIMA_EXCEDIDA` e nenhum pedido | 201, pedido VZ-526996 gerado | ❌ Falhou ([BUG-02](../bugs/BUG-02-api-aceita-mais-de-5-unidades.md)) | [CT09.json](../evidencias/execucao/api/CT09.json) |
| CT13 | a | P006 x3 + BEMVINDO10 | 89.7 / 8.97 / 19.9 / 100.63, com 2 casas | Igual ao esperado | ✅ Passou | [CT13.json](../evidencias/execucao/api/CT13.json) |
| CT13 | b | P007 x3 + P003 x1 + BEMVINDO10 | 879.6 / 87.96 / 0 / 791.64, com 2 casas | Igual ao esperado | ✅ Passou | [CT13.json](../evidencias/execucao/api/CT13.json) |
| CT14 | a | Calcular com XPTO | 200, sem desconto, `aplicado: false`, "Cupom inválido." | Igual ao esperado | ✅ Passou | [CT14.json](../evidencias/execucao/api/CT14.json) |
| CT14 | b | Calcular com VERAO2026 | 200, sem desconto, `aplicado: false`, "Cupom expirado." | Igual ao esperado | ✅ Passou | [CT14.json](../evidencias/execucao/api/CT14.json) |
| CT15 | a | Pedido com XPTO | 422 `CUPOM_INVALIDO`, campo `cupom` | Igual ao esperado | ✅ Passou | [CT15.json](../evidencias/execucao/api/CT15.json) |
| CT15 | b | Pedido com VERAO2026 | 422 `CUPOM_EXPIRADO`, campo `cupom` | Igual ao esperado | ✅ Passou | [CT15.json](../evidencias/execucao/api/CT15.json) |
| CT16 | — | Pedido válido com cupom `" bemvindo10 "` | 201, número VZ-000000, CEP `01310100`, total 109.9 | 201, pedido VZ-794399, CEP normalizado, total 109.9 | ✅ Passou | [CT16.json](../evidencias/execucao/api/CT16.json) |
| CT17 | a | Lista de itens vazia | 422 `ITENS_OBRIGATORIOS` | Igual ao esperado | ✅ Passou | [CT17.json](../evidencias/execucao/api/CT17.json) |
| CT17 | b | Produto P999 | 422 `PRODUTO_NAO_ENCONTRADO` | Igual ao esperado | ✅ Passou | [CT17.json](../evidencias/execucao/api/CT17.json) |
| CT17 | c | Produto repetido na lista | 422 `ITEM_DUPLICADO` | Igual ao esperado | ✅ Passou | [CT17.json](../evidencias/execucao/api/CT17.json) |
| CT17 | d | Quantidade 0 | 422 `QUANTIDADE_INVALIDA` | Igual ao esperado | ✅ Passou | [CT17.json](../evidencias/execucao/api/CT17.json) |
| CT18 | — | Nome vazio, e-mail `x`, CEP `1` | 422 `DADOS_INVALIDOS` listando os 3 campos | Igual ao esperado | ✅ Passou | [CT18.json](../evidencias/execucao/api/CT18.json) |

## Testes exploratórios

Além dos cenários roteirizados, foram feitas três sessões exploratórias. Elas não viraram cenários fixos, mas orientaram a escolha dos cenários e geraram os dois bugs.

| Sessão | Objetivo | O que foi feito | Achados |
|---|---|---|---|
| 1. API além dos critérios de aceite | Encontrar respostas fora do contrato documentado | Variações de cupom (minúsculas, espaços, espaço no meio, número, `null`, vazio); quantidades 0, -1, 1.5, "2", 6 e 99; corpo inválido; métodos e rotas inexistentes; validações de nome, e-mail e CEP | BUG-01 e BUG-02. Todos os outros códigos de erro da documentação estão corretos |
| 2. Arredondamento e fronteiras | Verificar CA11 e achar os valores-limite reais do frete | Varredura dos 8 produtos com quantidades de 1 a 5, com cupom (40 cálculos), conferindo 2 casas decimais, desconto de 10% e a fórmula do total. Cálculo de todas as combinações possíveis do catálogo para achar os subtotais mais próximos de R$ 200,00 | Nenhum erro de arredondamento. Fronteiras reais: R$ 199,90, R$ 200,00 e R$ 209,40, usadas no CT06 |
| 3. Interface | Procurar defeitos só de tela | Leitura do código da página para mapear onde a tela tem lógica própria; teste de cupom na tela, persistência ao recarregar, botões "+" e "−", remover item, esvaziar carrinho, checkout com carrinho vazio e página de confirmação | Nenhum bug só de tela: os cálculos vêm da API e as validações da tela são iguais às da API. Divergência de texto no banner da página inicial ([OBS-01](../bugs/README.md#obs-01--texto-da-página-inicial-diverge-da-documentação-sobre-o-cupom)) |

## Observações da execução

- **Execuções que confirmaram pedido:** usaram somente os dados fictícios do cenário (Maria Silva / maria@exemplo.com). Os números gerados (VZ-022372, VZ-544370, VZ-794399, VZ-526996) são fictícios, como diz a documentação.
- **Prints do CT02 ao CT05:** foram capturados com zoom de página reduzido, para o carrinho e o resumo caberem na mesma imagem. A partir do CT06, a janela foi fixada em 1280x720.
