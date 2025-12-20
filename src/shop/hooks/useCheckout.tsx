import { useMutation } from "@tanstack/react-query";
import { createOrderAction } from "../actions/create-order.action";
import type { AxiosError } from "axios";
import axios from "axios";
import { createPaymentSessionAction } from "../actions/create-payment-session.action";

async function createOrder(): Promise<string> {
  try {
    return await createOrderAction();
  } catch (error: unknown) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response) {
        throw new Error(axiosError.response.data.message);
      }
    }
    throw new Error("No se pudo crear la orden");
  }
}

async function createPaymentSession(orderId: string): Promise<string> {
  try {
    return await createPaymentSessionAction(orderId);
  } catch (error: unknown) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response) {
        throw new Error(axiosError.response.data.message);
      }
    }
    throw new Error("No se pudo iniciar el pago");
  }
}

export function useCheckout() {
  return useMutation({
    mutationFn: async () => {
      const orderId = await createOrder();
      const url = await createPaymentSession(orderId);
      return url;
    }
  });
}
