# 注册

## **URL**

`POST /api/register`

## **请求头**

```http

Content-Type: application/json

```

## **请求体**

```json
{
  "username": "string",

  "password": "string"
}
```

## **响应**

### 成功响应

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

### 失败响应

#### 输入有误

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
```

```json
{
  "success": false,
  "message": "输入有误"
}
```

#### 用户名已存在

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

#### 其他错误

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

### 错误响应

```http

HTTP/1.1 500 Internal Server Error

Content-Type: application/json

```

```json
{
  "message": "Internal server error"
}
```
