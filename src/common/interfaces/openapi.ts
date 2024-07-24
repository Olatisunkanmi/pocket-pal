type AppApiTag = {
  [key: string]: {
    path: string;
    description: string;
  };
};

export enum ApiTag {
  AUTH = 'Auth',
  USER = 'Users',
}

export const AppApiTags: AppApiTag = {
  [ApiTag.AUTH]: { path: 'auth', description: 'All things authentication' },
  [ApiTag.USER]: { path: 'users', description: 'All things users' },
};
