/**
 * Configuration options for the Payriff SDK
 * @interface PayriffConfig
 * @property {string} [baseUrl] - Optional base URL for the API (defaults to https://api.payriff.com/api/v3)
 * @property {string} secretKey - Merchant's secret key for authentication
 */
export interface PayriffConfig {
	baseUrl?: string
	secretKey?: string
}

/**
 * Request parameters for creating a new order
 * @interface CreateOrderRequest
 * @property {number} amount - Amount of the transaction in decimal format (e.g., 10.99)
 * @property {'AZ' | 'EN' | 'RU'} language - Language code for the payment page
 * @property {string} currency - ISO 4217 currency code (e.g., 'AZN', 'USD')
 * @property {string} description - Description of the order shown to customer
 * @property {string} callbackUrl - URL where customer will be redirected after payment
 * @property {boolean} cardSave - Whether to enable card saving for future payments
 * @property {'PURCHASE' | 'PRE_AUTH'} operation - Type of payment operation
 */
export interface CreateOrderRequest {
	/** Amount of the transaction */
	amount: number
	/** Language code for the payment page */
	language: 'AZ' | 'EN' | 'RU'
	/** Currency code for the transaction */
	currency: string
	/** Description of the order */
	description: string
	/** URL to redirect after payment completion */
	callbackUrl: string
	/** Whether to save the card for future payments */
	cardSave: boolean
	/** Type of payment operation */
	operation: 'PURCHASE' | 'PRE_AUTH'
}

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
 * Request parameters for automatic payment
 * @interface AutoPayRequest
 * @property {string} cardUuid - Unique identifier of the saved card
 * @property {number} amount - Payment amount in decimal format
 * @property {string} currency - ISO 4217 currency code
 * @property {string} description - Payment description
 * @property {string} callbackUrl - URL for payment result notification
 * @property {'PURCHASE' | 'PRE_AUTH'} operation - Type of payment operation
 */
export interface AutoPayRequest {
	cardUuid: string
	amount: number
	currency: string
	description: string
	callbackUrl: string
	operation: 'PURCHASE' | 'PRE_AUTH'
}

export interface CardDetails {
	maskedPan: string
	brand: string
	cardHolderName: string
}

export interface Transaction {
	uuid: string
	createdDate: string
	status: string
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
}

export interface OrderInfo {
	orderId: string
	amount: number
	currencyType: string
	merchantName: string
	operationType: string
	paymentStatus: string
	auto: boolean
	createdDate: string
	description: string
	transactions: Transaction[]
}

/**
 * Payriff Payment Gateway SDK
 * @class PayriffSDK
 */
export class PayriffSDK {
	private baseUrl: string
	private headers: HeadersInit
	private secretKey: string
	private static readonly DEFAULT_BASE_URL = 'https://api.payriff.com/api/v3'

	/**
	 * Creates an instance of PayriffSDK
	 * @param {PayriffConfig} config - Configuration options
	 */
	constructor(config: PayriffConfig = {}) {
		this.baseUrl = config.baseUrl || PayriffSDK.DEFAULT_BASE_URL
		this.secretKey =
			config.secretKey || process.env.PAYRIFF_SECRET_KEY || ''
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
		return this.makeRequest<OrderPayload>('/orders', 'POST', request)
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
	 * @param {RefundRequest} request - Completion parameters
	 * @returns {Promise<PayriffResponse<void>>} Completion operation result
	 */
	async complete(request: RefundRequest): Promise<PayriffResponse<void>> {
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
		return this.makeRequest<OrderInfo>('/autoPay', 'POST', request)
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
 * Standard response codes from Payriff API
 */
export const PayriffResultCodes = {
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
