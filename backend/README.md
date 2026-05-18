# PawsHope Backend (Java Spring Boot)

REST API cho hệ thống cứu hộ và nhận nuôi chó mèo PawsHope.

## Front-end (React)

Giao diện nằm **cùng cấp** với thư mục này, không nằm bên trong `backend/`:

- Thư mục: **`../frontend/`** (tức `PawsHope_Home/frontend/`)
- Chạy: `cd frontend` rồi `npm run dev`, hoặc từ gốc repo: `npm run dev` (đã cấu hình `--prefix frontend`)

**Lưu ý:** Trong `backend/` chỉ có Spring Boot theo chuẩn Maven (`src/main/java`, `pom.xml`). Mã React/TypeScript nằm trong `frontend/src/`, tách biệt hoàn toàn.

## Tech stack

- **Java**: 21 (LTS) - Microsoft OpenJDK
- **Framework**: Spring Boot 4.0.6 (`spring-boot-starter-webmvc`)
- **DB**: MySQL/MariaDB 10+ với `com.mysql:mysql-connector-j`
- **Persistence**: Spring JDBC + JdbcTemplate (raw SQL, không dùng ORM)
- **Build tool**: Maven (kèm Maven Wrapper `mvnw` - không cần cài Maven riêng)
- **Auth**: JWT (`io.jsonwebtoken:jjwt 0.12.6`) + BCrypt (`at.favre.lib:bcrypt`)
- **Validation**: Jakarta Bean Validation (`spring-boot-starter-validation`)

## Yêu cầu

- **JDK 21+** (hoặc 17+ tối thiểu - nhưng pom đang đặt 21)
- **MySQL/MariaDB** đang chạy ở `localhost:3306` (XAMPP, MariaDB standalone đều OK)
- Không cần cài Maven - dùng `mvnw.cmd` / `./mvnw`

## Cấu hình

Mọi config nằm trong `src/main/resources/application.yml`. Có thể override bằng env var:

| Biến môi trường           | Mặc định                                   | Mô tả                          |
|---------------------------|--------------------------------------------|--------------------------------|
| `SERVER_PORT`             | `4000`                                     | Cổng HTTP                      |
| `SPRING_DATASOURCE_URL`   | `jdbc:mysql://localhost:3306/pawshope?...` | JDBC URL                       |
| `SPRING_DATASOURCE_USERNAME` | `root`                                  | User DB                        |
| `SPRING_DATASOURCE_PASSWORD` | (rỗng)                                  | Password DB                    |
| `APP_CORS_ORIGIN`         | `http://localhost:5173`                    | Origin frontend cho CORS       |
| `APP_JWT_SECRET`          | (dev)                                      | Secret ký JWT (**đổi prod**!)  |
| `APP_JWT_EXPIRES_IN_DAYS` | `7`                                        | Thời gian sống token           |
| `APP_INIT_DB`             | `false`                                    | `true` → tự chạy schema + seed |

## Khởi tạo DB

Có 2 cách:

**A. Tự động qua app** - set env trước khi chạy:
```powershell
$env:APP_INIT_DB="true"
.\mvnw.cmd spring-boot:run
```
Hoặc truyền argument:
```powershell
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.arguments=--init-db"
```
Sau khi DB đã tạo xong, **tắt** `APP_INIT_DB` để tránh xoá dữ liệu khi restart.

**B. Chạy SQL tay** (XAMPP / DBeaver / mysql CLI):
```sql
CREATE DATABASE pawshope CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pawshope;
SOURCE backend/src/main/resources/db/schema.sql;
```
Sau đó dùng app để insert seed data, hoặc tự insert.

### Tài khoản mặc định (sau khi seed)

| Username    | Password       | Role      |
|-------------|----------------|-----------|
| `admin`     | `admin123`     | Admin     |
| `volunteer1`| `volunteer123` | Volunteer |
| `user1`     | `user123`      | User      |

## Chạy dev

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

App khởi động ở `http://localhost:4000`. Spring DevTools tự reload khi `.class` thay đổi.

## Build production

```powershell
.\mvnw.cmd clean package -DskipTests
java -jar target\pawshope-backend-0.0.1-SNAPSHOT.jar
```

## Cấu trúc package

```
net.pawshope/
├── PawshopeBackendApplication.java      # entry point
├── config/
│   ├── AppProperties.java               # @ConfigurationProperties cho app.*
│   └── WebConfig.java                   # CORS
├── common/
│   ├── ApiException.java                # exception chứa HTTP status
│   ├── ApiResponse.java                 # wrapper { success, data, items, pagination }
│   ├── GlobalExceptionHandler.java      # @RestControllerAdvice xử lý validation, ApiException
│   ├── HealthController.java            # GET /api/health
│   ├── PasswordUtil.java                # BCrypt wrapper
│   └── DbInitializer.java               # tuỳ chọn: chạy schema.sql khi APP_INIT_DB=true
├── security/
│   ├── JwtUtil.java                     # sign/verify HS256, tracking code generator
│   ├── AuthPrincipal.java               # record { userId, username, role }
│   ├── CurrentUser.java                 # @RequestScope holder
│   └── AuthFilter.java                  # OncePerRequestFilter đọc Authorization header
└── <module>/                            # mỗi module 1 package
    ├── <Module>Controller.java
    ├── <Module>Service.java (nếu phức tạp)
    └── <Module>Dto.java
```

## Pattern code chung

- **JdbcTemplate**: dùng `queryForList`, `queryForObject`, `update`, `queryForMap` cho query đơn giản
- **SimpleJdbcInsert**: dùng cho insert có `RETURN GENERATED KEYS` (lấy ID vừa tạo)
- **@Transactional**: trên service method nếu cần atomic multi-statement (xem `AdoptionController.review`, `OrderController.checkout`)
- **Validation**: thêm annotation Jakarta Bean Validation (`@NotBlank`, `@Size`, `@Pattern`...) vào DTO record
- **Auth**: gọi `currentUser.requireRole("Admin", "Volunteer")` trong controller. Cho phép anonymous bằng `currentUser.isAuthenticated()`

## API endpoints

Base URL: `http://localhost:4000/api`

### Auth (`/api/auth`)
| Method | Path        | Auth        | Mô tả                            |
|--------|-------------|-------------|----------------------------------|
| POST   | `/register` | public      | Đăng ký user                     |
| POST   | `/login`    | public      | Đăng nhập, trả về JWT            |
| GET    | `/me`       | Bearer      | Thông tin user hiện tại          |

### Rescue (`/api/rescue-reports`)
| Method | Path             | Auth                | Mô tả                              |
|--------|------------------|---------------------|------------------------------------|
| POST   | `/`              | public/optional     | Báo cáo cứu hộ (có thể ẩn danh)    |
| GET    | `/public-stats`  | public              | Số liệu thống kê tổng quát         |
| GET    | `/track/{code}`  | public              | Tra cứu trạng thái theo mã         |
| GET    | `/`              | Admin/Volunteer     | Danh sách (filter, paging)         |
| GET    | `/stats`         | Admin/Volunteer     | Stats nội bộ                       |
| GET    | `/{id}`          | Admin/Volunteer     | Chi tiết                           |
| PATCH  | `/{id}`          | Admin/Volunteer     | Cập nhật status, assign            |
| DELETE | `/{id}`          | Admin               | Xoá                                |

### Pets, Kennels, Adoptions, Products, Cart, Orders
Theo CRUD pattern chuẩn. Xem `api.http` để có example đầy đủ.

### Donations (`/api/donations`)
| Method | Path       | Auth                | Mô tả                          |
|--------|------------|---------------------|--------------------------------|
| POST   | `/money`   | optional            | Quyên góp tiền                 |
| POST   | `/items`   | optional            | Quyên góp vật phẩm             |
| GET    | `/`        | public              | List donation (ẩn user_id)     |
| GET    | `/stats`   | public              | Tổng tiền                      |
| GET    | `/items`   | Admin/Volunteer     | List vật phẩm donate           |

### Volunteers
| Method | Path                                | Auth              | Mô tả                              |
|--------|-------------------------------------|-------------------|------------------------------------|
| POST   | `/api/volunteer-applications`       | public            | Đơn xin làm tình nguyện viên       |
| GET    | `/api/volunteer-applications`       | Admin             | Danh sách đơn                      |
| PATCH  | `/api/volunteer-applications/{id}`  | Admin             | Duyệt/từ chối                      |
| GET    | `/api/shifts`                       | public            | Danh sách ca trực                  |
| POST   | `/api/volunteer-schedules`          | Volunteer/Admin   | Đăng ký ca                         |
| GET    | `/api/volunteer-schedules/my`       | Bearer            | Lịch trực của tôi                  |
| DELETE | `/api/volunteer-schedules/{id}`     | Bearer            | Huỷ đăng ký                        |

### Notifications (`/api/notifications`)
| Method | Path             | Auth   | Mô tả                          |
|--------|------------------|--------|--------------------------------|
| GET    | `/`              | Bearer | Danh sách thông báo của tôi    |
| GET    | `/unread-count`  | Bearer | Đếm chưa đọc                   |
| PATCH  | `/{id}/read`     | Bearer | Đánh dấu đã đọc                |
| PATCH  | `/read-all`      | Bearer | Đánh dấu tất cả đã đọc         |

### Expenses (`/api/expenses`) - Admin only
List / Summary / Create / Delete chi phí vận hành.

## Format response

Thành công:
```json
{ "success": true, "data": { ... } }
```
hoặc khi paging:
```json
{ "success": true, "items": [...], "pagination": { "page":1, "limit":20, "total":100, "totalPages":5 } }
```

Lỗi:
```json
{ "success": false, "message": "...", "details": [...] }
```

| Status | Khi nào                                |
|--------|----------------------------------------|
| 400    | Validation, body sai                   |
| 401    | Thiếu/token không hợp lệ               |
| 403    | Không đủ role                          |
| 404    | Không tìm thấy                         |
| 409    | Conflict (trùng user, pet đã adopted...) |
| 500    | Server error - đã được log             |

## Test thủ công

Mở file `api.http` bằng VS Code (extension REST Client) hoặc IntelliJ HTTP Client để gọi từng endpoint.

## Troubleshooting

- **Port 4000 đã chiếm**: kill process Java cũ hoặc đổi `SERVER_PORT`.
- **`Access denied for user 'root'`**: chỉnh `SPRING_DATASOURCE_USERNAME/PASSWORD` cho khớp MySQL local.
- **Vietnamese hiển thị "?????"**: kiểm tra DB tạo với `CHARACTER SET utf8mb4`. JDBC URL trong project đã có `characterEncoding=utf8`.
- **`UnsatisfiedDependencyException` về Jackson**: project đang trên Spring Boot 4 dùng Jackson 3 (`tools.jackson.*`). Đừng dùng config Jackson 2.x cũ.
