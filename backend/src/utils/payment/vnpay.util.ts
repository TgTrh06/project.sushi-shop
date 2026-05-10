import {
  VNPay,
  ignoreLogger,
  ProductCode,
  VnpLocale,
  dateFormat,
  HashAlgorithm,
} from "vnpay";

// console.log("VNP_SECRET Check:", process.env.VNP_SECRET);
// console.log("VNP_TMNCODE Check:", process.env.VNP_TMNCODE);

export const vnpay = new VNPay({
  tmnCode: process.env.VNP_TMNCODE!,
  secureSecret: process.env.VNP_SECRET!,

  vnpayHost: "https://sandbox.vnpayment.vn",
  testMode: true,

  hashAlgorithm: HashAlgorithm.SHA512,

  loggerFn: ignoreLogger,
});

export { ProductCode, VnpLocale, dateFormat };

// interface CreateVNPayUrlPTO {
//   amount: number;
//   txnRef: string;
//   ipAddr: string;
//   orderInfo: string;
// }
// 
// // Config from .env file
// const vnp_config = {
//   vnp_TmnCode: process.env.VNP_TMN_CODE!,
//   vnp_HashSecret: process.env.VNP_HASH_SECRET!,
//   vnp_Url: process.env.VNP_URL!,
//   vnp_ReturnUrl: process.env.VNP_RETURN_URL!,
// };
// 
// /**
//  * Sort an object by its keys and encode the values for URL parameters
//  * @param obj - The object to sort and encode
//  * @returns A new object with sorted keys and URL-encoded values
//  */
// const sortObject = (obj: Record<string, any>) => {
//   return Object.keys(obj)
//     .sort()
//     .reduce((result: Record<string, any>, key) => {
//       result[key] = obj[key];
//       return result;
//     }, {});
// };

// /**
//  * Create a VNPay payment URL with the given parameters
//  * @param amount - The amount to be paid (in VND)
//  * @param txnRef - A unique transaction reference string
//  * @param ipAddr - The IP address of the client
//  * @param orderInfo - Information about the order
//  * @returns The VNPay payment URL
//  */
// export const generateVNPayUrl = ({
//   amount,
//   txnRef,
//   ipAddr,
//   orderInfo,
// }: CreateVNPayUrlPTO): string => {
//   let createDate = moment().format("YYYYMMDDHHmmss");

//   let vnp_Params: any = {
//     vnp_Version: "2.1.0",
//     vnp_Command: "pay",
//     vnp_TmnCode: vnp_config.vnp_TmnCode,
//     vnp_Locale: "vn",
//     vnp_CurrCode: "VND",

//     vnp_TxnRef: txnRef,

//     vnp_OrderInfo: orderInfo,
//     vnp_OrderType: "other",

//     vnp_Amount: amount * 100, // VNPay expects the amount in the smallest currency unit (e.g., cents)

//     vnp_ReturnUrl: vnp_config.vnp_ReturnUrl,

//     vnp_IpAddr: ipAddr,

//     vnp_CreateDate: createDate,
//   };

//   // 1. Sort parameters by key
//   const sortedParams = sortObject(vnp_Params);

//   // 2. Create the sign data string
//   const signData = qs.stringify(sortedParams, { encode: false });

//   // 3. Hash with HMAC-SHA512 using the HashSecret
//   const hmac = crypto.createHmac("sha512", vnp_config.vnp_HashSecret);
//   const signed = hmac
//     .update(Buffer.from(signData, "utf-8"))
//     .digest("hex");

//   // 4. Add checksum to the parameters
//   sortedParams["vnp_SecureHash"] = signed;

//   return `${vnp_config.vnp_Url}?${qs.stringify(sortedParams, { encode: true })}`;
// };

// /**
//  * Validate response from VNPay by comparing the secure hash
//  * @param vnp_Params - Object containing all parameters returned by VNPay, including vnp_SecureHash
//  * @returns true if the response is valid, false otherwise
//  */
// export const verifyVNPayResponse = (
//   query: Record<string, any>
// ): boolean => {
//   const vnp_Params = { ...query };

//   const secureHash = vnp_Params["vnp_SecureHash"];

//   // Remove fields that are not part of the hash calculation
//   delete vnp_Params["vnp_SecureHash"];
//   delete vnp_Params["vnp_SecureHashType"];

//   // 1. Sort the parameters
//   const sortedParams = sortObject(vnp_Params);

//   // 2. Create the sign data string
//   const signData = qs.stringify(sortedParams, { encode: false });

//   // 3. Hash with HMAC-SHA512 using the HashSecret
//   const hmac = crypto.createHmac("sha512", vnp_config.vnp_HashSecret);
//   const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

//   // 4. Compare the hash of our own calculation with the hash sent by VNPay
//   return secureHash === signed;
// };
