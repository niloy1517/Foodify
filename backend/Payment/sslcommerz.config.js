import dotenv from 'dotenv'
dotenv.config()

import SSLCommerzPayment from 'sslcommerz-lts'



export const store_id = process.env.STORE_ID;
export const store_passwd = process.env.STORE_PASS;
export const is_live = false; //true for live, false for sandbox

export const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);