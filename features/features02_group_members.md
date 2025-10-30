# Feature: Group Members

This document outlines the implementation of **Group Members** functionality for the application. Group Members are players that belong to a specific group and can be either registered users or placeholders (unclaimed profiles). All endpoints must follow the structure and practices defined in `guidelines.md`.

## Overview

- Each group can contain multiple members.
- Members can be created as **placeholders** (only a name is provided).
- Members can later be linked to actual registered users (`user_profile_id`).
- Members are **soft deleted** by toggling `is_active = false`.
- Group membership is visible only within the group they were added to.

## Entity Reference

See `GroupMember` entity for detailed schema.

## Endpoints

### 1. Add Member to Group

`POST /group/:groupId/members`

#### Request Body (DTO: `CreateGroupMemberDto`):

```ts
{
  name: string;
  email?: string;
}
```

- `name` is required.
- `email` is optional. If present, it allows the owner to associate an email for potential user claim.
- `is_placeholder` is set to `true` by default.
- `is_active` is set to `true` by default.

#### Logic:

- Validate that the user making the request belongs to the group or is the group owner.
- Create a new `GroupMember` associated with the group.
- Return the newly created member.

---

### 2. Remove Member from Group (Soft Delete)

`DELETE /group/:groupId/members/:memberId`

#### Logic:

- Validate that the user making the request is part of the group.
- Set `is_active = false` for the specified `GroupMember`.
- Return confirmation response.

---

### 3. Update Member Info

`PATCH /group/:groupId/members/:memberId`

#### Request Body (DTO: `UpdateGroupMemberDto`):

```ts
{
  name?: string;
  email?: string;
  user_profile_id?: string; // used when claiming the placeholder
}
```

#### Logic:

- Validate that the requester belongs to the group.
- Allow partial update of `name`, `email`, and optionally `user_profile_id`.
- If `user_profile_id` is set, update `is_placeholder` to `false`.
- Return updated member.

---

## Access Control

- Only users who are part of the group (including owner) can perform operations.

## Notes

I

- Members with `is_placeholder = true` represent players added by name only.
- Claiming process can be handled later by linking `user_profile_id`.

> 🔒 All operations must respect authorization checks to prevent unauthorized access across groups.

---

✅ **All development must follow `guidelines.md` structure, validations, naming, and response formatting conventions for consistency.**

Create a advance.md file with important things to consider when implementing the feature, this file is going to be your base for future implementations of similar features.
