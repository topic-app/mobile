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
  report: RequestState;
  add?: RequestState;
  verification_list?: RequestStateComplex;
  verification_approve?: RequestState;
  following?: RequestStateComplex;
  delete?: RequestState;
};

export type ArticleRequestState = StandardRequestState;
export type PetitionRequestState = StandardRequestState;
export type PlaceRequestState = StandardRequestState & { near: RequestStateComplex };
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
};

export type LegalRequestState = {
  conditions: RequestState;
  confidentialite: RequestState;
  mentions: RequestState;
};

export type CommentRequestState = {
  list: RequestStateComplex;
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
  export: RequestState;
  delete: RequestState;
};

export type LocationRequestState = {
  fetch: RequestState;
  update: RequestState;
};

export type LinkingRequestState = {
  emailChange: RequestState;
  emailVerify: RequestState;
  accountDelete: RequestState;
};
export type UploadRequestState = {
  upload: RequestState;
  permission: RequestState;
};
