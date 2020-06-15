// Common types used throughout the project go here
// If types.ts gets too full, seperate into multiple files and export through types.ts

// Common types
export type Social = {
  twitter: string;
  facebook: string;
};

export type Tag = {
  _id: string;
  displayName: string;
  color: string;
};

export type Content = {
  parser: 'plaintext' | 'markdown';
  data: string;
};

export type Duration = {
  start: string;
  end: string;
};

export type School = {
  _id: string;
  shortName?: string;
  displayName: string;
  type: 'lycee' | 'college' | 'prepa' | 'other';
};

export type Image = {
  image: string;
  thumbnails: {
    small: boolean;
    medium: boolean;
    large: boolean;
  };
};

export type Department = School;

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

export type Place = {
  type: 'place' | 'school' | 'standalone';
  associatedSchool?: School;
  associatedPlace?: Department;
  address?: Address;
};

// User types
export type User = {
  _id: string;
  displayName: string;
};

export type AccountInfo = {
  _id: string;
  info: {
    joinDate: string;
    username: string;
  };
  data: {
    public: boolean;
    firstName?: string;
    lastName?: string;
    description?: string;
    following: {
      groups: string[];
      users: string[];
      events: string[];
    };
    location: Location;
    cache: {
      followers: number;
    };
    sensitiveData: {
      email: string;
    };
  };
};

export type Author = User;
export type Member = User;

// Group Types
export type Group = {
  _id: string;
  displayName: string;
  image: Image;
};

export type GroupInfo = {
  _id: string;
  name: string;
  summary: string;
  type: string; // could be an enum in the future
  image: Image;
  description: string;
  location: Location;
  cache: {
    followers: number;
    members: number;
  };
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
  tags: Tag[];
};

export type ArticleInfo = ArticleList & {
  content: Content;
};

// Event Types
export type EventEntry = {
  title: string;
  duration: Duration;
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
  places: Place[];
  cache: {
    followers: number;
  };
};

export type EventInfo = EventList & {
  content: Content;
  members: Member[];
  contact: {
    user: User;
    email: string;
    phone: string;
    social: Social;
    other: { key: string; value: string }[];
  };
};

// Explorer Types
export type ExplorerList = {
  _id: string;
  name: string;
  summary: string;
  type: 'event' | 'school' | 'museum';
  coordinated: {
    lat: number;
    lon: number;
  };
};

export type ExplorerInfo = {
  _id: string;
  name: string;
  summary: string;
  image: Image;
  type: 'event' | 'school' | 'museum';
  location: Address;
  content: Content;
};

// Petition Types
export type PetitionList = {
  _id: string;
  title: string;
  summary: string;
  type: 'goal' | 'sign' | 'opinion' | 'multiple';
  status: 'open' | 'waiting' | 'answered' | 'rejected';
  duration: Duration;
  location: Location;
  publisher: {
    type: 'user' | 'group';
    user?: User;
    group?: Group;
  };
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
  description: Content; // could change to content here
};
