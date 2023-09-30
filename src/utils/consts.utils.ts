export const Code = {
    OK: { msgCode: 200,
        mes: 'success',
        status: 200
    },
    CREATED: {
        msgCode: 201,
        mes: 'created',
        status: 201
    },
    IS_LOGIN: { msgCode: 202,
        mes: 'you are already logged in',
        status: 202
    },
    UNAUTHORIZED: {
        msgCode: 40101,
        mes: 'unauthorized',
        status: 401
    },
    ACCESS_TOKEN_NOT_SET: {
        msgCode: 40105,
        mes: 'access token is not set',
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
        mes: 'access token is invalid',
        status: 401
    },
    TOKEN_EXPIRED: {
        msgCode: 40108,
        mes: 'token is expired',
        status: 401
    },
    AUTHENTICATION_FAILED: {
        msgCode: 40109,
        mes: 'auth failed',
        status: 401
    },
    USER_NOT_FOUND: {
        msgCode: 40402,
        mes: 'user not found',
        status: 404
    },
    ROUTE_NOT_FOUND: {
        msgCode: 40403,
        mes: 'route not found',
        status: 404
    },
    NO_PRODUCT: {
        msgCode: 40404,
        mes: 'product not found',
        status: 404
    },
    NO_ORDER: {
        msgCode: 40405,
        mes: 'order not found',
        status: 404
    },
    EMAIL_NOT_FOUND: {
        msgCode: 40406,
        mes: 'email not found',
        status: 404
    },
    DATA_NOT_FOUND: {
        msgCode: 40401,
        mes: 'data not found',
        status: 404
    },
    INPUT_DATA_INVALID: {
        msgCode: 40601,
        mes: 'input data invalid',
        status: 406
    },
    PASSWORD_PATTERN_INVALID: {
        msgCode: 40602,
        mes: 'at least 8 char, 1 digit and 1 alphabet',
        status: 406
    },
    EMAIL_EXIST: {
        msgCode: 40603,
        mes: 'email already exist',
        status: 406
    },
    SIGN_UP_INVALID: {
        msgCode: 40604,
        mes: 'signup failed',
        status: 406
    },
    LOGIN_INVALID: {
        msgCode: 40605,
        mes: 'login failed',
        status: 406
    },
    PASSWORD_NOT_MATCH: {
        msgCode: 40606,
        mes: 'password is wrong',
        status: 406
    },
    TOKEN_DOES_NOT_EXIST: {
        msgCode: 40607,
        mes: 'input data invalid',
        status: 406
    },
    DATABASE_ERROR: {
        msgCode: 50003,
        mes: 'internal server error',
        status: 500
    },
    SERVER_ERROR: {
        msgCode: 50004,
        mes: 'internal server error',
        status: 500
    },
    ERROR_MAKING_TRANSACTION: {
        msgCode: 50006,
        mes: 'transaction error',
        status: 500
    },

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
