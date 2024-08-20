export interface UserAuth {
    uuid: string,
    login: string,
    token: string,
}

export interface UserProfileSimple {
    img: string,
    name: string
}

export interface UserProfile {
    img: string,
    name: string,
    email: string,
}

export type UserRole = "manager" | "administrator"