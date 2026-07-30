# Boom

[Boom](https://www.youtube.com/watch?v=bE2r7r7VVic) is an online bookmarks manager.
The primary goal of the project is learning more about and polishing up my skills
in full-stack web development, Deno, SQL, Postgres, auth, and Docker.

## Usage

Make sure to install Deno:
https://docs.deno.com/runtime/getting_started/installation

Then start the project in development mode:

```sh
deno task dev
```

This will watch the project directory and restart as necessary.

Next, you want to boot up the Postgres database with Docker:

```sh
docker-compose up -d
```

Verify that it's up:

```sh
docker exec -it boom-pg psql -U postgres -d boomdb -c "SELECT version();"
```

Import the schema:

```sh
docker exec -i boom-pg psql -U postgres -d boomdb < schema.sql
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
- [Setting up Postgres in Docker](https://dev.to/nhannguyenuri/setting-up-postgresql-in-docker-a-step-by-step-guide-3gc4)
- [pg docs](https://node-postgres.com/apis/pool)
- [HTTP status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)
- [argon2 on jsr](https://jsr.io/@felix/argon2)
- [DaisyUI](https://daisyui.com/components/)
