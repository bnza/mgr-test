import { BaseCollectionPage } from '@lib/pages/BaseCollectionPage'

export class StratigraphicUnitCollectionPage extends BaseCollectionPage {
  public readonly resourceLabel = 'Stratigraphic Units'
  protected readonly path = '/data/stratigraphic-units'
  protected readonly url = '/api/stratigraphic_units'

  async getCode(nthOrText: number | string | RegExp) {
    return await this.getTableDataRow(nthOrText)
      .locator('td')
      .nth(2)
      .textContent()
  }
}
