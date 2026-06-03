// Auto-generated from HSYC-BIDV Home GD3.docx
// Generated: 2026-05-28 14:54
// BM1 = Full scope | BM2 = Can BA lam RSD | BM3 = SIT (= BM1)
// Status: done = Da co RSD, rsd = Can BA+Design
// cx = Complexity score 1-10

const RATES = {
    PM: 2600000,
    QA: 2300000,
    BA: 2250000,
    SA: 2750000,
    SIT: 2075000,
    DEV: 2250000
};

const PROJECT_SUMMARY = [
    { stt: 'I', name: 'Quản lý dự án', md: 40.0, rateKey: 'PM' },
    { stt: '', name: 'Đảm bảo chất lượng', md: 10.0, rateKey: 'QA' },
    { stt: 'II', name: 'Khảo sát, phân tích', md: 65.0, rateKey: 'BA' },
    { stt: 'III', name: 'Thiết kế hệ thống', md: 55.0, rateKey: 'SA' },
    { stt: '', name: 'Kiểm thử SIT', md: 84.0, rateKey: 'SIT' },
    { stt: 'IV', name: 'Lập trình (bao gồm cả kiểm thử nội bộ UT, chuyển giao kỹ thuật)', md: 290.0, rateKey: 'DEV' }
];

const CX_LABELS = ['','Trivial','Simple','Basic','Standard','Moderate','Complex','Advanced','Expert','Critical','Extreme'];

const STATS = {
    total: 157,
    done: 90,
    rsd: 67,
    totalMD: 290.0,
    avgCx: 4.9
};

const ALL_SECTIONS = [
  {
    "name": "I. Quản lý dự án",
    "groups": []
  },
  {
    "name": "I. Đảm bảo chất lượng",
    "groups": []
  },
  {
    "name": "II. Khảo sát, phân tích",
    "groups": []
  },
  {
    "name": "III. Thiết kế hệ thống",
    "groups": []
  },
  {
    "name": "IV. Lập trình (bao gồm cả kiểm thử nội bộ UT, chuyển giao kỹ thuật)",
    "groups": [
      {
        "name": "A. Backoffice",
        "subs": [
          {
            "id": "1",
            "name": "BO - Nâng cấp tính năng cũ",
            "items": []
          },
          {
            "id": "1.1",
            "name": "Màn hình khai báo chủ đầu tư",
            "items": [
              {
                "name": "Web-  Sửa màn hình danh sách, chi tiết, thêm mới chủ đầu tư thêm trường thông ti",
                "md": 1.7,
                "status": "done",
                "cx": 6,
                "reason": "Form nhập liệu nhiều field + Truy vấn/Lọc dữ liệu + Điều chỉnh API + View data đơn thuần",
                "phases": "DEV"
              },
              {
                "name": "BE - Sửa API danh sách, chi tiết, thêm mới chủ đầu tư thêm trường thông tin cho",
                "md": 2.1,
                "status": "done",
                "cx": 6,
                "reason": "Form nhập liệu nhiều field + Truy vấn/Lọc dữ liệu + Điều chỉnh API + View data đơn thuần",
                "phases": "DEV"
              }
            ]
          },
          {
            "id": "1.2",
            "name": "Màn hình khai báo dự án",
            "items": [
              {
                "name": "Web - Sửa màn hình chi tiết, thêm mới/chỉnh sửa dự án thêm thứ tự ưu tiên hiển t",
                "md": 2.1,
                "status": "done",
                "cx": 6,
                "reason": "Form nhập liệu nhiều field + Form cập nhật thông tin + Điều chỉnh API + View data đơn thuần",
                "phases": "DEV"
              },
              {
                "name": "Web- Sửa tab chi nhánh đầu mối và cho vay",
                "md": 0.8,
                "status": "done",
                "cx": 3,
                "reason": "CRUD cơ bản / Luồng tiêu chuẩn",
                "phases": "DEV"
              },
              {
                "name": "BE - Sửa API lưu/sửa/xóa chi nhánh/cán bộ đầu mối",
                "md": 0.8,
                "status": "done",
                "cx": 3,
                "reason": "Điều chỉnh API + Thao tác xóa đơn giản",
                "phases": "DEV"
              },
              {
                "name": "BE - Sửa API chi tiết, thêm mới dự án thêm thứ tự ưu tiên hiển thị, thông tin ch",
                "md": 2.1,
                "status": "done",
                "cx": 5,
                "reason": "Form nhập liệu nhiều field + Điều chỉnh API + View data đơn thuần",
                "phases": "DEV"
              },
              {
                "name": "BE - Sửa API danh sách dự án check lấy dữ liệu theo phân quyền chi nhánh đầu mối",
                "md": 2.1,
                "status": "done",
                "cx": 7,
                "reason": "Truy vấn/Lọc dữ liệu + Điều chỉnh API + Phân quyền truy cập",
                "phases": "DEV"
              }
            ]
          },
          {
            "id": "1.3",
            "name": "Màn hình chi nhánh đầu mối vay",
            "items": [
              {
                "name": "Web- Sửa màn hình thêm mới chi nhánh đầu mối vay",
                "md": 2.1,
                "status": "done",
                "cx": 6,
                "reason": "Form nhập liệu nhiều field + Điều chỉnh API",
                "phases": "DEV"
              },
              {
                "name": "BE - Sửa API thêm/sửa chi nhánh đầu mối",
                "md": 1.3,
                "status": "done",
                "cx": 4,
                "reason": "Điều chỉnh API",
                "phases": "DEV"
              }
            ]
          },
          {
            "id": "1.4",
            "name": "Màn hình đăng tải video",
            "items": [
              {
                "name": "Web- Sửa màn hình danh sách kèm điều kiện lọc (thêm trường thông tin video ô tô)",
                "md": 2.1,
                "status": "rsd",
                "cx": 5,
                "reason": "Truy vấn/Lọc dữ liệu + Điều chỉnh API",
                "phases": "DEV + RSD"
              },
              {
                "name": "Web- Sửa màn hình thêm mới/chỉnh sửa video (thêm trường thông tin video ô tô)",
                "md": 2.1,
                "status": "rsd",
                "cx": 7,
                "reason": "Form nhập liệu nhiều field + Form cập nhật thông tin + Điều chỉnh API",
                "phases": "DEV + RSD"
              },
              {
                "name": "Web- Sửa màn hình xem chi tiết video xe (thêm trường thông tin video ô tô)",
                "md": 1.3,
                "status": "rsd",
                "cx": 4,
                "reason": "Điều chỉnh API",
                "phases": "DEV + RSD"
              },
              {
                "name": "BE- Sửa API lưu và đẩy duyệt (thêm trường thông tin video ô tô)",
                "md": 3,
                "status": "rsd",
                "cx": 7,
                "reason": "Quy trình phê duyệt nhiều step + Chuyển trạng thái quy trình + Điều chỉnh API",
                "phases": "DEV + RSD"
              },
              {
                "name": "BE- Sửa API danh sách video (thêm trường thông tin video ô tô)",
                "md": 2.1,
                "status": "rsd",
                "cx": 5,
                "reason": "Truy vấn/Lọc dữ liệu + Điều chỉnh API",
                "phases": "DEV + RSD"
              },
              {
                "name": "BE- Sửa API xem chi tiết (thêm trường thông tin video ô tô)",
                "md": 1.3,
                "status": "rsd",
                "cx": 4,
                "reason": "Điều chỉnh API",
                "phases": "DEV + RSD"
              }
            ]
          },
          {
            "id": "1.5",
            "name": "Màn hình khai báo chương trình ưu đãi",
            "items": [
              {
                "name": "Web- Sửa màn hình danh sách/chi tiết/thêm mới/chỉnh sửa khai báo ưu đãi (thêm kh",
                "md": 3,
                "status": "done",
                "cx": 7,
                "reason": "Form nhập liệu nhiều field + Form cập nhật thông tin + Truy vấn/Lọc dữ liệu + Điều chỉnh API + View data đơn thuần",
                "phases": "DEV"
              },
              {
                "name": "BE - Sửa API danh sách/chi tiết/thêm mới/sửa khai báo ưu đãi (thêm khai báo ô tô",
                "md": 3,
                "status": "done",
                "cx": 7,
                "reason": "Form nhập liệu nhiều field + Truy vấn/Lọc dữ liệu + Tác động nhiều API (CRUD) + View data đơn thuần",
                "phases": "DEV"
              }
            ]
          },
          {
            "id": "1.6",
            "name": "Màn hình quản lý banner",
            "items": [
              {
                "name": "Web- Sửa màn hình danh sách/chi tiết/thêm mới/chỉnh sửa chức năng quản lý banner",
                "md": 3,
                "status": "done",
                "cx": 7,
                "reason": "Form nhập liệu nhiều field + Form cập nhật thông tin + Truy vấn/Lọc dữ liệu + Điều chỉnh API + View data đơn thuần",
                "phases": "DEV"
              },
              {
                "name": "BE - Sửa API danh sách/chi tiết/thêm mới/sửa chức năng quản lý banner (thêm khai",
                "md": 3,
                "status": "done",
                "cx": 7,
                "reason": "Form nhập liệu nhiều field + Truy vấn/Lọc dữ liệu + Tác động nhiều API (CRUD) + View data đơn thuần",
                "phases": "DEV"
              }
            ]
          },
          {
            "id": "1.7",
            "name": "Màn hình quản lý tin tư vấn",
            "items": [
              {
                "name": "Web- Sửa màn hình danh sách/chi tiết/thêm mới/chỉnh sửa chức năng quản lý tin tư",
                "md": 3,
                "status": "done",
                "cx": 7,
                "reason": "Form nhập liệu nhiều field + Form cập nhật thông tin + Truy vấn/Lọc dữ liệu + Điều chỉnh API + View data đơn thuần",
                "phases": "DEV"
              },
              {
                "name": "BE - Sửa API danh sách/chi tiết/thêm mới/sửa chức năng quản lý tin tư vấn (thêm",
                "md": 3,
                "status": "done",
                "cx": 7,
                "reason": "Form nhập liệu nhiều field + Truy vấn/Lọc dữ liệu + Tác động nhiều API (CRUD) + View data đơn thuần",
                "phases": "DEV"
              }
            ]
          },
          {
            "id": "1.8",
            "name": "Màn hình quản lý OTT",
            "items": [
              {
                "name": "Web- Sửa màn hình danh sách/chi tiết/thêm mới/chỉnh sửa chức năng quản lý OTT (t",
                "md": 3.8,
                "status": "done",
                "cx": 10,
                "reason": "Tích hợp hệ thống/3rd party phức tạp + Form nhập liệu nhiều field + Form cập nhật thông tin + Truy vấn/Lọc dữ liệu + Điều chỉnh API + View data đơn thuần",
                "phases": "DEV"
              },
              {
                "name": "BE - Sửa API danh sách/chi tiết/thêm/sửa chức năng quản lý OTT ( thêm trường phâ",
                "md": 3,
                "status": "done",
                "cx": 9,
                "reason": "Tích hợp hệ thống/3rd party phức tạp + Truy vấn/Lọc dữ liệu + Tác động nhiều API (CRUD) + View data đơn thuần",
                "phases": "DEV"
              }
            ]
          },
          {
            "id": "1.9",
            "name": "Màn hình quản lý khoản vay",
            "items": [
              {
                "name": "Web- Sửa màn hình quản lý khoản vay cho phép cập nhật số PCA và thêm trường thôn",
                "md": 2.1,
                "status": "done",
                "cx": 5,
                "reason": "Form cập nhật thông tin + Điều chỉnh API",
                "phases": "DEV"
              },
              {
                "name": "BE - Sửa API cập nhật khoản vay và API chi tiết khoản vay",
                "md": 1.3,
                "status": "done",
                "cx": 4,
                "reason": "Form cập nhật thông tin + Điều chỉnh API + View data đơn thuần",
                "phases": "DEV"
              }
            ]
          },
          {
            "id": "1.10",
            "name": "Màn hình quản lý tài khoản",
            "items": [
              {
                "name": "Web- Sửa màn hình quản lý tài khoản cho phép tìm theo khoảng ngày và thêm chức n",
                "md": 1.3,
                "status": "done",
                "cx": 4,
                "reason": "Điều chỉnh API",
                "phases": "DEV + SIT"
              },
              {
                "name": "BE- Sửa API danh sách tài khoản lọc theo khoảng ngày",
                "md": 2.1,
                "status": "done",
                "cx": 5,
                "reason": "Truy vấn/Lọc dữ liệu + Điều chỉnh API",
                "phases": "DEV"
              },
              {
                "name": "BE - API export danh sách tài khoản",
                "md": 3,
                "status": "rsd",
                "cx": 6,
                "reason": "Xuất/tải file báo cáo + Truy vấn/Lọc dữ liệu",
                "phases": "DEV + RSD"
              }
            ]
          },
          {
            "id": "2",
            "name": "BO - Phát triển tính năng mới",
            "items": []
          },
          {
            "id": "2.1",
            "name": "Màn hình chính sách hoa hồng",
            "items": [
              {
                "name": "Web- Màn hình danh sách chính sách hoa hồng (kèm tìm kiếm nâng cao)",
                "md": 1.3,
                "status": "rsd",
                "cx": 4,
                "reason": "Truy vấn/Lọc dữ liệu",
                "phases": "DEV + RSD"
              },
              {
                "name": "Web- Màn hình xem chi tiết chính sách hoa hồng",
                "md": 0.8,
                "status": "rsd",
                "cx": 3,
                "reason": "CRUD cơ bản / Luồng tiêu chuẩn",
                "phases": "DEV + RSD"
              },
              {
                "name": "Web- Màn hình thêm mới chính sách hoa hồng (Tích hợp nhiều dropdownlist chọn)",
                "md": 3,
                "status": "rsd",
                "cx": 8,
                "reason": "Tích hợp hệ thống/3rd party phức tạp + Form nhập liệu nhiều field + Load data không logic phức tạp",
                "phases": "DEV + RSD"
              },
              {
                "name": "Web- Chỉnh sửa chính sách hoa hồng",
                "md": 1.3,
                "status": "rsd",
                "cx": 4,
                "reason": "Form cập nhật thông tin",
                "phases": "DEV + RSD"
              },
              {
                "name": "Web- Đẩy duyệt/ phê duyệt/ từ chối/ xóa/ đổi trạng thái chính sách hoa hồng",
                "md": 2.1,
                "status": "rsd",
                "cx": 5,
                "reason": "Quy trình phê duyệt nhiều step + Chuyển trạng thái quy trình + Thao tác xóa đơn giản",
                "phases": "DEV + RSD"
              },
              {
                "name": "BE- API danh sách chính sách hoa hồng",
                "md": 1.3,
                "status": "rsd",
                "cx": 4,
                "reason": "Truy vấn/Lọc dữ liệu",
                "phases": "DEV + RSD"
              },
              {
                "name": "BE- API chi tiết chính sách hoa hồng",
                "md": 0.8,
                "status": "rsd",
                "cx": 3,
                "reason": "CRUD cơ bản / Luồng tiêu chuẩn",
                "phases": "DEV + RSD"
              },
              {
                "name": "BE- API lấy danh sách showroom (chọn dropdownlist)",
                "md": 0.8,
                "status": "rsd",
                "cx": 3,
                "reason": "Truy vấn/Lọc dữ liệu + Load data không logic phức tạp",
                "phases": "DEV + RSD"
              },
              {
                "name": "BE- API thêm mới chính sách hoa hồng",
                "md": 2.1,
                "status": "rsd",
                "cx": 5,
                "reason": "Form nhập liệu nhiều field",
                "phases": "DEV + RSD"
              },
              {
                "name": "BE- API chỉnh sửa chính sách hoa hồng",
                "md": 1.3,
                "status": "rsd",
                "cx": 4,
                "reason": "Form cập nhật thông tin",
                "phases": "DEV + RSD"
              },
              {
                "name": "BE- API đẩy duyệt/ phê duyệt/ từ chối chính sách hoa hồng",
                "md": 3,
                "status": "rsd",
                "cx": 6,
                "reason": "Quy trình phê duyệt nhiều step + Chuyển trạng thái quy trình",
                "phases": "DEV + RSD"
              },
              {
                "name": "BE- API thay đổi trạng thái (active, inactive) chính sách hoa hồng",
                "md": 2.1,
                "status": "rsd",
                "cx": 5,
                "reason": "Quy trình phê duyệt nhiều step",
                "phases": "DEV + RSD"
              },
              {
                "name": "BE- API xóa chính sách hoa hồng",
                "md": 0.8,
                "status": "rsd",
                "cx": 2,
                "reason": "Thao tác xóa đơn giản",
                "phases": "DEV + RSD"
              }
            ]
          },
          {
            "id": "2.2",
            "name": "Màn hình quản lý Cộng tác viên",
            "items": [
              {
                "name": "Web- Màn hình danh sách cộng tác viên (kèm điều kiện lọc)",
                "md": 1.3,
                "status": "rsd",
                "cx": 4,
                "reason": "Truy vấn/Lọc dữ liệu",
                "phases": "DEV + RSD"
              },
              {
                "name": "Web- Màn hình xem chi tiết cộng tác viên",
                "md": 0.8,
                "status": "rsd",
                "cx": 3,
                "reason": "CRUD cơ bản / Luồng tiêu chuẩn",
                "phases": "DEV + RSD"
              },
              {
                "name": "Web- Màn hình thêm mới cộng tác viên",
                "md": 2.1,
                "status": "rsd",
                "cx": 5,
                "reason": "Form nhập liệu nhiều field",
                "phases": "DEV + RSD"
              },
              {
                "name": "Web- Chức năng upload file (import theo lô)",
                "md": 3,
                "status": "rsd",
                "cx": 6,
                "reason": "Upload và validate file",
                "phases": "DEV + RSD"
              },
              {
                "name": "Web- Chỉnh sửa thông tin cộng tác viên",
                "md": 1.3,
                "status": "rsd",
                "cx": 4,
                "reason": "Form cập nhật thông tin",
                "phases": "DEV + RSD"
              },
              {
                "name": "Web- Phê duyệt/từ chối/xóa yêu cầu",
                "md": 1.3,
                "status": "rsd",
                "cx": 4,
                "reason": "Quy trình phê duyệt nhiều step + Thao tác xóa đơn giản",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "BE- API danh sách cộng tác viên",
                "md": 1.3,
                "status": "rsd",
                "cx": 4,
                "reason": "Truy vấn/Lọc dữ liệu",
                "phases": "DEV + RSD"
              },
              {
                "name": "BE- API phê duyệt/ từ chối duyệt",
                "md": 2.1,
                "status": "rsd",
                "cx": 5,
                "reason": "Quy trình phê duyệt nhiều step",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "BE- API  thêm mới thông tin cộng tác viên",
                "md": 2.1,
                "status": "rsd",
                "cx": 5,
                "reason": "Form nhập liệu nhiều field",
                "phases": "DEV + RSD"
              },
              {
                "name": "BE - API sửa thông tin cộng tác viên",
                "md": 0.8,
                "status": "rsd",
                "cx": 3,
                "reason": "CRUD cơ bản / Luồng tiêu chuẩn",
                "phases": "DEV + RSD"
              },
              {
                "name": "BE - API xóa thông tin cộng tác viên",
                "md": 0.8,
                "status": "rsd",
                "cx": 2,
                "reason": "Thao tác xóa đơn giản",
                "phases": "DEV + RSD"
              },
              {
                "name": "BE - API xem chi tiết thông tin cộng tác viên",
                "md": 0.8,
                "status": "rsd",
                "cx": 3,
                "reason": "CRUD cơ bản / Luồng tiêu chuẩn",
                "phases": "DEV + RSD"
              },
              {
                "name": "BE- API upload file và validate thông tin cộng tác viên",
                "md": 3,
                "status": "rsd",
                "cx": 6,
                "reason": "Upload và validate file",
                "phases": "DEV + RSD"
              }
            ]
          },
          {
            "id": "2.3",
            "name": "Màn hình quản lý sản phẩm vay",
            "items": [
              {
                "name": "Web- Màn hình danh sách sản phẩm vay (kèm điều kiện lọc)",
                "md": 1.3,
                "status": "rsd",
                "cx": 4,
                "reason": "Truy vấn/Lọc dữ liệu",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "Web- Màn hình xem chi tiết sản phẩm vay",
                "md": 0.8,
                "status": "rsd",
                "cx": 3,
                "reason": "CRUD cơ bản / Luồng tiêu chuẩn",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "Web- Màn hình thêm mới sản phẩm vay",
                "md": 2.1,
                "status": "rsd",
                "cx": 5,
                "reason": "Form nhập liệu nhiều field",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "Web- Chỉnh sửa thông tin sản phẩm vay",
                "md": 1.3,
                "status": "rsd",
                "cx": 4,
                "reason": "Form cập nhật thông tin",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "Web- Phê duyệt/từ chối/xóa yêu cầu",
                "md": 1.3,
                "status": "rsd",
                "cx": 4,
                "reason": "Quy trình phê duyệt nhiều step + Thao tác xóa đơn giản",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "BE- API danh sách sản phẩm vay",
                "md": 1.3,
                "status": "rsd",
                "cx": 4,
                "reason": "Truy vấn/Lọc dữ liệu",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "BE- API phê duyệt/ từ chối duyệt",
                "md": 2.1,
                "status": "rsd",
                "cx": 5,
                "reason": "Quy trình phê duyệt nhiều step",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "BE- API  thêm mới sản phẩm vay",
                "md": 2.1,
                "status": "rsd",
                "cx": 5,
                "reason": "Form nhập liệu nhiều field",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "BE - API sửa thông tin sản phẩm vay",
                "md": 0.8,
                "status": "rsd",
                "cx": 3,
                "reason": "CRUD cơ bản / Luồng tiêu chuẩn",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "BE - API xóa thông tin sản phẩm vay",
                "md": 0.8,
                "status": "rsd",
                "cx": 2,
                "reason": "Thao tác xóa đơn giản",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "BE - API xem chi tiết thông tin sản phẩm vay",
                "md": 0.8,
                "status": "rsd",
                "cx": 3,
                "reason": "CRUD cơ bản / Luồng tiêu chuẩn",
                "phases": "DEV + SIT + RSD"
              }
            ]
          },
          {
            "id": "2.4",
            "name": "Màn hình quản lý mẫu email",
            "items": [
              {
                "name": "Web- Màn hình Quản lý mẫu email",
                "md": 0.8,
                "status": "done",
                "cx": 3,
                "reason": "CRUD cơ bản / Luồng tiêu chuẩn",
                "phases": "DEV + SIT"
              },
              {
                "name": "Web- Màn hình Thêm mới mẫu email",
                "md": 2.1,
                "status": "done",
                "cx": 5,
                "reason": "Form nhập liệu nhiều field",
                "phases": "DEV + SIT"
              },
              {
                "name": "Web- Màn hình Chỉnh sửa mẫu email",
                "md": 1.3,
                "status": "done",
                "cx": 4,
                "reason": "Form cập nhật thông tin",
                "phases": "DEV + SIT"
              },
              {
                "name": "Web- Màn hình Lịch sử chỉnh sửa",
                "md": 1.3,
                "status": "done",
                "cx": 4,
                "reason": "Form cập nhật thông tin",
                "phases": "DEV + SIT"
              },
              {
                "name": "Web- Màn hình Xem trước mẫu email",
                "md": 0.8,
                "status": "done",
                "cx": 3,
                "reason": "CRUD cơ bản / Luồng tiêu chuẩn",
                "phases": "DEV + SIT"
              },
              {
                "name": "BE- API lấy danh sách mẫu email",
                "md": 0.8,
                "status": "done",
                "cx": 3,
                "reason": "Truy vấn/Lọc dữ liệu + Load data không logic phức tạp",
                "phases": "DEV + SIT"
              },
              {
                "name": "BE- API Thêm mới mẫu email",
                "md": 2.1,
                "status": "done",
                "cx": 5,
                "reason": "Form nhập liệu nhiều field",
                "phases": "DEV + SIT"
              },
              {
                "name": "BE- API Chỉnh sửa mẫu email",
                "md": 1.3,
                "status": "done",
                "cx": 4,
                "reason": "Form cập nhật thông tin",
                "phases": "DEV + SIT"
              },
              {
                "name": "BE- API Chi tiết mẫu email (bảo gồm thông tin lịch sử)",
                "md": 0.8,
                "status": "done",
                "cx": 3,
                "reason": "CRUD cơ bản / Luồng tiêu chuẩn",
                "phases": "DEV"
              }
            ]
          },
          {
            "id": "2.5",
            "name": "Màn hình quản lý cán bộ nhận",
            "items": [
              {
                "name": "Web- màn hình Quản lý cán bộ nhận",
                "md": 0.8,
                "status": "rsd",
                "cx": 3,
                "reason": "CRUD cơ bản / Luồng tiêu chuẩn",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "Web- Import dữ liệu qua upload file Excel",
                "md": 3,
                "status": "done",
                "cx": 6,
                "reason": "Upload và validate file",
                "phases": "DEV + SIT"
              },
              {
                "name": "Web- Màn hình thêm mới cán bộ nhận",
                "md": 2.1,
                "status": "done",
                "cx": 5,
                "reason": "Form nhập liệu nhiều field",
                "phases": "DEV + SIT"
              },
              {
                "name": "Web- Màn hình chỉnh sửa cán bộ nhận",
                "md": 1.3,
                "status": "done",
                "cx": 4,
                "reason": "Form cập nhật thông tin",
                "phases": "DEV + SIT"
              },
              {
                "name": "BE- API danh sách cán bộ nhận",
                "md": 1.3,
                "status": "done",
                "cx": 4,
                "reason": "Truy vấn/Lọc dữ liệu",
                "phases": "DEV + SIT"
              },
              {
                "name": "BE- API Import dữ liệu qua upload file Excel",
                "md": 3,
                "status": "done",
                "cx": 6,
                "reason": "Upload và validate file",
                "phases": "DEV + SIT"
              },
              {
                "name": "BE- API thêm mới cán bộ nhận",
                "md": 2.1,
                "status": "done",
                "cx": 5,
                "reason": "Form nhập liệu nhiều field",
                "phases": "DEV + SIT"
              },
              {
                "name": "BE-  API chỉnh sửa cán bộ nhận",
                "md": 1.3,
                "status": "done",
                "cx": 4,
                "reason": "Form cập nhật thông tin",
                "phases": "DEV + SIT"
              },
              {
                "name": "BE-  API chi tiết cán bộ nhận",
                "md": 0.8,
                "status": "done",
                "cx": 3,
                "reason": "CRUD cơ bản / Luồng tiêu chuẩn",
                "phases": "DEV + SIT"
              }
            ]
          },
          {
            "id": "2.6",
            "name": "Báo cáo các yêu cầu quá hạn xử lý",
            "items": [
              {
                "name": "Job - Gửi email tự động",
                "md": 3,
                "status": "done",
                "cx": 8,
                "reason": "Gửi thông báo/SMS/Email + Job chạy ngầm tự động",
                "phases": "DEV + SIT"
              }
            ]
          },
          {
            "id": "2.7",
            "name": "Báo cáo khách hàng đặt lịch hẹn",
            "items": [
              {
                "name": "Web- màn hình báo cáo khách hàng đặt lịch hẹn",
                "md": 2.1,
                "status": "rsd",
                "cx": 5,
                "reason": "Tổng hợp dữ liệu/Báo cáo",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "Web- export báo cáo khách hàng đặt lịch hẹn",
                "md": 3,
                "status": "rsd",
                "cx": 7,
                "reason": "Xuất/tải file báo cáo + Tổng hợp dữ liệu/Báo cáo",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "BE- API lấy báo cáo khách hàng đặt lịch hẹn",
                "md": 2.1,
                "status": "rsd",
                "cx": 5,
                "reason": "Tổng hợp dữ liệu/Báo cáo",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "BE- API export báo cáo khách hàng đặt lịch hẹn",
                "md": 3,
                "status": "rsd",
                "cx": 7,
                "reason": "Xuất/tải file báo cáo + Tổng hợp dữ liệu/Báo cáo",
                "phases": "DEV + SIT + RSD"
              }
            ]
          },
          {
            "id": "2.8",
            "name": "Báo cáo khách hàng đăng ký lái thử",
            "items": [
              {
                "name": "Web- Màn hình Báo cáo khách hàng đăng ký lái thử",
                "md": 3,
                "status": "rsd",
                "cx": 7,
                "reason": "Form nhập liệu nhiều field + Tổng hợp dữ liệu/Báo cáo",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "Web- export Báo cáo khách hàng đăng ký lái thử",
                "md": 3,
                "status": "rsd",
                "cx": 9,
                "reason": "Xuất/tải file báo cáo + Form nhập liệu nhiều field + Tổng hợp dữ liệu/Báo cáo",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "BE- API Báo cáo khách hàng đăng ký lái thử",
                "md": 3,
                "status": "rsd",
                "cx": 7,
                "reason": "Form nhập liệu nhiều field + Tổng hợp dữ liệu/Báo cáo",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "BE- API export  Báo cáo khách hàng đăng ký lái thử",
                "md": 3,
                "status": "rsd",
                "cx": 9,
                "reason": "Xuất/tải file báo cáo + Form nhập liệu nhiều field + Tổng hợp dữ liệu/Báo cáo",
                "phases": "DEV + SIT + RSD"
              }
            ]
          },
          {
            "id": "2.9",
            "name": "Báo cáo hoa hồng CTV từng chi nhánh",
            "items": [
              {
                "name": "Web- Màn hình Báo cáo hoa hồng CTV từng chi nhánh",
                "md": 2.1,
                "status": "rsd",
                "cx": 5,
                "reason": "Tổng hợp dữ liệu/Báo cáo",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "Web- export Báo cáo hoa hồng CTV từng chi nhánh",
                "md": 3,
                "status": "rsd",
                "cx": 7,
                "reason": "Xuất/tải file báo cáo + Tổng hợp dữ liệu/Báo cáo",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "BE- API Báo cáo hoa hồng CTV từng chi nhánh",
                "md": 2.1,
                "status": "rsd",
                "cx": 5,
                "reason": "Tổng hợp dữ liệu/Báo cáo",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "BE- API export  Báo cáo hoa hồng CTV từng chi nhánh",
                "md": 3,
                "status": "rsd",
                "cx": 7,
                "reason": "Xuất/tải file báo cáo + Tổng hợp dữ liệu/Báo cáo",
                "phases": "DEV + SIT + RSD"
              }
            ]
          },
          {
            "id": "2.10",
            "name": "Quản lý QR code",
            "items": [
              {
                "name": "Web- Màn hình danh sách QR code",
                "md": 3,
                "status": "rsd",
                "cx": 7,
                "reason": "Tương tác thiết bị (Camera/QR) + Truy vấn/Lọc dữ liệu",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "Web- Màn hình Thêm mới QR code",
                "md": 3,
                "status": "done",
                "cx": 8,
                "reason": "Tương tác thiết bị (Camera/QR) + Form nhập liệu nhiều field",
                "phases": "DEV + SIT"
              },
              {
                "name": "Web- Màn hình Chỉnh sửa QR code",
                "md": 3,
                "status": "done",
                "cx": 7,
                "reason": "Tương tác thiết bị (Camera/QR) + Form cập nhật thông tin",
                "phases": "DEV + SIT"
              },
              {
                "name": "Web- Màn hình xóa QR code",
                "md": 2.1,
                "status": "done",
                "cx": 5,
                "reason": "Tương tác thiết bị (Camera/QR) + Thao tác xóa đơn giản",
                "phases": "DEV + SIT"
              },
              {
                "name": "BE- API lấy danh sách QR code",
                "md": 3,
                "status": "done",
                "cx": 6,
                "reason": "Tương tác thiết bị (Camera/QR) + Truy vấn/Lọc dữ liệu + Load data không logic phức tạp",
                "phases": "DEV + SIT"
              },
              {
                "name": "BE- API Thêm mới QR code",
                "md": 3,
                "status": "done",
                "cx": 8,
                "reason": "Tương tác thiết bị (Camera/QR) + Form nhập liệu nhiều field",
                "phases": "DEV + SIT"
              },
              {
                "name": "BE- API lấy chi tiết QR code",
                "md": 2.1,
                "status": "done",
                "cx": 5,
                "reason": "Tương tác thiết bị (Camera/QR) + View data đơn thuần",
                "phases": "DEV + SIT"
              },
              {
                "name": "BE- API Chỉnh sửa QR code",
                "md": 3,
                "status": "done",
                "cx": 7,
                "reason": "Tương tác thiết bị (Camera/QR) + Form cập nhật thông tin",
                "phases": "DEV + SIT"
              },
              {
                "name": "BE- API xóa QR code",
                "md": 2.1,
                "status": "done",
                "cx": 5,
                "reason": "Tương tác thiết bị (Camera/QR) + Thao tác xóa đơn giản",
                "phases": "DEV + SIT"
              }
            ]
          }
        ]
      },
      {
        "name": "B. Các chức năng FO cho Khách hàng",
        "subs": [
          {
            "id": "1",
            "name": "FO - Nâng cấp tính năng cũ",
            "items": []
          },
          {
            "id": "1.1",
            "name": "Màn hình danh sách lịch hẹn",
            "items": [
              {
                "name": "FE-  Sửa màn hình lịch hẹn đã tạo thêm lịch hẹn mua ô tô",
                "md": 1.3,
                "status": "rsd",
                "cx": 4,
                "reason": "Điều chỉnh API",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "BE- Sửa API lịch hẹn đã tạo",
                "md": 1.3,
                "status": "rsd",
                "cx": 4,
                "reason": "Điều chỉnh API",
                "phases": "DEV + SIT + RSD"
              }
            ]
          },
          {
            "id": "1.2",
            "name": "Trang chủ bất động sản - gợi ý cho bạn",
            "items": [
              {
                "name": "FE- Màn hình hiển thị danh sách ô tô gợi ý cho bạn",
                "md": 1.3,
                "status": "done",
                "cx": 4,
                "reason": "Truy vấn/Lọc dữ liệu",
                "phases": "DEV + SIT"
              },
              {
                "name": "BE- Job tổng hợp điểm gợi ý cho sản phẩm bất động sản",
                "md": 3,
                "status": "done",
                "cx": 6,
                "reason": "Job chạy ngầm tự động",
                "phases": "DEV + SIT"
              },
              {
                "name": "BE - Sửa API danh sách dự án gợi ý cho bạn",
                "md": 2.1,
                "status": "done",
                "cx": 5,
                "reason": "Truy vấn/Lọc dữ liệu + Điều chỉnh API",
                "phases": "DEV + SIT"
              }
            ]
          },
          {
            "id": "1.3",
            "name": "Màn hình xem video",
            "items": [
              {
                "name": "BE - Sửa API danh sách video thêm video sản phẩm ô tô và chia 2 loại cho bạn/Fol",
                "md": 2.1,
                "status": "rsd",
                "cx": 5,
                "reason": "Truy vấn/Lọc dữ liệu + Điều chỉnh API",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "BE- API download video kèm watermark (Xử lý video add thêm watermark)",
                "md": 3,
                "status": "rsd",
                "cx": 9,
                "reason": "Xử lý media/watermark nặng + Xuất/tải file báo cáo",
                "phases": "DEV + SIT + RSD"
              }
            ]
          },
          {
            "id": "1.4",
            "name": "Màn hình danh sách thông báo",
            "items": [
              {
                "name": "FE-  Hiển thị số lượng thông báo chưa đọc",
                "md": 2.1,
                "status": "done",
                "cx": 5,
                "reason": "Gửi thông báo/SMS/Email",
                "phases": "DEV + SIT"
              },
              {
                "name": "BE - API count số lượng thông báo chưa đọc",
                "md": 0.8,
                "status": "done",
                "cx": 3,
                "reason": "Gửi thông báo/SMS/Email + Update field trạng thái đơn giản",
                "phases": "DEV + SIT"
              },
              {
                "name": "FE- Hiển thị danh sách thông báo đã đọc/chưa đọc",
                "md": 1.3,
                "status": "done",
                "cx": 4,
                "reason": "Truy vấn/Lọc dữ liệu + Gửi thông báo/SMS/Email + Update field trạng thái đơn giản",
                "phases": "DEV + SIT"
              },
              {
                "name": "BE- Sửa API danh sách thông báo thêm trường  đã đọc/chưa đọc",
                "md": 2.1,
                "status": "done",
                "cx": 5,
                "reason": "Truy vấn/Lọc dữ liệu + Gửi thông báo/SMS/Email + Điều chỉnh API + Update field trạng thái đơn giản",
                "phases": "DEV + SIT"
              },
              {
                "name": "FE- Đánh dấu thông báo là đã đọc",
                "md": 0.8,
                "status": "done",
                "cx": 3,
                "reason": "Gửi thông báo/SMS/Email + Update field trạng thái đơn giản",
                "phases": "DEV + SIT"
              },
              {
                "name": "BE- API đánh dấu thông báo đã đọc",
                "md": 0.8,
                "status": "done",
                "cx": 3,
                "reason": "Gửi thông báo/SMS/Email + Update field trạng thái đơn giản",
                "phases": "DEV + SIT"
              }
            ]
          },
          {
            "id": "1.5",
            "name": "Màn hình công cụ tính toán vay",
            "items": [
              {
                "name": "BE- Sửa API tính toán khoản vay",
                "md": 3,
                "status": "done",
                "cx": 9,
                "reason": "Logic tính toán/AI tư vấn chuyên sâu + Điều chỉnh API",
                "phases": "DEV + SIT"
              }
            ]
          },
          {
            "id": "1.6",
            "name": "Màn hình danh sách/chi tiết sản phẩm vay",
            "items": [
              {
                "name": "FE- Sửa màn hình chi tiết sản phẩm vay",
                "md": 1.3,
                "status": "done",
                "cx": 4,
                "reason": "Điều chỉnh API",
                "phases": "DEV + SIT"
              }
            ]
          },
          {
            "id": "1.7",
            "name": "Màn hình đặt lịch hẹn tư vấn vay",
            "items": [
              {
                "name": "BE- Sửa API đăng ký lịch hẹn",
                "md": 3,
                "status": "done",
                "cx": 6,
                "reason": "Form nhập liệu nhiều field + Điều chỉnh API",
                "phases": "DEV + SIT"
              }
            ]
          },
          {
            "id": "2",
            "name": "FO - Phát triển tính năng mới",
            "items": []
          },
          {
            "id": "2.1",
            "name": "Màn hình tìm kiếm nhanh/ tìm kiếm nâng cao ô tô",
            "items": [
              {
                "name": "BE - API lấy thông tin showroom (tách riêng ko chung api tham số bên trên)",
                "md": 0.8,
                "status": "done",
                "cx": 3,
                "reason": "CRUD cơ bản / Luồng tiêu chuẩn",
                "phases": "DEV"
              },
              {
                "name": "BE- API danh sách xe theo điều kiện tìm kiếm",
                "md": 1.3,
                "status": "done",
                "cx": 4,
                "reason": "Truy vấn/Lọc dữ liệu",
                "phases": "DEV"
              }
            ]
          },
          {
            "id": "2.2",
            "name": "Trang chủ ô tô - video cho bạn",
            "items": [
              {
                "name": "FE - Hiển thị danh sách video ô tô cho bạn",
                "md": 1.3,
                "status": "rsd",
                "cx": 4,
                "reason": "Truy vấn/Lọc dữ liệu",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "BE - Sửa API lấy danh sách video gợi ý theo type ô tô",
                "md": 1.3,
                "status": "rsd",
                "cx": 4,
                "reason": "Truy vấn/Lọc dữ liệu + Điều chỉnh API + Load data không logic phức tạp",
                "phases": "DEV + SIT + RSD"
              }
            ]
          },
          {
            "id": "2.3",
            "name": "Trang chủ ô tô - tin tức",
            "items": [
              {
                "name": "FE - Hiển thị danh sách tin tức cho bạn",
                "md": 1.3,
                "status": "done",
                "cx": 4,
                "reason": "Truy vấn/Lọc dữ liệu",
                "phases": "DEV + SIT"
              },
              {
                "name": "BE - Sửa API lấy danh sách tin tức theo type ô tô",
                "md": 1.3,
                "status": "done",
                "cx": 4,
                "reason": "Truy vấn/Lọc dữ liệu + Điều chỉnh API + Load data không logic phức tạp",
                "phases": "DEV + SIT"
              },
              {
                "name": "FE - Màn hình danh sách tin tức ô tô riêng (tin thị trường, cẩm nang, thông tin",
                "md": 1.3,
                "status": "done",
                "cx": 4,
                "reason": "Truy vấn/Lọc dữ liệu",
                "phases": "DEV + SIT"
              }
            ]
          },
          {
            "id": "2.4",
            "name": "Đăng ký lái thử",
            "items": [
              {
                "name": "FE- Màn hình nhập thông tin đăng ký lái thử",
                "md": 2.1,
                "status": "rsd",
                "cx": 5,
                "reason": "Form nhập liệu nhiều field",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "BE- API xác nhận OTP và lưu thông tin đăng ký lái thử",
                "md": 3,
                "status": "rsd",
                "cx": 9,
                "reason": "Tích hợp hệ thống/3rd party phức tạp + Form nhập liệu nhiều field",
                "phases": "DEV + SIT + RSD"
              },
              {
                "name": "BE- Gửi OTT và SMS tới cán bộ chi nhánh đầu mối",
                "md": 3,
                "status": "rsd",
                "cx": 9,
                "reason": "Tích hợp hệ thống/3rd party phức tạp + Gửi thông báo/SMS/Email",
                "phases": "DEV + SIT + RSD"
              }
            ]
          },
          {
            "id": "2.5",
            "name": "Ưu đãi đặc quyền",
            "items": [
              {
                "name": "FE- Màn hình danh sách ưu đãi đặc quyền",
                "md": 1.3,
                "status": "done",
                "cx": 4,
                "reason": "Truy vấn/Lọc dữ liệu",
                "phases": "DEV + SIT"
              },
              {
                "name": "FE- Màn hình chi tiết ưu đãi đặc quyền",
                "md": 0.8,
                "status": "done",
                "cx": 3,
                "reason": "CRUD cơ bản / Luồng tiêu chuẩn",
                "phases": "DEV + SIT"
              },
              {
                "name": "BE - API danh sách ưu đãi",
                "md": 1.3,
                "status": "done",
                "cx": 4,
                "reason": "Truy vấn/Lọc dữ liệu",
                "phases": "DEV + SIT"
              },
              {
                "name": "BE- API chi tiết ưu đãi",
                "md": 0.8,
                "status": "done",
                "cx": 3,
                "reason": "CRUD cơ bản / Luồng tiêu chuẩn",
                "phases": "DEV + SIT"
              }
            ]
          },
          {
            "id": "2.6",
            "name": "AI tư vấn vay",
            "items": [
              {
                "name": "MH nhập thông tin AI tư vấn vay",
                "md": 3.8,
                "status": "done",
                "cx": 10,
                "reason": "Logic tính toán/AI tư vấn chuyên sâu + Form nhập liệu nhiều field",
                "phases": "DEV + SIT"
              },
              {
                "name": "BE- API tính toán gói vay",
                "md": 3,
                "status": "done",
                "cx": 8,
                "reason": "Logic tính toán/AI tư vấn chuyên sâu",
                "phases": "DEV + SIT"
              },
              {
                "name": "MH lựa chọn gói vay",
                "md": 0.8,
                "status": "done",
                "cx": 3,
                "reason": "CRUD cơ bản / Luồng tiêu chuẩn",
                "phases": "DEV + SIT"
              },
              {
                "name": "MH kết quả phê duyệt gói vay",
                "md": 2.1,
                "status": "done",
                "cx": 5,
                "reason": "Quy trình phê duyệt nhiều step",
                "phases": "DEV + SIT"
              }
            ]
          },
          {
            "id": "2.7",
            "name": "Đọc QR code",
            "items": [
              {
                "name": "BE- API đọc thông tin QR code",
                "md": 3,
                "status": "done",
                "cx": 6,
                "reason": "Tương tác thiết bị (Camera/QR)",
                "phases": "DEV + SIT"
              }
            ]
          },
          {
            "id": "3",
            "name": "FO - WEB",
            "items": []
          },
          {
            "id": "3.1",
            "name": "Xây dựng framework",
            "items": [
              {
                "name": "Dựng components theo design concept mới",
                "md": 0.8,
                "status": "done",
                "cx": 3,
                "reason": "CRUD cơ bản / Luồng tiêu chuẩn",
                "phases": "DEV + SIT"
              }
            ]
          },
          {
            "id": "3.2",
            "name": "Màn hình trang chủ",
            "items": [
              {
                "name": "Naviagation + Tiện ích trang chủ (chưa có noti)",
                "md": 2.1,
                "status": "done",
                "cx": 5,
                "reason": "Gửi thông báo/SMS/Email",
                "phases": "DEV"
              },
              {
                "name": "Banner Quảng cáo",
                "md": 0.8,
                "status": "done",
                "cx": 3,
                "reason": "CRUD cơ bản / Luồng tiêu chuẩn",
                "phases": "DEV + SIT"
              },
              {
                "name": "Danh sách dự án đã kiểm chứng",
                "md": 1.3,
                "status": "done",
                "cx": 4,
                "reason": "Truy vấn/Lọc dữ liệu",
                "phases": "DEV + SIT"
              },
              {
                "name": "Gợi ý cho bạn (Dự án nổi bật)",
                "md": 0.8,
                "status": "done",
                "cx": 3,
                "reason": "CRUD cơ bản / Luồng tiêu chuẩn",
                "phases": "DEV + SIT"
              }
            ]
          },
          {
            "id": "3.3",
            "name": "Màn hình tìm kiếm thông thường / nâng cao",
            "items": [
              {
                "name": "Màn hình tìm kiếm thông thường",
                "md": 1.3,
                "status": "done",
                "cx": 4,
                "reason": "Truy vấn/Lọc dữ liệu",
                "phases": "DEV + SIT"
              },
              {
                "name": "Màn hình kết quả tìm kiếm",
                "md": 1.3,
                "status": "done",
                "cx": 4,
                "reason": "Truy vấn/Lọc dữ liệu",
                "phases": "DEV + SIT"
              },
              {
                "name": "Tìm kiếm nâng cao màn danh sách dự án",
                "md": 1.3,
                "status": "done",
                "cx": 4,
                "reason": "Truy vấn/Lọc dữ liệu",
                "phases": "DEV + SIT"
              },
              {
                "name": "Tìm kiếm nâng cao màn danh sách căn hộ",
                "md": 1.3,
                "status": "done",
                "cx": 4,
                "reason": "Truy vấn/Lọc dữ liệu",
                "phases": "DEV + SIT"
              }
            ]
          },
          {
            "id": "3.4",
            "name": "Màn hình đăng ký đối tác hệ sinh thái",
            "items": [
              {
                "name": "Form đăng ký hợp tác với BIDV",
                "md": 2.1,
                "status": "done",
                "cx": 5,
                "reason": "Form nhập liệu nhiều field",
                "phases": "DEV + SIT"
              }
            ]
          },
          {
            "id": "3.5",
            "name": "Màn hình Chi tiết Banner",
            "items": [
              {
                "name": "Chi tiết banner",
                "md": 0.8,
                "status": "done",
                "cx": 3,
                "reason": "CRUD cơ bản / Luồng tiêu chuẩn",
                "phases": "DEV + SIT"
              }
            ]
          },
          {
            "id": "3.6",
            "name": "Màn hình thông tin chi tiết dự án",
            "items": [
              {
                "name": "Header: Slide ảnh tổng quan dự án Thiết kế mặt bằng",
                "md": 2.1,
                "status": "done",
                "cx": 5,
                "reason": "Cấu trúc UI/Layout base",
                "phases": "DEV"
              },
              {
                "name": "Thông tin tổng quan dự án + tiến độ thanh toán",
                "md": 0.8,
                "status": "done",
                "cx": 3,
                "reason": "CRUD cơ bản / Luồng tiêu chuẩn",
                "phases": "DEV + SIT"
              },
              {
                "name": "Thư viện hình ảnh + các actions điều hướng",
                "md": 0.8,
                "status": "done",
                "cx": 3,
                "reason": "CRUD cơ bản / Luồng tiêu chuẩn",
                "phases": "DEV + SIT"
              }
            ]
          },
          {
            "id": "3.7",
            "name": "Màn hình Danh sách căn hộ",
            "items": [
              {
                "name": "Bộ lọc + danh sách căn hộ",
                "md": 1.3,
                "status": "done",
                "cx": 4,
                "reason": "Truy vấn/Lọc dữ liệu",
                "phases": "DEV + SIT"
              }
            ]
          },
          {
            "id": "3.8",
            "name": "Màn hình Thông tin chi tiết căn hộ",
            "items": [
              {
                "name": "Thông tin chi tiết căn hộ",
                "md": 0.8,
                "status": "done",
                "cx": 3,
                "reason": "CRUD cơ bản / Luồng tiêu chuẩn",
                "phases": "DEV + SIT"
              }
            ]
          },
          {
            "id": "3.9",
            "name": "Xây dựng Web đáp ứng tiêu chuẩn SEO",
            "items": [
              {
                "name": "SEO website",
                "md": 3,
                "status": "done",
                "cx": 7,
                "reason": "Tích hợp hệ thống/3rd party phức tạp",
                "phases": "DEV"
              }
            ]
          }
        ]
      }
    ]
  }
];
