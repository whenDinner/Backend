# API DOCS

## ***GET*** `/get/posts`
parameters: (\*) = required
```
  query -> offset(*), limit(*), type(*)
```

### `failure`:
```json
{
  "success": false,
  "message": err.message
}
```
### `success`:
```json
{
  "success": true,
  "posts": Posts.data,
  "posts_cnt": Posts.count
}
```

## ***GET*** `/get/post`
parameters: (\*) = required
```
  query -> id(*)
```

### `failure`:
```json
{
  "success": false,
  "message": err.message
}
```
### `success`:
```json
{
  "success": true,
  "post": Post.data,
  "comments": Comments.data
}
```

## ***GET*** `/search/posts`
parameters: (\*) = required
```
  query -> offset(*), limit(*), type(*), search(*)
```

### `failure`:
```json
{
  "success": false,
  "message": err.message
}
```
### `success`:
```json
{
  "success": true,
  "post": Post.data,
  "posts_cnt": Posts.count
}
```

## ***GET*** `/category/info`
#### \# 로그인을 안하면 사용을 할 수 없음.

### `failure`:
```json
{
  "success": false,
  "message": err.message
}
```
### `success`:
```json
{
  "success": true,
  "info": {
    label: string,
    value: string,
    count: number
  }[]
}
```

## ***POST*** `/post/insert`
#### \# 로그인을 안하면 사용을 할 수 없음.
parameters: (\*) = required
```
  body -> title(*), content(*), type(*)
  Headers -> Authorization: Bearer(*)
```

### `failure`:
```json
{
  "success": false,
  "message": err.message
}
```
### `success`:
```json
{
  "success": true
}
```

## ***POST*** `/post/update`
#### \# 로그인을 안하면 사용을 할 수 없음.
parameters: (\*) = required
```
  body -> title(*), content(*), id(*)
  Headers -> Authorization: Bearer(*)
```

### `failure`:
```json
{
  "success": false,
  "message": err.message
}
```
### `success`:
```json
{
  "success": true
}
```

## ***DELETE*** `/post/delete`
#### \# 로그인을 안하면 사용을 할 수 없음.
parameters: (\*) = required
```
  body -> id(*)
  Headers -> Authorization: Bearer(*)
```

### `failure`:
```json
{
  "success": false,
  "message": err.message
}
```
### `success`:
```json
{
  "success": true
}
```

## ***POST*** `/comment/insert`
#### \# 로그인을 안하면 사용을 할 수 없음.
parameters: (\*) = required
```
  body -> id(*), comment(*)
  Headers -> Authorization: Bearer(*)
```

### `failure`:
```json
{
  "success": false,
  "message": err.message
}
```
### `success`:
```json
{
  "success": true
}
```

## ***POST*** `/comment/reply`
#### \# 로그인을 안하면 사용을 할 수 없음.
parameters: (\*) = required
```
  body -> id(*), comment(*)
  Headers -> Authorization: Bearer(*)
```

### `failure`:
```json
{
  "success": false,
  "message": err.message
}
```
### `success`:
```json
{
  "success": true
}
```

## ***DELETE*** `/comment/delete`
#### \# 로그인을 안하면 사용을 할 수 없음.
parameters: (\*) = required
```
  body -> id(*)
  Headers -> Authorization: Bearer(*)
```

### `failure`:
```json
{
  "success": false,
  "message": err.message
}
```
### `success`:
```json
{
  "success": true
}
```
