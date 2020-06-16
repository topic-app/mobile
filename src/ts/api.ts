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
 */

// Common types
export type Content = {
  parser: 'plaintext' | 'markdown';
  data: string;
};

export type TagPreload = {
  _id: string;
  displayName: string;
  color: string;
};

export type Tag = {
  _id: string;
  name: string;
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
  shortName?: string;
  displayName: string;
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
  displayName: string;
  shortName?: string;
  type: 'region' | 'department' | 'academie';
};

export type Department = {
  _id: string;
  name: string;
  shortName?: string;
  aliases: string[];
  code: string; // zipcode
  type: 'region' | 'department' | 'academie';
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

// User types
export type Avatar = {
  type: 'gradient' | 'color';
  gradient?: {
    start: string;
    end: string;
    angle: number;
  };
  color?: string;
};

export type UserPreload = {
  _id: string;
  displayName: string;
  info: {
    username: string;
    avatar: Avatar;
  };
};

export type User = {
  _id: string;
  name: string;
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
      events: Event[];
    };
    location: Location;
    description: string;
    cache: {
      followers: number;
    };
  };
};

export type Account = User & {
  sensitiveData: {
    email: string;
  };
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
    schools: string[];
    departments: string[];
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
  role: GroupRole;
  secondaryRoles: GroupRole[];
  expiry: {
    permanent: boolean;
    expires?: string;
  };
};

export type GroupPreload = {
  _id: string;
  displayName: string;
  image: Image;
};

export type Group = {
  _id: string;
  name: string;
  type: string; // could be an enum in the future
  image: Image;
  shortName?: string;
  handle: string;
  aliases: string;
  summary: string;
  description: string;
  location: Location;
  permissions: GroupRolePermission[]; // Not sure how this works
  roles: GroupRole[];
  members: GroupMember[];
  cache: {
    followers: number;
    members: number;
  };
  tags: TagPreload[];
};

// Article Types
export type ArticlePreload = {
  _id: string;
  title: string;
  date: string;
  summary: string;
  image: Image;
  author: AuthorPreload;
  group: GroupPreload;
  location: Location;
  tags: TagPreload[];
};

export type Article = ArticlePreload & {
  content: Content;
  preferences: {
    comments: boolean;
  };
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
  duration: Duration[];
  places: EventPlace[];
  location: Location; // why exactly is there places AND locations?
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

// Place Types (used for Explorer)
type PlaceType = 'cultural' | 'education' | 'history' | 'tourism' | 'club' | 'other';

export type PlacePreload = {
  _id: string;
  displayName: string;
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

export type PetitionPreload = {
  _id: string;
  title: string;
  summary: string;
  type: 'goal' | 'sign' | 'opinion' | 'multiple';
  status: 'open' | 'waiting' | 'answered' | 'closed';
  duration: Duration;
  location: Location;
  publisher: Publisher;
  tags: TagPreload[];
  cache: {
    multiple?: { title: string; votes: string }[];
    double?: {
      for: number;
      against: number;
    };
    signatures?: number;
    goals?: number[];
    followers: number;
  };
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
