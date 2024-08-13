# 更改密码

## **URL**

`POST /api/changePassword`

## **请求头**

```http
Content-Type: application/json
Authorization: Bearer <token>
```

## **请求体**

```json
{
  "username": "string",
  "oldPassword": "string",
  "newPassword": "string"
}
```

## **响应**

### 成功响应

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "success": true,
  "message": "Password changed successfully"
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

#### 旧密码错误

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json
```

```json
{
  "success": false,
  "message": "Old password is incorrect"
}
```

#### 用户名不存在

```http
HTTP/1.1 404 Not Found
Content-Type: application/json
```

```json
{
  "success": false,
  "message": "Username not found"
}
```

#### 错误响应

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
```

```json
{
  "message": "Internal server error"
}
```
