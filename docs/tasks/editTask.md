# 编辑任务

## **URL**

`PUT /api/tasks`

## **请求头**

```http
Content-Type: application/json
Authorization: Bearer jwt-token-string
```

## **请求体**

```json
{
  "taskId": "string",
  "taskName": "string",
  "taskDetail": "string",
  "username": "string",
  "timestamp": "number"
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
  "message": "Task updated successfully"
}
```

### 失败响应

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
HTTP/1.1 404 Not Found
Content-Type: application/json
```

```json
{
  "success": false,
  "message": "Task not found"
}
```
