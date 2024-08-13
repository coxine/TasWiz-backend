# 查询用户所有项目

## **URL**

`GET /api/projects`

## **请求头**

```http
Authorization: Bearer <jwt-token-string>
Content-Type: application/json
```

## **请求参数**

```json
{
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
[
  {
    "projectID": 1,
    "projectName": "待办",
    "projectOwner": "123",
    "tasks": [
      {
        "taskID": 1,
        "taskName": "任务1",
        "taskOwner": "123",
        "taskDetail": "# 123\n## 456",
        "comments": [
          {
            "content": "这是一条评论",
            "timestamp": 1145141919810
          }
        ]
      }
    ]
  }
]
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
  "message": "Unauthorized"
}
```

```http
HTTP/1.1 404 Not Found
Content-Type: application/json
```

```json
{
  "success": false,
  "message": "User not found"
}
```
