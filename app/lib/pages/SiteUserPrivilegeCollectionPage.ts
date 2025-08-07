import { BaseCollectionPage } from '@lib/pages/BaseCollectionPage'
import { DataDialogSiteUserPrivilege } from '@lib/components/DataDialogSiteUserPrivilege'
import { expect } from '@playwright/test'

export class SiteUserPrivilegeCollectionPage extends BaseCollectionPage {
  public readonly resourceLabel = 'Site/User Privileges'
  protected readonly path = '**only child**'
  protected readonly url = '/api/admin/site_user_privileges'

  public readonly privilegesDialog = new DataDialogSiteUserPrivilege(this)

  getRowAuthUserButton(nthOrText: number | string | RegExp) {
    return this.getTableDataRow(nthOrText).getByTestId('auth-user-button')
  }

  async expectAuthUserButtonToHavePrivilege(
    nthOrText: number | string | RegExp,
    privilege: 'ROLE_SITE_USER' | 'ROLE_SITE_EDITOR',
  ) {
    const locator = this.getRowAuthUserButton(nthOrText)
    await locator.hover()
    await expect(
      this.page.getByRole('tooltip', { name: privilege }),
    ).toBeVisible()
  }
}
