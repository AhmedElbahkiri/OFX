import { DocumentClient } from '../lib/dynamodb';
import { GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Payment } from '../models/Payment';

export class PaymentRepository {
    private readonly tableName = 'Payments';

    async save(payment: Payment): Promise<void> {
        await DocumentClient.send(
            new PutCommand({
                TableName: this.tableName,
                Item: payment,
            })
        );
    }

    async findById(paymentId: string): Promise<Payment | null> {
        const result = await DocumentClient.send(
            new GetCommand({
                TableName: this.tableName,
                Key: { paymentId },
            })
        );

        return (result.Item as Payment) || null;
    }

    async findAll(currency?: string): Promise<Payment[]> {
        const scanParams: any = {
            TableName: this.tableName,
        };

        if (currency) {
            scanParams.FilterExpression = 'currency = :currency';
            scanParams.ExpressionAttributeValues = {
                ':currency': currency
            };
        }

        const result = await DocumentClient.send(new ScanCommand(scanParams));
        return (result.Items as Payment[]) || [];
    }
}