import { expect, type Locator, type Page } from '@playwright/test';

/** Página inicial com a lista de produtos (vitrine). */
export class VitrinePage {
  readonly contadorCarrinho: Locator;

  constructor(private readonly page: Page) {
    this.contadorCarrinho = page.locator('.contador-carrinho');
  }

  async abrir(): Promise<void> {
    await this.page.goto('/');
    await expect(this.page.getByRole('article')).toHaveCount(8);
  }

  cardDoProduto(nome: string): Locator {
    return this.page
      .getByRole('article')
      .filter({ has: this.page.getByRole('heading', { name: nome, exact: true }) });
  }

  botaoAdicionar(nome: string): Locator {
    return this.cardDoProduto(nome).getByRole('button', { name: 'Adicionar ao carrinho' });
  }

  /** Clica em "Adicionar ao carrinho" a quantidade de vezes informada. */
  async adicionar(nome: string, quantidade = 1): Promise<void> {
    for (let i = 0; i < quantidade; i++) {
      await this.botaoAdicionar(nome).click();
    }
  }
}
