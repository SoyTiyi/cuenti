export interface CreateUserDTO {
    auth0Id: string;
    email: string;
    name: string;
    picture: string;
    needsOnboarding: boolean;
    isActive: boolean;
}

export interface UserOnboardingDTO {
    name: string;
    lastname: string;
    profileImage: string;
}

export interface User {
    id: number,
    name: string,
    lastname: string,
    email: string,
    profileImage: string,
}