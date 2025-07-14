import { BaseCollectionPage } from '@lib/pages/BaseCollectionPage'

export class SiteCollectionPage extends BaseCollectionPage {
  public readonly resourceLabel = 'Users'
  protected readonly path = '/data/users'
}
