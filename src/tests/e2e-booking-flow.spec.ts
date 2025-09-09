import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/search-page.js';
import { AddToCartPage } from '../pages/addToCart-page.js'
import { CheckoutPage } from '../pages/checkout-page.js';
import { ConfirmationPage } from '../pages/confirmation-page.js';
import testData from '../data/test-data.json' with { type: "json" };

test.describe('RMS Cloud E2E Booking Flow', () => {
  let searchPage: SearchPage;
  let addToCartPage: AddToCartPage;
  let checkoutPage: CheckoutPage;
  let confirmationPage: ConfirmationPage;

  test.beforeEach(async ({ page, isMobile }) => {
    searchPage = new SearchPage(page, isMobile);
    addToCartPage = new AddToCartPage(page);
    checkoutPage = new CheckoutPage(page);
    confirmationPage = new ConfirmationPage(page);
    // Navigate to the booking application
    await searchPage.launchPage(testData.baseURL);
  });

  test('should complete the booking workflow successfully', async () => {

    // Search rooms for given dates and guests.
    await searchPage.searchRooms(testData.bookingDetails.dates);
    const isPageLoaded = await addToCartPage.isSearchPageLoaded();
    expect(isPageLoaded).toEqual('Available');

    // Get Available rooms
    const roomToSelect = await addToCartPage.getRoomTestId(2);

    // View Prices, Select Room and Add to Cart
    await addToCartPage.ViewPricesAndAddRoomToCart(roomToSelect);
    
    // Validate Cart details
    const cartDetails = await addToCartPage.getCartDetails();
    expect (cartDetails).toContain('Cart3 / 3 Guests Added');

    // Checkout Cart
    await addToCartPage.checkOutCart();
    const isCheckoutPageLoaded = await checkoutPage.isCheckoutPageLoaded();
    expect(isCheckoutPageLoaded).toContain('Complete your');

    // Fill Guest Details
    await checkoutPage.fillGuestDetails(testData.bookingDetails.guestInfo);

    // Submit booking and Make Payment
    await checkoutPage.SubmitBookingAndPay(testData.bookingDetails.paymentInfo);

    // Validate Confirmation Page
    const bookingNumber = await confirmationPage.getBookingNumber();
    expect (bookingNumber).toBeDefined();
    
    const summaryDetails = await confirmationPage.getSummaryMessage();
    console.info(summaryDetails);

    // Validate Guest Details from test data
    const expectedGuestName = `${testData.bookingDetails.guestInfo.firstName} ${testData.bookingDetails.guestInfo.lastName}`;
    expect(summaryDetails).toContain(expectedGuestName);
    expect(summaryDetails).toContain(testData.bookingDetails.guestInfo.email);
    expect(summaryDetails).toContain(testData.bookingDetails.guestInfo.phone);

    // Validate Reservation Dates and Duration
    // As an alternative the dates, guest numbers from test data file can be fomatted and dynamically validated over here. But kept it as static for assessment.
    expect(summaryDetails).toContain('2 Nights');
    expect(summaryDetails).toContain('Sun 28 Sep 2025'); // Check-in date
    expect(summaryDetails).toContain('Tue 30 Sep 2025'); // Check-out date

    expect(summaryDetails).toContain(`2 Adults, 1 Child`);

    // Validate Payment Information
    expect(summaryDetails).toContain('Visa **** **** **** 0000'); // Validates card type and masking
    expect(summaryDetails).toContain('Paid Today');
    expect(summaryDetails).toContain('Outstanding Payment');
  
    });
});