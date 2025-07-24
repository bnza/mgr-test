import { LocatorWrapper } from '@lib/components/LocatorWrapper'
import { BaseCollectionPage } from '@lib/pages/BaseCollectionPage'
import { Autocomplete } from '@lib/components/Autocomplete'

export class DataDialogSiteUserPrivilege extends LocatorWrapper {
  public readonly closeButton = this.locator.getByRole('button', {
    name: 'Close',
  })
  public readonly submitButton = this.locator.getByRole('button', {
    name: 'Submit',
  })

  public readonly userInput = new Autocomplete(
    this.pom,
    this.locator.getByRole('combobox').nth(0),
  )
  public readonly siteInput = new Autocomplete(
    this.pom,
    this.locator.getByRole('combobox').nth(1),
  )
  public readonly privilegeInput = this.locator.getByRole('checkbox', {
    name: 'editor',
  })

  constructor(pom: BaseCollectionPage) {
    super(pom, pom.page.getByTestId('data-dialog-create'))
  }
}
