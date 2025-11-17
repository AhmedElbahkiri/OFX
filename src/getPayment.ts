import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse } from './lib/apigateway';
import { getPayment } from './lib/payments';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const paymentId = event.pathParameters?.id;
    if (!paymentId) {
        return buildResponse(400, { error: 'Payment ID is required' });
    }
    
    const payment = await getPayment(paymentId);
    if (!payment) {
        return buildResponse(404, { error: 'Payment not found' });
    }
    
    return buildResponse(200, payment);
};
