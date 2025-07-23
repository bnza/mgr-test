import { Browser } from '@playwright/test'
import { LoginPage } from '@lib/pages/LoginPage'
import { DataDialogUserPassword } from '@lib/components/DataDialogUserPassword'

export class AuthTestHelper {
  constructor(private browser: Browser) {}

  async verifyLoginWithPassword(
    email: string,
    password: string,
  ): Promise<void> {
    const context = await this.browser.newContext({
      storageState: { cookies: [], origins: [] },
    })
    const page = await context.newPage()
    const loginPage = new LoginPage(page)

    try {
      await loginPage.open()
      await loginPage.login({ email, password })
      await loginPage.expectAppMessageToHaveText(/successfully logged in/)
    } finally {
      await page.close()
      await context.close()
    }
  }

  async verifyLoginWithPasswordFromDialog(
    email: string,
    passwordDialog: DataDialogUserPassword,
  ): Promise<void> {
    const password = await passwordDialog.getPlainPassword()
    await this.verifyLoginWithPassword(email, password)
  }
}
