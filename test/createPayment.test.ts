import { handler } from '../src/handlers/createPayment';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('createPayment validation', () => {
    it('should return 422 for invalid data', async () => {
        const result = await handler({
            body: JSON.stringify({ amount: -100, currency: 'INVALID' })
        } as APIGatewayProxyEvent);
        
        expect(result.statusCode).toBe(422);
    });
});