import { handler } from '../src/handlers/createPayment';
import { APIGatewayProxyEvent } from 'aws-lambda';

jest.mock('../src/repositories/PaymentRepository', () => {
    return {
        PaymentRepository: jest.fn().mockImplementation(() => {
            return {
                save: jest.fn().mockResolvedValue(undefined),
                findById: jest.fn(),
                findAll: jest.fn()
            };
        })
    };
});

describe('createPayment validation', () => {
    it('should return 422 for invalid data', async () => {
        const result = await handler({
            body: JSON.stringify({ amount: -100, currency: 'INVALID' })
        } as APIGatewayProxyEvent);
        
        expect(result.statusCode).toBe(422);
        expect(JSON.parse(result.body)).toHaveProperty('error');
        expect(JSON.parse(result.body).error).toContain('Validation failed');
    });

    it('should return 201 for valid data', async () => {
        const result = await handler({
            body: JSON.stringify({ amount: 100, currency: 'USD' })
        } as APIGatewayProxyEvent);
        
        expect(result.statusCode).toBe(201);
        expect(JSON.parse(result.body)).toHaveProperty('success', true);
        expect(JSON.parse(result.body)).toHaveProperty('paymentId');
    });
});