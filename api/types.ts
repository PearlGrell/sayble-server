export type User = {
    id: string;
    firstName: string; 
    lastName: string;
    username : string;
    email: string;
    password: string;
    image : string;
    dob : string;
    otp : string;
    isVerified : number;
    isLoggedIn : number;
    salt : string;
    createdAt: string;
    updatedAt: string;
};

export type Validate = {
    email: string;
    first_name: string;
    last_name: string;
    dob: string;
};