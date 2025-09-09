import { expect, Locator, Page } from '@playwright/test';

// Class to handle interactions for selecting rooms, adding to cart and proceeding to checkout 
export class AddToCartPage {
  protected page: Page;
  private pageText: Locator
  private roomItems: Locator
  private cartContent: Locator;
  private checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageText = page.getByText('Available', {exact: true});
    this.roomItems = page.locator('[data-testid^="roomItem-"]');
    this.cartContent = page.getByTestId('cartContentComponent');
    this.checkoutButton = page.getByTestId('btnCheckoutOnCart');
  }

  async isSearchPageLoaded(): Promise<string> {
    const statusText = await this.pageText.innerText();
    return statusText;
  }

  // Gets count of available rooms
  async getAvailableRoomsCount(): Promise<number> {
    return await this.roomItems.count();
  }

  // Gets all test id's of available rooms to be used for selecting rooms.
  async getAllRoomTestDataIds(): Promise<string[]> {
    const allRooms = await this.roomItems.all();
    const testIds = await Promise.all(
      allRooms.map(async (room) => (await room.getAttribute('data-testid'))!)
    );
    return testIds.filter(id => id); // Filter out any null/undefined values
  }

  // Selects room as per user choice or selects the last one , and returns the test id of the selected room.
  async getRoomTestId(roomIndexToSelect: number) {
    const roomsCount = await this.getAvailableRoomsCount();
    const roomTestIds = await this.getAllRoomTestDataIds();
    let roomToSelect: Locator;

    if (roomIndexToSelect <= roomsCount) {
      roomToSelect = this.roomItems.nth(roomIndexToSelect - 1); // Adjusting for zero-based index
    } else {
      console.log(`Room List No: ${roomIndexToSelect} is not available. Selecting the last available room.`);
      roomToSelect = this.roomItems.last();
    }

    await roomToSelect.click();
    const roomId = await roomToSelect.getAttribute('data-testid');

    if (!roomId) {
      throw new Error('Could not find data-testid for the selected room.');
    }
    
    return roomId;
  }

  // Views Prices of selected room and adds it to cart
  async ViewPricesAndAddRoomToCart(roomTestId: string) {
    
    // Select room using the captured room test id
    const roomLocator = this.page.getByTestId(roomTestId);
    
    // View the prices for the selected room
    await roomLocator.getByTestId('see-prices-btn-rates-page').click();
    
    // Wait for the response of adding the room to cart for better reliability
    const cartUpdateResponse = this.page.waitForResponse(
      (response) =>
        response.url().includes('/OnlineApi/AddBooking?') && response.status() === 200
    );
    await roomLocator.getByTestId('add-to-cart-btn-rates-page').first().click();
    
    // Wait for the network request to complete
    await cartUpdateResponse;

    // Throw error if cart still shows empty after adding room
    const cartContents = await this.cartContent.innerText();
    if (cartContents.includes('Your cart is empty')) {
      throw new Error('Failed to add room to cart.');
    }

    // Additional UI check for items added to cart
    await expect(this.cartContent).not.toContainText('Your cart is empty');

  }

  // Gets cart details
  async getCartDetails() {
    return await this.cartContent.textContent();
  }

  // Proceeds to checkout
  async checkOutCart() {
  await this.checkoutButton.click();
  }
}