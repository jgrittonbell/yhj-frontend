export const environment = {
  production: false,
  cognito: {
    clientId: '17maovn490jgjo4sahig56bs9b',
    domain: 'us-east-2qhnriu1dn.auth.us-east-2.amazoncognito.com',
    redirectUri: 'http://localhost:4200/auth-callback',
    responseType: 'code',
    scope: 'openid email',
  },
};
