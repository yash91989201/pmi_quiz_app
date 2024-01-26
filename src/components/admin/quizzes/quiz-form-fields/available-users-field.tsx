"use client";
import { useFormContext } from "react-hook-form";
// TYPES
import type { QuizFormSchemaType } from "@/lib/schema";
// CUSTOM COMPONENTS
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
// ICONS
export default function AvailableUsersField({
  availableUsers,
  isLoading,
}: {
  availableUsers: {
    id: string;
    name: string;
  }[];
  isLoading: boolean;
}) {
  const { control } = useFormContext<QuizFormSchemaType>();

  if (isLoading) return <p>Loading available Users.</p>;

  if (availableUsers.length == 0) return <p>No users available.</p>;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-lg font-medium">Add Users to this quiz.</p>
      <FormField
        control={control}
        name="usersId"
        render={() => (
          <FormItem>
            {availableUsers.map((user) => (
              <FormField
                key={user.id}
                control={control}
                name="usersId"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={user.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(user.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, user.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== user.id,
                                  ),
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">{user.name}</FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
