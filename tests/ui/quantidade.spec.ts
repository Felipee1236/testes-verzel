import { expect, test } from '@playwright/test';
import { CarrinhoPage } from '../pages/CarrinhoPage';
import { VitrinePage } from '../pages/VitrinePage';
import { PRODUTOS } from '../support/dados';

test.describe('Limite de 5 unidades por produto na interface', () => {
  test(
    'CT08 - a interface não deixa passar de 5 unidades de um produto',
    { tag: ['@CT08', '@CA10'] },
    async ({ page }) => {
      const vitrine = new VitrinePage(page);
      const carrinho = new CarrinhoPage(page);
      const produto = PRODUTOS.CAMISETA.nome;
      const botaoAdicionar = vitrine.botaoAdicionar(produto);

      await vitrine.abrir();
      await vitrine.adicionar(produto, 5);

      await expect(vitrine.contadorCarrinho).toHaveText('5');
      await expect(botaoAdicionar).toBeDisabled();
      await expect(vitrine.cardDoProduto(produto)).toContainText('Limite de 5 unidades atingido.');

      // 6ª tentativa: force ignora a espera por botão habilitado e tenta clicar mesmo assim.
      await botaoAdicionar.click({ force: true });
      await expect(vitrine.contadorCarrinho).toHaveText('5');

      await carrinho.abrir();
      await expect(carrinho.botaoAumentar(produto)).toBeDisabled();
      await expect(page.getByText('Limite de 5 unidades por produto.')).toBeVisible();
      await carrinho.validarResumo({ subtotal: 'R$ 299,50' });
    },
  );
});
