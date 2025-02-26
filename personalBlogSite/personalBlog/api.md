# Updated API Documentation with Bearer Authentication

## Authentication

### Login

**Endpoint:**
```http
POST /api/login/
```

**Headers:**
```http
Content-Type: application/json
```

**Body:**
```json
{
    "username": "test_user",
    "password": "test_password"
}
```

**Successful Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json
```
```json
{
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Category API

### Create Category

**Endpoint:**
```http
POST /api/category/
```

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer ${jwtToken}
```

**Body:**
```json
{
    "category_name": "Yeni Kategori"
}
```

**Successful Response:**
```http
HTTP/1.1 201 Created
Content-Type: application/json
```
```json
{
    "category_name": "Yeni Kategori"
}
```

### List All Categories

**Endpoint:**
```http
GET /api/category/
```

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer ${jwtToken}
```

**Successful Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json
```
```json
[
    {
        "id": 1,
        "category_name": "Yeni Kategori"
    },
    {
        "id": 2,
        "category_name": "Başka Kategori"
    }
]
```

### Get Category by ID

**Endpoint:**
```http
GET /api/category/{id}/
```

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer ${jwtToken}
```

**Successful Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json
```
```json
{
    "id": 1,
    "category_name": "Yeni Kategori"
}
```

### Update Category

**Endpoint:**
```http
PUT /api/category/
```

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer ${jwtToken}
```

**Body:**
```json
{
    "category_id": 1,
    "category_name": "Güncellenmiş Kategori"
}
```

**Successful Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json
```
```json
{
    "id": 1,
    "category_name": "Güncellenmiş Kategori"
}
```

### Delete Category

**Endpoint:**
```http
DELETE /api/category/
```

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer ${jwtToken}
```

**Body:**
```json
{
    "category_id": 1
}
```

**Successful Response:**
```http
HTTP/1.1 204 No Content
```

---

## Blog API

### Create Blog

**Endpoint:**
```http
POST /api/blog/
```

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer ${jwtToken}
```

**Body:**
```json
{
    "title": "Blog Başlığı",
    "content": "Blog içeriği",
    "photo": "<dosya_ismi>",
    "category": "Kategori Adı"
}
```

**Successful Response:**
```http
HTTP/1.1 201 Created
Content-Type: application/json
```
```json
{
    "id": 1,
    "title": "Blog Başlığı",
    "content": "Blog içeriği",
    "photo": "media_path_of_photo",
    "category": 1,
    "user_id": 1
}
```

### List All Blogs

**Endpoint:**
```http
GET /api/blog/
```

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer ${jwtToken}
```

**Successful Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json
```
```json
[
    {
        "id": 1,
        "title": "Blog Başlığı",
        "content": "Blog içeriği",
        "photo": "media_path_of_photo",
        "category": 1,
        "user_id": 1
    }
]
```

**Filter by Category:**
```http
GET /api/blog/?category_id=1
```

### Get Blog by ID

**Endpoint:**
```http
GET /api/blog/{id}/
```

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer ${jwtToken}
```

**Successful Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json
```
```json
{
    "id": 1,
    "title": "Blog Başlığı",
    "content": "Blog içeriği",
    "photo": "media_path_of_photo",
    "category": 1,
    "user_id": 1
}
```

### Update Blog

**Endpoint:**
```http
PUT /api/blog/
```

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer ${jwtToken}
```

**Body:**
```json
{
    "blog_id": 1,
    "title": "Güncellenmiş Başlık",
    "content": "Güncellenmiş İçerik",
    "photo": "<yeni_dosya>",
    "category": "Yeni Kategori Adı"
}
```

**Successful Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json
```
```json
{
    "id": 1,
    "title": "Güncellenmiş Başlık",
    "content": "Güncellenmiş İçerik",
    "photo": "updated_media_path",
    "category": 2,
    "user_id": 1
}
```

### Delete Blog

**Endpoint:**
```http
DELETE /api/blog/
```

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer ${jwtToken}
```

**Body:**
```json
{
    "blog_id": 1
}
```

**Successful Response:**
```http
HTTP/1.1 204 No Content
```

---

## Comment API

### Add Comment

**Endpoint:**
```http
POST /api/comment/
```

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer ${jwtToken}
```

**Body:**
```json
{
    "comment_text": "Yorum içeriği",
    "blog_id": 1,
    "user_id": 1
}
```

**Successful Response:**
```http
HTTP/1.1 201 Created
Content-Type: application/json
```
```json
{
    "id": 1,
    "comment_text": "Yorum içeriği",
    "blog_id": 1,
    "user_id": 1
}
```

### List Comments

**Endpoint:**
```http
GET /api/comment/?blog_id=1
```

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer ${jwtToken}
```

**Successful Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json
```
```json
[
    {
        "id": 1,
        "comment_text": "Yorum içeriği",
        "blog_id": 1,
        "user_id": 1
    }
]
```

### Update Comment

**Endpoint:**
```http
PUT /api/comment/
```

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer ${jwtToken}
```

**Body:**
```json
{
    "comment_id": 1,
    "comment_text": "Güncellenmiş Yorum"
}
```

**Successful Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json
```
```json
{
    "id": 1,
    "comment_text": "Güncellenmiş Yorum",
    "blog_id": 1,
    "user_id": 1
}
```

### Delete Comment

**Endpoint:**
```http
DELETE /api/comment/
```

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer ${jwtToken}
```

**Body:**
```json
{
    "comment_id": 1
}
```

**Successful Response:**
```http
HTTP/1.1 204 No Content
```

---

## User Role Check API

### Check User Role

**Endpoint:**
```http
GET /api/check_user/
```

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer ${jwtToken}
```

**Successful Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json
```
```json
{
    "Role": "Mod"
}
```

---

## Password Change API

### Change Password

**Endpoint:**
```http
POST /api/change_password/
```

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer ${jwtToken}
```

**Body:**
```json
{
    "old_password": "mevcut_sifre",
    "new_password": "yeni_sifre"
}
```

**Successful Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json
```
```json
{
    "message": "Şifre başarıyla güncellendi"
}
```

---

## Admin User Management

### Add User

**Endpoint:**
```http
POST /api/add-user/
```

**Headers:**
```http
Content-Type: application/json
```

**Body:**
```json
{
    "admin_password": "admin",
    "username": "new_user",
    "first_name": "New",
    "last_name": "User",
    "email": "new_user@example.com",
    "password": "secure_password123",
    "role": "Mod"
}
```

**Successful Response:**
```http
HTTP/1.1 201 Created
```