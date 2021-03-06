type RequestStateBase = {
  success: boolean | null;
  error:
    | null
    | boolean
    | {
        value: string;
        message: string;
        extraMessage: string;
      };
};

export type RequestState = RequestStateBase & {
  loading: boolean;
};

export type RequestStateComplex = RequestStateBase & {
  loading: {
    initial: boolean;
    next?: boolean;
    refresh?: boolean;
  };
};

export type StandardRequestState = {
  list: RequestStateComplex;
  search?: RequestStateComplex;
  info: RequestState;
  my?: RequestState;
  like?: RequestState;
  report: RequestState;
  add?: RequestState;
  modify?: RequestState;
  verification_list?: RequestStateComplex;
  verification_approve?: RequestState;
  verification_deverify?: RequestState;
  following?: RequestStateComplex;
  delete?: RequestState;
};

export type ArticleRequestState = StandardRequestState;
export type PlaceRequestState = StandardRequestState & {
  near: RequestStateComplex;
  map: RequestState;
};
export type SchoolRequestState = StandardRequestState & { near: RequestStateComplex };
export type TagRequestState = StandardRequestState;
export type UserRequestState = StandardRequestState & { follow: RequestState };
export type DepartmentRequestState = StandardRequestState;
export type EventRequestState = StandardRequestState & {
  messages_add: RequestState;
  messages_delete: RequestState;
};
export type GroupRequestState = StandardRequestState & {
  follow: RequestState;
  member_add: RequestState;
  member_modify: RequestState;
  member_delete: RequestState;
  member_accept: RequestState;
  member_reject: RequestState;
  member_leave: RequestState;
  modify: RequestState;
  templates: RequestStateComplex;
  verification_delete: RequestState;
};

export type LegalRequestState = {
  conditions: RequestState;
  confidentialite: RequestState;
  mentions: RequestState;
};

export type CommentRequestState = {
  list: RequestStateComplex;
  verification_list: RequestStateComplex;
  search: RequestStateComplex;
  add: RequestState;
  report: RequestState;
};

export type AccountRequestState = {
  login: RequestState & { incorrect: boolean | null };
  register: RequestState;
  check: RequestState;
  fetchGroups: RequestState;
  fetchAccount: RequestState;
  fetchWaitingGroups: RequestState; 
  fetchEmail: RequestState;
  updateProfile: RequestState;
  updateToken: RequestState;
  export: RequestState;
  delete: RequestState;
  passwordRequest: RequestState;
  passwordReset: RequestState;
  resend: RequestState;
  notifications: RequestState;
};

export type LocationRequestState = {
  fetch: RequestState;
  update: RequestState;
};

export type LinkingRequestState = {
  emailChange: RequestState;
  emailVerify: RequestState;
  accountDelete: RequestState;
  resetPassword: RequestState;
  feedback: RequestState;
};
export type UploadRequestState = {
  upload: RequestState;
  permission: RequestState;
};
