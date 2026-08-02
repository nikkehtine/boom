# Boom

[Boom](https://www.youtube.com/watch?v=bE2r7r7VVic) is an online bookmarks manager.
The primary goal of the project is learning more about and polishing up my skills
in full-stack web development, Deno, SQL, Postgres, auth, and Docker.

## Usage

Make sure to install Deno:
https://docs.deno.com/runtime/getting_started/installation

Then start the project in development mode:

```sh
deno install
deno task dev
```

This will watch the project directory and restart as necessary.

Next, you want to boot up the Postgres database with Docker:

```sh
docker-compose up -d
```

Verify that it's up:

```sh
# Docker
docker exec -it boom-pg psql -U postgres -d boomdb_dev -c "SELECT version();"
# Native
psql -U postgres -d boomdb_dev -c "SELECT version();"
```

Import the schema:

```sh
# Docker
docker exec -i boom-pg psql -U postgres -d boomdb_dev < sql/schema.sql
# Native
psql -U postgres -d boomdb_dev -f "sql/schema.sql"
```

**NOTE:** in `sql/create_app_role.sql` on line 2 the db is called `boomdb`, check and modify if needed.

## Testing

You can test the API using `curl`. Below are a few commands and expected output.

```sh
curl localhost:5173/api/health
# (timestamp)

curl -i -X POST localhost:5173/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "strongpassword"}'
# {"user":{"id":1,"email":"test@example.com","created_at":"..."}}

curl -i -X POST localhost:5173/api/login \
  -c cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "strongpassword"}'
# {"email":"test@example.com"}

curl -i -b cookies.txt localhost:5173/api/
# {"message":"Welcome! You're logged in as test@example.com"}

curl -i -X POST -b cookies.txt localhost:5173/api/logout
# {"ok":true}
```

## Links

- [Fresh docs](https://usefresh.dev/docs/getting-started)
  - [File routing](https://usefresh.dev/docs/concepts/file-routing)
  - [Middlewares](https://usefresh.dev/docs/concepts/middleware)
  - [Session management](https://usefresh.dev/docs/examples/session-management)
- [Deno docs](https://docs.deno.com/)
  - [Environment variables](https://docs.deno.com/runtime/reference/env_variables/)
  - [Deno in GitHub Actions](https://docs.deno.com/examples/deno_github_actions_tutorial/)
- [Postgres docs](https://www.postgresql.org/docs/16)
- [PGTutorial](https://www.pgtutorial.com)
- [Setting up Postgres in Docker](https://dev.to/nhannguyenuri/setting-up-postgresql-in-docker-a-step-by-step-guide-3gc4)
- [pg docs](https://node-postgres.com/apis/pool)
- [HTTP status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)
- [argon2 on jsr](https://jsr.io/@felix/argon2)
- [DaisyUI](https://daisyui.com/components/)
