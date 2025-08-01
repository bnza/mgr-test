import { BaseItemPage } from '@lib/pages/BaseItemPage'
import { DataDialogUserPassword } from '@lib/components/DataDialogUserPassword'

export class UserItemPage extends BaseItemPage {
  public readonly resourceLabel = 'User'
  protected readonly path = '/admin/users/{id}'
  protected readonly url = '/api/users'

  public readonly userPasswordDialog = new DataDialogUserPassword(this)
}
