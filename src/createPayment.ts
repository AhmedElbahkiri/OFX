import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { buildResponse, parseInput } from "./lib/apigateway";
import { createPayment, Payment } from "./lib/payments";
import { validatePayment } from "./lib/validators";
import { generateUUID } from "./lib/utils";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const paymentData = parseInput(event.body || "{}") as Omit<Payment, "id">;

    const validationErrors = validatePayment(paymentData);
    if (validationErrors.length > 0) {
      return buildResponse(422, { errors: validationErrors });
    }

    const payment: Payment = {
      ...paymentData,
      id: generateUUID(),
    };
    await createPayment(payment);
    console.log("Creating payment request received");
    return buildResponse(201, {
      success: true,
      paymentId: payment.id,
      message: "Payment created successfully",
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    return buildResponse(500, { error: "Internal Server Error" });
  }
};
