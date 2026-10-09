import { expect, test } from '@playwright/test';
import { BUGS, CLIENTE_VALIDO, PRODUTOS } from '../support/dados';

/**
 * CT09 — a API deve validar o limite de 5 unidades por produto (CA10).
 */
const casos = [
  { linha: 'a', rota: '/api/carrinho/calcular', quantidade: 5, statusEsperado: 200 },
  {
    linha: 'b',
    rota: '/api/carrinho/calcular',
    quantidade: 6,
    statusEsperado: 422,
    bug: 'BUG-02: a API aceita 6 unidades no cálculo do carrinho',
  },
  {
    linha: 'c',
    rota: '/api/pedidos',
    quantidade: 6,
    statusEsperado: 422,
    bug: 'BUG-02: a API confirma pedido com 6 unidades',
  },
] as const;

test.describe('Limite de 5 unidades por produto na API', () => {
  for (const caso of casos) {
    const bug = 'bug' in caso ? caso.bug : undefined;

    test(
      `CT09${caso.linha} - POST ${caso.rota} com ${caso.quantidade} unidades responde ${caso.statusEsperado}`,
      {
        tag: ['@CT09', '@CA10', ...(bug ? ['@bug'] : [])],
        annotation: bug ? [{ type: 'issue', description: `${bug} (${BUGS.BUG_02})` }] : [],
      },
      async ({ request }, testInfo) => {
        // Enquanto o bug existir, o teste falha, e o Playwright conta a falha como esperada.
        test.fail(!!bug, bug);

        const itens = [{ produtoId: PRODUTOS.CAMISETA.id, quantidade: caso.quantidade }];
        const corpo = caso.rota === '/api/pedidos' ? { cliente: CLIENTE_VALIDO, itens } : { itens };

        const resposta = await request.post(caso.rota, { data: corpo });
        const json = await resposta.json();
        await testInfo.attach('resposta.json', {
          body: JSON.stringify({ status: resposta.status(), corpo: json }, null, 2),
          contentType: 'application/json',
        });

        expect(resposta.status()).toBe(caso.statusEsperado);
        if (caso.statusEsperado === 200) {
          expect(json.subtotal).toBe(299.5);
        } else {
          expect(json.erro.codigo).toBe('QUANTIDADE_MAXIMA_EXCEDIDA');
          expect(json).not.toHaveProperty('numero');
        }
      },
    );
  }
});
