type FormInitialType<ErrorsType> = {
  status: "UNINITIALIZED";
  errors: ErrorsType;
  message: string;
};

type FormSuccessType = {
  status: "SUCCESS";
  message: string;
};

type FormFailType<ErrorsType> = {
  status: "FAILED";
  errors?: ErrorsType;
  message: string;
};

type LoginFormErrorsType = {
  email?: string;
  password?: string;
};

type SignUpFormErrorsType = {
  name?: string;
  email?: string;
  password?: string;
};

type NewVerificationErrorsType = {
  token?: string;
};

type ResetErrorsType = {
  email?: string;
};

type NewPasswordErrorsType = {
  email?: string;
};

type LoginFormSuccessType = {
  status: "SUCCESS";
  message: string;
  authType: "PASSWORD" | "PASSWORD_WITH_2FA";
};

type CreateNewUserFormErrorsType = {
  userName?: string;
  password?: string;
};

type DeleteUserFormErrorsType = {
  id?: string;
};

type LoginFormStatusType =
  | FormInitialType<LoginFormErrorsType>
  | LoginFormSuccessType
  | FormFailType<LoginFormErrorsType>;

type SignUpFormStatusType =
  | FormInitialType<SignUpFormErrorsType>
  | FormSuccessType
  | FormFailType<SignUpFormErrorsType>;

type NewVerificationStatusType =
  | FormInitialType<NewVerificationErrorsType>
  | FormSuccessType
  | FormFailType<NewVerificationErrorsType>;

type ResetPasswordStatusType =
  | FormInitialType<ResetErrorsType>
  | FormSuccessType
  | FormFailType<ResetErrorsType>;

type NewPasswordStatusType =
  | FormInitialType<NewPasswordErrorsType>
  | FormSuccessType
  | FormFailType<NewPasswordErrorsType>;

type CreateNewUserFormStatusType =
  | FormInitialType<CreateNewUserFormErrorsType>
  | FormSuccessType
  | FormFailType<CreateNewUserFormErrorsType>;

type DeleteUserFormStatusType =
  | FormInitialType<DeleteUserFormErrorsType>
  | FormSuccessType
  | FormFailType<DeleteUserFormErrorsType>;

type UserRole = "ADMIN" | "USER";

type AuthCardWrapperProps = {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
};
