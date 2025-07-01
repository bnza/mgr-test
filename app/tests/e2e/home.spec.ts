import {test, expect} from '@playwright/test'
import {HomePage} from '@lib/pages/HomePage'

test.describe('Home page', () => {
    test('Navigation drawer works works as expected', async ({page}) => {
        const pom = new HomePage(page)
        await pom.open()
    })
})
