import { BaseItemPage } from '@lib/pages/BaseItemPage'

export class ContextItemPage extends BaseItemPage {
  public readonly resourceLabel = 'Context'
  protected readonly path = '/data/contexts/{id}'
  protected readonly url = '/api/data/contexts'
  public readonly dataToolbarActionMenuButton = this.page.getByTestId(
    'data-toolbar-item-action-menu-button',
  )
  public readonly dataToolbarActionMenu = this.page.getByTestId(
    'data-toolbar-item-action-menu',
  )
}
