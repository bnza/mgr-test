import {expect, Locator, Page} from '@playwright/test'
import {isInViewport} from '@lib/index'

export abstract class BasePage {
    public readonly appBarNavIcon = this.page.getByTestId('app-bar-nav-icon')
    public readonly appNavigationDrawer = this.page.getByTestId(
        'app-navigation-drawer',
    )
    public readonly loginButton = this.page.getByTestId('login-button')

    protected abstract readonly path: string

    constructor(public readonly page: Page) {
    }

    public readonly appMessage = this.page.getByTestId('app-message')

    async open(path = '') {
        await this.page.goto('#' + (path || this.path))
    }

    async expectAppMessageToHaveText(text: string | RegExp, count = 1) {
        await expect(this.appMessage.getByText(text)).toHaveCount(count)
    }

    async openAppNavigationDrawer() {
        if (!(await isInViewport(this.appNavigationDrawer))) {
            await this.appBarNavIcon.click()
        }
    }

    async clickAppNavigationDrawerListItem(listItemsTestIds: string[]) {
        await this.openAppNavigationDrawer()
        for (const testId of listItemsTestIds) {
            await this.appNavigationDrawer.getByTestId(testId).click()
        }
    }
}
