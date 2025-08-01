import { test } from '@playwright/test'
import { HomePage } from '@lib/pages/HomePage'
import { NavigationLinksButton } from '@lib/index'
import { SiteCollectionPage } from '@lib/pages/SiteCollectionPage'
import { SiteItemPage } from '@lib/pages/SiteItemPage'
import { loadFixtures } from '@lib/api'

test.beforeAll(async () => {
  loadFixtures()
})

test.describe('Site page navigation', () => {
  test('Navigation drawer works works as expected', async ({ page }) => {
    const homePom = new HomePage(page)
    const collectionPom = new SiteCollectionPage(page)
    const itemPom = new SiteItemPage(page)
    await homePom.open()
    await homePom.clickAppNavigationDrawerListItem([
      'app-nav-drawer-li-data',
      'app-nav-drawer-li-sites',
    ])
    await collectionPom.expectDataTable(true)
    await collectionPom
      .getItemNavigationLink('TO', NavigationLinksButton.Read)
      .click()
    await itemPom.expectAppDataCardToHaveResourceLabelAsTitle()
    await itemPom.expectAppDataCardToHaveIdentifier('TO')
    await itemPom.backNavigationButton.click()
    await collectionPom.expectDataTable(true)
  })
  test('Table pagination work as expected', async ({ page }) => {
    const collectionPom = new SiteCollectionPage(page)
    await collectionPom.open()
    await collectionPom.expectDataTable(true)

    // First click should change the table content (ascending order)
    await collectionPom.expectTableContentChangesAfterSortableHeaderClick(
      'code',
    )

    // Second click should change the table content again (descending order)
    await collectionPom.expectTableContentChangesAfterSortableHeaderClick(
      'code',
    )

    // Third click should change the table content again (no sorting)
    await collectionPom.expectTableContentChangesAfterSortableHeaderClick(
      'code',
    )
  })
  test('Search dialog work as expected', async ({ page }) => {
    const collectionPom = new SiteCollectionPage(page)
    await collectionPom.open()
    await collectionPom.expectDataTable(true)
    await collectionPom.openDataDialogSearch()
    await collectionPom.dataDialogSearch.expectFilterListItemToHaveCount(0)
    await collectionPom.dataDialogSearch.openAddFilterDialog()
    await collectionPom.dataDialogSearch.searchDialogFilter.clickPropertySelectOption(
      'code',
    )
    await collectionPom.dataDialogSearch.searchDialogFilter.clickOperatorSelectOption(
      'equals',
    )
    await collectionPom.dataDialogSearch.searchDialogFilter
      .getByRole('textbox', { name: 'value' })
      .fill('TO')
    await collectionPom.dataDialogSearch.searchDialogFilter.submitButton.click()
    await collectionPom.dataDialogSearch.expectFilterListItemToHaveCount(1)
    await collectionPom.dataDialogSearch.submitButton.click()
    await collectionPom.expectTableTotalItems(1)
    await collectionPom.openDataDialogSearch()
    await collectionPom.expectTableTotalItems(1)
    await collectionPom.dataDialogSearch.clearButton.click()
    await collectionPom.dataDialogSearch.expectFilterListItemToHaveCount(0)
    await collectionPom.dataDialogSearch.submit()
    await collectionPom.expectTableTotalItems(7)
  })
})
