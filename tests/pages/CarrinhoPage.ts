import { expect, type Locator, type Page } from '@playwright/test';

export type ResumoEsperado = {
  subtotal?: string;
  desconto?: string;
  frete?: string;
  total?: string;
};

/** Página do carrinho: itens, cupom e resumo do pedido. */
export class CarrinhoPage {
  readonly campoCupom: Locator;
  readonly botaoAplicarCupom: Locator;
  readonly botaoRemoverCupom: Locator;
  readonly cupomAplicado: Locator;
  readonly avisoFreteGratis: Locator;

  constructor(private readonly page: Page) {
    this.campoCupom = page.getByLabel('Cupom de desconto');
    this.botaoAplicarCupom = page.getByRole('button', { name: 'Aplicar cupom' });
    this.botaoRemoverCupom = page.getByRole('button', { name: 'Remover cupom' });
    this.cupomAplicado = page.locator('.cupom-aplicado');
    this.avisoFreteGratis = page.locator('.aviso-frete');
  }

  async abrir(): Promise<void> {
    await this.page.goto('/carrinho');
    await expect(this.page.getByRole('heading', { name: 'Carrinho', level: 1 })).toBeVisible();
  }

  /** Valor exibido no resumo do pedido (subtotal, desconto, frete ou total). */
  valor(campo: keyof ResumoEsperado): Locator {
    return this.page.locator(`[data-valor="${campo}"]`);
  }

  botaoAumentar(nomeProduto: string): Locator {
    return this.page.getByRole('button', { name: `Aumentar quantidade de ${nomeProduto}` });
  }

  async aplicarCupom(codigo: string): Promise<void> {
    await this.campoCupom.fill(codigo);
    await this.botaoAplicarCupom.click();
  }

  /** Confere só os campos informados; o Playwright espera o cálculo da API terminar. */
  async validarResumo(esperado: ResumoEsperado): Promise<void> {
    for (const [campo, texto] of Object.entries(esperado)) {
      await expect(this.valor(campo as keyof ResumoEsperado), `valor de ${campo} no resumo`).toHaveText(texto);
    }
  }
}
