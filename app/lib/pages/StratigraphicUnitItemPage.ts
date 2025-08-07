import { BaseItemPage } from '@lib/pages/BaseItemPage'

export class StratigraphicUnitItemPage extends BaseItemPage {
  public readonly resourceLabel = 'Stratigraphic Unit'
  protected readonly path = '/data/stratigraphic-units/{id}'
  protected readonly url = '/api/data/stratigraphic_units'
  public readonly dataToolbarActionMenuButton = this.page.getByTestId(
    'data-toolbar-item-action-menu-button',
  )
  public readonly dataToolbarActionMenu = this.page.getByTestId(
    'data-toolbar-item-action-menu',
  )
}
