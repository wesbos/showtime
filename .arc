# Warning: do not edit
# --------------------
# This is a generated file and will be overwritten

@app
begin-app

@http
get  /todos
post /todos
post /todos/delete

@tables
data
  scopeID *String
  dataID **String
  ttl TTL
