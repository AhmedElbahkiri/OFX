import * as payments from '../src/lib/payments';
import { handler } from '../src/listPayments';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('listPayments', () => {
    it('should filter payments by currency', async () => {
        const mockPayments = [
            { id: '1', currency: 'SGD', amount: 200 }
        ];
        jest.spyOn(payments, 'listPayments').mockResolvedValueOnce(mockPayments);

        const result = await handler({
            queryStringParameters: { currency: 'SGD' }
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual({ data: mockPayments });
    });
});
