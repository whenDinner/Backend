# API DOCS

## ***GET*** `/callback`
parameters: (\*) = required
```
  query -> id_token(*), state(*)
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
  "type": user.type,
  "token": whenDinnerToken
}
```

## ***GET*** `/verify`
parameters: (*) = required
```
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
  "success": true,
  "user": user.data
}
```

## ***GET*** `/getLogin`

### `success`:
```json
{
  "success": true,
  "data": loginURL
}
```

## ***GET*** `/get/users`
#### \# 로그인을 안하면 사용을 할 수 없음.
parameters: (\*) = required
```
  query -> floor(*), gender(*), limit(*), offset(*)
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
  "user": user.data,
  "user_cnt": user.data.count
}
```

## ***GET*** `/get/user`
#### \# 로그인을 안하면 사용을 할 수 없음.
parameters: (\*) = required
```
  Headers -> Authorization: Bearer(*)
  query -> uuid(*)
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
  "user": user.data
}
```

## ***GET*** `/update/user`
#### \# 로그인을 안하면 사용을 할 수 없음.
parameters: (*) = required
```
  Headers -> Authorization: Bearer(*)
  query -> fullname(*), student_id(*), gender(*), roomNumber(*), type(*)
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
  "user": user.data
}
```