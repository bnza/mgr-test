import { expect, Locator } from '@playwright/test'
import { BasePage } from '@lib/pages/BasePage'

export abstract class BaseDataPage extends BasePage {
  public abstract readonly resourceLabel: string | RegExp
  public abstract readonly dataToolbarActionMenuButton: Locator
  public abstract readonly dataToolbarActionMenu: Locator
  public readonly backNavigationButton = this.appDataCardToolbar.getByTestId(
    'navigation-back-button',
  )
  public readonly appDataCardToolbarIdentifier =
    this.appDataCardToolbar.getByTestId('data-card-toolbar-identifier')

  public readonly dataDialogDelete = this.page.getByTestId('data-dialog-delete')

  public readonly dataDialogForm = this.page.getByTestId('data-dialog-form')
  public readonly dataDialogCloseButton = this.page.getByTestId(
    'data-dialog-form-close-button',
  )
  public readonly dataDialogSubmitButton = this.page.getByTestId(
    'data-dialog-form-submit-button',
  )

  expectAppDataCardToHaveResourceLabelAsTitle() {
    return this.expectAppDataCardToHaveTitle(this.resourceLabel)
  }

  async expectAppDataCardToHaveIdentifier(title: string | RegExp) {
    await expect(this.appDataCardToolbarIdentifier).toHaveText(title)
  }

  async clickActionMenuButton(testId: string) {
    await this.dataToolbarActionMenuButton.click()
    await expect(this.dataToolbarActionMenu).toBeVisible()
    await this.page.getByTestId(testId).click()
  }

  async expectDayaDialogTextFieldToHaveValue(
    name: string,
    value: string | RegExp,
  ) {
    await expect(
      this.dataDialogForm.getByRole('textbox', { name }),
    ).toHaveValue(value)
  }
}
