import {test} from '@playwright/test'
import {SiteCollectionPage} from '@lib/pages/SiteCollectionPage'
import {loadFixtures} from "@lib/api";
import {SiteItemPage} from "@lib/pages/SiteItemPage";

test.beforeAll(async () => {
    loadFixtures()
})
test.describe('Site page navigation', () => {

    test.describe('Admin user', () => {
        test.use({storageState: 'playwright/.auth/admin.json'})

        test('Create dialog work as expected', async ({page}) => {
            const collectionPom = new SiteCollectionPage(page)
            const itemPom = new SiteItemPage(page)
            await collectionPom.open()
            await collectionPom.expectDataTable(true)
            await collectionPom.openDataDialogCreate()
            await collectionPom.dataDialogCloseButton.click()
            await collectionPom.openDataDialogCreate()
            await collectionPom
                .dataDialogForm
                .getByRole('textbox', {name: 'code'})
                .fill('NW')
            await collectionPom
                .dataDialogForm
                .getByRole('textbox', {name: 'name'})
                .fill('New Shining Site')
            await collectionPom
                .dataDialogForm
                .getByRole('textbox', {name: 'description'})
                .fill('A new shining site for testing purposes')
            await collectionPom.dataDialogSubmitButton.click()
            await itemPom.expectAppDataCardToHaveResourceLabelAsTitle()
            await itemPom.expectTextFieldToHaveValue('code', 'NW')
            await itemPom.expectTextFieldToHaveValue('name', 'New Shining Site')
            await itemPom.expectTextFieldToHaveValue('description', 'A new shining site for testing purposes')
            await itemPom.backNavigationButton.click()
            await collectionPom.expectDataTable(true)
        })
    })
})
