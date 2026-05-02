import crypto from "crypto";
import qs from "qs";
import moment from "moment";
import dotenv from "dotenv";

dotenv.config();

// Các cấu hình lấy từ file .env
const vnp_TmnCode = process.env.VNP_TMN_CODE || "";
const vnp_HashSecret = process.env.VNP_HASH_SECRET || "";
const vnp_Url = process.env.VNP_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const vnp_ReturnUrl = process.env.VNP_RETURN_URL || "http://localhost:3000/booking/callback";

interface PaymentParams {
  amount: number;
  txnRef: string;
  ipAddr: string;
  orderInfo: string;
}

/**
 * Hàm sắp xếp các key của object theo thứ tự alphabet
 */
function sortObject(obj: any) {
  let sorted: any = {};
  let str: any = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

/**
 * Tạo URL thanh toán để gửi sang VNPay
 */
export const generateVNPayUrl = ({ amount, txnRef, ipAddr, orderInfo }: PaymentParams): string => {
  let date = new Date();
  let createDate = moment(date).format("YYYYMMDDHHmmss");

  let vnp_Params: any = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: vnp_TmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100, // VNPay đơn vị là xu
    vnp_ReturnUrl: vnp_ReturnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  // 1. Sắp xếp params
  vnp_Params = sortObject(vnp_Params);

  // 2. Tạo chuỗi sign data
  let signData = qs.stringify(vnp_Params, { encode: false });

  // 3. Băm HMAC-SHA512 với HashSecret
  let hmac = crypto.createHmac("sha512", vnp_HashSecret);
  let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  // 4. Thêm checksum vào URL
  vnp_Params["vnp_SecureHash"] = signed;

  return vnp_Url + "?" + qs.stringify(vnp_Params, { encode: false });
};

/**
 * Kiểm tra tính hợp lệ của dữ liệu phản hồi từ VNPay (Checksum)
 */
export const verifyVNPayResponse = (vnp_Params: any): boolean => {
  const secureHash = vnp_Params["vnp_SecureHash"];

  // Xóa các trường không tham gia vào việc tạo hash
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  // 1. Sắp xếp lại
  const sortedParams = sortObject(vnp_Params);

  // 2. Tạo chuỗi sign data
  const signData = qs.stringify(sortedParams, { encode: false });

  // 3. Băm lại với HashSecret của mình
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  // 4. So sánh hash của mình với hash VNPay gửi về
  return secureHash === signed;
};