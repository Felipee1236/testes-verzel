# Teste técnico QA Júnior — Verzel Store

Validação da entrega **VZS-142: cupom de desconto e frete grátis** (versão 2.3.0) da Verzel Store.

- **Loja:** https://verzel-store.qa-test-verzel-store.workers.dev/
- **Documentação da entrega:** https://verzel-store.qa-test-verzel-store.workers.dev/documentacao
- **API:** https://verzel-store.qa-test-verzel-store.workers.dev/api

## Onde encontrar cada entrega

| Entrega pedida | Onde está |
|---|---|
| Cenários de teste levantados a partir da documentação (Gherkin) | [`cenarios/`](cenarios/), com índice e rastreabilidade em [`cenarios/README.md`](cenarios/README.md) |
| Execução dos testes manuais e exploratórios, com o resultado de cada cenário | [`execucao/README.md`](execucao/README.md) |
| Report de todos os bugs encontrados | [`bugs/`](bugs/), com resumo em [`bugs/README.md`](bugs/README.md) |
| Documento com as evidências da execução | [`evidencias/`](evidencias/), ligadas linha a linha no relatório de execução e nos bugs |
| Automação de pelo menos 3 cenários com Playwright | [`tests/`](tests/) (6 cenários, 12 testes). Como rodar: [seção abaixo](#como-rodar-a-automação) |

## Resumo dos resultados

- **18 cenários e 32 execuções manuais**, cobrindo os 11 critérios de aceite: **29 passaram e 3 falharam**.
- As falhas estão no CA06 (frete em exatamente R$ 200,00) e no CA10 (limite de quantidade na API).
- **2 bugs encontrados:**

| ID | Bug | Severidade | Critério |
|---|---|---|---|
| [BUG-01](bugs/BUG-01-frete-cobrado-com-subtotal-200.md) | Frete de R$ 19,90 é cobrado quando o subtotal é exatamente R$ 200,00 | Alta | CA06 |
| [BUG-02](bugs/BUG-02-api-aceita-mais-de-5-unidades.md) | API aceita mais de 5 unidades do mesmo produto no cálculo e no pedido | Média | CA10 |

As interpretações de pontos ambíguos da documentação estão em [`cenarios/README.md`](cenarios/README.md#interpretações-registradas).

## Como rodar a automação

### Pré-requisitos

- [Node.js](https://nodejs.org/) 20 ou superior
- Git

### Instalação

```bash
git clone https://github.com/Felipee1236/teste-qa-verzel.git
cd teste-qa-verzel
npm install
npx playwright install chromium
```

### Execução

| Comando | O que faz |
|---|---|
| `npm test` | Roda todos os testes (interface e API) |
| `npm run test:ui` | Roda só os testes de interface |
| `npm run test:api` | Roda só os testes de API |
| `npm run test:headed` | Roda os testes de interface com o navegador visível |
| `npm run report` | Abre o relatório HTML da última execução |
| `npx playwright test --grep @CT06` | Roda um cenário específico pela tag |

Para apontar para outro ambiente: `BASE_URL=https://outro-endereco npm test`.

Os testes também rodam no **GitHub Actions** a cada push na `main` ([`.github/workflows/playwright.yml`](.github/workflows/playwright.yml)). O relatório HTML fica disponível como artefato da execução, na aba Actions.

### Cenários automatizados

| Cenário | Camada | Arquivo | Testes | Critério |
|---|---|---|---|---|
| CT01 — cupom BEMVINDO10 aplica 10% | Interface | [`tests/ui/cupom.spec.ts`](tests/ui/cupom.spec.ts) | 1 | CA01 |
| CT03 — cupom inexistente e expirado | Interface | [`tests/ui/cupom.spec.ts`](tests/ui/cupom.spec.ts) | 2 | CA03, CA04 |
| CT06 — fronteira do frete (R$ 199,90 / R$ 200,00 / R$ 209,40) | Interface | [`tests/ui/frete.spec.ts`](tests/ui/frete.spec.ts) | 3 | CA06, CA07 |
| CT08 — limite de 5 unidades na vitrine e no carrinho | Interface | [`tests/ui/quantidade.spec.ts`](tests/ui/quantidade.spec.ts) | 1 | CA10 |
| CT09 — limite de 5 unidades na API | API | [`tests/api/quantidade.api.spec.ts`](tests/api/quantidade.api.spec.ts) | 3 | CA10 |
| CT15 — cupom inválido e expirado no pedido | API | [`tests/api/cupom.api.spec.ts`](tests/api/cupom.api.spec.ts) | 2 | CA03, CA04 |

Cada teste tem tags com o id do cenário e o critério de aceite (`@CT06`, `@CA06`), para rastrear até os [`cenarios/`](cenarios/).

### Testes que expõem bugs

Três testes verificam o comportamento que a documentação pede e, por isso, falham enquanto os bugs existirem:
- CT06, subtotal de R$ 200,00 → BUG-01;
- CT09b e CT09c → BUG-02.

Eles estão marcados com `test.fail()` e a tag `@bug`, com uma anotação apontando para o report do bug:
- **enquanto o bug existir**, a falha é contada como esperada e a execução fica verde. No terminal, esses testes aparecem com ✘;
- **quando o bug for corrigido**, o teste passa e o Playwright acusa "passou de forma inesperada". Esse é o sinal para remover a marcação.

Com isso, a esteira não fica quebrada por um defeito já conhecido, mas o defeito continua visível e rastreável no relatório. O relatório HTML guarda, em cada teste, o print do carrinho (interface) ou a resposta JSON (API).

### Estrutura da automação

```
tests/
├── pages/                  ← page objects
│   ├── VitrinePage.ts
│   └── CarrinhoPage.ts
├── support/
│   └── dados.ts            ← produtos, cupons, cliente e links dos bugs
├── ui/                     ← testes de interface
│   ├── cupom.spec.ts
│   ├── frete.spec.ts
│   └── quantidade.spec.ts
└── api/                    ← testes de API
    ├── cupom.api.spec.ts
    └── quantidade.api.spec.ts
```

**Decisões técnicas:**
- **Seletores:** priorizam o que o usuário vê, como papel e nome acessível (`getByRole`, `getByLabel`). Os valores do resumo usam o atributo `data-valor`, que a própria página expõe.
- **Pré-condições:** cada teste monta o carrinho pela vitrine, clicando em "Adicionar ao carrinho". Como o carrinho fica na aba, cada teste começa com o carrinho vazio e nenhum depende do outro.
- **Esperas:** não há esperas fixas. As asserções do Playwright esperam o cálculo da API aparecer na tela.

## Estrutura do repositório

```
.
├── README.md
├── cenarios/                  ← cenários em Gherkin (pt-BR) e índice
├── execucao/                  ← resultado de cada execução e testes exploratórios
├── bugs/                      ← reports de bug e observações
├── evidencias/
│   ├── execucao/ui/           ← prints de cada execução na interface
│   ├── execucao/api/          ← requisição e resposta de cada execução na API
│   ├── ui/                    ← prints usados nos reports de bug
│   └── api/                   ← respostas da API usadas nos reports de bug
├── tests/                     ← automação com Playwright
├── playwright.config.ts
├── package.json
└── .github/workflows/         ← execução automática no GitHub Actions
```
