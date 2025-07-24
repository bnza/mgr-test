import { test, expect, Page } from '@playwright/test'
import { HomePage } from '@lib/pages/HomePage'
import { credentials, loadFixtures } from '@lib/api'
import { LoginPage } from '@lib/pages/LoginPage'
import { UserCollectionPage } from '@lib/pages/UserCollectionPage'
import { NavigationLinksButton } from '@lib/index'
import { UserItemPage } from '@lib/pages/UserItemPage'
import { AuthTestHelper } from '@lib/utils/AuthTestHelper'
import { SiteUserPrivilegeCollectionPage } from '@lib/pages/SiteUserPrivilegeCollectionPage'

const navigateFromCollection = async (page: Page, id: string | RegExp) => {
  const collectionPom = new UserCollectionPage(page)
  const itemPom = new UserItemPage(page)
  await collectionPom.open()
  await collectionPom.expectDataTable(true)
  await collectionPom
    .getItemNavigationLink(id, NavigationLinksButton.Read)
    .click()
  await itemPom.expectAppDataCardToHaveResourceLabelAsTitle()
  await itemPom.expectAppDataCardToHaveIdentifier(id)
  return {
    collectionPom,
    itemPom,
  }
}
test.describe('User lifecycle', () => {
  test.beforeAll(async () => {
    loadFixtures()
  })

  test.describe('Unauthenticated user', () => {
    test.use([])
    test('Navigation drawer admin section is hidden/showed', async ({
      page,
    }) => {
      const homePom = new HomePage(page)
      const loginPage = new LoginPage(page)
      const pom = new UserCollectionPage(page)
      await homePom.open()
      await homePom.clickAppNavigationDrawerListItem(['app-nav-drawer-li-data'])
      await expect(
        homePom.appNavigationDrawer.getByTestId('app-nav-drawer-li-admin'),
      ).not.toBeAttached()

      await homePom.loginButton.click()
      await loginPage.login(credentials.ADMIN)
      await homePom.appNavigationDrawer
        .getByTestId('app-nav-drawer-li-admin')
        .click()
      await homePom.clickAppNavigationDrawerListItem([
        'app-nav-drawer-li-users',
      ])
      await pom.expectDataTable(true)
      await pom.logout()
      await homePom.openAppNavigationDrawer()
      await homePom.clickAppNavigationDrawerListItem(['app-nav-drawer-li-data'])
      await expect(
        homePom.appNavigationDrawer.getByTestId('app-nav-drawer-li-admin'),
      ).not.toBeAttached()
    })
  })

  test.describe('Admin user', () => {
    test.use({ storageState: 'playwright/.auth/admin.json' })
    test('User lifecycle', async ({ page, browser }) => {
      // NAVIGATION TO/FROM ITEM
      const { collectionPom, itemPom } = await navigateFromCollection(
        page,
        'user_geo@example.com',
      )
      await itemPom.backNavigationButton.click()
      await collectionPom.expectDataTable(true)

      //CREATE AND REDIRECT TO NEW USER PAGE
      await collectionPom.openDataDialogCreate()
      await collectionPom.dataDialogCreateShowCreatedItemCheckbox.click()

      await itemPom.dataDialogForm
        .getByRole('textbox', { name: 'email' })
        .fill('user_new@example.com')
      await itemPom.dataDialogForm
        .getByRole('radio', { name: 'ROLE_ADMIN' })
        .click()
      await collectionPom.dataDialogSubmitButton.click()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
      await itemPom.expectAppDataCardToHaveResourceLabelAsTitle()

      // USER PASSWORD DIALOG INTERACTION
      const authTestHelper = new AuthTestHelper(browser)
      await authTestHelper.verifyLoginWithPasswordFromDialog(
        'user_new@example.com',
        itemPom.userPasswordDialog,
      )

      await itemPom.userPasswordDialog.expectPlainPasswordToBeCopied()
      await itemPom.userPasswordDialog.expectCloseButtonClosesDialog()

      // CHECK NEW USER VALUES
      await itemPom.expectTextFieldToHaveValue('email', 'user_new@example.com')
      await expect(
        itemPom.page.getByRole('radio', { name: 'ROLE_ADMIN' }),
      ).toBeChecked()

      // BACK TO COLLECTION
      await itemPom.backNavigationButton.click()
      await collectionPom.expectDataTable(true)

      //UPDATE
      await collectionPom
        .getItemNavigationLink(
          'user_new@example.com',
          NavigationLinksButton.Update,
        )
        .click()
      await expect(
        itemPom.dataDialogForm.getByRole('textbox', { name: 'email' }),
      ).toBeDisabled()
      await itemPom.dataDialogForm
        .getByRole('radio', { name: 'ROLE_EDITOR' })
        .click()
      await collectionPom.dataDialogSubmitButton.click()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully updated',
      )
      await collectionPom.expectTableDataToHaveRowWithText(
        'user_new@example.com',
        'ROLE_EDITOR',
      )

      // DELETE
      await collectionPom
        .getItemNavigationLink(
          'user_new@example.com',
          NavigationLinksButton.Delete,
        )
        .click()
      await collectionPom.expectDataDialogTextFieldToHaveValue(
        'email',
        'user_new@example.com',
      )
      await collectionPom.dataDialogSubmitButton.click()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully deleted',
      )
      await collectionPom.expectTableDataNotToHaveRow('user_new@example.com')
    })
    test('User reset password', async ({ page, browser }) => {
      const collectionPom = new UserCollectionPage(page)
      const itemPom = new UserItemPage(page)
      await collectionPom.open()
      await collectionPom.expectDataTable(true)

      // CREATE TEST USER
      await collectionPom.openDataDialogCreate()
      await itemPom.dataDialogForm
        .getByRole('textbox', { name: 'email' })
        .fill('user_new@example.com')
      await itemPom.dataDialogForm
        .getByRole('radio', { name: 'ROLE_ADMIN' })
        .click()
      await collectionPom.dataDialogSubmitButton.click()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
      await collectionPom.userPasswordDialog.expectCloseButtonClosesDialog()

      await collectionPom
        .getTableDataRowByText('user_new@example.com')
        .getByTestId('reset-password-button')
        .click()
      await itemPom.userPasswordDialog.resetButton.click()

      // CHECK RESET PASSWORD LOGIN
      const authTestHelper = new AuthTestHelper(browser)
      await authTestHelper.verifyLoginWithPasswordFromDialog(
        'user_new@example.com',
        itemPom.userPasswordDialog,
      )
    })
    test('Site/User privileges management', async ({ page }) => {
      await navigateFromCollection(page, 'user_geo@example.com')
      const pom = new SiteUserPrivilegeCollectionPage(page, false)
      await pom.expectDataTable(false)
      await pom.expectTableTotalItems(0)
      await pom.clickActionMenuButton('data-toolbar-menu-create-list-item')
      await expect(pom.privilegesDialog.locator).toBeVisible()
      await pom.privilegesDialog.userInput.expectToBeDisabled()
      await pom.privilegesDialog.siteInput.fill('Toz')
      await page.getByRole('option', { name: 'Tozar' }).click()
      await pom.privilegesDialog.privilegeInput.click()
      await pom.privilegesDialog.submitButton.click()
      await pom.expectAppMessageToHaveText('Resource successfully created')
      await pom.expectTableTotalItems(1)
      await pom.clickActionMenuButton('data-toolbar-menu-create-list-item')
      await pom.privilegesDialog.siteInput.fill('ni')
      await page.getByRole('option', { name: 'Nivar' }).click()
      await pom.privilegesDialog.submitButton.click()
      await pom.expectAppMessageToHaveText('Resource successfully created')
      await pom.expectTableTotalItems(2)

      // AUTH-BUTTON TOOLTIP
      await pom.expectAuthUserButtonToHavePrivilege(/NI/, 'ROLE_SITE_USER')
      await pom.expectAuthUserButtonToHavePrivilege(/TO/, 'ROLE_SITE_EDITOR')

      // UPDATE PRIVILEGE

      await pom.getRowAuthUserButton(/NI/).click()
      await expect(pom.dataDialogUpdate).toHaveText(/EDITOR/)
      await pom.dataDialogSubmitButton.click()
      await pom.expectAppMessageToHaveText('Resource successfully updated')

      await pom.expectAuthUserButtonToHavePrivilege(/NI/, 'ROLE_SITE_EDITOR')

      //DELETE
      await pom
        .getItemNavigationLink(/TO/, NavigationLinksButton.Delete)
        .click()
      await pom.expectDataDialogTextFieldToHaveValue('site site', 'Tozar')
      await pom.dataDialogSubmitButton.click()
      await pom.expectAppMessageToHaveText('Resource successfully deleted')
      await pom.expectTableTotalItems(1)
    })
  })
})
