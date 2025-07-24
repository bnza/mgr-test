import { LocatorWrapper } from '@lib/components/LocatorWrapper'
import { expect, type Locator } from '@playwright/test'

export class Autocomplete extends LocatorWrapper {
  public readonly input = this.locator.locator('input')

  async expectToBeDisabled() {
    return expect(this.input).toBeDisabled()
  }

  async fill(...args: Parameters<Locator['fill']>) {
    await this.input.fill(...args)
  }
}
