export type RequestState = {
  success: boolean | null;
  error: null | {
    value: string;
    message: string;
    extraMessage: string;
  };
  loading: boolean;
};

export type RequestStateComplex = RequestState & {
  loading: {
    initial: boolean;
    next: boolean;
    refresh?: boolean;
  };
};

export type StandardRequestState = {
  list: RequestStateComplex;
  search?: RequestStateComplex;
  info: RequestState;
  report?: RequestState;
  add?: RequestState;
  verification_list?: RequestStateComplex;
  verification_approve?: RequestState;
};

export type ArticleRequestState = StandardRequestState;
export type PetitionRequestState = StandardRequestState;
export type PlaceRequestState = StandardRequestState & { near: RequestStateComplex };
export type SchoolRequestState = StandardRequestState & { near: RequestStateComplex };
export type TagRequestState = StandardRequestState;
export type UserRequestState = StandardRequestState;
export type DepartmentRequestState = StandardRequestState;
export type EventRequestState = StandardRequestState;
export type GroupRequestState = StandardRequestState & {
  follow: RequestState;
  member_add: RequestState;
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
};

export type LocationRequestState = {
  fetch: RequestState;
  update: RequestState;
};
