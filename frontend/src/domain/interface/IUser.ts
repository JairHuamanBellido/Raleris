export interface IUser {
    id:string;
    username:string;
    colorNickname?:string;
}

export interface IUpdateUser extends IUser {}