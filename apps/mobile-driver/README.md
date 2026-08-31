# GreenLogix Driver Web

## Overview
Giao diện web responsive dành riêng cho tài xế giao nhận, không yêu cầu cài ứng dụng:
- **Nhận tuyến giao hàng**: Xem danh sách điểm giao đã được sắp xếp theo thứ tự tối ưu nhất.
- **Chỉ dẫn Turn-by-Turn**: Dẫn đường tránh điểm ùn tắc theo thời gian thực.
- **Xác thực giao hàng (POD)**: Chụp ảnh kiện hàng, chữ ký điện tử khách hàng, cập nhật trạng thái đơn.
- **Ghép đơn chiều về (Backhaul)**: Nhận thông báo lấy hàng chiều về trên đường quay về kho để tăng thu nhập.

## Tech Stack (Planned)
- React + TypeScript, triển khai dưới dạng Progressive Web App khi cần.
- Web Geolocation API và kết nối GPS theo quyền người dùng.
- Cache trình duyệt để duy trì các tác vụ thiết yếu khi kết nối không ổn định.
