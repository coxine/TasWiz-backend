# 查询任务

## **URL**

`GET /api/task`

## **请求头**

```http
Content-Type: application/json
Authorization: Bearer jwt-token-string
```

## **请求体**

```json
{
  "taskId": "string"  ,
  "username": "string"
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
  "task": {
    "taskId": "number",
    "taskName": "string",
    "taskDetail": "string",
    "comments": [
      {
        "content": "string",
        "timestamp": "number"
      }
    ],
    "username": "string",
    "timestamp": "number"
  }
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
