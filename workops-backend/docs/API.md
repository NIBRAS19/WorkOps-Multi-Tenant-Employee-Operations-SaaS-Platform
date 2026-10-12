# WorkOps API Reference

Base URL: `/api/v1`

## Auth

- `POST /auth/register` — create user + workspace
- `POST /auth/login` — issue access token + refresh cookie
- `POST /auth/refresh` — rotate access token
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/switch-organization`
- `POST /auth/accept-invite`

## Dashboard

- `GET /dashboard/summary`

## Employees

- `GET /employees`
- `POST /employees`
- `GET /employees/:id`
- `PATCH /employees/:id`
- `DELETE /employees/:id` — soft deactivation
- `POST /employees/:id/account`

## Departments / Teams

- `GET /departments`
- `POST /departments`
- `PATCH /departments/:id`
- `DELETE /departments/:id`
- `GET /departments/teams`
- `POST /departments/teams`
- `PATCH /departments/teams/:id`
- `DELETE /departments/teams/:id`

## Attendance

- `GET /attendance/today`
- `POST /attendance/clock-in`
- `POST /attendance/clock-out`
- `GET /attendance`
- `PUT /attendance`

## Leave

- `GET /leave/policies`
- `POST /leave/policies`
- `GET /leave/requests`
- `POST /leave/requests`
- `PATCH /leave/requests/:id/review`
- `PATCH /leave/requests/:id/cancel`

## Tasks

- `GET /tasks`
- `POST /tasks`
- `GET /tasks/:id`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`

## Requests

- `GET /requests`
- `POST /requests`
- `PATCH /requests/:id`

## Documents

- `GET /documents`
- `POST /documents` multipart form with `file`
- `GET /documents/:id`
- `GET /documents/:id/download`
- `GET /documents/:id/versions`
- `DELETE /documents/:id`

## Assets

- `GET /assets`
- `POST /assets`
- `PATCH /assets/:id`
- `POST /assets/:id/assign`
- `POST /assets/:id/return`

## Announcements

- `GET /announcements`
- `POST /announcements`
- `DELETE /announcements/:id`

## Notifications

- `GET /notifications`
- `GET /notifications/unread-count`
- `PATCH /notifications/:id/read`
- `PATCH /notifications/read-all`

## Calendar

- `GET /calendar`
- `POST /calendar`
- `PATCH /calendar/:id`
- `DELETE /calendar/:id`

## Reports

- `GET /reports/overview`
- `GET /reports/attendance`
- `GET /reports/leave`

## Audit

- `GET /audit-logs`

## Settings

- `GET /settings/organization`
- `PATCH /settings/organization`
- `GET /settings/members`
- `PATCH /settings/members/:id/role`
- `POST /settings/invitations`

## Headers

Authenticated endpoints use:

`Authorization: Bearer <accessToken>`

To switch to another organization that the user belongs to:

`X-Organization-Id: <organizationId>`

The server verifies membership before honoring the header.
