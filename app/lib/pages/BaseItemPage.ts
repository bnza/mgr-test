import { BaseDataPage } from '@lib/pages/BaseDataPage'
import { expect } from '@playwright/test'

export abstract class BaseItemPage extends BaseDataPage {
  public readonly dataToolbarActionMenuButton = this.page.getByTestId(
    'data-toolbar-item-action-menu-button',
  )
  public readonly dataToolbarActionMenu = this.page.getByTestId(
    'data-toolbar-item-action-menu',
  )

  async expectTextFieldToHaveValue(name: string, value: string | RegExp) {
    await expect(this.appDataCard.getByRole('textbox', { name })).toHaveValue(
      value,
    )
  }
}
