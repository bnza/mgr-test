import { BaseCollectionPage } from '@lib/pages/BaseCollectionPage'
import { DataDialogUserPassword } from '@lib/components/DataDialogUserPassword'
import { UserItemPage } from '@lib/pages/UserItemPage'

export class UserCollectionPage extends BaseCollectionPage {
  public readonly resourceLabel = 'Users'
  protected readonly path = '/admin/users'

  public readonly userPasswordDialog = new DataDialogUserPassword(this)

  async createUser(
    email: string,
    role: 'ROLE_ADMIN' | 'ROLE_EDITOR' | 'ROLE_USER' = 'ROLE_ADMIN',
    itemPom?: UserItemPage,
    showCreatedItem = false,
  ): Promise<void> {
    const userItemPom = itemPom || new UserItemPage(this.page)

    await this.openDataDialogCreate()
    if (showCreatedItem) {
      await this.dataDialogCreateShowCreatedItemCheckbox.click()
    }

    await userItemPom.dataDialogForm
      .getByRole('textbox', { name: 'email' })
      .fill(email)
    await userItemPom.dataDialogForm.getByRole('radio', { name: role }).click()
    //The following line fails. ???
    await this.dataDialogSubmitButton.click()
    await this.expectAppMessageToHaveText('Resource successfully created')
  }
}
