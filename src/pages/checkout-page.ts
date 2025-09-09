import { Locator, FrameLocator, Page } from '@playwright/test';

// Class to handle interactions for filling guest details, payment and submitting the booking
export class CheckoutPage {
  protected page: Page;
  private completeYourReservationText: Locator;
  private title: Locator;
  private firstName: Locator;
  private lastName: Locator;
  private email: Locator;
  private phone: Locator;
  private address: Locator;
  private addressOption: Locator;
  private bookNow: Locator
  private payButton: Locator;
  
  // Payment Fields locators
  private cardNumber: FrameLocator;
  private expiry: FrameLocator;
  private cvc: FrameLocator;
  private cardName: Locator;

  constructor(page: Page) {
    this.page = page;
    this.completeYourReservationText = page.getByText('Complete your reservation');
    this.title = page.getByRole('combobox', { name: 'Title' });
    this.firstName = page.getByRole('textbox', { name: 'First Name *' });
    this.lastName = page.getByRole('textbox', { name: 'Last Name *' });
    this.email = page.getByRole('textbox', { name: 'Email Address *' });
    this.phone = page.getByRole('textbox', { name: 'Mobile Number *' });
    this.address = page.getByRole('textbox', { name: 'Address Finder' });
    this.addressOption = page.locator('#address-finder-option-0');
    this.bookNow = page.getByTestId('book-now-btn-summary')
    this.payButton = page.getByRole('button', { name: /Pay A\$/ });

    // Using framelocator for iframe elements
    this.cardNumber = page.frameLocator('iframe[title="Iframe for card number"]');
    this.expiry = page.frameLocator('iframe[title="Iframe for expiry date"]');
    this.cvc = page.frameLocator('iframe[title="Iframe for security code"]');
    this.cardName = page.getByRole('textbox', { name: 'Name on card' });

  }

  async isCheckoutPageLoaded() {
    const checkoutPageText = await this.completeYourReservationText.innerText();
    return checkoutPageText;
  }

  // Handles form filling of guest details
  async fillGuestDetails(guestInfo: { title: string, firstName: string, lastName:string, email: string, phone: string, address: string }) {
    await this.title.click();
    await this.page.getByRole('option', { name: guestInfo.title, exact: true }).click();
    await this.firstName.fill(guestInfo.firstName);
    await this.lastName.fill(guestInfo.lastName);
    await this.email.fill(guestInfo.email);
    await this.phone.fill(guestInfo.phone);
    await this.address.fill(guestInfo.address);
    await this.addressOption.click();
  }

  // Handles form filling of payment card details
  async fillPaymentCardDetails(cardNumber: string, expiry: string, cvc: string) {
    await this.cardNumber.getByRole('textbox', { name: 'Card number' }).fill(cardNumber);
    await this.expiry.getByRole('textbox', { name: 'Expiry date' }).fill(expiry);
    await this.cvc.getByRole('textbox', { name: 'Security code' }).fill(cvc);
    await this.cardName.fill('Test Card');
  }

  
  // Handles booking submission and payment process. Waits for booking and payment API responses for better reliability
  async SubmitBookingAndPay(paymentInfo: {cardNumber: string, expiry: string, cvc: string}) {

    // Waits for the response of SaveBooking API
    const saveBookingApiResponse = this.page.waitForResponse(
      (response) =>
        response.url().includes('/OnlineApi/SaveBookingCDB?') && response.status() === 200
    );
    // Performs booking sumission
    await this.bookNow.click();
    // Wait for the network request to complete
    await saveBookingApiResponse;

    // Fills in payment details
    await this.fillPaymentCardDetails(paymentInfo.cardNumber, paymentInfo.expiry, paymentInfo.cvc);
    
    // Waits for the response of Confirm booking API's for better reliability
    const confirmBookingApiResponse = this.page.waitForResponse(
      (response) => 
        response.url().includes('/OnlineApi/ConfirmBookingAfterPayment?') && response.status() === 200
    );
    // Performs payment
    await this.payButton.click();
    // Wait for the network request to complete
    await confirmBookingApiResponse;
  }
}