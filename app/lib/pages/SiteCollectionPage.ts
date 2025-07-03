import {BaseCollectionPage} from "@lib/pages/BaseCollectionPage";

export class SiteCollectionPage extends BaseCollectionPage {
    public readonly resourceLabel = 'Sites'
    protected readonly path = '/data/sites'
}