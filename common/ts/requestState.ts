export type RequestState = {
  success: boolean | null;
  error: null | {
    value: string;
    message: string;
    extraMessage: string;
  };
  loading:
    | {
        initial: boolean;
        next: boolean;
        refresh?: boolean;
      }
    | boolean;
};

export type StandardRequestState = {
  list: RequestState;
  search?: RequestState;
  info: RequestState;
  report?: RequestState;
  add?: RequestState;
  verification_list?: RequestState;
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
  list: RequestState;
  search: RequestState;
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
