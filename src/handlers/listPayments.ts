import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse } from '../lib/apigateway';
import { PaymentService } from '../services/PaymentService';

const paymentService = new PaymentService();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const currency = event.queryStringParameters?.currency;
        const payments = await paymentService.listPayments(currency);
        return buildResponse(200, { data: payments });
    } catch (error) {
        console.error('Error listing payments:', error);
        return buildResponse(500, { error: 'Internal Server Error' });
    }
};
