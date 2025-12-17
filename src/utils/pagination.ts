// src/utils/pagination.ts
import { QueryClient, type QueryKey } from "@tanstack/react-query";
import React from "react";

interface PaginationState {
  current: number;
  pageSize: number;
}

/**
 * Xử lý logic sau khi xóa item trong bảng có phân trang
 * @param queryClient Instance của QueryClient
 * @param queryKey Key của query cần làm mới (ví dụ: ['rooms'])
 * @param pagination State phân trang hiện tại
 * @param setPagination Hàm set state phân trang
 * @param currentDataLength Số lượng item hiện có trên bảng (trước khi xóa hiển thị)
 */
export const handleAfterDelete = (
  queryClient: QueryClient,
  queryKey: QueryKey,
  pagination: PaginationState,
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>,
  currentDataLength: number
) => {
  // Logic: Nếu đang ở trang > 1 và chỉ còn 1 dòng dữ liệu -> Lùi về trang trước
  if (pagination.current > 1 && currentDataLength === 1) {
    setPagination((prev) => ({ ...prev, current: prev.current - 1 }));
    // Lưu ý: Không cần invalidateQueries ở đây vì khi state pagination thay đổi, 
    // useQuery sẽ tự động chạy lại.
  } else {
    // Trường hợp còn nhiều dữ liệu hoặc đang ở trang 1 -> Refresh lại data tại chỗ
    queryClient.invalidateQueries({ queryKey });
  }
};