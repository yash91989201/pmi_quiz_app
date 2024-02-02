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

type AdminLoginFormErrorsType = {
  email?: string;
  password?: string;
};

type UserLoginFormErrorsType = {
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

type UserLoginFormSuccessType = {
  status: "SUCCESS";
  message: string;
  authType: "PASSWORD" | "PASSWORD_WITH_2FA";
};

type AdminLoginFormSuccessType = {
  status: "SUCCESS";
  message: string;
  authType: "PASSWORD" | "PASSWORD_WITH_2FA";
};

type VerificationFormSuccessType = {
  status: "SUCCESS";
  message: string;
  role: UserRole;
};

type NewPasswordFormSuccessType = {
  status: "SUCCESS";
  message: string;
  role: UserRole;
};

type CreateNewUserFormErrorsType = {
  name?: string;
  password?: string;
};

type DeleteUserFormErrorsType = {
  id?: string;
};

type CreateQuizFormErrorsType = {
  message: string;
};

type DeleteQuizFormErrorsType = {
  message: string;
};

type UserQuizFormFailType = {
  message: string;
};

type StartUserQuizFormFailType = {
  message: string;
};

type AdminLoginFormStatusType =
  | FormInitialType<AdminLoginFormErrorsType>
  | AdminLoginFormSuccessType
  | FormFailType<AdminLoginFormErrorsType>;

type UserLoginFormStatusType =
  | FormInitialType<UserLoginFormErrorsType>
  | UserLoginFormSuccessType
  | FormFailType<UserLoginFormErrorsType>;

type SignUpFormStatusType =
  | FormInitialType<SignUpFormErrorsType>
  | FormSuccessType
  | FormFailType<SignUpFormErrorsType>;

type NewVerificationStatusType =
  | FormInitialType<NewVerificationErrorsType>
  | VerificationFormSuccessType
  | FormFailType<NewVerificationErrorsType>;

type ResetPasswordStatusType =
  | FormInitialType<ResetErrorsType>
  | FormSuccessType
  | FormFailType<ResetErrorsType>;

type NewPasswordStatusType =
  | FormInitialType<NewPasswordErrorsType>
  | NewPasswordFormSuccessType
  | FormFailType<NewPasswordErrorsType>;

type UpdateUserPartialSuccessType = {
  insert?: {
    status: "SUCCESS" | "FAILED";
    message: string;
  };
  update?: {
    status: "SUCCESS" | "FAILED";
    message: string;
  };
  delete?: {
    status: "SUCCESS" | "FAILED";
    message: string;
  };
};

type UpdateUserFormInitialType = {
  status: "UNINITIALIZED";
  user: UpdateUserPartialSuccessType;
  quizzes: UpdateUserPartialSuccessType;
};

type UpdateUserFormSuccessType = {
  status: "SUCCESS";
  message: string;
  user: UpdateUserPartialSuccessType;
  quizzes: UpdateUserPartialSuccessType;
};

type UpdateUserFormFailType = {
  status: "FAILED";
  message: string;
};

type UpdateUserFormStatusType =
  | UpdateUserFormInitialType
  | UpdateUserFormSuccessType
  | UpdateUserFormFailType;

type UserFormStatusType =
  | FormInitialType<CreateNewUserFormErrorsType>
  | FormSuccessType
  | FormFailType<CreateNewUserFormErrorsType>;

type DeleteUserFormStatusType =
  | FormInitialType<DeleteUserFormErrorsType>
  | FormSuccessType
  | FormFailType<DeleteUserFormErrorsType>;

type QuizFormStatusType =
  | FormInitialType<CreateQuizFormErrorsType>
  | FormSuccessType
  | FormFailType<CreateQuizFormErrorsType>;

type FieldOperationPartialSuccessType = {
  insert?: {
    status: "SUCCESS" | "FAILED";
    message: string;
  };
  update?: {
    status: "SUCCESS" | "FAILED";
    message: string;
  };
  delete?: {
    status: "SUCCESS" | "FAILED";
    message: string;
  };
};

type UpdateQuizFormPartialSuccessType = {
  quiz?: FieldOperationPartialSuccessType;
  questions?: FieldOperationPartialSuccessType;
  options?: FieldOperationPartialSuccessType;
  users?: FieldOperationPartialSuccessType;
};

type UpdateFormInitialType = {
  status: "UNINITIALIZED";
  message: string;
  fields: UpdateQuizFormPartialSuccessType;
};

type UpdateQuizFormFailType = {
  status: "FAILED";
  message: string;
};

type UpdateQuizFormSuccessType = {
  status: "SUCCESS";
  message: string;
  fields: UpdateQuizFormPartialSuccessType;
};

type UpdateQuizFormStatusType =
  | FormInitialType<UpdateQuizFormPartialSuccessType>
  | UpdateQuizFormSuccessType
  | FormFailType<UpdateQuizFormPartialSuccessType>;

type DeleteQuizFormStatusType =
  | FormInitialType<DeleteQuizFormErrorsType>
  | FormSuccessType
  | FormFailType<DeleteQuizFormErrorsType>;

type UserQuizFormStatusType =
  | FormInitialType<UserQuizFormFailType>
  | FormSuccessType
  | FormFailType<UserQuizFormFailType>;

type UserQuizDeleteFormErrorsType = {
  message: string;
};

type UserQuizResetFormErrorsType = {
  message: string;
};

type UserQuizDeleteFormStatusType =
  | FormInitialType<UserQuizDeleteFormErrorsType>
  | FormSuccessType
  | FormFailType<UserQuizDeleteFormErrorsType>;

type UserQuizResetFormStatusType =
  | FormInitialType<UserQuizResetFormErrorsType>
  | FormSuccessType
  | FormFailType<UserQuizResetFormErrorsType>;

type UserRole = "ADMIN" | "USER";

type UserQuizStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

type StartUserQuizFormStatusType =
  | FormInitialType<StartUserQuizFormFailType>
  | FormSuccessType
  | FormFailType<StartUserQuizFormFailType>;

type AuthCardWrapperProps = {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel?: string;
  backButtonHref?: string;
};

type PaginationResult = {
  current: number;
  prev: number;
  next: number;
  items: string[];
};

type PaginationParams = {
  current: number;
  max: number;
};
