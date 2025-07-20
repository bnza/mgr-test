import { BaseCollectionPage } from '@lib/pages/BaseCollectionPage'
import { DataDialogUserPassword } from '@lib/components/DataDialogUserPassword'

export class UserCollectionPage extends BaseCollectionPage {
  public readonly resourceLabel = 'Users'
  protected readonly path = '/admin/users'

  public readonly userPasswordDialog = new DataDialogUserPassword(this)
}
