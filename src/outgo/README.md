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

## ***GET*** `/get/calendar`

### `success`:
```json
{
  "success": true,
  "calendar": calendar.data
}
```
