import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse, parseInput } from './lib/apigateway';
import { createPayment, Payment } from './lib/payments';

const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const paymentData = parseInput(event.body || '{}') as Omit<Payment, 'id'>;

      const validationErrors = validatePayment(paymentData);
    if (validationErrors.length > 0) {
        return buildResponse(422, { errors: validationErrors });
    }
    
    const payment: Payment = {
        ...paymentData,
        id: generateUUID()
    };
    await createPayment(payment);
    return buildResponse(201, { result: payment.id });
};

const validatePayment = (data: any): string[] => {
    const errors: string[] = [];
    
    if (!data.amount || typeof data.amount !== 'number' || data.amount <= 0) {
        errors.push('Amount must be a positive number');
    }
    
    if (!data.currency || typeof data.currency !== 'string' || data.currency.length !== 3) {
        errors.push('Currency must be a 3-character string');
    }
    
    return errors;
};
