import { expect, test } from '@playwright/test'
import { loadFixtures } from '@lib/api'
import { UserMePage } from '@lib/pages/UserMePage'
import { HomePage } from '@lib/pages/HomePage'
import { AuthTestHelper } from '@lib/utils/AuthTestHelper'

test.beforeAll(async () => {
  loadFixtures()
})

test.describe('setting/me page', () => {
  test.describe('Base user', () => {
    test.use({ storageState: 'playwright/.auth/base.json' })
    test('Can change his password', async ({ page, browser }) => {
      const homePom = new HomePage(page)
      await homePom.open()

      await homePom.authUserButton.click()
      await homePom.userMeButton.click()

      const pom = new UserMePage(page)
      await pom.expectAppDataCardToHaveTitle('user_base@example.com')

      await pom.clickActionMenuButton(
        'data-toolbar-menu-change-password-list-item',
      )
      await pom.userPasswordDialog.oldPassword.fill('0000')
      await pom.userPasswordDialog.newPassword.fill('NewPassword1!')
      await pom.userPasswordDialog.passwordRepeat.fill('NewPassword1!')

      await pom.userPasswordDialog.changeButton.click()
      await pom.expectAppMessageToHaveText('Password successfully changed')

      // CHECK RESET PASSWORD LOGIN
      const authTestHelper = new AuthTestHelper(browser)
      await authTestHelper.verifyLoginWithPassword(
        'user_base@example.com',
        'NewPassword1!',
      )
    })
  })
})
