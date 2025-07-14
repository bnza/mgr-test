import { test } from '@playwright/test'
import { SiteCollectionPage } from '@lib/pages/SiteCollectionPage'
import { loadFixtures } from '@lib/api'
import { SiteItemPage } from '@lib/pages/SiteItemPage'
import { NavigationLinksButton } from '@lib/index'

test.beforeAll(async () => {
  loadFixtures()
})
test.describe('Site page navigation', () => {
  test.describe('Admin user', () => {
    test.use({ storageState: 'playwright/.auth/admin.json' })

    test('Create dialog work as expected', async ({ page }) => {
      const collectionPom = new SiteCollectionPage(page)
      const itemPom = new SiteItemPage(page)
      await collectionPom.open()
      await collectionPom.expectDataTable(true)
      await collectionPom.openDataDialogCreate()
      await collectionPom.dataDialogCloseButton.click()

      //CREATE AND REDIRECT TO NEW SITE PAGE
      await collectionPom.openDataDialogCreate()
      await collectionPom.dataDialogCreateShowCreatedItemCheckbox.click()
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'code' })
        .fill('NW')
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'name' })
        .fill('New Shining Site')
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'description' })
        .fill('A new shining site for testing purposes')
      await collectionPom.dataDialogSubmitButton.click()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
      await itemPom.expectAppDataCardToHaveResourceLabelAsTitle()
      await itemPom.expectTextFieldToHaveValue('code', 'NW')
      await itemPom.expectTextFieldToHaveValue('name', 'New Shining Site')
      await itemPom.expectTextFieldToHaveValue(
        'description',
        'A new shining site for testing purposes',
      )
      await itemPom.backNavigationButton.click()
      await collectionPom.expectDataTable(true)

      //UPDATE
      await collectionPom
        .getItemNavigationLink('NW', NavigationLinksButton.Update)
        .click()
      await collectionPom.expectDataDialogTextFieldToHaveValue(
        'name',
        'New Shining Site',
      )
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'name' })
        .fill('Newer Shining Site')
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'description' })
        .fill('A modified shining site description')
      await collectionPom.dataDialogSubmitButton.click()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully updated',
      )
      await collectionPom.expectTableDataToHaveRowWithText(
        'NW',
        'Newer Shining Site',
      )
      await collectionPom.expectTableDataToHaveRowWithText(
        'NW',
        'A modified shining site description',
      )

      // DELETE
      await collectionPom
        .getItemNavigationLink('NW', NavigationLinksButton.Delete)
        .click()
      await collectionPom.expectDataDialogTextFieldToHaveValue(
        'name',
        'Newer Shining Site',
      )
      await collectionPom.dataDialogSubmitButton.click()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully deleted',
      )
      await collectionPom.expectTableDataNotToHaveRow('NW')

      //CREATE AND NOT REDIRECT TO NEW SITE PAGE
      await collectionPom.openDataDialogCreate()
      await collectionPom.dataDialogCreateShowCreatedItemCheckbox.click()
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'code' })
        .fill('NW1')
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'name' })
        .fill('New Shining Site (again)')
      await collectionPom.dataDialogSubmitButton.click()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
      await collectionPom.expectAppDataCardToHaveResourceLabelAsTitle()
    })
  })
})
