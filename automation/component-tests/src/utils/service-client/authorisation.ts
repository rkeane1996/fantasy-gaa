//import jwt from 'jsonwebtoken';
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET_KEY; 

interface Payload {
    sub: string;                   
    iat: number;        
    exp: number;
}


export const generateToken = (payload: Payload): string => {
    return jwt.sign(payload, SECRET_KEY);
}

