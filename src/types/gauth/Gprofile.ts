
export interface Gprofile {
  provider: string;
  sub: string;
  id: string;
  displayName: string;
  name: { givenName: string; familyName: string };
  given_name: string;
  family_name: string;
  email_verified: boolean;
  verified: boolean;
  language: string;
  email: string;
  emails: Array<{ value: string; type: string }>;

  photos: Array<{value: string; type: string;}>;
  picture: string;
  _raw: string;
  _json: {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    locale: string;
  };
}