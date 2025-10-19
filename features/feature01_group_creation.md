# Feature: Group Creation

## Overview

This feature allows **registered users** to create a **new group** that will later be used to organize matches and teams. A group is essentially a container for a list of participants (which may or may not be registered users). This document describes the **group creation logic**.

---

## Purpose

- Enable users to create groups with a name.
- Automatically set the group owner to the currently authenticated user (via access token, the id of the user is inside `token.sub`).

---

## Database Entities (Relevant)

### `user_profiles`

- Stores all registered users.
- Relation to `groups` (1:N) through id

### `groups`

- `id: UUID` - Primary key.
- `name: TEXT` - Group name.
- `owner_profile_id: UUID` - Foreign key to `user_profiles.id` (creator of the group).
- `description: TEXT` - Group description (optional).
- `is_active: BOOLEAN` - Set to true by default.
- `created_at: TIMESTAMP` - Auto-generated.

---

## Modules Involved

- `GroupModule`
  - Controller: `GroupController`
  - Service: `GroupService`
  - Entity: `GroupEntity`
  - DTO: `CreateGroupDto`, `UpdateGroupDto`
  - Repository: TypeORM default repository

---

## Endpoints

### 1. POST `/group`

Creates a new group.

#### Headers:

- `Authorization: Bearer <access_token>`

#### Request Body (JSON):

```json
{
  "name": "My Weekend Soccer Group",
  "description": "A group for weekend soccer matches"
}
```

The `description` field is optional.

#### Response:

```json
{
  "id": "uuid",
  "name": "My Weekend Soccer Group",
  "description": "A group for weekend soccer matches",
  "created_at": "2025-10-18T21:00:00Z"
}
```

---

### 2. PATCH `/group/:id`

Updates an existing group. Only the group owner can perform this operation.

#### Headers:

- `Authorization: Bearer <access_token>`

#### Request Body (JSON):

```json
{
  "name": "Updated Group Name",
  "description": "New description for the group"
}
```

All fields are optional. If a field is not sent, it should remain unchanged.

#### Response:

```json
{
  "id": "uuid",
  "name": "Updated Group Name",
  "description": "New description for the group",
  "created_at": "2025-10-18T21:00:00Z",
  "updated_at": "2025-10-19T10:00:00Z"
}
```

#### Logic:

1. Validate token → extract `user_metadata.sub`.
2. Verify that the user is the `owner_profile_id` of the group.
3. Update provided fields.
4. Return the updated entity.

---

### 3. DELETE `/group/:id`

Performs a **soft delete** of a group by setting `is_active` to `false`. Only the owner can delete their group.

#### Headers:

- `Authorization: Bearer <access_token>`

#### Response:

```json
{
  "message": "Group successfully deactivated",
  "group_id": "uuid"
}
```

#### Logic:

1. Validate token → extract `user_metadata.sub`.
2. Confirm that the user owns the group.
3. Set `is_active` to `false`.
4. Return success message.

---

### 3. GET `/group/:id`

Retrieves the details of a specific group.

#### Headers:

- `Authorization: Bearer <access_token>`

#### Response:

```json
{
  "id": "uuid",
  "name": "My Weekend Soccer Group",
  "description": "A group for weekend soccer matches",
  "created_at": "2025-10-18T21:00:00Z"
}
```

If no ID is provided it should return a 400 Bad Request error.

#### Logic:

1. Validate token → extract `user_metadata.sub`.
2. Confirm that the user owns the group.
3. Return the group details.

---

### 3. GET `/group`

Retrieves all active groups of the user.

#### Headers:

- `Authorization: Bearer <access_token>`

#### Response:

```json
[
  {
    "id": "uuid",
    "name": "My Weekend Soccer Group",
    "description": "A group for weekend soccer matches",
    "created_at": "2025-10-18T21:00:00Z"
  }
]
```

#### Logic:

1. Validate token → extract `user_metadata.sub`.
2. Fetch all groups where `owner_profile_id` matches and `is_active` is true.
3. Return the list of groups.

## DTOs

### `CreateGroupDto`

```ts
import { IsString, MinLength, IsOptional } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
```

### `UpdateGroupDto`

```ts
import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {}
```

---

## Logic Flow

1. User makes an authenticated request (POST, PATCH, or DELETE).
2. `GroupController` validates DTO.
3. Extract user ID from `user_metadata.sub` in JWT.
4. `GroupService` checks ownership where applicable.
5. Perform requested action (create, update, or soft delete).
6. Return appropriate response.

---

## Notes

- Validation is minimal (group name must be a string and at least 3 characters).
- Description is optional.
- Ownership of a group is determined by `owner_profile_id`.
- No members are automatically added during creation (this will be handled in the next feature).
- Use UUID auto-generation.
- Ensure `created_at` is automatically set via `@CreateDateColumn`.
- Use mappers to convert entities to response DTOs and reuse them across endpoints.

---

## Security

- Requires valid JWT access token.
- Only the group owner can update or deactivate their groups.
- No role-based restrictions for now (MVP scope).

---
