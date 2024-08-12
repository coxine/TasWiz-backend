# 创建任务

## **URL**

`POST /api/task`

## **请求头**

```http
Content-Type: application/json
Authorization: Bearer jwt-token-string
```

## **请求体**

```json
{
  "taskName": "string",
  "taskDetail": "string",
  "username": "string",
  "projectId": "number"
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
  "message": "Task created successfully",
  "task": {
    "taskId": "number",
    "taskName": "string",
    "taskDetail": "string",
    "username": "string"
  }
}
```

### 失败响应

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
```

```json
{
  "success": false,
  "message": "Invalid request data"
}
```

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
