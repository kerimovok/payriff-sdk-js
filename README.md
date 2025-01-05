# Unofficial Payriff SDK for JavaScript

An unofficial TypeScript/JavaScript SDK for integrating with the Payriff payment gateway.

## Installation

```bash
npm install payriff-sdk-js
```

or

```bash
yarn add payriff-sdk-js
```

or

```bash
bun add payriff-sdk-js
```

P.S. Alternatively, you can use the SDK without installing it by copying the `PayriffSDK.ts` file into your project.

## Configuration

Initialize the SDK with your merchant credentials:

### Default Configuration

```typescript
import { PayriffSDK } from 'payriff-sdk-js'

const payriff = new PayriffSDK()
```

### Custom Configuration

```typescript
import { PayriffSDK } from 'payriff-sdk-js'

const payriff = new PayriffSDK({
	// optional, defaults to https://api.payriff.com/api/v3
	baseUrl: 'https://api.payriff.com/api/v3',
	// optional, defaults to PAYRIFF_SECRET_KEY environment variable
	secretKey: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
	// optional, defaults to PAYRIFF_CALLBACK_URL environment variable
	defaultCallbackUrl: 'https://example.com/webhook',
	// optional, defaults to 'AZ'
	defaultLanguage: 'AZ',
	// optional, defaults to 'AZN'
	defaultCurrency: 'AZN',
})
```

## Features

### Create Order

Create a new payment order:

#### With default options

```typescript
const order = await payriff.createOrder({
	amount: 10.99,
	description: 'Product purchase',
})
```

#### With custom options

```typescript
const order = await payriff.createOrder({
	amount: 10.99,
	language: 'EN', // optional, defaults to 'AZ'
	currency: 'USD', // optional, defaults to 'AZN'
	description: 'Product purchase',
	callbackUrl: 'https://example.com/webhook', // optional, defaults to PAYRIFF_CALLBACK_URL environment variable
	cardSave: true, // optional, defaults to false
	operation: 'PURCHASE', // optional, defaults to 'PURCHASE'
})
```

### Get Order Information

Retrieve details about an existing order:

```typescript
const orderInfo = await payriff.getOrderInfo('ORDER_ID')
```

### Process Refund

Refund a completed payment:

```typescript
const refund = await payriff.refund({
	orderId: 'ORDER_ID',
	amount: 10.99,
})
```

### Complete Pre-authorized Payment

Complete a pre-authorized payment:

```typescript
const complete = await payriff.complete({
	orderId: 'ORDER_ID',
	amount: 10.99,
})
```

### Automatic Payment

Process payment using saved card details:

#### With default options

```typescript
const autoPay = await payriff.autoPay({
	cardUuid: 'CARD_UUID',
	amount: 10.99,
	description: 'Subscription renewal',
})
```

#### With custom options

```typescript
const autoPay = await payriff.autoPay({
	cardUuid: 'CARD_UUID',
	amount: 10.99,
	currency: 'USD', // optional, defaults to 'AZN'
	description: 'Subscription renewal',
	callbackUrl: 'https://example.com/webhook', // optional, defaults to PAYRIFF_CALLBACK_URL environment variable
	operation: 'PURCHASE', // optional, defaults to 'PURCHASE'
})
```

## Type Definitions

The SDK includes TypeScript definitions for all request and response types:

### Configuration

-   `PayriffConfig` - SDK initialization options
    -   `baseUrl?` - API base URL
    -   `secretKey?` - Merchant secret key
    -   `defaultLanguage?` - Default payment page language
    -   `defaultCurrency?` - Default currency
    -   `defaultCallbackUrl?` - Default callback URL for notifications

### Payment Operations

-   `CreateOrderRequest` - Parameters for creating new orders
    -   Required:
        -   `amount` - Payment amount
        -   `description` - Order description
    -   Optional:
        -   `language` - Payment page language (defaults to 'AZ')
        -   `currency` - Payment currency (defaults to 'AZN')
        -   `cardSave` - Enable card saving (defaults to false)
        -   `operation` - Payment operation type (defaults to 'PURCHASE')
        -   `callbackUrl` - Result notification URL
-   `RefundRequest` - Parameters for refund operations
    -   `amount` - Refund amount
    -   `orderId` - Order to refund
-   `AutoPayRequest` - Parameters for automatic payments
    -   Required:
        -   `cardUuid` - Saved card identifier
        -   `amount` - Payment amount
        -   `description` - Payment description
    -   Optional:
        -   `currency` - Payment currency
        -   `callbackUrl` - Result notification URL
        -   `operation` - Payment operation type

### Response Types

-   `PayriffResponse<T>` - Generic API response wrapper
-   `OrderPayload` - Created order details
-   `OrderInfo` - Detailed order information
-   `Transaction` - Transaction details
-   `CardDetails` - Payment card information

### Constants

-   `PayriffResultCodes` - API response codes

    -   `SUCCESS`: '00000'
    -   `SUCCESS_GATEWAY`: '00'
    -   `SUCCESS_GATEWAY_APPROVE`: 'APPROVED'
    -   `SUCCESS_GATEWAY_PREAUTH_APPROVE`: 'PREAUTH-APPROVED'
    -   `WARNING`: '01000'
    -   `ERROR`: '15000'
    -   `INVALID_PARAMETERS`: '15400'
    -   `UNAUTHORIZED`: '14010'
    -   `TOKEN_NOT_PRESENT`: '14013'
    -   `INVALID_TOKEN`: '14014'

-   `PayriffTypes` - Available options
    -   `Languages`: ['AZ', 'EN', 'RU']
    -   `Currencies`: ['AZN', 'USD', 'EUR']
    -   `Operations`: ['PURCHASE', 'PRE_AUTH']

### Response Structure

All API operations return responses in this format:

```typescript
{
	code: string // Response status code
	message: string // Human-readable message
	route: string // API endpoint path
	internalMessage: string | null // Additional details
	responseId: string // Unique response ID
	payload: T // Operation-specific data
}
```

## Utility Methods

-   `isSuccessful(code: string)` - Check if an operation was successful based on the response code

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
