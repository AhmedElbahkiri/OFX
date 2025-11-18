import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse } from '../lib/apigateway';
import { PaymentService } from '../services/PaymentService';

const paymentService = new PaymentService();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const paymentId = event.pathParameters?.id;
        
        if (!paymentId) {
            return buildResponse(400, { error: 'Payment ID is required' });
        }
        
        const payment = await paymentService.getPayment(paymentId);
        if (!payment) {
            return buildResponse(404, { error: 'Payment not found' });
        }
        
        return buildResponse(200, payment);
    } catch (error) {
        console.error('Error getting payment:', error);
        return buildResponse(500, { error: 'Internal Server Error' });
    }
};
