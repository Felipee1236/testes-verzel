import { expect, test } from '@playwright/test';
import { CarrinhoPage } from '../pages/CarrinhoPage';
import { VitrinePage } from '../pages/VitrinePage';
import { CUPONS, PRODUTOS } from '../support/dados';

test.describe('Cupom de desconto', () => {
  test(
    'CT01 - BEMVINDO10 aplica 10% de desconto sobre o subtotal',
    { tag: ['@CT01', '@CA01', '@smoke'] },
    async ({ page }) => {
      const vitrine = new VitrinePage(page);
      const carrinho = new CarrinhoPage(page);

      await vitrine.abrir();
      await vitrine.adicionar(PRODUTOS.CALCA.nome, 1);
      await vitrine.adicionar(PRODUTOS.BONE.nome, 2);
      await carrinho.abrir();
      await carrinho.aplicarCupom(CUPONS.VALIDO);

      await expect(carrinho.cupomAplicado).toContainText('Cupom BEMVINDO10 aplicado.');
      await carrinho.validarResumo({
        subtotal: 'R$ 239,70',
        desconto: '- R$ 23,97',
        frete: 'Grátis',
        total: 'R$ 215,73',
      });
    },
  );

  const cuponsRecusados = [
    { cupom: CUPONS.INEXISTENTE, mensagem: 'Cupom inválido.', criterio: '@CA03' },
    { cupom: CUPONS.EXPIRADO, mensagem: 'Cupom expirado.', criterio: '@CA04' },
  ];

  for (const { cupom, mensagem, criterio } of cuponsRecusados) {
    test(
      `CT03 - cupom ${cupom} exibe "${mensagem}" e não aplica desconto`,
      { tag: ['@CT03', criterio] },
      async ({ page }) => {
        const vitrine = new VitrinePage(page);
        const carrinho = new CarrinhoPage(page);

        await vitrine.abrir();
        await vitrine.adicionar(PRODUTOS.MOCHILA.nome, 1);
        await carrinho.abrir();
        await carrinho.aplicarCupom(cupom);

        await expect(page.getByText(mensagem, { exact: true })).toBeVisible();
        await expect(carrinho.cupomAplicado).toBeHidden();
        await carrinho.validarResumo({ desconto: 'R$ 0,00', total: 'R$ 119,90' });
      },
    );
  }
});
