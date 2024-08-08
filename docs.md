登录

#### **URL**

`POST /api/login`

#### **请求头**

```http
Content-Type: application/json
```

#### **请求体**

```json
{
  "username": "string",
  "password": "string"
}
```

#### **响应**

##### 成功响应

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token-string"
}
```

##### 失败响应

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json
```

```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

#### **示例**

##### 请求示例

```http
POST /api/login HTTP/1.1
Host: example.com
Content-Type: application/json

{
  "username": "user123",
  "password": "password123"
}
```

##### 成功响应示例

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

##### 失败响应示例

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "success": false,
  "message": "Invalid username or password"
}
```

### 说明

* **请求头** ：必须包含 `Content-Type: application/json`。
* **请求体** ：包含 `username` 和 `password` 字段，均为字符串类型。
* **成功响应** ：返回 `success` 为 `true`，并包含一条成功消息和一个 JWT 令牌。
* **失败响应** ：返回 `success` 为 `false`，并包含一条错误消息。
