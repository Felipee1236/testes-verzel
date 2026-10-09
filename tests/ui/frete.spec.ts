import { expect, test } from '@playwright/test';
import { CarrinhoPage } from '../pages/CarrinhoPage';
import { VitrinePage } from '../pages/VitrinePage';
import { BUGS, PRODUTOS } from '../support/dados';

/**
 * CT06 — fronteira do frete grátis (CA06 e CA07).
 * R$ 199,90 é o maior subtotal possível abaixo de R$ 200,00 com o catálogo,
 * e R$ 209,40 é o menor acima.
 */
const fronteiras = [
  {
    subtotal: 'R$ 199,90',
    itens: [
      [PRODUTOS.MOCHILA.nome, 1],
      [PRODUTOS.GARRAFA.nome, 1],
      [PRODUTOS.BONE.nome, 1],
    ],
    frete: 'R$ 19,90',
    total: 'R$ 219,80',
    mensagemFaltante: 'Faltam R$ 0,10 para o frete grátis.',
  },
  {
    subtotal: 'R$ 200,00',
    itens: [[PRODUTOS.MOCHILA.nome, 2]],
    frete: 'Grátis',
    total: 'R$ 200,00',
    mensagemFaltante: null,
    bug: 'BUG-01: frete de R$ 19,90 é cobrado quando o subtotal é exatamente R$ 200,00',
  },
  {
    subtotal: 'R$ 209,40',
    itens: [
      [PRODUTOS.CAMISETA.nome, 1],
      [PRODUTOS.MEIAS.nome, 5],
    ],
    frete: 'Grátis',
    total: 'R$ 209,40',
    mensagemFaltante: null,
  },
] as const;

test.describe('Frete grátis a partir de R$ 200,00', () => {
  for (const caso of fronteiras) {
    const bug = 'bug' in caso ? caso.bug : undefined;

    test(
      `CT06 - subtotal ${caso.subtotal}: frete ${caso.frete}`,
      {
        tag: ['@CT06', '@CA06', '@CA07', ...(bug ? ['@bug'] : [])],
        annotation: bug ? [{ type: 'issue', description: `${bug} (${BUGS.BUG_01})` }] : [],
      },
      async ({ page }, testInfo) => {
        // O teste verifica o comportamento correto da documentação.
        // Enquanto o bug existir, ele falha, e o Playwright conta a falha como esperada.
        test.fail(!!bug, bug);

        const vitrine = new VitrinePage(page);
        const carrinho = new CarrinhoPage(page);

        await vitrine.abrir();
        for (const [nome, quantidade] of caso.itens) {
          await vitrine.adicionar(nome, quantidade);
        }
        await carrinho.abrir();
        await expect(carrinho.valor('subtotal')).toHaveText(caso.subtotal);

        await testInfo.attach(`carrinho-subtotal-${caso.subtotal}`, {
          body: await page.screenshot({ fullPage: true }),
          contentType: 'image/png',
        });

        await carrinho.validarResumo({ frete: caso.frete, total: caso.total });
        if (caso.mensagemFaltante) {
          await expect(carrinho.avisoFreteGratis).toHaveText(caso.mensagemFaltante);
        } else {
          await expect(carrinho.avisoFreteGratis).toBeHidden();
        }
      },
    );
  }
});
