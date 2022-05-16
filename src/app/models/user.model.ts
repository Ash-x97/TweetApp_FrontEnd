export interface User{
    id?:string;
    firstName:string;
    lastName:string;
    email:string;
    loginId:string;
    contactNumber:string;
    password:string;
    confirmPassword:string;
    isMailConfirmed?:boolean;
    avatar?:any;
    otp?:OTP;
    notifications?:CustomNotification[];
}

interface OTP{
    otpValue:string;
    token:string;
}

export interface CustomNotification{
    message:string;
    isSeen:boolean;
}