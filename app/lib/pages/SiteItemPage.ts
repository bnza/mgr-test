import {BaseItemPage} from "@lib/pages/BaseItemPage";

export class SiteItemPage extends BaseItemPage {
    public readonly resourceLabel = 'Site'
    protected readonly path = '/data/sites/{id}'
}