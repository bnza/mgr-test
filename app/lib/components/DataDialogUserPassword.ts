import { LocatorWrapper } from '@lib/components/LocatorWrapper'
import { expect } from '@playwright/test'
import { BasePage } from '@lib/pages/BasePage'

export class DataDialogUserPassword extends LocatorWrapper {
  public readonly cancelButton = this.locator.getByRole('button', {
    name: 'Cancel',
  })
  public readonly resetButton = this.locator.getByRole('button', {
    name: 'Reset',
  })
  public readonly copyButton = this.locator.getByRole('button', {
    name: 'Copy',
  })
  public readonly closeButton = this.locator.getByRole('button', {
    name: 'Close',
  })
  public readonly plainPassword = this.locator.locator('#plainPassword')

  constructor(pom: BasePage) {
    super(pom, pom.page.getByTestId('data-dialog-user-password'))
  }

  async expectPlainPasswordMessage() {
    await expect(this.plainPassword).toHaveCount(1)
  }

  async expectPlainPasswordToBeCopied() {
    await this.expectPlainPasswordMessage()
    await this.copyButton.click()
    await this.pom.expectAppMessageToHaveText(/copied/i)
  }

  async getPlainPassword() {
    await this.expectPlainPasswordMessage()
    return await this.plainPassword.textContent()
  }

  async expectCloseButtonClosesDialog() {
    await this.closeButton.click()
    await expect(this.locator).not.toBeVisible()
  }
}
