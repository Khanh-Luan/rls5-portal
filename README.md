# RLS5 — Royal Los Santos 5 (`D:\fivem-rp-dev`)

Dự án máy chủ **RLS5 (Royal Los Santos 5)** chuẩn **FiveM (GTA V Roleplay)** được tổ chức để:
1. **Dev & test logic backend + giao diện NUI ngay trên máy không cần cài GTA V** (`npm test` và `npm run preview`).
2. **Chạy được trực tiếp trên FXServer thật** cho tester có GTA V vào test hoặc đẩy nguyên folder lên VPS.

## Cấu trúc thư mục

```text
D:\fivem-rp-dev\
├── package.json
├── README.md
├── portal-web/                           # Cổng Web Server (phong cách Midnight-Navy / HUD GTA5VN)
│   ├── index.html
│   ├── style.css
│   ├── server-config.js                  # Địa chỉ IP/tên miền server & tạo link fivem://connect/
│   └── app.js
├── server-data/
│   ├── server.cfg                        # Cấu hình FXServer thật
│   ├── database/schema.sql               # Bảng MariaDB/MySQL mẫu
│   └── resources/[local]/rp-core/        # Resource FiveM chuẩn (fxmanifest.lua)
│       ├── fxmanifest.lua
│       ├── shared/config.js              # Nghề nghiệp, lương, tiền khởi tạo
│       ├── server/economy.js             # Logic kinh tế/nghề nghiệp thuần
│       ├── server/main.js                # Events, commands & exports trên FXServer
│       ├── client/main.js                # NUI callbacks & phím F5 trên FiveM client
│       └── web/                          # Giao diện HUD & Ví tiền in-game (NUI)
├── tools/dev-preview.js                  # Chạy Portal (/) + NUI (/nui) tại localhost:3000
└── tests/economy.test.js                 # Unit test logic server bằng node:test
```

## 1. Chạy thử ngay (Không cần GTA V & chưa cần FXServer)

Mở terminal tại `D:\fivem-rp-dev`:

```powershell
# Chạy kiểm thử tự động logic ví tiền, chuyển khoản, đổi nghề, phát lương
npm test

# Bật Cổng Web Server + NUI preview trên trình duyệt
npm run preview
```

Sau đó mở trình duyệt vào:
- `http://127.0.0.1:3000/` — Trang web Cổng thông tin Server (Tin tức, Trailer, Hướng dẫn Tester, Bảng xếp hạng & Ví tiền trực tiếp).
- `http://127.0.0.1:3000/nui/` — Xem trước giao diện NUI HUD & Ví tiền trong game.

## 2. Đưa Web Portal lên GitHub Pages miễn phí 24/24

Repo đã có sẵn `.gitignore`, `tools/build-pages.js` và GitHub Actions `.github/workflows/pages.yml`:

1. Tạo một repository mới trên GitHub và đẩy toàn bộ thư mục `D:\fivem-rp-dev` lên nhánh `main`:
   ```powershell
   git init -b main
   git add .
   git commit -m "Initial RLS5 portal and rp-core"
   git remote add origin https://github.com/<ten_github>/<ten_repo>.git
   git push -u origin main
   ```
2. Trên GitHub, vào **Settings → Pages → Source** chọn **GitHub Actions**.
3. Workflow tự chạy `npm test` và `npm run build:pages`, sau đó cấp link sống 24/24 tại `https://<ten_github>.github.io/<ten_repo>/` (gồm cả trang chủ và `/nui/`).
4. *(Lưu ý: GitHub Pages chỉ host phần Web; server game `FXServer` cho tester vào chơi vẫn cần chạy trên máy dev qua ZeroTier/Radmin hoặc VPS).*

## 3. Đưa lên FXServer thật cho Tester vào chơi

1. Cài **MariaDB / MySQL** và import file `server-data/database/schema.sql` (nếu mở rộng lưu database lâu dài).
2. Tải **FXServer Artifacts** bản mới nhất cho Windows từ cổng runtime chính thức của Cfx.re và giải nén vào `D:\fivem-rp-dev\fxserver\`.
3. Tạo key miễn phí tại **Cfx.re Portal** (tối đa 48 slot miễn phí với OneSync) và điền vào `sv_licenseKey` trong `server-data/server.cfg`.
4. Chạy `FXServer.exe`, cấu hình qua `txAdmin` (`http://localhost:40120`) trỏ về `server-data` (hoặc copy folder `resources/[local]/rp-core` vào `resources/[local]/` của txAdmin recipe như CFX Default / Qbox / QBCore rồi thêm `ensure rp-core` vào `server.cfg`).
5. Mở port `30120` (TCP/UDP) trên router/VPS (hoặc dùng VPN LAN như ZeroTier/Radmin khi test nội bộ) để tester có GTA V mở FiveM bấm `F8` và gõ:
   ```text
   connect <IP_CUA_BAN>:30120
   ```

## Lệnh trong game / console FXServer

- `F5` hoặc `/rphud` (client): Bật/tắt bảng Ví tiền & Nghề nghiệp.
- `/balance` (client): Xem nhanh số dư tiền mặt và ngân hàng.
- `/pay <id> <so_tien>` (client): Chuyển khoản ngân hàng cho người chơi khác.
- `/setjob <id> <ma_nghe>` (console/admin): Đổi nghề (`unemployed`, `delivery`, `mechanic`, `police`).
- `/addcash <id> <so_tien>` (console/admin): Cộng tiền mặt để test.
