import { PayriffSDK } from '../src/PayriffSDK'

// === CUSTOM OPTIONS ===
const payriff = new PayriffSDK({
	// baseUrl: 'https://api.payriff.com/api/v3', // optional, defaults to https://api.payriff.com/api/v3
	// secretKey: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX', // optional, defaults to process.env.PAYRIFF_SECRET_KEY
})

// === CREATE ORDER ===
const order = await payriff.createOrder({
	amount: 0.01,
	language: 'EN',
	currency: 'AZN',
	description: 'Product purchase',
	callbackUrl: 'https://example.com/webhook',
	cardSave: true,
	operation: 'PURCHASE', // 'PURCHASE' or 'PRE_AUTH'
})
console.log(order)

// === GET ORDER INFO ===
const orderInfo = await payriff.getOrderInfo(
	'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'
)
console.log(orderInfo)

// === REFUND ORDER ===
const refund = await payriff.refund({
	orderId: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
	amount: 0.01,
})
console.log(refund)

// === COMPLETE ORDER ===
const complete = await payriff.complete({
	orderId: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
	amount: 0.01,
})
console.log(complete)

// === AUTO PAY ===
const autoPay = await payriff.autoPay({
	cardUuid: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
	amount: 0.01,
	currency: 'AZN',
	description: 'Subscription renewal',
	callbackUrl: 'https://example.com/webhook',
	operation: 'PURCHASE',
})
console.log(autoPay)
