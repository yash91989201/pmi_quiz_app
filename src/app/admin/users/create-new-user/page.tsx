// CUSTOM COMPONENTS
import CreateNewUserForm from "@/components/admin/user/create-user-form";

export default function CreateNewUserPage() {
  return (
    <>
      <div className="flex flex-col gap-3">
        <h2 className="text-base  md:text-3xl">Create New User</h2>
        <CreateNewUserForm />
      </div>
    </>
  );
}
