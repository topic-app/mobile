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
  extraVerification?: boolean;
  noDeverify?: boolean;
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

type SchoolBase = {
  _id: string;
  name: string;
  shortName?: string;
  types: SchoolType[];
  cache?: {
    events?: number;
  };
};

export type SchoolPreload = SchoolBase & {
  preload: true;
  displayName?: string;
  address?: Address;
  image?: Image;
  departments?: DepartmentPreload[];
};

export type School = SchoolBase & {
  preload?: false;
  displayName?: string;
  address: Address;
  adminGroups?: GroupPreload[];
  image: Image;
  description: Content;
  departments: DepartmentPreload[]; // Also one in address but this one is for the admin group(s)
};

export type AnySchool = SchoolPreload | School;

type DepartmentBase = {
  _id: string;
  name: string;
  code: string;
  shortName?: string;
  type: 'region' | 'departement' | 'academie';
};

export type DepartmentPreload = DepartmentBase & {
  displayName: string;
};

export type Department = DepartmentBase & {
  displayName?: string;
  aliases: string[];
  adminGroups: GroupPreload[];
};

export type AnyDepartment = DepartmentPreload | Department;

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
    coordinates: [number, number];
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
    cache: {
      followers: number;
      following: number;
      groups: GroupPreload[];
    };
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
      following: number;
      groups: GroupPreload[];
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
  _id?: string;
  permission: string; // might be an enum in the future
  scope: {
    self?: boolean;
    everywhere?: boolean;
    global?: boolean;
    groups?: string[];
    schools?: string[];
    departments?: string[];
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
  description: string;
  expiry: {
    permanent: boolean;
    expires?: string;
  };
};

type GroupBase = {
  _id: string;
  displayName: string;
  parent?: GroupPreload | null;
  name: string;
  official?: boolean;
  type: string;
  avatar?: Avatar;
  summary?: string;
  shortName?: string;
  cache: {
    followers?: number | null;
    members?: number | null;
    subgroups?: GroupPreload[];
  };
};

// Any group takes any valid group and ignores value of preload
export type AnyGroup = GroupBase;

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
  legal?: {
    name?: string;
    id?: string;
    admin?: string;
    address?: string;
    email?: string;
    website?: string;
    extra?: string;
  };
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
  opinion?: boolean;
  cache?: {
    likes?: number;
    views?: number;
  };
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

export type AnyArticle = ArticlePreload | Article;

export type ArticleVerification = Article & {
  verification: Verification;
};

// Event Types
export type ProgramEntry = {
  _id: string;
  title: string;
  duration: {
    start: string | Date;
    end: string | Date;
  };
  description?: Content;
  image?: Image;
  address?: Address | undefined;
};

export type EventPlace =
  | { _id: string; type: 'place'; associatedPlace: PlacePreload }
  | { _id: string; type: 'school'; associatedSchool: SchoolPreload }
  | { _id: string; type: 'standalone'; address: Address }
  | { _id: string; type: 'online'; link: string };

type EventMessageBase = {
  date: string;
  content: {
    parser: 'plaintext' | 'markdown';
    data: string;
  };
  important: boolean;
  _id: string;
};

export type EventMessage = EventMessageBase &
  (
    | {
        type: 'system';
        group: null;
      }
    | {
        type: 'high' | 'medium' | 'low';
        group: GroupPreload;
      }
  );

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
  cache?: {
    likes?: number;
    views?: number;
  };
};

// AnyEvent means anything that implements EventBase can match it
// meaning you won't get any { preload: ... } errors if you give
// an Event to a component that accepts AnyEvent
export type AnyEvent = EventBase;

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
  messages: EventMessage[];
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

export namespace MapLocation {
  type Base = {
    type: 'Feature';
    id: string;
    geometry: {
      type: 'Point';
      coordinates: [number, number];
    };
  };

  export type PointDataType = 'school' | 'place' | 'event';

  export type Point<T extends PointDataType = PointDataType> = Base & {
    properties: {
      dataType: T;
      _id: string;
      name: string;
      events: T extends 'school' ? number : never;
    };
  };

  export type Cluster = Base & {
    properties: {
      dataType: 'cluster';
      cluster: true;
      cluster_id: number;
      point_count: number;
      point_count_abbreviated: number;
    };
  };

  export type Element = Point | Cluster;

  export type FullLocation = {
    id: string;
    name: string;
    shortName?: string;
    icon: string;
    description: string;
    detail: string;
    type: PointDataType;
    addresses: string[];
  };
}

export type Publisher = {
  _id?: string; // Note: Not really useful
  type: 'user' | 'group';
  user?: UserPreload;
  group?: GroupPreload;
};

export type CommentReply = {
  _id: string;
  date: string;
  publisher: Publisher;
  content: Content;
};

// Comment Types
export type Comment = {
  _id: string;
  date: string;
  publisher: Publisher;
  content: Content;
  parentType: 'article' | 'event' | 'place' | 'comment';
  parent: string;
  cache?: {
    replies?: CommentReply[];
  };
};

type MyInfo = {
  _id: string;
  comments: Comment[];
  liked: boolean;
};
export type ArticleMyInfo = MyInfo;
export type EventMyInfo = MyInfo;

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

export type ModerationTypes = 'unverified' | 'extra' | 'reported' | 'deverified';

export type Notifications = {
  _id: string;
  date: Date;
  priority?: 'urgent' | 'high' | 'medium' | 'low';
  content: {
    title: string;
    description: string;
    icon: string;
    color: string;
  };
  actions: {
    name: string;
    important: boolean;
    action: {
      type: string;
      data: string;
    };
  };
};
