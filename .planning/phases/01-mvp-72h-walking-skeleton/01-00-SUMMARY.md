---
phase: 01-mvp-72h-walking-skeleton
plan: "00"
status: api_ready_for_review
verified_on: 2026-09-06
cr_id: CR-20260906-001
branch: cr/001-chien-api
worktree: WT-01
---

# Wave 0 — API sẵn sàng review trên nhánh riêng

**Chỉ phần API đã được kiểm chứng.** Người dùng đã yêu cầu commit/push lên nhánh riêng `cr/001-chien-api`. Chưa xác nhận Flutter, chưa mở PR/merge; không đánh dấu toàn bộ Wave 0 hoàn tất.

## Vị trí review và Git

- Worktree: `.worktrees/cr-001-api` trong checkout gốc, nhánh riêng `cr/001-chien-api`. Giữ nguyên tên thư mục để không ảnh hưởng môi trường Python đã tạo.
- Checkout gốc ở detached HEAD cùng commit `c4941b7`; README đang sửa, onboarding docs và `task/` của người dùng giữ nguyên ở đó, không được đưa vào bản sửa này.
- Kiểm tra trực tiếp GitHub ngày 2026-09-06 trước khi push: nhánh cũ `cr/001-api` head `c4941b7f192660decba45c6e5201f1daea2228ce`, `dev` head `05ae53e763d7847392e503f7271e7a5f2cac5145`. Nhánh riêng kế thừa hai commit scaffold trên nền `dev`, rồi thêm commit hoàn thiện Wave 0; không sửa lịch sử nhánh cũ.
- Scope và danh sách file: `changes/CR-20260906-001.md`. Các CR cũ và `PLAN.md` không bị sửa.

## Thay đổi contract

- Giữ nguyên 15 đường dẫn nghiệp vụ, HTTP methods và JSON keys, trừ multipart ảnh được chốt lại bên dưới. Không thêm dependency hoặc sửa lockfile.
- Thêm enum cho loại hàng, nhiên liệu, trạng thái xe/đơn/điểm giao, loại điểm và lý do thất bại.
- PATCH đơn kiểm tra tọa độ hữu hạn trong miền hợp lệ, kg không âm, giờ `HH:MM`. PATCH xe kiểm tra tải trọng và mức tiêu hao hữu hạn, dương. Radius optimize hữu hạn, dương, mặc định 3.0 km.
- `failed` phải có reason không null thuộc `khach_vang|sai_dia_chi|hang_hong|tu_choi`; sai dữ liệu trả `422`.
- **Cần Thanh xác nhận:** upload ảnh dùng field `photo`, thay cho `file`; import Excel vẫn dùng `file`. Không sửa Flutter. OpenAPI đã sinh lại và được test so với runtime.
- Sửa lỗi tìm thấy khi kiểm tra: đầu vào `NaN`, vô cực hoặc số tràn như `1e999` trước đây khiến serialize validation error trả `500`; nay trả `422` với error detail JSON hợp lệ.
- Không triển khai xử lý nghiệp vụ: seed/import/optimize/publish/report vẫn rỗng hoặc zero; PATCH/DELETE đơn, PATCH xe, status/photo vẫn `503` khi request hợp lệ.

## Kết quả kiểm chứng

| Kiểm tra | Kết quả |
|----------|---------|
| `uv sync --locked --project apps/api` | Thành công với Python 3.12.14; không sửa dependency/lockfile |
| `uv run --locked pytest -q` | **191 passed**, gồm 7 test ban đầu |
| `uv run --locked ruff check src tests` | Passed |
| Ruff format check cho main, schemas và tests | Passed |
| Uvicorn thật, bind `0.0.0.0` với cổng tạm | Health/OpenAPI public, dispatcher/driver auth, thiếu/sai vai trò đều đạt; demo bật/tắt đều đạt |
| SQLite | Test dùng DB tạm riêng từng case; startup tạo orders/vehicles/routes/stops; smoke cũng dùng DB tạm |
| Bảo toàn checkout gốc | SHA-256 của 14 file đã ghi nhận khớp, gồm README, onboarding docs, task và DB demo |
| `git diff --check` | Passed; không sửa các đường dẫn cấm; chỉ stage/commit các file Wave 0 đã chốt |

Auth tests dùng payload hợp lệ, kiểm tra từng endpoint với demo unset/0/1, credential thiếu/sai/đúng và nhầm vai trò. Contract tests kiểm tra endpoint/method, enums, các biên giá trị, multipart name và OpenAPI snapshot.

## Xem diff và chạy thử

Từ checkout gốc:

```bash
cd .worktrees/cr-001-api
git status --short
git diff --stat origin/dev...HEAD
git diff origin/dev...HEAD -- apps/api
cd apps/api
uv run --locked pytest -q
GREENLOGIX_DEMO=1 uv run --locked uvicorn greenlogix_api.main:app --host 0.0.0.0 --port 8000
```

Sau khi commit, các lệnh diff trên hiển thị toàn bộ phần API khác `dev`, gồm scaffold ban đầu và bản hoàn thiện. Dùng `git show --stat HEAD` để xem riêng commit hoàn thiện Wave 0.

Lệnh curl và expected responses ở `apps/api/README.md`. Đây vẫn là API skeleton; không có màn hình điều phối hoàn chỉnh để demo Wave 1.

## Còn chờ trước khi kết thúc toàn bộ Wave 0

- Người dùng review nhánh riêng và integrator review scope/contract.
- Thanh xác nhận tên `photo`, thử `/health` và `/driver/route` với PIN `0000`, kiểm tra parse dữ liệu trên Flutter. Chưa chạy Flutter tests hoặc kiểm tra thiết bị trong lần làm này.
- Commit/push nhánh riêng đã được người dùng yêu cầu. Bước sau là PR `cr/001-chien-api` vào `dev` theo template `feature-to-dev`; không tự merge.
