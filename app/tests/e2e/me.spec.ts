import { expect, test } from '@playwright/test'
import { loadFixtures } from '@lib/api'
import { UserMePage } from '@lib/pages/UserMePage'
import { HomePage } from '@lib/pages/HomePage'
import { AuthTestHelper } from '@lib/utils/AuthTestHelper'

test.beforeAll(async () => {
  loadFixtures()
})

test.describe('setting/me page', () => {
  test.describe('Base user', () => {
    test.use({ storageState: 'playwright/.auth/base.json' })

    test('Can change his password', async ({ page, browser }) => {
      const homePom = new HomePage(page)
      await homePom.open()

      await homePom.authUserButton.click()
      await homePom.userMeButton.click()

      const pom = new UserMePage(page)
      await pom.expectAppDataCardToHaveTitle('user_base@example.com')

      await pom.clickActionMenuButton(
        'data-toolbar-menu-change-password-list-item',
      )
      await pom.userPasswordDialog.oldPassword.fill('0000')

      await pom.userPasswordDialog.newPassword.fill('NewPassword1!')
      await pom.userPasswordDialog.passwordRepeat.fill('NewPassword1!')

      await pom.userPasswordDialog.changeButton.click()
      await pom.expectAppMessageToHaveText('Password successfully changed')

      // CHECK RESET PASSWORD LOGIN
      const authTestHelper = new AuthTestHelper(browser)
      await authTestHelper.verifyLoginWithPassword(
        'user_base@example.com',
        'NewPassword1!',
      )
    })

    test('Password validation rules work correctly', async ({ page }) => {
      const pom = new UserMePage(page)
      await pom.open()
      await pom.expectAppDataCardToHaveTitle('user_base@example.com')

      await pom.clickActionMenuButton(
        'data-toolbar-menu-change-password-list-item',
      )

      // Fill old password to focus on new password validation
      await pom.userPasswordDialog.oldPassword.fill('0000')

      // Test 1: Empty password should show required error
      await pom.userPasswordDialog.newPassword.fill('a')
      await page.keyboard.press('Backspace')
      await pom.userPasswordDialog.newPassword.blur()
      await expect(page.getByText('Password cannot be blank.')).toBeVisible()

      // Test 2: Too short password should show length error
      await pom.userPasswordDialog.newPassword.fill('Ab1!')
      await pom.userPasswordDialog.newPassword.blur()
      await expect(
        page.getByText('Password must be at least 8 characters long.'),
      ).toBeVisible()

      // Test 3: Too long password should show length error
      await pom.userPasswordDialog.newPassword.fill(
        'ThisPasswordIsTooLongForValidation123!',
      )
      await pom.userPasswordDialog.newPassword.blur()
      await expect(
        page.getByText('Password cannot be longer than 20 characters.'),
      ).toBeVisible()

      // Test 4: Password without uppercase should show uppercase error
      await pom.userPasswordDialog.newPassword.fill('lowercase123!')
      await pom.userPasswordDialog.newPassword.blur()
      await expect(
        page.getByText('Password must contain at least one uppercase letter.'),
      ).toBeVisible()

      // Test 5: Password without lowercase should show lowercase error
      await pom.userPasswordDialog.newPassword.fill('UPPERCASE123!')
      await pom.userPasswordDialog.newPassword.blur()
      await expect(
        page.getByText('Password must contain at least one lowercase letter.'),
      ).toBeVisible()

      // Test 6: Password without digit should show digit error
      await pom.userPasswordDialog.newPassword.fill('NoDigitPass!')
      await pom.userPasswordDialog.newPassword.blur()
      await expect(
        page.getByText('Password must contain at least one digit.'),
      ).toBeVisible()

      // Test 7: Password without special character should show special char error
      await pom.userPasswordDialog.newPassword.fill('NoSpecialChar123')
      await pom.userPasswordDialog.newPassword.blur()
      await expect(
        page.getByText('Password must contain at least one special character.'),
      ).toBeVisible()

      // Test 8: Valid password should not show any validation errors
      await pom.userPasswordDialog.newPassword.fill('ValidPass123!')
      await pom.userPasswordDialog.newPassword.blur()

      // Wait a moment for validation to process
      await page.waitForTimeout(500)

      // Check that no password validation errors are visible
      await expect(
        page.getByText('Password cannot be blank.'),
      ).not.toBeVisible()
      await expect(
        page.getByText('Password must be at least 8 characters long.'),
      ).not.toBeVisible()
      await expect(
        page.getByText('Password cannot be longer than 20 characters.'),
      ).not.toBeVisible()
      await expect(
        page.getByText('Password must contain at least one uppercase letter.'),
      ).not.toBeVisible()
      await expect(
        page.getByText('Password must contain at least one lowercase letter.'),
      ).not.toBeVisible()
      await expect(
        page.getByText('Password must contain at least one digit.'),
      ).not.toBeVisible()
      await expect(
        page.getByText('Password must contain at least one special character.'),
      ).not.toBeVisible()

      // Test 9: Password mismatch should show error when repeat password is different
      await pom.userPasswordDialog.passwordRepeat.fill('DifferentPass123!')
      await pom.userPasswordDialog.passwordRepeat.blur()
      await expect(page.getByText('Passwords must match.')).toBeVisible()

      // Test 10: Matching passwords should not show mismatch error
      await pom.userPasswordDialog.passwordRepeat.fill('ValidPass123!')
      await pom.userPasswordDialog.passwordRepeat.blur()
      await page.waitForTimeout(500)
      await expect(page.getByText('Passwords must match.')).not.toBeVisible()
    })
  })
})
