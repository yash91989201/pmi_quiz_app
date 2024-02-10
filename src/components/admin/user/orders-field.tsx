"use client";
import { Fragment } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
// TYPES
import type { CreateUserFormSchemaType } from "@/lib/schema";
// ICONS
import { Checkbox } from "@/components/ui/checkbox";

export default function OrdersField() {
  const { control, getValues } = useFormContext<CreateUserFormSchemaType>();

  const { fields, update } = useFieldArray({
    name: "orders",
    control: control,
  });

  const setOrderCompletion = (index: number) => {
    const allOrders = getValues("orders");
    const updatedOrders = allOrders.map((order, optionIndex) => {
      if (optionIndex === index) {
        return {
          ...order,
          isCompleted: !order.isCompleted,
        };
      }
      return order;
    });

    updatedOrders.forEach((order, index) => {
      update(index, order);
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-lg font-medium">Update User Order</p>
      <div className="flex flex-col gap-3">
        {fields.map((order, index) => (
          <Fragment key={index}>
            <div>
              <span className="text-xl font-bold text-primary">
                {index + 1}
              </span>
              <span>/{fields.length}</span>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                checked={order.isCompleted}
                onClick={() => setOrderCompletion(index)}
              />
              <p>{order.orderText}</p>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
