import {test, expect} from '@playwright/test'
import {HomePage} from '@lib/pages/HomePage'
import {NavigationLinksButton} from "@lib/index";
import {SiteCollectionPage} from '@lib/pages/SiteCollectionPage'
import {SiteItemPage} from "@lib/pages/SiteItemPage";

test.describe('Site page', () => {
    test('Navigation drawer works works as expected', async ({page}) => {
        const homePom = new HomePage(page)
        const collectionPom = new SiteCollectionPage(page)
        const itemPom = new SiteItemPage(page)
        await homePom.open()
        await homePom.clickAppNavigationDrawerListItem([
            'app-nav-drawer-li-data',
            'app-nav-drawer-li-sites',
        ])
        await collectionPom.expectDataTable(true)
        await collectionPom.getItemNavigationLink('TO', NavigationLinksButton.Read).click()
        await itemPom.expectAppDataCardToHaveResourceLabelAsTitle()
        await itemPom.expectAppDataCardToHaveIdentifier('TO')
        await itemPom.backNavigationButton.click()
        await collectionPom.expectDataTable(true)
    })
})