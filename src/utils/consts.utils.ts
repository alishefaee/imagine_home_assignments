export const Code = {
    OK: { msgCode: 200,
        mes: 'عملیات موفقیت آمیز بود',
        devMes: 'عملیات موفقیت آمیز بود',
        status: 200
    },
    CREATED: {
        msgCode: 201,
        mes: 'عملیات موفقیت آمیز بود',
        status: 201
    },
    IS_LOGIN: { msgCode: 202,
        mes: 'شما لاگین هستید',
        status: 202
    },
    UNAUTHORIZED: {
        msgCode: 40101,
        mes: 'عدم دسترسی',
        status: 401
    },
    ACCESS_TOKEN_NOT_SET: {
        msgCode: 40105,
        mes: 'عدم احراز هویت',
        devMes: 'access token is not set',
        status: 401
    },
    ACCESS_TOKEN_EXPIRED: {
        msgCode: 40106,
        mes: 'عدم احراز هویت',
        devMes: 'access token is expired',
        status: 401
    },
    ACCESS_TOKEN_INVALID: {
        msgCode: 40107,
        mes: 'عدم احراز هویت',
        devMes: 'access token is invalid',
        status: 401
    },
    TOKEN_EXPIRED: {
        msgCode: 40108,
        mes: 'عدم احراز هویت',
        devMes: 'token is expired',
        status: 401
    },
    AUTHENTICATION_FAILED: {
        msgCode: 40109,
        mes: 'عدم احراز هویت',
        devMes: 'عدم احراز هویت',
        status: 401
    },
    USER_NOT_ADMIN: {
        msgCode: 40110,
        mes: 'عدم دسترسی',
        devMes: 'user must have admin privilege',
        status: 401
    },
    USER_NOT_FOUND: {
        msgCode: 40402,
        mes: 'کاربر یافت نشد',
        status: 404
    },
    ROUTE_NOT_FOUND: {
        msgCode: 40403,
        mes: 'route not found',
        status: 404
    },
    NO_PRODUCT: {
        msgCode: 40404,
        mes: 'محصولی وجود ندارد',
        status: 404
    },
    NO_ORDER: {
        msgCode: 40405,
        mes: 'سفارش وجود ندارد',
        status: 404
    },
    EMAIL_NOT_FOUND: {
        msgCode: 40406,
        mes: 'ایمیل یافت نشد',
        status: 404
    },
    DATA_NOT_FOUND: {
        msgCode: 40401,
        mes: 'داده یافت نشد',
        devMes: 'داده یافت نشد یا کاربر به این داده دسترسی ندارد',
        status: 404
    },
    INPUT_DATA_INVALID: {
        msgCode: 40601,
        mes: 'دیتای ورودی معتبر نیست',
        status: 406
    },
    PASSWORD_PATTERN_INVALID: {
        msgCode: 40602,
        mes: 'رمزعبور شامل ۸ کاراکتر انگلیسی شامل حداقل یک عدد و حداقل یک حرف باشد',
        status: 406
    },
    EMAIL_EXIST: {
        msgCode: 40603,
        mes: 'ایمیل تکراری است',
        status: 406
    },
    SIGN_UP_INVALID: {
        msgCode: 40604,
        mes: 'ثبتنام موفقیت آمیز نبود',
        status: 406
    },
    LOGIN_INVALID: {
        msgCode: 40605,
        mes: 'ورود موفقیت آمیز نبود',
        status: 406
    },
    PASSWORD_NOT_MATCH: {
        msgCode: 40606,
        mes: 'اطلاعات وارد شده صحیح نمیباشد',
        devMes: 'رمزعبور با تکرار آن مطابقت ندارد',
        status: 406
    },
    TOKEN_DOES_NOT_EXIST: {
        msgCode: 40607,
        mes: 'دیتای ورودی معتبر نیست',
        devMes: 'توکن وجود ندارد',
        status: 406
    },
    DATABASE_ERROR: {
        msgCode: 50003,
        mes: 'خطایی در سرور رخ داده است',
        devMes: 'خطایی در دیتابیس رخ داده است',
        status: 500
    },
    SERVER_ERROR: {
        msgCode: 50004,
        mes: 'خطایی در سرور رخ داده است',
        status: 500
    },
    ERROR_MAKING_TRANSACTION: {
        msgCode: 50006,
        mes: 'تراکنش انجام نشد',
        status: 500
    },

}

export enum UserType {
    USER= 'USER',
    ADMIN= 'ADMIN'
}

export enum RegisterType {
    BUILTIN= 'BUILTIN',
    GOOGLE= 'GOOGLE'
}

export enum OrderStatus {
    CANCELLED= 'CANCELLED',
    ACTIVE= 'ACTIVE',
    INACTIVE= 'INACTIVE'
}

export enum PaymentStatus {
    BEFORE_PAYMENT= 'BEFORE_PAYMENT',
    PENDING= 'PENDING',
    FAILED= 'FAILED',
    SUCCESSFUL= 'SUCCESSFUL'
}

export enum ProductType {
    SUBSCRIPTION= 'SUBSCRIPTION',
    WALLPAPER= 'WALLPAPER',
    CARD= 'CARD'
}
