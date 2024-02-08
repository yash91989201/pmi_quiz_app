import type { UserOrderSchemaType } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { Check, CircleSlash } from "lucide-react";
import { Fragment } from "react";

export default function UserOrders({
  userOrders,
}: {
  userOrders: UserOrderSchemaType[];
}) {
  return (
    <div className="flex flex-col  items-start">
      {userOrders.map(({ userOrderId, isCompleted, orderText }, index) => (
        <Fragment key={userOrderId}>
          {index > 0 && (
            <div
              className={cn(
                "ml-3 h-10 w-1.5 rounded-full",
                isCompleted ? "bg-green-500" : "bg-gray-100",
              )}
            />
          )}
          <div className="my-2 flex flex-row items-center justify-center gap-3 ">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full [&>svg]:size-4",
                isCompleted ? "bg-green-500 [&>svg]:text-white" : "bg-gray-100",
              )}
            >
              {isCompleted ? <Check /> : <CircleSlash />}
            </div>
            <p className="text-center">{orderText}</p>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
