# 登录

## **URL**

`POST /api/login`

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

#### 无效的用户名或密码

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
