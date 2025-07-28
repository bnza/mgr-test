import { expect, test } from '@playwright/test'
import { SiteCollectionPage } from '@lib/pages/SiteCollectionPage'
import { loadFixtures } from '@lib/api'
import { SiteItemPage } from '@lib/pages/SiteItemPage'
import { NavigationLinksButton } from '@lib/index'

test.beforeEach(async () => {
  loadFixtures()
})
test.describe('Site lifecycle', () => {
  test.describe('Admin user', () => {
    test.use({ storageState: 'playwright/.auth/admin.json' })

    test('Basic site lifecycle works as expected', async ({ page }) => {
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
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'chronology (lower)' })
        .fill('1000')
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'chronology (upper)' })
        .fill('1100')
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'field director' })
        .fill('Some One')
      await collectionPom.dataDialogSubmitButton.click()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
      await itemPom.expectAppDataCardToHaveResourceLabelAsTitle()
      await page.getByTestId('chronology-panel').click()
      await itemPom.expectTextFieldToHaveValue('code', 'NW')
      await itemPom.expectTextFieldToHaveValue('name', 'New Shining Site')
      await itemPom.expectTextFieldToHaveValue(
        'description',
        'A new shining site for testing purposes',
      )
      await itemPom.expectTextFieldToHaveValue('chronology (lower)', '1000')
      await itemPom.expectTextFieldToHaveValue('chronology (upper)', '1100')
      await itemPom.expectTextFieldToHaveValue('field director', 'Some One')
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
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'chronology (lower)' })
        .fill('900')
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'chronology (upper)' })
        .fill('1200')
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'field director' })
        .fill('Some One Else')
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
    test('Data validation', async ({ page }) => {
      const collectionPom = new SiteCollectionPage(page)
      const itemPom = new SiteItemPage(page)
      await collectionPom.open()
      await collectionPom.expectDataTable(true)
      await collectionPom.openDataDialogCreate()

      // Test 1: Required field validation - code field
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'code' })
        .fill('AA')
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'code' })
        .clear()
      await page.keyboard.press('Tab')
      await expect(
        collectionPom.dataDialogForm.getByText(/required/),
      ).toBeVisible()

      // Test 2: Required field validation - name field
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'code' })
        .fill('TEST')
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'name' })
        .fill('a')
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'name' })
        .clear()
      await page.keyboard.press('Tab')
      await expect(
        collectionPom.dataDialogForm.getByText(/required/),
      ).toBeVisible()

      // Test 3: Unique validation - try to create with existing code
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'code' })
        .fill('TO') // Assuming this exists in fixtures
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'name' })
        .fill('Valid Name')
      await page.keyboard.press('Tab')
      await expect(
        collectionPom.dataDialogForm.getByText('Code must be unique'),
      ).toBeVisible()

      // Test 4: Unique validation - try to create with existing name
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'code' })
        .fill('NEW') // Assuming this exists in fixtures
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'name' })
        .fill('Tozar')
      await page.keyboard.press('Tab')
      await expect(
        collectionPom.dataDialogForm.getByText('Name must be unique'),
      ).toBeVisible()

      // Test 5: Chronology validation - invalid year format
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'code' })
        .fill('NEW')
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'chronology (lower)' })
        .fill('not_a_number')
      await page.keyboard.press('Tab')
      await expect(
        collectionPom.dataDialogForm.getByText('Must be an integer'),
      ).toBeVisible()

      // Test 6: Chronology validation - year too low
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'chronology (lower)' })
        .fill('-50000')
      await page.keyboard.press('Tab')
      await expect(
        collectionPom.dataDialogForm.getByText(/must be greater than/i),
      ).toBeVisible()

      // Test 7: Chronology validation - year too high (future year)
      const futureYear = new Date().getFullYear() + 100
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'chronology (lower)' })
        .fill(futureYear.toString())
      await page.keyboard.press('Tab')
      await expect(
        collectionPom.dataDialogForm.getByText(/must be less than/i),
      ).toBeVisible()

      // Test 8: Chronology validation - lower > upper
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'chronology (lower)' })
        .fill('1500')
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'chronology (upper)' })
        .fill('1000')
      await page.keyboard.press('Tab')
      await expect(
        collectionPom.dataDialogForm.getByText(
          'Lower chronology must be greater than or equal upper chronology.',
        ),
      ).toBeVisible()

      // Test 9: Valid form submission after fixing validation errors
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'code' })
        .fill('NEW')
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'name' })
        .fill('Valid Test Site')
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'chronology (lower)' })
        .fill('1000')
      await collectionPom.dataDialogForm
        .getByRole('textbox', { name: 'chronology (upper)' })
        .fill('1500')
      await collectionPom.dataDialogSubmitButton.click()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
    })
    test('Site chronology works as expected', async ({ page }) => {
      const collectionPom = new SiteCollectionPage(page)
      const itemPom = new SiteItemPage(page)
      await collectionPom.open()
      await collectionPom.expectDataTable(true)
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
      await collectionPom.dataDialogForm.getByRole('combobox').first().click()
      await page.getByRole('option', { name: 'taifa' }).click()
      await page.getByRole('option', { name: 'feudal' }).click()
      await page.keyboard.press('Tab')
      await collectionPom.dataDialogSubmitButton.click()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
      await itemPom.expectAppDataCardToHaveResourceLabelAsTitle()
      await page.getByTestId('chronology-panel').click()
      await expect(page.getByTestId('cultural-contexts-selection')).toHaveText(
        /(?=.*feudal)(?=.*taifa)/,
      )
      await itemPom.backNavigationButton.click()
      await collectionPom.expectDataTable(true)

      //UPDATE
      await collectionPom
        .getItemNavigationLink('NW', NavigationLinksButton.Update)
        .click()
      await collectionPom.dataDialogForm.getByRole('combobox').first().click()
      await page.getByRole('option', { name: 'taifa' }).click() //uncheck
      await page.getByRole('option', { name: 'emirate' }).click()
      await page.getByRole('option', { name: 'caliphate' }).click()
      await page.keyboard.press('Tab')
      await collectionPom.dataDialogSubmitButton.click()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully updated',
      )
      await collectionPom
        .getItemNavigationLink('NW', NavigationLinksButton.Read)
        .click()
      await expect(page.getByTestId('cultural-contexts-selection')).toHaveText(
        /(?=.*feudal)(?=.*emirate)(?=.*caliphate)/,
      )
    })
  })
})
