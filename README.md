# PawsHope (monorepo)

Trong `PawsHope_Home` có **hai thư mục độc lập** ngang hàng:

- **`frontend/`** — toàn bộ ứng dụng React + Vite + Tailwind (UI, gọi API, build ra `dist/`).
- **`backend/`** — riêng Spring Boot + Maven (`pom.xml`, `src/main/java/`, API).

Hai phần chỉ “nói chuyện” qua HTTP (ví dụ `VITE_API_URL` trỏ tới `http://localhost:4000/api`).

## Cấu trúc

```
PawsHope_Home/
├── README.md                 ← hướng dẫn này
├── package.json              ← lệnh npm rút gọn (gọi vào frontend/)
├── frontend/                 ← UI: package.json, src/, public/, .env.local …
│   └── ...
└── backend/                  ← API: pom.xml, mvnw, src/main/java/, api.http …
    └── ...
```

## Chạy dev

Từ **gốc** `PawsHope_Home`:

```powershell
npm run dev              # Vite → http://localhost:5173 (thư mục frontend/)
```

Terminal khác:

```powershell
npm run backend:dev      # Spring Boot → http://localhost:4000
```

Hoặc từng thư mục:

```powershell
cd frontend && npm run dev
cd backend && .\mvnw.cmd spring-boot:run
```

Chi tiết API/DB: **`backend/README.md`**.
