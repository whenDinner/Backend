# API DOCS

## ***GET*** `/get/users`
#### \# 로그인을 안하면 사용을 할 수 없음.
parameters: (\*) = required
```
  query -> floor(*), gender(*), limit(*), offset(*)
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
  "user": user.data,
  "user_cnt": user.data.count
}
```

## ***GET*** `/get`
#### \# 로그인을 안하면 사용을 할 수 없음.
parameters: (\*) = required
```
  query -> uuid(*), dataType(*)
  Headers -> Authorization: Bearer(*)
  dataType = tobuffer | todataurl | tostring
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
  "data": data.dataType
}
```

## ***GET*** `/getImage`
parameters: (\*) = required
```
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
```html
  <img src=base64 />
```

## ***GET*** `/get/codes`
#### \# 로그인을 안하면 사용을 할 수 없음.
parameters: (\*) = required
```
  query -> limit(*), offset(*)
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
  "codes": codes.data,
  "codes_cnt": codes.count
}
```

## ***GET*** `/get/place`
#### \# 로그인을 안하면 사용을 할 수 없음.
parameters: (\*) = required
```
  query -> limit(*), offset(*)
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
  "codes": codes.data,
  "codes_cnt": codes.count
}
```

## ***GET*** `/search/codes`
#### \# 로그인을 안하면 사용을 할 수 없음.
parameters: (\*) = required
```
  query -> limit(*), offset(*), name(*)
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
  "codes": codes.data,
  "codes_cnt": codes.count
}
```

## ***PUT*** `/create`
#### \# 로그인을 안하면 사용을 할 수 없음.
parameters: (\*) = required
```
  body -> name(*), action(*)
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
  "uuid": insertQr.identifiers[0].uuid
}
```

## ***DELETE*** `/delete`
#### \# 로그인을 안하면 사용을 할 수 없음.
parameters: (\*) = required
```
  body -> uuid(*)
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

## ***GET*** `/getinfo`
#### \# 로그인을 안하면 사용을 할 수 없음.
parameters: (\*) = required
```
  query -> uuid(*)
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
  "QuickResponse": {
    uuid: QR.uuid,
    name: QR.name,
    action: QR.action,
    createdAt: QR.createAt,
    count: QR.count
  }
}
```

## ***GET*** `/access/get`
#### \# 로그인을 안하면 사용을 할 수 없음.
parameters: (\*) = required
```
  query -> uuid(*), limit(*), offset(*)
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
  "users": users.data,
  "users_cnt": users.count
}
```

## ***DELETE*** `/access/clear`
#### \# 로그인을 안하면 사용을 할 수 없음.
parameters: (\*) = required
```
  body -> uuid(*), action(*)
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

## ***POST*** `/access/PLACE`
#### \# 로그인을 안하면 사용을 할 수 없음.
parameters: (\*) = required
```
  body -> uuid(*)
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

## ***POST*** `/access/WRITE`
#### \# 로그인을 안하면 사용을 할 수 없음.
parameters: (\*) = required
```
  body -> uuid(*)
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

## ***POST*** `/access/OUTGO`
#### \# 로그인을 안하면 사용을 할 수 없음.
parameters: (\*) = required
```
  body -> uuid(*)
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
