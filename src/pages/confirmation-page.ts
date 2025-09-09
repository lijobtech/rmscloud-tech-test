import { Locator, Page } from '@playwright/test';

// Class to handle interactions for confirmation page and extracting booking details
export class ConfirmationPage {
  protected page: Page;
  private bookingNumber: Locator;
  private summaryMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bookingNumber = page.getByText('Booking Number:');
    this.summaryMessage = page.locator('#bookingSummary');
  }

  // Gets booking number
  async getBookingNumber(): Promise<string> {
    return await this.bookingNumber.innerText();
  }

  // Gets the entire summary message
  async getSummaryMessage(): Promise<string> {
    const summaryMessage = await this.summaryMessage.innerText();
    return summaryMessage;
  }

}