import { BaseItemPage } from '@lib/pages/BaseItemPage'

export class SiteItemPage extends BaseItemPage {
  public readonly resourceLabel = 'Site'
  protected readonly path = '/data/sites/{id}'
  public readonly dataToolbarActionMenuButton = this.page.getByTestId(
    'data-toolbar-item-action-menu-button',
  )
  public readonly dataToolbarActionMenu = this.page.getByTestId(
    'data-toolbar-item-action-menu',
  )
}
