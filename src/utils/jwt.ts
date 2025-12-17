// src/utils/jwt.ts
import { jwtDecode } from "jwt-decode";

// 1. Định nghĩa Interface cho Payload gốc từ Token (Dựa trên token thực tế bạn gửi)
interface JwtPayloadOriginal {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
  UserId?: string; // Quan trọng nhất
  sub?: string;
  exp?: number;
  iss?: string;
  aud?: string;
}

// 2. Định nghĩa Interface User Clean (Dễ dùng cho code của mình)
export interface UserInfo {
  id: string;
  email: string;
  role: string;
  roleId: number; // Map sang số: 0, 1, 2
}

// 3. Hàm decode và transform dữ liệu
export const decodeUserFromToken = (token: string): UserInfo | null => {
  try {
    const decoded = jwtDecode<JwtPayloadOriginal>(token);   
    
    // Map Role String -> Role Number
    let roleId = 0;
    const roleStr = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "Admin";
    
    if (roleStr === "Student") roleId = 2;
    else if (roleStr === "Lecturer") roleId = 1;

    return {
      id: decoded.UserId || decoded.sub || "", // Ưu tiên lấy UserId
      email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || "",
      role: roleStr,
      roleId: roleId
    };
  } catch (error) {
    console.error("Lỗi decode token:", error);
    return null;
  }
};