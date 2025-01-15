/**
 * Configuration options for the Payriff SDK
 * @interface PayriffConfig
 * @property {string} [baseUrl] - Optional base URL for the API (defaults to https://api.payriff.com/api/v3)
 * @property {string} [secretKey] - Optional Merchant's secret key for authentication (defaults to PAYRIFF_SECRET_KEY environment variable)
 * @property {string} [language] - Optional default language for the payment page (defaults to 'AZ')
 * @property {string} [currency] - Optional default currency for the payment page (defaults to 'AZN')
 * @property {string} [callbackUrl] - Optional callback URL for payment result notification (defaults to PAYRIFF_CALLBACK_URL environment variable)
 */
export interface PayriffConfig {
	baseUrl?: string
	secretKey?: string
	defaultLanguage?: Language
	defaultCurrency?: Currency
	defaultCallbackUrl?: string
}

/**
 * Request parameters for creating a new order
 * @interface CreateOrderRequired
 * @property {number} amount - Amount of the transaction in decimal format (e.g., 10.99)
 * @property {string} description - Description of the order shown to customer
 */
interface CreateOrderRequired {
	amount: number
	description: string
}

/**
 * Optional parameters for creating a new order
 * @interface CreateOrderOptional
 * @property {Language} [language] - Language code for the payment page ('AZ', 'EN', 'RU')
 * @property {Currency} [currency] - ISO 4217 currency code ('AZN', 'USD', 'EUR')
 * @property {boolean} [cardSave] - Whether to enable card saving for future payments
 * @property {Operation} [operation] - Type of payment operation ('PURCHASE' or 'PRE_AUTH')
 * @property {string} [callbackUrl] - Optional callback URL for payment result notification
 */
interface CreateOrderOptional {
	language?: Language
	currency?: Currency
	cardSave?: boolean
	operation?: Operation
	callbackUrl?: string
}

export type CreateOrderRequest = CreateOrderRequired & CreateOrderOptional

/**
 * Generic response structure from Payriff API
 * @interface PayriffResponse
 * @template T - Type of the response payload
 * @property {string} code - Response status code (e.g., '00000' for success)
 * @property {string} message - Human-readable response message
 * @property {string} route - API endpoint that processed the request
 * @property {string | null} internalMessage - Additional internal message (if any)
 * @property {string} responseId - Unique identifier for the response
 * @property {T} payload - Response data of type T
 */
export interface PayriffResponse<T> {
	/** Response code */
	code: string
	/** Response message */
	message: string
	/** API route */
	route: string
	/** Internal message (if any) */
	internalMessage: string | null
	/** Unique response identifier */
	responseId: string
	/** Response payload */
	payload: T
}

/**
 * Order creation response payload
 * @interface OrderPayload
 * @property {string} orderId - Unique identifier of the created order
 * @property {string} paymentUrl - URL where customer should be redirected to complete payment
 * @property {number} transactionId - Unique identifier of the transaction
 */
export interface OrderPayload {
	orderId: string
	paymentUrl: string
	transactionId: number
}

/**
 * Request parameters for refund operation
 * @interface RefundRequest
 * @property {number} amount - Amount to refund in decimal format
 * @property {string} orderId - ID of the order to refund
 */
export interface RefundRequest {
	amount: number
	orderId: string
}

/**
 * Request parameters for completing a pre-authorized payment
 * @interface CompleteRequest
 * @property {number} amount - Amount to complete in decimal format
 * @property {string} orderId - ID of the order to complete
 */
export interface CompleteRequest {
	amount: number
	orderId: string
}

/**
 * Request parameters for automatic payment
 * @interface AutoPayRequired
 * @property {string} cardUuid - Unique identifier of the saved card
 * @property {number} amount - Payment amount in decimal format
 * @property {string} description - Payment description
 */
interface AutoPayRequired {
	cardUuid: string
	amount: number
	description: string
}

/**
 * Optional parameters for automatic payment
 * @interface AutoPayOptional
 * @property {Currency} [currency] - ISO 4217 currency code ('AZN', 'USD', 'EUR')
 * @property {Operation} [operation] - Type of payment operation ('PURCHASE' or 'PRE_AUTH')
 * @property {string} [callbackUrl] - Optional callback URL for payment result notification
 */
interface AutoPayOptional {
	currency?: Currency
	operation?: Operation
	callbackUrl?: string
}

export type AutoPayRequest = AutoPayRequired & AutoPayOptional

/**
 * Details of a payment card
 * @interface CardDetails
 * @property {string} maskedPan - Masked card number (e.g., "411111******1111")
 * @property {string} brand - Card brand/network (e.g., "VISA", "MASTERCARD")
 * @property {string} cardHolderName - Name of the cardholder
 */
export interface CardDetails {
	maskedPan: string
	brand: string
	cardHolderName: string
}

/**
 * Transaction details for an order
 * @interface Transaction
 * @property {string} uuid - Unique identifier for the transaction
 * @property {string} createdDate - Transaction creation timestamp
 * @property {Status} status - Current status of the transaction
 * @property {string} channel - Payment channel used
 * @property {string} channelType - Type of payment channel
 * @property {string} requestRrn - Request reference number
 * @property {string | null} responseRrn - Response reference number (if available)
 * @property {string} pan - Masked card number
 * @property {string} paymentWay - Method of payment
 * @property {CardDetails} cardDetails - Detailed card information
 * @property {string} [cardUuid] - Unique identifier for saved card (if applicable)
 * @property {string} merchantCategory - Merchant category code
 * @property {object} installment - Installment payment details
 * @property {string | null} installment.type - Type of installment
 * @property {string | null} installment.period - Installment period
 * @property {string | null} deliveryAddress - Delivery address (if available)
 */
export interface Transaction {
	uuid: string
	createdDate: string
	status: Status
	channel: string
	channelType: string
	requestRrn: string
	responseRrn: string | null
	pan: string
	paymentWay: string
	cardDetails: CardDetails
	cardUuid?: string
	merchantCategory: string
	installment: {
		type: string | null
		period: string | null
	}
	deliveryAddress: string | null
}

/**
 * Detailed information about an order
 * @interface OrderInfo
 * @property {string} orderId - Unique identifier of the order
 * @property {string} invoiceUuid - Unique identifier of the order (if available)
 * @property {number} amount - Total amount of the order
 * @property {string} currencyType - Currency code used for the order
 * @property {string} merchantName - Name of the merchant
 * @property {number} commissionRate - Commission rate for the order
 * @property {string} operationType - Type of payment operation
 * @property {string} paymentStatus - Current status of the payment
 * @property {boolean} auto - Whether this was an automatic payment
 * @property {string} createdDate - Order creation timestamp
 * @property {string} description - Order description
 * @property {Transaction[]} transactions - List of transactions for this order
 */
export interface OrderInfo {
	orderId: string
	invoiceUuid: string | null
	amount: number
	currencyType: Currency
	merchantName: string
	commissionRate?: number
	operationType: string
	paymentStatus: string
	auto: boolean
	createdDate: string
	description: string
	transactions?: Transaction[]
}

/**
 * Payriff Payment Gateway SDK
 * @class PayriffSDK
 */
export class PayriffSDK {
	private baseUrl: string
	private headers: HeadersInit
	private secretKey: string
	private defaultLanguage: Language
	private defaultCurrency: Currency
	private defaultCallbackUrl: string
	private static readonly DEFAULT_BASE_URL = 'https://api.payriff.com/api/v3'
	private static readonly DEFAULT_SECRET_KEY: string =
		process.env.PAYRIFF_SECRET_KEY || ''
	private static readonly DEFAULT_LANGUAGE: Language = 'AZ'
	private static readonly DEFAULT_CURRENCY: Currency = 'AZN'
	private static readonly DEFAULT_CALLBACK_URL: string =
		process.env.PAYRIFF_CALLBACK_URL || ''

	/**
	 * Creates an instance of PayriffSDK
	 * @param {PayriffConfig} config - Configuration options
	 */
	constructor(config: PayriffConfig = {}) {
		this.baseUrl = config.baseUrl || PayriffSDK.DEFAULT_BASE_URL
		this.secretKey = config.secretKey || PayriffSDK.DEFAULT_SECRET_KEY
		this.defaultLanguage =
			config.defaultLanguage || PayriffSDK.DEFAULT_LANGUAGE
		this.defaultCurrency =
			config.defaultCurrency || PayriffSDK.DEFAULT_CURRENCY
		this.defaultCallbackUrl =
			config.defaultCallbackUrl || PayriffSDK.DEFAULT_CALLBACK_URL
		this.headers = {
			Authorization: this.secretKey,
			'Content-Type': 'application/json',
		}
	}

	/**
	 * Makes an HTTP request to the Payriff API
	 * @private
	 * @template T - Type of the response payload
	 * @param {string} endpoint - API endpoint
	 * @param {'GET' | 'POST'} method - HTTP method
	 * @param {object} [body] - Request body
	 * @returns {Promise<PayriffResponse<T>>} API response
	 */
	private async makeRequest<T>(
		endpoint: string,
		method: 'GET' | 'POST',
		body?: object
	): Promise<PayriffResponse<T>> {
		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			method,
			headers: this.headers,
			...(body && { body: JSON.stringify(body) }),
		})
		return response.json()
	}

	/**
	 * Creates a new payment order
	 * @param {CreateOrderRequest} request - Order creation parameters
	 * @returns {Promise<PayriffResponse<OrderPayload>>} Created order details
	 */
	async createOrder(
		request: CreateOrderRequest
	): Promise<PayriffResponse<OrderPayload>> {
		const defaultedRequest: CreateOrderRequest = {
			language: this.defaultLanguage,
			currency: this.defaultCurrency,
			callbackUrl: this.defaultCallbackUrl,
			cardSave: false,
			operation: 'PURCHASE',
			...request,
		}

		return this.makeRequest<OrderPayload>(
			'/orders',
			'POST',
			defaultedRequest
		)
	}

	/**
	 * Retrieves information about an existing order
	 * @param {string} orderId - Unique order identifier
	 * @returns {Promise<PayriffResponse<OrderInfo>>} Order information
	 */
	async getOrderInfo(orderId: string): Promise<PayriffResponse<OrderInfo>> {
		return this.makeRequest<OrderInfo>(`/orders/${orderId}`, 'GET')
	}

	/**
	 * Initiates a refund for an order
	 * @param {RefundRequest} request - Refund parameters
	 * @returns {Promise<PayriffResponse<void>>} Refund operation result
	 */
	async refund(request: RefundRequest): Promise<PayriffResponse<void>> {
		return this.makeRequest<void>('/refund', 'POST', request)
	}

	/**
	 * Completes a pre-authorized payment
	 * @param {CompleteRequest} request - Completion parameters
	 * @returns {Promise<PayriffResponse<void>>} Completion operation result
	 */
	async complete(request: CompleteRequest): Promise<PayriffResponse<void>> {
		return this.makeRequest<void>('/complete', 'POST', request)
	}

	/**
	 * Processes an automatic payment using saved card details
	 * @param {AutoPayRequest} request - Auto-payment parameters
	 * @returns {Promise<PayriffResponse<OrderInfo>>} Payment result
	 */
	async autoPay(
		request: AutoPayRequest
	): Promise<PayriffResponse<OrderInfo>> {
		const defaultedRequest: AutoPayRequest = {
			currency: this.defaultCurrency,
			callbackUrl: this.defaultCallbackUrl,
			operation: 'PURCHASE',
			...request,
		}

		return this.makeRequest<OrderInfo>('/autoPay', 'POST', defaultedRequest)
	}

	/**
	 * Checks if an operation was successful based on the response code
	 * @param {string} code - Response code from the API
	 * @returns {boolean} True if the operation was successful
	 */
	isSuccessful(code: string): boolean {
		return code === '00000' || code === '00'
	}
}

/**
 * Response codes from Payriff API
 */
export const ResultCodes = {
	/** Operation completed successfully */
	SUCCESS: '00000',
	/** Gateway success */
	SUCCESS_GATEWAY: '00',
	/** Payment approved */
	SUCCESS_GATEWAY_APPROVE: 'APPROVED',
	/** Pre-authorization approved */
	SUCCESS_GATEWAY_PREAUTH_APPROVE: 'PREAUTH-APPROVED',
	/** Warning condition */
	WARNING: '01000',
	/** General error */
	ERROR: '15000',
	/** Invalid parameters provided */
	INVALID_PARAMETERS: '15400',
	/** Unauthorized access */
	UNAUTHORIZED: '14010',
	/** Authentication token missing */
	TOKEN_NOT_PRESENT: '14013',
	/** Invalid authentication token */
	INVALID_TOKEN: '14014',
} as const

export const Operation = {
	PURCHASE: 'PURCHASE',
	PRE_AUTH: 'PRE_AUTH',
} as const

export const Language = {
	AZ: 'AZ',
	EN: 'EN',
	RU: 'RU',
} as const

export const Currency = {
	AZN: 'AZN',
	USD: 'USD',
	EUR: 'EUR',
} as const

export const Status = {
	CREATED: 'CREATED',
	APPROVED: 'APPROVED',
	CANCELED: 'CANCELED',
	DECLINED: 'DECLINED',
	REFUNDED: 'REFUNDED',
	PREAUTH_APPROVED: 'PREAUTH_APPROVED',
	EXPIRED: 'EXPIRED',
	REVERSE: 'REVERSE',
	PARTIAL_REFUND: 'PARTIAL_REFUND',
} as const

export type Operation = (typeof Operation)[keyof typeof Operation]
export type Language = (typeof Language)[keyof typeof Language]
export type Currency = (typeof Currency)[keyof typeof Currency]
export type Status = (typeof Status)[keyof typeof Status]
