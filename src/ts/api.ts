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

export type SchoolType = 'lycee' | 'college' | 'prepa' | 'other';

export type SchoolPreload = {
  _id: string;
  name: string;
  shortName?: string;
  displayName: string;
  address?: Address;
  types: SchoolType[];
  cache: {
    events?: number;
  };
  departments?: DepartmentPreload[];
};

export type School = {
  _id: string;
  shortName?: string;
  displayName?: string;
  name: string;
  types: SchoolType[];
  address: Address;
  adminGroups?: GroupPreload[];
  image: Image;
  description: Content;
  departments: DepartmentPreload[]; // Also one in address but this one is for the admin group(s)
  cache: {
    events?: number;
  };
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
  _id?: string; // Note: Not really useful
  image: string | null;
  thumbnails: {
    small?: boolean;
    medium?: boolean;
    large?: boolean;
  };
};

// Location types
export type Location = {
  _id?: string; // Note: Not really useful
  global: boolean;
  schools: SchoolPreload[];
  departments: DepartmentPreload[];
};

export type Address = {
  _id: string;
  shortName?: string;
  // coordinates: {
  //   lat: number;
  //   lon: number;
  // };
  geo: {
    type: 'Point';
    coordinates: number[];
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

export type Avatar =
  | {
      type: 'color';
      color: string;
      text: string;
    }
  | {
      type: 'gradient';
      gradient: {
        start: string;
        end: string;
        angle: number;
      };
      text: string;
    }
  | {
      type: 'image';
      image: Image;
    };

export type UserPreload = {
  preload: true;
  _id: string;
  displayName: string;
  info: {
    username: string;
    avatar?: Avatar;
    official?: boolean;
  };
  data?: {
    public?: boolean;
  };
};

export type User = {
  preload?: false;
  _id: string;
  name: string;
  displayName: string;
  info: {
    username: string;
    avatar: Avatar;
    joinDate: string;
    official?: boolean;
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

export type WaitingGroup = Group & {
  waitingMembership: { role: string; permanent: boolean; expiry: Date };
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

type GroupBase = {
  _id: string;
  displayName: string;
  name: string;
  official?: boolean;
  type: string;
  avatar?: Avatar;
  summary?: string;
  shortName?: string;
  cache: {
    followers?: number | null;
    members?: number | null;
  };
};

export type GroupPreload = GroupBase & {
  preload: true;
};

export type Group = GroupBase & {
  preload?: false;
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

export type GroupVerification = Group & {
  verification: Verification;
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
type ArticleBase = {
  _id: string;
  title: string;
  date: string;
  summary: string;
  image?: Image;
  authors: AuthorPreload[];
  group: GroupPreload;
  location: Location;
  tags: TagPreload[];
};
export type ArticlePreload = ArticleBase & {
  preload: true; // So we can check if article.preload to change type
};
export type ArticleVerificationPreload = ArticlePreload & {
  verification: Verification;
};

export type Article = ArticleBase & {
  preload?: false;
  content: Content;
  preferences: {
    comments: boolean;
  };
};

export type Article2 = Article;

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

export type EventPlace =
  | { _id: string; type: 'place'; associatedPlace: PlacePreload }
  | { _id: string; type: 'school'; associatedSchool: SchoolPreload }
  | { _id: string; type: 'standalone'; address: Address };

type EventBase = {
  _id: string;
  title: string;
  summary: string;
  image: Image;
  group: GroupPreload;
  authors: AuthorPreload[];
  tags: TagPreload[];
  duration: Duration;
  places: EventPlace[];
  location: Location; // why exactly is there places AND locations?
};
export type EventPreload = EventBase & {
  preload: true;
};
export type EventVerificationPreload = EventPreload & {
  verification: Verification;
};

export type Event = EventBase & {
  preload?: false;
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
export type PlaceType = 'cultural' | 'history' | 'tourism' | 'club' | 'other';

export type PlacePreload = {
  _id: string;
  name: string;
  displayName: string;
  types: PlaceType[];
  summary: string;
  address: Address;
};

export type Place = PlacePreload & {
  shortName?: string;
  description: Content;
  group: GroupPreload;
  tags: TagPreload[];
  image: Image;
  location: Location;
};

export namespace ExplorerLocation {
  export type LocationTypes = 'place' | 'school' | 'event' | 'secret' | 'collection';
  export type Place = { type: 'place'; data: PlacePreload };
  export type School = { type: 'school'; data: SchoolPreload & { address: Address } };
  export type Event = { type: 'event'; data: EventPreload };
  export type Secret = { type: 'secret'; data: PlacePreload };
  export type Collection = {
    type: 'collection';
    data: {
      number: number;
      geo: { type: 'Point'; coordinates: [number, number] };
    };
  };

  export type Location =
    | ExplorerLocation.Place
    | ExplorerLocation.School
    | ExplorerLocation.Event
    | ExplorerLocation.Secret
    | ExplorerLocation.Collection;
}

// Petition Types
export type Publisher = {
  _id?: string; // Note: Not really useful
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
