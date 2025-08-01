import { LocatorWrapper } from '@lib/components/LocatorWrapper'
import { DataDialogSearchFilter } from '@lib/components/DataDialogSearchFilter'
import { BasePage } from '@lib/pages/BasePage'
import { expect } from '@playwright/test'

export class DataDialogSearch extends LocatorWrapper {
  public readonly addFilterButton = this.locator.getByRole('button', {
    name: 'add filter',
  })
  public readonly closeButton = this.locator.getByRole('button', {
    name: 'close',
  })
  public readonly clearButton = this.locator.getByRole('button', {
    name: 'clear',
  })
  public readonly submitButton = this.locator.getByRole('button', {
    name: 'submit',
  })

  public readonly filterList = this.locator.getByTestId(
    'data-dialog-search-filters-list',
  )

  public readonly emptyState = this.locator.getByTestId(
    'data-dialog-empty-state',
  )

  public readonly searchDialogFilter = new DataDialogSearchFilter(
    this.pom,
    this.pom.page.getByTestId('data-dialog-search-filter'),
  )

  constructor(pom: BasePage) {
    super(pom, pom.page.getByTestId('data-dialog-search'))
  }

  async openAddFilterDialog() {
    await this.addFilterButton.click()
    await expect(this.searchDialogFilter.locator).toBeVisible()
  }

  async close() {
    await this.closeButton.click()
    await expect(this.locator).not.toBeVisible()
  }

  async submit() {
    await this.submitButton.click()
    await expect(this.locator).not.toBeVisible()
  }

  async expectFilterListItemToHaveCount(count: number) {
    if (count === 0) {
      await expect(this.emptyState).toBeVisible()
      return
    }
    await expect(
      this.filterList.getByTestId('data-dialog-search-filters-list-item'),
    ).toHaveCount(count)
  }
}
