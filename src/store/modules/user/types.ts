export type RoleType = '' | '*' | 'admin' | 'user';

export interface UserState {
  username?: string;
  avatar?: string;
  email?: string;
  remark?: string;
  nick_name?: string;
  phone?: string;
  create_at?: string;
  id?: string;
  certification?: number;
  role: RoleType;
}
