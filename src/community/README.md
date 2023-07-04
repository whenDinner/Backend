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
  "posts": Posts.data
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

## ***POST*** `/get/insert`
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

## ***POST*** `/get/update`
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

## ***DELETE*** `/get/delete`
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