/**
 * File containing types for items fetched from the api.
 *
 * Format:
 * - For items with incomplete data (e.g. Articles in Article List), use `ItemPreload` with
 *   `Item` as the corresponding item.
 *
 *   e.g. `ArticlePreload` or `TagPreload`
 *
 * - For items with complete data (e.g. Articles in Article Display), use `Item` as the type.
 *
 *   e.g. `Article` or `Event`
 *
 * Note: Don't import this file through `common/`, use `import { ... } from '@ts/types'` instead.
 */

import { AccountRequestState } from './requestState'; // Account stuff should probably go in redux.ts but too much risk of breakage

// Common types
export type Content = {
  parser: 'plaintext' | 'markdown';
  data: string;
};

export type Verification = {
  verified: boolean;
  users?: string[];
  bot: {
    score: number;
    flags: string[];
  };
  reports?: { user: UserPreload; date: Date; reason: string }[];
  data?: {
    name?: string;
    id?: string;
    extra?: string;
  };
};

export type TagPreload = {
  _id: string;
  name?: string;
  displayName: string;
  color: string;
};

export type Tag = {
  _id: string;
  name: string;
  displayName: string;
  color: string;
  summary: string;
};

export type Duration = {
  start: string;
  end: string;
};

type SchoolType = 'lycee' | 'college' | 'prepa' | 'other';

export type SchoolPreload = {
  _id: string;
  name: string;
  shortName?: string;
  displayName: string;
  address?: Address;
  types: SchoolType[];
};

export type School = {
  _id: string;
  shortName?: string;
  name: string;
  types: SchoolType[];
  address: Address;
  adminGroups?: GroupPreload[];
  image: Image;
  description: Content;
  departments: DepartmentPreload[]; // Also one in address but this one is for the admin group(s)
};

export type DepartmentPreload = {
  _id: string;
  name: string;
  code: string;
  displayName: string;
  shortName?: string;
  type: 'region' | 'departement' | 'academie';
};

export type Department = {
  _id: string;
  name: string;
  shortName?: string;
  aliases: string[];
  displayName?: string;
  code: string; // zipcode
  type: 'region' | 'departement' | 'academie';
  adminGroups: GroupPreload[];
};

export type Image = {
  _id: string; // Note: Not really useful
  image: string;
  thumbnails: {
    small: boolean;
    medium: boolean;
    large: boolean;
  };
};

// Location types
export type Location = {
  _id: string; // Note: Not really useful
  global: boolean;
  schools: SchoolPreload[];
  departments: DepartmentPreload[];
};

export type Address = {
  _id: string;
  shortName?: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  address: {
    number: string;
    street: string;
    extra: string;
    city: string;
    code: string;
  };
  departments: DepartmentPreload[];
};

export type Avatar = {
  type: 'color' | 'gradient' | 'image';
  color: string;
  gradient: {
    start: string;
    end: string;
    angle: number;
  };
  text: string;
  image: Image;
};

export type UserPreload = {
  _id: string;
  displayName: string;
  info: {
    username: string;
    avatar?: Avatar;
  };
};

export type User = {
  _id: string;
  name: string;
  displayName: string;
  info: {
    username: string;
    avatar: Avatar;
    joinDate: string;
  };
  data: {
    public: boolean;
    firstName: string;
    lastName: string;
    following: {
      groups: GroupPreload[];
      users: UserPreload[];
    };
    location: Location;
    description: string;
    cache: {
      followers: number;
    };
  };
};

export type AccountCreationData = {
  avatar?: Avatar;
  username?: string;
  email?: string;
  password?: string;
  global?: boolean;
  schools?: string[];
  departments?: string[];
  accountType?: 'public' | 'private';
  firstName?: string;
  lastName?: string;
};

export type AccountPermission = GroupRolePermission & { group: string };

export type AccountUser = User & {
  sensitiveData: {
    email: string;
  };
};

export type AccountInfo = {
  accountId: string;
  accountToken: string;
  accountTokenExpiry: string;
  user: AccountUser;
};

export type WaitingGroup = Group & {
  waitingMembership: { role: string; permanent: boolean; expiry: Date };
};

export type Account =
  | {
      loggedIn: true;
      accountInfo: AccountInfo;
      creationData: AccountCreationData;
      state: AccountRequestState;
      groups: GroupWithMembership[];
      permissions: AccountPermission[];
      waitingGroups: WaitingGroup[];
    }
  | {
      loggedIn: false;
      accountInfo: null;
      creationData: AccountCreationData;
      state: AccountRequestState;
    };

export type AuthorPreload = UserPreload;

export type MemberPreload = UserPreload;

// Group Types
export type GroupRolePermission = {
  _id: string;
  permission: string; // might be an enum in the future
  scope: {
    self: boolean;
    everywhere: boolean;
    global: boolean;
    groups: string[];
    schools: SchoolPreload[];
    departments: DepartmentPreload[];
  };
};

export type GroupRole = {
  _id: string;
  name: string;
  admin: boolean;
  legalAdmin: boolean;
  primary: boolean;
  hierarchy: number;
  permissions: GroupRolePermission[];
};

export type GroupMember = {
  _id: string; // Note: Not really useful
  user: UserPreload;
  role: string;
  secondaryRoles: string[];
  expiry: {
    permanent: boolean;
    expires?: string;
  };
};

export type GroupPreload = {
  _id: string;
  displayName: string;
  name: string;
  official?: boolean;
  type: string;
  avatar?: Avatar;
  summary?: string;
  cache: {
    followers?: number | null;
    members?: number | null;
  };
};

export type Group = GroupPreload & {
  shortName?: string;
  handle: string;
  aliases: string;
  description: {
    data: string;
    parser: 'markdown' | 'plaintext';
  };
  location: Location;
  permissions: GroupRolePermission[]; // Not sure how this works
  roles: GroupRole[];
  members: GroupMember[];
  tags: TagPreload[];
};

export type GroupWithMembership = Group & {
  membership: GroupMember;
};

export type GroupTemplate = {
  name: string;
  type: string;
  summary: string;
  description: string;
  permissions: GroupRolePermission[];
  roles: GroupRole[];
};

// Article Types
export type ArticlePreload = {
  _id: string;
  title: string;
  date: string;
  summary: string;
  image?: Image;
  preload?: boolean;
  authors: AuthorPreload[];
  group: GroupPreload;
  location: Location;
  tags: TagPreload[];
};
export type ArticleVerificationPreload = ArticlePreload & {
  verification: Verification;
};

export type Article = ArticlePreload & {
  content: Content;
  preferences: {
    comments: boolean;
  };
};
export type ArticleVerification = Article & {
  verification: Verification;
};

// Event Types
export type ProgramEntry = {
  _id: string;
  title: string;
  duration: Duration;
  image?: Image;
  address: Address;
};

export type EventPlace = {
  _id: string;
  type: 'place' | 'school' | 'standalone';
  associatedSchool?: SchoolPreload;
  associatedPlace?: DepartmentPreload;
  address?: Address;
};

export type EventPreload = {
  _id: string;
  title: string;
  summary: string;
  image: Image;
  group: GroupPreload;
  author: AuthorPreload;
  tags: TagPreload[];
  duration: Duration;
  places: EventPlace[];
  location: Location; // why exactly is there places AND locations?
};
export type EventVerificationPreload = EventPreload & {
  verification: Verification;
};

export type Event = EventPreload & {
  description: Content;
  members: MemberPreload[];
  program: ProgramEntry[];
  contact: {
    email: string;
    phone: string;
    other: { key: string; value: string }[];
  };
  preferences: {
    comments: boolean;
  };
  cache: {
    followers: number;
  };
};
export type EventVerification = Event & {
  verification: Verification;
};

// Place Types (used for Explorer)
type PlaceType = 'cultural' | 'education' | 'history' | 'tourism' | 'club' | 'other';

export type PlacePreload = {
  _id: string;
  name: string;
  types: PlaceType[];
  summary: string;
  address: Address;
};

export type Place = {
  _id: string;
  name: string;
  shortName?: string;
  types: PlaceType[];
  summary: string;
  description: Content;
  group: GroupPreload;
  tags: TagPreload[];
  image: Image;
  address: Address;
  location: Location;
};

// Petition Types
export type Publisher = {
  _id: string; // Note: Not really useful
  type: 'user' | 'group';
  user?: UserPreload;
  group?: GroupPreload;
};

export type PetitionMessage = {
  _id: string;
  type: 'answer' | 'group' | 'publisher' | 'system' | 'closure';
  date: string;
  publisher: Publisher;
  content: Content;
  important: boolean;
};

export type PetitionStatus = 'open' | 'waiting' | 'answered' | 'closed';

export type PetitionVoteDataMultiple = {
  multiple: { title: string; votes: number }[];
};
export type PetitionVoteDataDouble = {
  double: {
    for: number;
    against: number;
  };
};
export type PetitionVoteDataGoal = {
  signatures: number;
  goals: number[];
};
export type PetitionVoteDataNoGoal = {
  signatures: number;
};

export type PetitionVoteData = {
  // Also change types above when changing PetitionVoteData
  multiple?: { title: string; votes: number }[];
  double?: {
    for: number;
    against: number;
  };
  signatures?: number;
  goals?: number[];
};

export type PetitionPreload = {
  _id: string;
  title: string;
  summary: string;
  type: 'goal' | 'sign' | 'opinion' | 'multiple';
  status: PetitionStatus;
  duration: Duration;
  location: Location;
  publisher: Publisher;
  tags: TagPreload[];
  cache: PetitionVoteData & { followers: number };
};

export type Petition = PetitionPreload & {
  image: Image;
  description: Content;
  messages: PetitionMessage[];
  preferences: {
    comments: boolean;
  };
};

// Comment Types
export type Comment = {
  _id: string;
  date: string;
  publisher: Publisher;
  content: Content;
  parentType: 'article' | 'event' | 'petition' | 'place' | 'comment';
  parent: string;
};

// Misc Types
export type Error = {
  reason: string;
  error: {
    response: {
      status: number;
      data?: {
        error: {
          value: string;
        };
      };
    };
  };
};

export type Item =
  | Article
  | Comment
  | Event
  | Petition
  | Group
  | User
  | Place
  | Tag
  | Department
  | School;
