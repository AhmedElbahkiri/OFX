import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { buildResponse, parseInput } from "../lib/apigateway";
import { PaymentService, CreatePaymentRequest } from "../services/PaymentService";

const paymentService = new PaymentService();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const paymentData = parseInput(event.body || "{}") as CreatePaymentRequest;
    console.log("Creating payment request received");
    
    const result = await paymentService.createPayment(paymentData);
    return buildResponse(201, result);
  } catch (error) {
    console.error("Error creating payment:", error);
    
    if (error instanceof Error && error.message.includes('Validation failed')) {
      return buildResponse(422, { error: error.message });
    }
    
    return buildResponse(500, { error: "Internal Server Error" });
  }
};
