import { Locator, Page } from '@playwright/test';

export class SearchPage {
  protected page: Page;
  protected isMobile: boolean | undefined
  private datePicker: Locator;
  private childrenPlusButton: Locator;
  private doneButton: Locator;
  private guestsTextbox: Locator;
  private searchButton: Locator;
  
  constructor(page: Page, isMobile?: boolean) {
    this.page = page;
    this.isMobile = isMobile;
    this.datePicker = page.getByText('Check InCheck Out')
    this.childrenPlusButton = page.getByTestId('guest-selector-plusButton-children');
    this.doneButton = page.getByRole('button', { name: 'Done' });
    this.guestsTextbox = page.getByRole('textbox', { name: 'Guests' });
    this.searchButton = page.getByTestId('search');
  }

  // Click action for Done button specifically for mobile browsers
  async mobileDoneButtonClick() {
    await this.doneButton.click();
  }

  // Launch and Check Base page
  async launchPage(url: string) {
    await this.page.goto(url);
    await this.datePicker.isVisible();
  }

  async searchRooms(dates: { checkIn: string; checkOut: string }) {
    // Select Dates
    await this.datePicker.click();
    await this.page.getByRole('button', { name: dates.checkIn }).click();
    await this.page.getByRole('button', { name: dates.checkOut }).click();
    
    // For mobile, click done button after selecting dates to close the date picker
    if (this.isMobile) {
      await this.mobileDoneButtonClick();
    }

    // Select Guests
    await this.guestsTextbox.click();
    await this.childrenPlusButton.click();

    // For mobile, click done button after selecting guests to close the guest selector
    if (this.isMobile) {
      await this.mobileDoneButtonClick();
    }

    // Search Rooms
    await this.searchButton.click();
  }
}