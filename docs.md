# API 文档

## 权限相关

### 登录

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

### 验证 Token 接口

#### **URL**

`POST /api/isTokenValid`

#### **方法**

`POST`

#### **描述**

验证客户端提供的 JWT token 是否有效。

#### **请求头**

```http
Authorization: Bearer <token>
Content-Type: application/json
```

#### **请求体**

无

#### **响应**

##### 成功响应

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "message": "Token is valid"
}
```

##### 失败响应

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json
```

```json
{
  "message": "Token is invalid or missing"
}
```

##### 错误响应

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
```

```json
{
  "message": "Internal server error"
}
```

### 注册

#### **URL**

`POST /api/register`

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
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
  "success": true,
  "message": "Registration successful",
  "token": "jwt-token-string"
}
```

##### 失败响应

###### 用户名已存在

```http
HTTP/1.1 409 Conflict
Content-Type: application/json
```

```json
{
  "success": false,
  "message": "Username already exists"
}
```

###### 其他错误

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
```

```json
{
  "success": false,
  "message": "Invalid input"
}
```

##### 错误响应

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
```

```json
{
  "message": "Internal server error"
}
```
