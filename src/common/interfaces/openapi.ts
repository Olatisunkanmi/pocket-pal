type AppApiTag = {
  [key: string]: {
    path: string;
    description: string;
  };
};

export enum ApiTag {
  AUTH = 'Auth',
  OTP = 'OTPs',
  DRIVERS = 'Drivers',
  USER = 'Users',
  SPOTIFY = 'Spotify',
  APPLE = 'Apple',
  ADMIN = 'Admin',
}

export const AppApiTags: AppApiTag = {
  [ApiTag.AUTH]: { path: 'auth', description: 'All things authentication' },
  [ApiTag.USER]: { path: 'users', description: 'All things users' },
  [ApiTag.SPOTIFY]: { path: 'spotify', description: 'All things spotify' },
  [ApiTag.ADMIN]: { path: 'admin', description: 'All things Admin' },
};
