"use client";
import { useForm } from "react-hook-form";
import { createId } from "@paralleldrive/cuid2";
import { zodResolver } from "@hookform/resolvers/zod";
// ACTIONS
import { updateOrder } from "@/server/actions/order";
// SCHEMAS
import { OrderFormSchema } from "@/lib/schema";
// TYPES
import type { SubmitHandler } from "react-hook-form";
import type { OrderFormSchemaType, OrderSchemaType } from "@/lib/schema";
// CUSTOM COMPONENTS
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import OrdersField from "@/components/admin/orders/orders-field";
// ICONS
import { Loader2 } from "lucide-react";

export default function CreateOrderForm({
  initialOrders,
}: {
  initialOrders: OrderSchemaType[];
}) {
  const defaultValues = {
    orders:
      initialOrders.length > 0
        ? initialOrders
        : [
            {
              orderId: createId(),
              orderText: "",
              orderPriority: 1,
            },
            {
              orderId: createId(),
              orderText: "",
              orderPriority: 2,
            },
          ],
  };
  const createOrderForm = useForm<OrderFormSchemaType>({
    defaultValues,
    shouldUseNativeValidation: true,
    resolver: zodResolver(OrderFormSchema),
  });
  const { handleSubmit, formState, reset } = createOrderForm;

  const createOrderAction: SubmitHandler<OrderFormSchemaType> = async (
    data,
  ) => {
    await updateOrder(data);
  };

  return (
    <Form {...createOrderForm}>
      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit(createOrderAction)}
        onReset={() => reset()}
      >
        <OrdersField />

        <Button
          type="submit"
          disabled={formState.isSubmitting}
          className="flex w-fit items-center justify-center gap-3  disabled:cursor-not-allowed"
        >
          <h6 className="md:text-lg">Update Order Status</h6>
          {formState.isSubmitting && <Loader2 className="animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
