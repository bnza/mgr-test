import { BaseCollectionPage } from '@lib/pages/BaseCollectionPage'

export class ContextCollectionPage extends BaseCollectionPage {
  public readonly resourceLabel = 'Contexts'
  protected readonly path = '/data/contexts'
  protected readonly url = '/api/data/contexts'

  async getName(nthOrText: number | string | RegExp) {
    return await this.getTableDataRow(nthOrText)
      .locator('td')
      .nth(4)
      .textContent()
  }
}
