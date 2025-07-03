import {expect, Locator, Page} from '@playwright/test'
import {NavigationLinksButton} from "@lib/index";
import {BaseDataPage} from "@lib/pages/BaseDataPage";

const navigationItemLinkStatusIndex = {
    [NavigationLinksButton.Read]: 0,
    [NavigationLinksButton.Update]: 1,
    [NavigationLinksButton.Delete]: 2,
}

export abstract class BaseCollectionPage extends BaseDataPage {

    public readonly dataCollectionTable = this.page.getByTestId(
        'data-collection-table',
    )

    getItemNavigationLink(rowSelector: number | string | RegExp, testId: string) {
        return this.getTableDataRow(rowSelector).getByTestId(testId)
    }

    getTableDataRow(nthOrText: number | string | RegExp) {
        return typeof nthOrText === 'number'
            ? this.dataCollectionTable.getByRole('row').nth(nthOrText + 1)
            : this.getTableDataRowByText(nthOrText)
    }

    getTableDataRowByText(text: string | RegExp) {
        if ('string' === typeof text) {
            text = new RegExp(`^${text}`)
        }
        return this.dataCollectionTable
            .getByRole('row')
            .filter({has: this.page.locator('td', {hasText: text})})
    }

    async expectDataTable(main = true) {
        if (main) {
            await this.expectAppDataCardToHaveResourceLabelAsTitle()
        }
        await expect(this.dataCollectionTable).toHaveCount(1)

        await expect(this.dataCollectionTable.getByText(/Loading/)).toHaveCount(0)
    }
}