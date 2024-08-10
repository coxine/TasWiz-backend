# 验证 Token 接口

## **URL**

`POST /api/isTokenValid`

## **方法**

`POST`

## **描述**

验证客户端提供的 JWT token 是否有效。

## **请求头**

```http
Authorization: Bearer <token>
Content-Type: application/json
```

## **请求体**

无

## **响应**

### 成功响应

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "message": "Token is valid"
}
```

### 失败响应

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json
```

```json
{
  "message": "Token is invalid or missing"
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
