import { test, expect } from '@playwright/test'
import { HomePage } from '@lib/pages/HomePage'
import { credentials, loadFixtures } from '@lib/api'
import { LoginPage } from '@lib/pages/LoginPage'
import { UserCollectionPage } from '@lib/pages/UserCollectionPage'
import { NavigationLinksButton } from '@lib/index'
import { UserItemPage } from '@lib/pages/UserItemPage'

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
      const collectionPom = new UserCollectionPage(page)
      const itemPom = new UserItemPage(page)
      await collectionPom.open()
      await collectionPom.expectDataTable(true)
      await collectionPom
        .getItemNavigationLink(
          'user_geo@example.com',
          NavigationLinksButton.Read,
        )
        .click()
      await itemPom.expectAppDataCardToHaveResourceLabelAsTitle()
      await itemPom.expectAppDataCardToHaveIdentifier('user_geo@example.com')
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
      const password = await itemPom.userPasswordDialog.getPlainPassword()
      const newUserContext = await browser.newContext({
        storageState: { cookies: [], origins: [] },
      })
      const userContextPage = await newUserContext.newPage()
      const loginPage = new LoginPage(userContextPage)
      await loginPage.open()
      await loginPage.login({ email: 'user_new@example.com', password })
      await loginPage.expectAppMessageToHaveText(/successfully logged in/)
      await userContextPage.close()
      await newUserContext.close()

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
  })
})
