# Teste técnico QA Júnior — Verzel Store

Validação da entrega **VZS-142: cupom de desconto e frete grátis** (versão 2.3.0) da Verzel Store.

- **Loja:** https://verzel-store.qa-test-verzel-store.workers.dev/
- **Documentação da entrega:** https://verzel-store.qa-test-verzel-store.workers.dev/documentacao
- **API:** https://verzel-store.qa-test-verzel-store.workers.dev/api

## Onde encontrar cada entrega

| Entrega pedida | Onde está | Status |
|---|---|---|
| Cenários de teste levantados a partir da documentação (Gherkin) | [`cenarios/`](cenarios/) | ✅ Concluído |
| Execução dos testes manuais e exploratórios, com o resultado de cada cenário | `execucao/` | 🔄 Em andamento |
| Report de todos os bugs encontrados | [`bugs/`](bugs/) | ✅ Concluído |
| Documento com as evidências da execução | [`evidencias/`](evidencias/) | 🔄 Bugs concluídos; execução em andamento |
| Automação de pelo menos 3 cenários com Playwright | `tests/` | 🔄 Em andamento |

## Estrutura do repositório

```
.
├── README.md                  ← este arquivo
├── cenarios/                  ← cenários em Gherkin (pt-BR)
│   ├── README.md              ← índice, rastreabilidade com os critérios de aceite e interpretações
│   ├── 01-cupom.feature
│   ├── 02-frete.feature
│   ├── 03-quantidade.feature
│   ├── 04-checkout.feature
│   └── 05-api.feature
├── bugs/                      ← reports de bug
│   ├── README.md              ← resumo, critérios de severidade e observações
│   ├── BUG-01-frete-cobrado-com-subtotal-200.md
│   └── BUG-02-api-aceita-mais-de-5-unidades.md
└── evidencias/
    ├── ui/                    ← prints da interface
    └── api/                   ← requisições e respostas da API (JSON) e prints
```

## Resumo dos resultados até aqui

- **18 cenários** (32 execuções contando os exemplos), cobrindo os 11 critérios de aceite.
- **2 bugs encontrados:**

| ID | Bug | Severidade | Critério |
|---|---|---|---|
| [BUG-01](bugs/BUG-01-frete-cobrado-com-subtotal-200.md) | Frete de R$ 19,90 é cobrado quando o subtotal é exatamente R$ 200,00 | Alta | CA06 |
| [BUG-02](bugs/BUG-02-api-aceita-mais-de-5-unidades.md) | API aceita mais de 5 unidades do mesmo produto no cálculo e no pedido | Média | CA10 |

As interpretações de pontos ambíguos da documentação estão em [`cenarios/README.md`](cenarios/README.md#interpretações-registradas).
