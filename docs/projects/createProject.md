# 增加新项目

## **URL**

`POST /api/project`

## **请求头**

```http
Content-Type: application/json
Authorization: Bearer jwt-token-string
```

## **请求体**

```json
{
  "username": "string",
  "projectName": "string"
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
  "message": "Project created successfully",
  "project": {
    "username": "string",
    "projectName": "string"
  }
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

#### 未授权访问

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json
```

```json
{
  "success": false,
  "message": "Invalid token or unauthorized access"
}
```

#### 服务器内部错误

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
```

```json
{
  "success": false,
  "message": "Internal server error"
}
```
