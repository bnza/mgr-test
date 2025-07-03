import {expect, Locator} from "@playwright/test";
import {BasePage} from "@lib/pages/BasePage";

export abstract class BaseDataPage extends BasePage {
    public abstract readonly resourceLabel: string | RegExp
    public abstract readonly dataToolbarActionMenuButton: Locator
    public abstract readonly dataToolbarActionMenu: Locator
    public readonly backNavigationButton = this.appDataCardToolbar.getByTestId('navigation-back-button')
    public readonly appDataCardToolbarIdentifier = this.appDataCardToolbar.getByTestId('data-card-toolbar-identifier')

    expectAppDataCardToHaveResourceLabelAsTitle() {
        return this.expectAppDataCardToHaveTitle(this.resourceLabel)
    }

    async expectAppDataCardToHaveIdentifier(title: string | RegExp) {
        await expect(this.appDataCardToolbarIdentifier).toHaveText(title,)
    }

    async clickActionMenuButton(testid: string) {
        await this.dataToolbarActionMenuButton.click()
        await expect(this.dataToolbarActionMenu).toBeVisible()
        await this.page.getByTestId(testid).click()
    }
}