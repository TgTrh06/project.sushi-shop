export interface UpdateProfileInput {
  username?: string;
  avatar_id?: string;
  phoneNumber?: number;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
