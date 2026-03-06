export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface LoginChallengeResponse {
  challenge_token: string;
  requires_2fa: true;
}

export type LoginResult = LoginResponse | LoginChallengeResponse;

export function isLoginChallenge(result: LoginResult): result is LoginChallengeResponse {
  return 'requires_2fa' in result && result.requires_2fa === true;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  roles: string[];
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface LogoutRequest {
  refresh_token: string;
  access_token?: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  email: string;
  code: string;
  new_password: string;
}

export interface TwoFactorSetupResponse {
  secret: string;
  qr_code: string;
  uri: string;
}

export interface TwoFactorVerifySetupRequest {
  user_id: string;
  code: string;
}

export interface TwoFactorVerifySetupResponse {
  message: string;
  backup_codes: string[];
}

export interface TwoFactorChallengeRequest {
  challenge_token: string;
  code: string;
}

export interface TwoFactorEmailCodeRequest {
  challenge_token: string;
}

export interface TwoFactorDisableRequest {
  user_id: string;
  password: string;
}

export interface BackupCodesResponse {
  remaining_backup_codes: number;
}

export interface RegenerateBackupCodesResponse {
  message: string;
  backup_codes: string[];
}

export interface Session {
  id: string;
  ip_address: string;
  user_agent: string;
  device_info: string;
  is_trusted: boolean;
  created_at: string;
}

export interface OAuthAuthorizeResponse {
  authorization_url: string;
  state: string;
  provider: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  roles?: string[];
  exp: number;
  iat: number;
}

export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  roles: string[];
}

export interface ApiMessage {
  message: string;
}

/** Request body for POST /auth/validate */
export interface ValidateTokenRequest {
  token: string;
}

/** Response from POST /auth/validate — use for route guards and UI (user_id, email, role, roles) */
export interface ValidateTokenResponse {
  user_id: string;
  email: string;
  role?: string;
  roles?: string[];
}
