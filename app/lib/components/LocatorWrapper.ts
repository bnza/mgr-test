import { Locator } from '@playwright/test'
import { BasePage } from '@lib/pages/BasePage'

export abstract class LocatorWrapper {
  public getByText: (text: string) => Locator
  public getByRole: Locator['getByRole']

  protected constructor(
    public readonly pom: BasePage,
    public readonly locator: Locator,
  ) {
    // Bind the methods to the locator
    this.getByText = this.locator.getByText.bind(this.locator)
    this.getByRole = this.locator.getByRole.bind(this.locator)

    return new Proxy(this, {
      get(target, prop) {
        // If the property exists in our class, use it
        if (prop in target) {
          return target[prop as keyof typeof target]
        }

        // Otherwise, forward to the locator
        const locatorProp = target.locator[prop as keyof Locator]
        if (typeof locatorProp === 'function') {
          return locatorProp.bind(target.locator)
        }
        return locatorProp
      },
    })
  }
}
