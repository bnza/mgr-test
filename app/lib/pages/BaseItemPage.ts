import {BaseDataPage} from "@lib/pages/BaseDataPage";
import {expect} from "@playwright/test";

export abstract class BaseItemPage extends BaseDataPage {
    async expectTextFieldToHaveValue(name: string, value: string | RegExp) {
        await expect(this.appDataCard.getByRole('textbox', {name})).toHaveValue(value)
    }
}