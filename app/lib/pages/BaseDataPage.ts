import {expect} from "@playwright/test";
import {BasePage} from "@lib/pages/BasePage";

export abstract class BaseDataPage extends BasePage {
    public abstract readonly resourceLabel: string | RegExp
    public readonly backNavigationButton = this.appDataCardToolbar.getByTestId('navigation-back-button')
    public readonly appDataCardToolbarIdentifier = this.appDataCardToolbar.getByTestId('data-card-toolbar-identifier')

    expectAppDataCardToHaveResourceLabelAsTitle() {
        return this.expectAppDataCardToHaveTitle(this.resourceLabel)
    }

    async expectAppDataCardToHaveIdentifier(title: string | RegExp) {
        await expect(this.appDataCardToolbarIdentifier).toHaveText(title,)
    }
}