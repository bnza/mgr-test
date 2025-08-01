import { LocatorWrapper } from '@lib/components/LocatorWrapper'
import { expect } from '@playwright/test'

export class DataDialogSearchFilter extends LocatorWrapper {
  public readonly closeButton = this.locator.getByRole('button', {
    name: 'close',
  })
  public readonly submitButton = this.locator.getByRole('button', {
    name: 'submit',
  })

  public readonly propertySelect = this.locator
    .getByRole('combobox')
    .filter({ hasText: 'property' })
  public readonly operatorSelect = this.locator
    .getByRole('combobox')
    .filter({ hasText: 'operator' })
  public readonly valueSimpleInput = this.locator.getByRole('textbox', {
    name: 'value',
  })
  public readonly valueCheckbox = this.locator.getByRole('checkbox', {
    name: 'value',
  })

  async clickPropertySelectOption(optionText: string) {
    await this.propertySelect.click()
    await this.pom.page.getByRole('option', { name: optionText }).click()
  }

  async clickOperatorSelectOption(optionText: string) {
    await this.operatorSelect.click()
    await this.pom.page.getByRole('option', { name: optionText }).click()
  }
}
