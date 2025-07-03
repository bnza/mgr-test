import {test} from '@playwright/test'
import {HomePage} from '@lib/pages/HomePage'
import {loadFixtures} from "@lib/api";

test.beforeAll(async () => {
    loadFixtures()
})

test.describe('Home page', () => {
    test('Navigation drawer  works as expected', async ({page}) => {
        const pom = new HomePage(page)
        await pom.open()
    })
})
