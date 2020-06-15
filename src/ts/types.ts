// Common types used throughout the project go here
// If types.ts gets too full, seperate into multiple files and export through types.ts

// Common types
export type Content = {
  parser: 'plaintext' | 'markdown';
  data: string;
};

export type Tag = {
  _id: string;
  displayName: string;
  color: string;
};

export type TagInfo = {
  _id: string;
  name: string;
  color: string;
  description: Content;
};

export type Duration = {
  start: string;
  end: string;
};

type SchoolType = 'lycee' | 'college' | 'prepa' | 'other';

export type School = {
  _id: string;
  shortName?: string;
  displayName: string;
  types: SchoolType[];
};

export type SchoolInfo = {
  _id: string;
  shortName?: string;
  name: string;
  types: SchoolType[];
  address: Address;
  adminGroups?: Group[];
  image: Image;
  description: Content;
  departments: Department[]; // Also one in address but this one is for the admin group(s)
};

export type Department = {
  _id: string;
  displayName: string;
  shortName?: string;
  type: 'region' | 'department' | 'academie';
};

export type DepartmentInfo = {
  name: string;
  shortName?: string;
  aliases: string[];
  code: string; // zipcode
  type: 'region' | 'department' | 'academie';
  adminGroups: Group[];
};

export type Image = {
  image: string;
  thumbnails: {
    small: boolean;
    medium: boolean;
    large: boolean;
  };
};

// Location types
export type Location = {
  _id: string; // Note: completely useless, maybe someone could find a use for it
  global: boolean;
  schools: School[];
  departments: Department[];
};

export type Address = {
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
  departments: Department[];
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

export type User = {
  _id: string;
  displayName: string;
  info: {
    username: string;
    avatar: Avatar;
  };
};

export type UserInfo = {
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
      groups: Group[];
      users: User[];
      events: Event[];
    };
    location: Location;
    description: string;
    cache: {
      followers: number;
    };
  };
};

export type AccountInfo = UserInfo & {
  sensitiveData: {
    email: string;
  };
};

export type Author = User;
export type Member = User;

// Group Types
export type GroupRolePermission = {
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
  name: string;
  admin: boolean;
  legalAdmin: boolean;
  primary: boolean;
  hierarchy: number;
  permissions: GroupRolePermission[];
};

export type GroupMember = {
  user: string; // user id
  role: GroupRole; // role id
  secondaryRoles: GroupRole[];
  expiry: {
    permanent: boolean;
    expires?: string;
  };
};

export type Group = {
  _id: string;
  displayName: string;
  image: Image;
};

export type GroupInfo = {
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
  tags: Tag[];
};

// Article Types
export type ArticleList = {
  _id: string;
  title: string;
  date: string;
  summary: string;
  image: Image;
  author: Author;
  group: Group;
  location: Location;
  tags: Tag[];
};

export type ArticleInfo = ArticleList & {
  content: Content;
  preferences: {
    comments: boolean;
  };
};

// Event Types
export type ProgramEntry = {
  title: string;
  duration: Duration;
};

export type EventPlace = {
  type: 'place' | 'school' | 'standalone';
  associatedSchool?: School;
  associatedPlace?: Department;
  address?: Address;
};

export type EventList = {
  _id: string;
  title: string;
  summary: string;
  image: Image;
  group: Group;
  author: Author;
  tags: Tag[];
  duration: Duration[];
  places: EventPlace[];
  location: Location; // why exactly is there places AND locations?
};

export type EventInfo = EventList & {
  description: Content;
  members: Member[];
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

// Explorer Types
type PlaceType = 'cultural' | 'education' | 'history' | 'tourism' | 'club' | 'other';

export type Place = {
  _id: string;
  displayName: string;
  types: PlaceType[];
  summary: string;
  address: Address;
};

export type PlaceInfo = {
  _id: string;
  name: string;
  shortName?: string;
  types: PlaceType[];
  summary: string;
  description: Content;
  group: Group;
  tags: Tag[];
  image: Image;
  address: Address;
  location: Location;
};

// Petition Types
export type Publisher = {
  type: 'user' | 'group';
  user?: User;
  group?: Group;
};

export type PetitionMessage = {
  _id: string;
  type: 'answer' | 'group' | 'publisher' | 'system' | 'closure';
  date: string;
  publisher: Publisher;
  content: Content;
  important: boolean;
};

export type PetitionList = {
  _id: string;
  title: string;
  summary: string;
  type: 'goal' | 'sign' | 'opinion' | 'multiple';
  status: 'open' | 'waiting' | 'answered' | 'closed';
  duration: Duration;
  location: Location;
  publisher: Publisher;
  tags: Tag[];
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

export type PetitionInfo = PetitionList & {
  image: Image;
  description: Content;
  messages: PetitionMessage[];
  preferences: {
    comments: boolean;
  };
};

// TODO: comments
