# API DOCS

## ***POST*** `/set`
parameters: (\*) = required
```
  body -> dotw(*), type(*), reason(*)
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
}
```

## ***POST*** `/update/calendar`
parameters: (\*) = required
```
  FormData -> file = excel[0]
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
}
```

## ***GET*** `/get/calendars`

### `success`:
```json
{
  "success": true,
  "calendar": calendars.data
}
```

## ***GET*** `/get/calendar`

### `success`:
```json
{
  "success": true,
  "calendar": calendar.data
}
```

## ***POST*** `/clear/calendar`
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
}
```

## ***POST*** `/set/rh`
#### \# 로그인을 안하면 사용을 할 수 없음.
parameters: (\*) = required
```
  body -> rh(*)
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
}
```
