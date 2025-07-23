import { BaseItemPage } from '@lib/pages/BaseItemPage'
import { DataDialogUserPassword } from '@lib/components/DataDialogUserPassword'

export class UserMePage extends BaseItemPage {
  public readonly resourceLabel = '*Current user email*'
  protected readonly path = '/settings/me'

  public readonly userPasswordDialog = new DataDialogUserPassword(this)

  public readonly dataToolbarActionMenuButton = this.page.getByTestId(
    'data-toolbar-item-user-me-action-menu-button',
  )
  public readonly dataToolbarActionMenu = this.page.getByTestId(
    'data-toolbar-item-user-me-action-menu',
  )
}
