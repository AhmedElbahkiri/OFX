import { Payment } from '../models/Payment';
import { PaymentRepository } from '../repositories/PaymentRepository';
import { validatePayment } from '../lib/validators';
import { generateUUID } from '../lib/utils';

export interface CreatePaymentRequest {
    amount: number;
    currency: string;
}

export interface PaymentResponse {
    success: boolean;
    paymentId: string;
    message: string;
}

export class PaymentService {
    private paymentRepository: PaymentRepository;

    constructor() {
        this.paymentRepository = new PaymentRepository();
    }

    async createPayment(request: CreatePaymentRequest): Promise<PaymentResponse> {
        const validationErrors = validatePayment(request);
        if (validationErrors.length > 0) {
            throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
        }

        const payment: Payment = {
            ...request,
            id: generateUUID()
        };

        await this.paymentRepository.save(payment);

        return {
            success: true,
            paymentId: payment.id,
            message: 'Payment created successfully'
        };
    }

    async getPayment(paymentId: string): Promise<Payment | null> {
        if (!paymentId) {
            throw new Error('Payment ID is required');
        }

        return await this.paymentRepository.findById(paymentId);
    }

    async listPayments(currency?: string): Promise<Payment[]> {
        return await this.paymentRepository.findAll(currency);
    }
}