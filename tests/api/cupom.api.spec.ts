import { expect, test } from '@playwright/test';
import { CLIENTE_VALIDO, CUPONS, PRODUTOS } from '../support/dados';

/**
 * CT15 — na criação do pedido, cupom inválido ou expirado gera erro 422 (CA03 e CA04).
 */
const cuponsRecusados = [
  { cupom: CUPONS.INEXISTENTE, codigo: 'CUPOM_INVALIDO', mensagem: 'Cupom inválido.', criterio: '@CA03' },
  { cupom: CUPONS.EXPIRADO, codigo: 'CUPOM_EXPIRADO', mensagem: 'Cupom expirado.', criterio: '@CA04' },
];

test.describe('Cupom na criação do pedido', () => {
  for (const { cupom, codigo, mensagem, criterio } of cuponsRecusados) {
    test(
      `CT15 - pedido com cupom ${cupom} é recusado com ${codigo}`,
      { tag: ['@CT15', criterio] },
      async ({ request }, testInfo) => {
        const resposta = await request.post('/api/pedidos', {
          data: {
            cliente: CLIENTE_VALIDO,
            itens: [{ produtoId: PRODUTOS.MOCHILA.id, quantidade: 1 }],
            cupom,
          },
        });
        const json = await resposta.json();
        await testInfo.attach('resposta.json', {
          body: JSON.stringify({ status: resposta.status(), corpo: json }, null, 2),
          contentType: 'application/json',
        });

        expect(resposta.status()).toBe(422);
        expect(json.erro).toMatchObject({ codigo, campo: 'cupom', mensagem });
        expect(json).not.toHaveProperty('numero');
      },
    );
  }
});
