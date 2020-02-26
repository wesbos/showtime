@app
goat-vhi

@static

@http
get /todos
post /todos
post /todos/delete
get /scrape

@tables
data
  scopeID *String
  dataID **String
  ttl TTL
