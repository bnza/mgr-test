import { expect, Locator, Page } from '@playwright/test'
import { isInViewport } from '@lib/index'

export abstract class BasePage {
  public readonly appBarNavIcon = this.page.getByTestId('app-bar-nav-icon')
  public readonly appDataCard: Locator
  public readonly appDataCardToolbar: Locator
  public readonly appNavigationDrawer = this.page.getByTestId(
    'app-navigation-drawer',
  )
  public readonly appDataCardTitle: Locator
  public readonly loginButton = this.page.getByTestId('login-button')
  public readonly authUserButton = this.page.getByTestId('auth-user-button')
  public readonly authUserMenu = this.page.getByTestId('auth-user-menu')

  public readonly openLogoutDialogButton = this.authUserMenu.getByText('Logout')
  public readonly logoutDialog = this.page.getByTestId('logout-dialog')
  public readonly logoutButton = this.logoutDialog.getByRole('button', {
    name: 'Logout',
  })
  public readonly userMeButton = this.authUserMenu.getByTestId(
    'user-settings-me-link',
  )

  protected abstract readonly path: string

  constructor(
    public readonly page: Page,
    main = true,
  ) {
    this.appDataCard = this.page.getByTestId('data-card').nth(main ? 0 : 1)
    this.appDataCardToolbar = this.appDataCard
      .getByTestId('data-card-toolbar')
      .first()
    this.appDataCardTitle = this.appDataCard.getByTestId(
      'data-card-toolbar-main-title',
    )
  }

  public readonly appMessage = this.page.getByTestId('app-message')

  async open(path = '') {
    await this.page.goto('#' + (path || this.path))
  }

  async logout() {
    await this.authUserButton.click()
    await this.openLogoutDialogButton.click()
    await this.logoutButton.click()
    await this.expectAppMessageToHaveText(/successfully logged out/)
  }

  async expectAppDataCardToHaveTitle(title: string | RegExp, nth = 0) {
    await expect(this.appDataCardTitle.nth(nth)).toHaveText(title)
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

  async expectInnerInputToBeDisabled(locator: Locator) {
    await expect(locator.locator('input')).toBeDisabled()
  }
}
