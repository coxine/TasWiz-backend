# 编辑任务

## **URL**

`PUT /api/task`

## **请求头**

```http
Content-Type: application/json
Authorization: Bearer jwt-token-string
```

## **请求体**

```json
{
  "taskId": "number",
  "taskName": "string",
  "taskDetail": "string",
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
  "message": "Task updated successfully"
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
  "message": "输入有误"
}
```

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json
```

```json
{
  "success": false,
  "message": "无效登陆信息"
}
```

```http
HTTP/1.1 404 Not Found
Content-Type: application/json
```

```json
span
```
