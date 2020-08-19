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
export type PlaceRequestState = StandardRequestState;
export type SchoolRequestState = StandardRequestState;
export type TagRequestState = StandardRequestState;
export type UserRequestState = StandardRequestState;
export type DepartmentRequestState = StandardRequestState;
export type EventRequestState = StandardRequestState;
export type GroupRequestState = StandardRequestState & { follow: RequestState };

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
};

export type LocationRequestState = {
  fetch: RequestState;
  update: RequestState;
};
