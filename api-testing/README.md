# RMS Cloud Take Home Challenge - API Testing Documentation

## Reconnaisance
- Used `Chrome Developer Tools` in browser to understand the chain of web requests and identified the API calls like get connection, search, get category rates, add booking etc., made from the application
- Analysed API request and response headers, body, Cookie storage values to understand the context, details shared in the API response. Identified the `APICookie` in response header cookie which acts as the authorization API key for requests.
- Understood the various parameters passed in the API like clientid, agentid, dates for booking, cartID etc., and mapped the key details wihch is passed to other API's


## API's tested (2 Nos)

1. ### Get Category Availability Rates - https://alphaibe12.rmscloud.com/OnlineApi/GetCatAvailRatesData

- Retrives the availability of rooms and rates data for the search criteria submitted by user like dates and guests count.
- Uses the `API Cookie` generated from the Get Connection URL API as authorization key.
- API response has `addToCartUrl` field with all the details to run `AddBooking` API
- I chose this as it is a critical API to proceed with booking and had scope for data validation.
- Tests are added for API

   Bugs:
    - Missing field validation for `dates` field. Backdated dates are allowed in API, however in frontend, back dated booking are not possible. Opens the possibility for API poisoning.

    Observations:
    - Good to have input validation for guest numbers and `bookingType` fields


2. ### Add Booking API - https://alphaibe12.rmscloud.com/OnlineApi/AddBooking?

- Adds the selected room for the price with dates and guest numbers to cart
- All parameters (dynamic in nature) for the add to cart API can be extracted from `Get Category Availability Rates` API response, specifically `categoryRows` array.
- Provides the `cartId` for successfull response which is a significant information in completing or removing the booking.
- Added Tests to validate cart details.


## How to Test

- Download the postman collection file of API's from `./api-testing/RMS Cloud API Collection.postman_collection.json`
- Import the Postman Collection file into Postman.
- Navigate to the `Pre-requisite - Get Connection URL's` API and clear the cookies if any.
- Click on the `Run` button from the `RMS Cloud API Collection` collection to run the API's and their tests. 


## Assumptions & Limitations

*   **Test Environment**: The tests assume they are running against a stable test environment where the booking API services are available.
*   **Static Data**: The test relies on static test data as it assumes that the search criteria (dates, guests) will yield available rooms.


## Observations
1. Decoded the API Cookie JWT token and found that `Day` is wrong as September 8 is Monday and not Friday.

```sh
JSON
{
  "sub": "user",
  "jti": "7b96d22b-7ffa-4fca-9e06-b0bc333f485a",
  "UserAgent": "PostmanRuntime/7.45.0",
  "exp": 1757327128,
  "iss": "IBEPlus",
  "aud": "rmscloud.com"
}
exp: The expiration time of the token is 1757327128 (Unix timestamp), which is Friday, September 8, 2025, 9:05:28 PM AEST. After this time, the token is invalid.
```
2. Search API - API doesn’t need any cookie based auth in header to fetch search results.


