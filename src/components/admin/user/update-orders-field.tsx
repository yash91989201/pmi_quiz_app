"use client";
import { createId } from "@paralleldrive/cuid2";
import { Fragment, useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
// TYPES
import type { UpdateUserFormSchemaType } from "@/lib/schema";
// CUSTOM COMPONENTS
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
// ICONS
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function UpdateOrdersField({
  fieldHeader,
}: {
  fieldHeader: string;
}) {
  const { control, setValue, getValues } =
    useFormContext<UpdateUserFormSchemaType>();
  const userId = getValues("id");

  const { fields, append, remove, update } = useFieldArray({
    name: "orders",
    control: control,
  });

  useEffect(() => {
    fields.map((field, index) => {
      setValue(`orders.${index}.orderPriority`, index + 1);
    });
  }, [fields, setValue]);

  const addOrder = () => {
    append({
      userId,
      userOrderId: createId(),
      orderText: "",
      orderPriority: fields.length + 1,
      isCompleted: false,
    });
  };

  const deleteOrder = (index: number) => {
    remove(index);
  };

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
      <p className="text-lg font-medium">{fieldHeader}</p>
      <div className="flex flex-col gap-3">
        {fields.map((order, index) => (
          <Fragment key={order.userOrderId}>
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
              <FormField
                name={`orders.${index}.orderText`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={`Order ${index + 1}`}
                        className="w-60"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => deleteOrder(index)}
                  disabled={fields.length == 1}
                  type="button"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </Fragment>
        ))}
        <Button
          variant="outline"
          type="button"
          className="w-fit"
          onClick={() => addOrder()}
          disabled={fields.length === 5}
        >
          Add New Order
        </Button>
      </div>
    </div>
  );
}
