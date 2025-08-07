import { test } from '@playwright/test'
import { ContextCollectionPage } from '@lib/pages/ContextCollectionPage'
import { loadFixtures } from '@lib/api'
import { ContextItemPage } from '@lib/pages/ContextItemPage'
import { NavigationLinksButton } from '@lib/index'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Context lifecycle', () => {
  test.describe('Admin user', () => {
    test.use({ storageState: 'playwright/.auth/admin.json' })

    test('Create dialog work as expected', async ({ page }) => {
      const collectionPom = new ContextCollectionPage(page)
      const itemPom = new ContextItemPage(page)
      await collectionPom.open()
      await collectionPom.expectDataTable(true)
      await collectionPom.openDataDialogCreate()
      await collectionPom.dataDialogCloseButton.click()

      //CREATE AND REDIRECT TO NEW CONTEXT PAGE
      await collectionPom.openDataDialogCreate()
      await collectionPom.dataDialogCreateShowCreatedItemCheckbox.click()
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'site' })
        .click()
      await page.getByRole('option').first().click()
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'type' })
        .click()
      await page.getByRole('option').first().click()
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'name' })
        .fill('Test context name')
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'description' })
        .fill('New test context description')
      await collectionPom.dataDialogSubmitButton.click()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
      await itemPom.expectAppDataCardToHaveResourceLabelAsTitle()
      await itemPom.expectTextFieldToHaveValue('name', 'Test context name')
      await itemPom.expectTextFieldToHaveValue(
        'description',
        'New test context description',
      )
      await itemPom.backNavigationButton.click()
      await collectionPom.expectDataTable(true)
      const createdName = await collectionPom.getName(0)

      //UPDATE
      await collectionPom
        .getItemNavigationLink(0, NavigationLinksButton.Update)
        .click()
      await collectionPom.expectDataDialogTextFieldToHaveValue(
        'description',
        'New test context description',
      )
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'name' })
        .fill('Updated context name')
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'description' })
        .fill('Updated context description')
      await collectionPom.dataDialogSubmitButton.click()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully updated',
      )
      await collectionPom.expectTableDataToHaveRowWithText(
        0,
        'Updated context name',
      )
      await collectionPom.expectTableDataToHaveRowWithText(
        0,
        'Updated context description',
      )

      // DELETE
      await collectionPom
        .getItemNavigationLink(0, NavigationLinksButton.Delete)
        .click()
      await collectionPom.expectDataDialogTextFieldToHaveValue(
        'description',
        'Updated context description',
      )
      await collectionPom.dataDialogSubmitButton.click()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully deleted',
      )
      await collectionPom.expectTableDataNotToHaveRow(createdName)
    })
  })
})
