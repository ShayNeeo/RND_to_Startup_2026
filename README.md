# 🚛 GreenLogix Platform (Powered by CargoX Engine)

> **B2B SaaS Urban Logistics Optimization & ISO 14083 / GLEC Carbon Accounting**  
> Giải pháp tối ưu tuyến đường giao nhận đa ràng buộc (VRPTW) kết hợp kiểm kê và báo cáo phát thải CO₂ tự động cho bưu cục và doanh nghiệp vận tải đô thị.

[![Live Landing Page](https://img.shields.io/badge/Live_Demo-cargox--group.pages.dev-FFDA00?style=for-the-badge&logo=cloudflare&logoColor=black)](https://cargox-group-3qm.pages.dev)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-Cloudflare_Pages-F38020?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/ShayNeeo/RND_to_Startup_2026/actions)

---

## 🏛️ Kiến Trúc Hệ Thống Monorepo (`pnpm-workspace`)

```text
.
├── apps/
│   ├── landing/              # CargoX / GreenLogix Full-Viewport & Scrolling Landing Page
│   │   ├── src/
│   │   │   ├── components/   # Navbar, Hero, Solutions, Calculator, Workflow, Showcase, Pricing, Modal
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   └── package.json      # @greenlogix/landing
│   ├── web-portal/           # [Future] Web Portal điều phối viên bưu cục (Dispatcher Console)
│   └── mobile-driver/        # [Legacy placeholder] Luồng tài xế được triển khai trên web responsive
├── packages/
│   └── shared-types/         # [Future] Shared TypeScript types, VRPTW contracts & ESG schemas
├── docs/
│   └── planning/             # Hồ sơ quy hoạch dự án, BRAINSTORM_IDEA.md, Mô hình tài chính CAPEX/OPEX
├── .github/
│   └── workflows/
│       └── deploy-landing.yml # Tự động Build & Deploy Landing Page lên Cloudflare Pages
├── pnpm-workspace.yaml       # Cấu hình không gian làm việc Monorepo
└── package.json              # Scripts điều phối toàn bộ hệ thống
```

---

## 🛠️ Hướng Dẫn Phát Triển Local

### Yêu Cầu Cài Đặt
- **Node.js**: `>= 20.x`
- **pnpm**: `>= 10.x`

### Các Lệnh Thao Tác Cơ Bản
```bash
# 1. Cài đặt toàn bộ dependencies cho monorepo
pnpm install

# 2. Khởi chạy môi trường Dev cho Landing Page
pnpm run dev:landing

# 3. Build kiểm tra Landing Page
pnpm run build:landing

# 4. Preview bản build
pnpm run preview:landing
```

---

## 🚀 Hướng Dẫn Kích Hoạt CI/CD Tự Động (Cloudflare Pages)

Mỗi khi bạn `git push` lên nhánh `main`, GitHub Actions sẽ tự động kích hoạt workflow `.github/workflows/deploy-landing.yml` để build và deploy lên Cloudflare Pages.

Để workflow hoạt động thành công, bạn chỉ cần thêm **2 Secret** vào GitHub Repository:

### 1. Lấy thông tin từ Cloudflare Dashboard:
1. Đăng nhập [dash.cloudflare.com](https://dash.cloudflare.com).
2. **Lấy `CLOUDFLARE_ACCOUNT_ID`**:
   - Chọn mục **Workers & Pages** ở thanh điều hướng bên trái.
   - Nhìn sang cột bên phải màn hình, copy chuỗi **Account ID** (dài 32 ký tự).
3. **Tạo `CLOUDFLARE_API_TOKEN`**:
   - Truy cập vào: [My Profile > API Tokens](https://dash.cloudflare.com/profile/api-tokens).
   - Nhấn **Create Token** > Chọn template **Edit Cloudflare Workers** (hoặc Custom Token cấp quyền `Account > Cloudflare Pages > Edit`).
   - Nhấn **Continue to summary** > **Create Token** và copy mã token vừa sinh ra.

### 2. Thêm vào GitHub Repository Secrets:
1. Truy cập Repository trên GitHub: `https://github.com/ShayNeeo/RND_to_Startup_2026/settings/secrets/actions`.
2. Nhấn **New repository secret** và thêm 2 biến:
   - Tên: `CLOUDFLARE_ACCOUNT_ID` — Giá trị: *[Dán Account ID của bạn]*
   - Tên: `CLOUDFLARE_API_TOKEN` — Giá trị: *[Dán API Token của bạn]*
3. Nhấn **Add secret** để lưu.

Từ nay, mọi commit hoặc pull request merge vào `main` sẽ tự động cập nhật lên [https://cargox-group-3qm.pages.dev](https://cargox-group-3qm.pages.dev).

---

## 📜 Căn Cứ Pháp Lý & Định Hướng Phát Triển
- **Quyết định 2229/QĐ-TTg**: Kế hoạch phát triển dịch vụ logistics Việt Nam đến năm 2030, tầm nhìn 2050 (Ưu tiên chuyển đổi số & logistics xanh).
- **Quyết định 876/QĐ-TTg**: Chương trình chuyển đổi năng lượng xanh, giảm phát thải khí carbon ngành Giao thông vận tải đến Net Zero 2050.
- **Tiêu chuẩn ISO 14083 / GLEC Framework**: Phương pháp luận quốc tế về định lượng và báo cáo phát thải khí nhà kính trong chuỗi vận tải.
- **Nghị định 13/2023/NĐ-CP**: Tuân thủ tuyệt đối quy định bảo vệ dữ liệu cá nhân của tài xế và khách hàng.
