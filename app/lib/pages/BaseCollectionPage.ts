import { expect } from '@playwright/test'
import { NavigationLinksButton } from '@lib/index'
import { BaseDataPage } from '@lib/pages/BaseDataPage'

const navigationItemLinkStatusIndex = {
  [NavigationLinksButton.Read]: 0,
  [NavigationLinksButton.Update]: 1,
  [NavigationLinksButton.Delete]: 2,
}

export abstract class BaseCollectionPage extends BaseDataPage {
  public readonly dataCollectionTable = this.page.getByTestId(
    'data-collection-table',
  )

  public readonly dataToolbarActionMenuButton = this.page.getByTestId(
    'data-toolbar-collection-action-menu-button',
  )
  public readonly dataToolbarActionMenu = this.page.getByTestId(
    'data-toolbar-collection-action-menu',
  )
  public readonly dataToolbarSearchButton = this.page.getByRole('option', {
    name: /search/i,
  })

  public readonly dataDialog = this.page.getByTestId('data-dialog')
  public readonly dataDialogSearch = this.page.getByTestId('data-dialog-search')
  public readonly dataDialogCreate = this.page.getByTestId('data-dialog-create')

  getItemNavigationLink(rowSelector: number | string | RegExp, testId: string) {
    return this.getTableDataRow(rowSelector).getByTestId(testId)
  }

  getTableDataRow(nthOrText: number | string | RegExp) {
    return typeof nthOrText === 'number'
      ? this.dataCollectionTable.getByRole('row').nth(nthOrText + 1)
      : this.getTableDataRowByText(nthOrText)
  }

  getTableDataRowByText(text: string | RegExp) {
    if ('string' === typeof text) {
      text = new RegExp(`^${text}`)
    }
    return this.dataCollectionTable
      .getByRole('row')
      .filter({ has: this.page.locator('td', { hasText: text }) })
  }

  async expectTableDataNotToHaveRow(text: string | RegExp) {
    await expect(this.getTableDataRowByText(text)).toHaveCount(0)
  }

  async expectTableDataToHaveRowWithText(
    nthOrText: number | string | RegExp,
    text: string | RegExp,
  ) {
    await expect(this.getTableDataRow(nthOrText)).toHaveText(
      typeof text === 'string' ? new RegExp(`${text}`) : text,
    )
  }

  async expectDataTable(main = true) {
    if (main) {
      await this.expectAppDataCardToHaveResourceLabelAsTitle(main ? 0 : 1)
    }
    // await expect(this.dataCollectionTable).toHaveCount(main? 1: 2)

    await expect(this.dataCollectionTable.getByText(/Loading/)).toHaveCount(0)
  }

  async openDataDialogSearch() {
    await this.clickActionMenuButton('data-toolbar-menu-search-list-item')
    await expect(this.dataDialogSearch).toBeVisible()
  }

  async openDataDialogCreate() {
    await this.clickActionMenuButton('data-toolbar-menu-create-list-item')
    await expect(this.dataDialogCreate).toBeVisible()
  }

  async closeDataDialog() {
    await this.dataDialogCloseButton.click()
    await expect(this.dataDialog).not.toBeVisible()
  }

  async expectTableTotalItems(number: number) {
    await expect(this.dataCollectionTable).toHaveText(
      new RegExp(`\\d+\\sof\\s${number}$`),
    )
  }

  /**
   * Verifies that clicking a sortable table header triggers a GET request with the expected sort parameters.
   *
   * This method sets up request interception to monitor API calls and validates that:
   * - A request is made to the collection endpoint when the header is clicked
   * - The request includes the correct order parameter when sortCriteria is provided
   * - The request excludes the order parameter when sortCriteria is falsy
   *
   * @param headerName - The visible text of the table header to click
   * @param propertyName - The API property name that should appear in the order query parameter
   * @param sortCriteria - The expected sort direction ('asc' or 'desc'), or falsy to verify no sorting
   * @deprecated Use expectTableContentChangesAfterSortableHeaderClick instead due to @pinia/colada query cache
   */
  async expectGetRequestIsTriggeredWhenSortableHeaderIsClicked(
    headerName: string,
    propertyName: string,
    sortCriteria?: 'asc' | 'desc',
  ) {
    // Create variables to track interception
    let requestIntercepted = false
    let orderPropertyFound = false

    // Set up the route handler
    await this.page.route(`**${this.url}**`, async (route) => {
      const url = route.request().url()
      if (url.includes(`order%5B${propertyName}%5D=${sortCriteria}`)) {
        orderPropertyFound = true
      }
      requestIntercepted = true
      await route.continue()
    })

    // Click the header to trigger sorting
    await this.dataCollectionTable
      .getByRole('cell', { name: headerName, exact: false })
      .click()

    // Wait for the request to be made
    await this.page.waitForResponse(`**${this.url}**`)

    expect(requestIntercepted).toBeTruthy()
    // When sort criteria is falsy url shouldn't include the property in the query
    expect(orderPropertyFound).toBe(Boolean(sortCriteria))
  }
  
  /**
   * Verifies that clicking a sortable table header changes the table content.
   * 
   * This method captures the current table content, clicks the header,
   * and then verifies that the table content has changed.
   * 
   * Note: This method doesn't verify if the order is correct since sorting is done server-side.
   * It only checks that the table's content has changed after clicking the header.
   * 
   * @param headerName - The visible text of the table header to click
   */
  async expectTableContentChangesAfterSortableHeaderClick(
    headerName: string,
  ) {
    // Get all table rows before clicking the header
    const beforeContent = await this.dataCollectionTable.getByRole('row').allTextContents();
    
    // Click the header to trigger sorting
    await this.dataCollectionTable
      .getByRole('cell', { name: headerName, exact: false })
      .click();
      
    // Wait for the table to update
    await this.page.waitForTimeout(500);
    
    // Get all table rows after clicking the header
    const afterContent = await this.dataCollectionTable.getByRole('row').allTextContents();
    
    // Check if the content has changed
    // We're comparing the stringified versions to detect any changes in order
    expect(JSON.stringify(beforeContent)).not.toEqual(JSON.stringify(afterContent));
  }
}
