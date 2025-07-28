import { test } from '@playwright/test'
import { StratigraphicUnitCollectionPage } from '@lib/pages/StratigraphicUnitCollectionPage'
import { loadFixtures } from '@lib/api'
import { StratigraphicUnitItemPage } from '@lib/pages/StratigraphicUnitItemPage'
import { NavigationLinksButton } from '@lib/index'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Stratigraphic Unit lifecycle', () => {
  test.describe('Admin user', () => {
    test.use({ storageState: 'playwright/.auth/admin.json' })

    test('Create dialog work as expected', async ({ page }) => {
      const collectionPom = new StratigraphicUnitCollectionPage(page)
      const itemPom = new StratigraphicUnitItemPage(page)
      await collectionPom.open()
      await collectionPom.expectDataTable(true)
      await collectionPom.openDataDialogCreate()
      await collectionPom.dataDialogCloseButton.click()

      //CREATE AND REDIRECT TO NEW STRATIGRAPHIC UNIT PAGE
      await collectionPom.openDataDialogCreate()
      await collectionPom.dataDialogCreateShowCreatedItemCheckbox.click()
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'site' })
        .click()
      await page.getByRole('option').first().click()
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'year' })
        .fill('2024')
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'number' })
        .fill('100')
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'description' })
        .fill('New test stratigraphic unit description')
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'interpretation' })
        .fill('New test stratigraphic unit interpretation')
      await collectionPom.dataDialogSubmitButton.click()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
      await itemPom.expectAppDataCardToHaveResourceLabelAsTitle()
      await itemPom.expectTextFieldToHaveValue('year', '2024')
      await itemPom.expectTextFieldToHaveValue('number', '100')
      // await itemPom.expectTextFieldToHaveValue(
      //   'description',
      //   'New test stratigraphic unit description',
      // )
      await itemPom.expectTextFieldToHaveValue(
        'interpretation',
        'New test stratigraphic unit interpretation',
      )
      await itemPom.backNavigationButton.click()
      await collectionPom.expectDataTable(true)
      const createdCode = await collectionPom.getCode(0)

      //UPDATE
      await collectionPom
        .getItemNavigationLink(0, NavigationLinksButton.Update)
        .click()
      await collectionPom.expectDataDialogTextFieldToHaveValue(
        'description',
        'New test stratigraphic unit description',
      )
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'description' })
        .fill('Updated stratigraphic unit description')
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'interpretation' })
        .fill('Updated stratigraphic unit interpretation')
      await collectionPom.dataDialogSubmitButton.click()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully updated',
      )
      await collectionPom.expectTableDataToHaveRowWithText(
        0,
        'Updated stratigraphic unit description',
      )
      await collectionPom.expectTableDataToHaveRowWithText(
        0,
        'Updated stratigraphic unit interpretation',
      )

      // DELETE
      await collectionPom
        .getItemNavigationLink(0, NavigationLinksButton.Delete)
        .click()
      await collectionPom.expectDataDialogTextFieldToHaveValue(
        'interpretation',
        'Updated stratigraphic unit interpretation',
      )
      await collectionPom.dataDialogSubmitButton.click()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully deleted',
      )
      await collectionPom.expectTableDataNotToHaveRow(createdCode)

      //CREATE AND NOT REDIRECT TO NEW STRATIGRAPHIC UNIT PAGE
      await collectionPom.openDataDialogCreate()
      await collectionPom.dataDialogCreateShowCreatedItemCheckbox.click()
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'site' })
        .click()
      await page.getByRole('option').first().click()
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'year' })
        .fill('2024')
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'number' })
        .fill('2')
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'interpretation' })
        .fill('Another test stratigraphic interpretation')
      await collectionPom.dataDialogSubmitButton.click()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
      await collectionPom.expectAppDataCardToHaveResourceLabelAsTitle()
    })
  })
})
