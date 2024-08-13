# 删除项目

## **URL**

`DELETE /api/project`

## **请求头**

```http
Content-Type: application/json
Authorization: Bearer jwt-token-string
```

## **请求体**

```json
{
  "projectId": "number",
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
  "message": "Project deleted successfully"
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

#### 无效登陆信息

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

#### 未找到项目

```http
HTTP/1.1 404 Not Found
Content-Type: application/json
```

```json
{
  "success": false,
  "message": "Project not found"
}
```
