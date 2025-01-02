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

```typescript
import { PayriffSDK } from 'payriff-sdk-js'

const payriff = new PayriffSDK({
	// optional, defaults to https://api.payriff.com/api/v3
	baseUrl: 'https://api.payriff.com/api/v3',
	// optional, defaults to process.env.PAYRIFF_SECRET_KEY
	secretKey: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
})
```

## Features

### Create Order

Create a new payment order:

```typescript
const order = await payriff.createOrder({
	amount: 10.99,
	language: 'EN',
	currency: 'AZN',
	description: 'Product purchase',
	callbackUrl: 'https://example.com/webhook',
	cardSave: true,
	operation: 'PURCHASE', // 'PURCHASE' or 'PRE_AUTH'
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

```typescript
const autoPay = await payriff.autoPay({
	cardUuid: 'CARD_UUID',
	amount: 10.99,
	currency: 'AZN',
	description: 'Subscription renewal',
	callbackUrl: 'https://example.com/webhook',
	operation: 'PURCHASE',
})
```

## Type Definitions

The SDK includes TypeScript definitions for all request and response types. Key interfaces include:

-   `PayriffConfig`
-   `CreateOrderRequest`
-   `OrderPayload`
-   `RefundRequest`
-   `AutoPayRequest`
-   `OrderInfo`
-   `Transaction`
-   `CardDetails`

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
