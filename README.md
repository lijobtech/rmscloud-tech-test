# RMS Cloud Take Home Challenge - Automating Booking Flow

A basic test automation suite covering the end-to-end booking workflow for the RMS Cloud application. Designed with Page Object Model principles using Playwright's out of the box implementation with TypeScript and configured to run in desktop and mobile browsers.


## Test Implementation

This test suite follows best practices to ensure reliability and maintainability:

- Page Object Model (POM) - Encapsulates interactions/actions of search, add to cart, checkout and confirmation pages with stable locators using `getBy*` playwright locator methods and logical functions.
- Data-driven testing - Centralised test data design with JSON files for running various data combinations.
- Robust Test suite - Added with conditional logic to run the same test script for desktop and mobile browsers using `isMobile` playwright property for devices.
- Reliability - Focussed on ensuring API calls (Addbooking, SaveBooking, Confirmation) triggered by UI actions are successful before proceeding the request workflow.

### Test Structure

The project follows a standard, scalable test automation structure:

```
.
├── src
│   ├── data/
│   │   └── test-data.json      # Test data for inputs like guest details
│   ├── pages/
│   │   ├──-search-page.ts      # Search page with shared functionalities
│   │   ├── addToCart-page.ts   # Page objects and methods to select and add rooms to cart
│   │   └── ...                 # Other page objects for checkout and confirmation actions
│   └── tests/
│       └── e2e-booking-flow.spec.ts # The main test file executing the E2E flow
└── playwright.config.ts        # Playwright configuration file
```

## Getting Started

Follow these simple steps to a local copy up and running,

### Prerequisites

*   Node.js (v22 recommended)
*   npm (comes with Node.js)

### Installation

1.  Clone the repo:
    ```sh
    git clone git@github.com:lijobtech/rmscloud-tech-test.git
    ```
2.  Navigate to the project directory and install NPM packages:
    ```sh
    npm install
    ```
3.  Install Playwright's browser binaries:
    ```sh
    npx playwright install
    ```

## Usage

You can run the entire test suite or target specific configurations.

1.  **Run all tests** (both Desktop and Mobile projects in parallel):
    ```sh
    npm run test
    ```
2.  **Run tests for Desktop only**:
    ```sh
    npm run desktop-test
    ```
3.  **Run tests for Mobile only**:
    ```sh
    npm run mobile-test
    ```
4.  **View the HTML Test Report**:
    After a test run, a report is generated. To view it, run:
    ```sh
    npx playwright show-report
    ```

Video recordings and trace of test runs are also uploaded and can be referred if you are unable to run the tests in your local machine.
Desktop  - ./playwright-report/data/DesktopBrowser.webm
Mobile - ./playwright-report/data/MobileBrowser.webm


## Assumptions & Limitations

*   **Native Playwright**: The test suite is built upon the ready-to-use playwright test framework and does not manage any browser or driver functions.

*   **Test Environment**: The tests assume they are running against a stable test environment where the booking portal is available.

*   **Happy Path Focus**: The current test suite focuses exclusively on the "happy path" or successful booking scenario. It does not cover negative test cases, such as invalid card numbers, unavailable rooms, or user input validation errors. Documentation on observation and bugs/defects are listed below separately.

*   **Static Data**: The test relies on static data from `test-data.json`. It assumes that the search criteria (dates, guests) will yield available rooms.

*   **Validation/Assertion**: Final Summary validation is kept simple by asserting static text for dates, guests etc., Have not done dynamic validation of extracting values during room selection or formatting dates for validation. While printing the final summary message to console is not ideal, I have retained it to showcase the success.

*   **Payment Gateway**: The test assumes the payment gateway is in a test or mock mode that accepts the provided test card details.

*   **Configuration for Assessment**: The `playwright.config.ts` is set with `retries: 0` and `trace: 'on'` for assessment purposes. In a real-world CI/CD pipeline, retries would be enabled (`retries: 2`) and tracing/video might be set to `'on-first-retry'` or `'retain-on-failure'` to optimize.

*   **Inheritance**: Kept the design simple for assessment without any inheritance from base class or index driven page selection.


## Observation from Exploratory testing
Analysed using `Chrome Developer Tools` to understand the chain of events for the booking workflow and did some general exploratory testing
1. In the `Complete your reservation` Page, observed there are no input validations for Mobile number. Provided 3 digits `046` and it was considered to be a valid number.

2. Address Finder missing `*` to notify users that it is a mandatory field. Unable to submit booking form if address is missing.
Refer to image - AddressFinder.png

## AI Prompts

- To convert API's from HAR files to Postman Collection

        "Postman API testing task
        Goal - Create a Postman Collection File from the user given HAR file by extracting the `OnlineAPI` web requests. Add basic tests to validate response status and JSON response elements in a step by step model

        Step 1 - Analyse the user given HAR file for `OnlineAPI` web requests and print a summary of API's
        Step 2 - Extract the `OnlineAPI` requests and convert them into a postman collection file such that the file can be imported and used in postman tool. Make sure the syntax is correct.
        Step 3 - Update the postman collection file with basic tests
        Step 4 - Write a documentation on the API explaning what they do and what are the critical parameters of the API to make it work"

- To write this README file based on the project files

        "You are a experience document writer with special skills on technical writing. Write a README.md for the attached project specifically focussing on
        1.Introduction
        2.Test Structure
        3.Test Design highlighting page object model
        4.How to run test 
        5.Assumptions or limitations
        Make sure contents highlight the robustness of test capability to run for Desktop and mobile browsers and how it is implemented."

I have used other AI assistance in bits and pieces to help with writing the test and fixing some locator issues.