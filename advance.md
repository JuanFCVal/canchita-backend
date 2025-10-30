# Advanced Implementation Guidelines

## Feature Implementation Checklist

When implementing similar nested resource features (like group members, match players, etc.), follow this systematic approach:

### 1. **Entity Analysis & Relationships**

- ✅ **Review existing entities** for relationships and foreign key constraints
- ✅ **Identify access control patterns** (owner vs member vs public access)
- ✅ **Plan soft delete strategy** using `is_active` boolean flags
- ✅ **Consider placeholder/claim patterns** for unregistered users

### 2. **Access Control Strategy**

- ✅ **Define access levels**: Owner, Member, Public
- ✅ **Implement validation service method** to check user permissions
- ✅ **Use consistent exception types**: `NotFoundException`, `ForbiddenException`
- ✅ **Validate parent resource exists** before performing operations on child resources

### 3. **Service Layer Architecture**

#### **Private Helper Methods Pattern**

```typescript
// Always create reusable validation methods
private async validateGroupAccess(groupId: string, userProfileId: string): Promise<void>

// Create reusable finder methods with proper error handling
private async findEntityByIdAndParent(id: string, parentId: string): Promise<Entity>
```

#### **Service Method Structure**

1. **Validate access** to parent resource
2. **Validate child resource** exists (for update/delete operations)
3. **Perform business logic**
4. **Return mapped DTO response**

### 4. **DTO Design Patterns**

#### **Create DTO Considerations**

- ✅ **Required fields only** - optional fields should have defaults
- ✅ **Validation decorators** with clear error messages
- ✅ **API documentation** with examples

#### **Update DTO Patterns**

- ✅ **Extend PartialType** of Create DTO for consistency
- ✅ **Add special fields** (like `user_profile_id` for claim operations)
- ✅ **Handle state transitions** (placeholder → claimed user)

#### **Response DTO Structure**

- ✅ **Include relevant IDs** for frontend navigation
- ✅ **Include status flags** (`is_active`, `is_placeholder`)
- ✅ **Include timestamps** for auditing
- ✅ **Exclude sensitive fields** (passwords, internal flags)

### 5. **Controller Best Practices**

#### **Route Design**

- ✅ **Follow REST conventions**: `/parent/:parentId/children/:childId`
- ✅ **Use descriptive parameter names**: `groupId`, `memberId`
- ✅ **Keep thin controllers** - only call services

#### **API Documentation**

- ✅ **Complete Swagger documentation** with all status codes
- ✅ **Include example responses** for error cases
- ✅ **Document access control** in operation descriptions

### 6. **Module Organization**

#### **File Structure**

```
src/
  feature-name/
    dto/
      create-feature.dto.ts
      update-feature.dto.ts
      feature-response.dto.ts
    feature.controller.ts
    feature.service.ts
    feature.module.ts
  adapters/
    feature.adapter.ts
```

#### **Module Dependencies**

- ✅ **Import required entities** in TypeORM.forFeature()
- ✅ **Export service** for potential cross-module usage
- ✅ **Register in app module** imports

### 7. **Error Handling Patterns**

#### **Common Exception Types**

```typescript
// Resource not found
throw new NotFoundException('Resource not found');

// Access denied
throw new ForbiddenException(
  'Access denied. You are not authorized for this resource.',
);

// Validation failed
throw new BadRequestException('Invalid input data');
```

#### **Consistent Error Messages**

- ✅ **Generic messages** for security (don't reveal internal structure)
- ✅ **Descriptive for debugging** in development
- ✅ **Consistent format** across similar operations

### 8. **Database Considerations**

#### **Foreign Key Strategy**

- ✅ **Use CASCADE DELETE** for owned resources
- ✅ **Use SET NULL** for optional references
- ✅ **Index foreign keys** for query performance

#### **Soft Delete Implementation**

- ✅ **Always filter by `is_active = true`** in queries
- ✅ **Preserve data integrity** during soft deletes
- ✅ **Consider cleanup jobs** for old soft-deleted records

### 9. **Testing Strategy**

#### **Test Coverage Areas**

- ✅ **Access control validation** (owner vs non-owner)
- ✅ **Resource not found scenarios**
- ✅ **Soft delete behavior**
- ✅ **State transition logic** (placeholder claiming)

### 10. **Performance Considerations**

#### **Query Optimization**

- ✅ **Use selective loading** - don't load unnecessary relations
- ✅ **Implement pagination** for list endpoints
- ✅ **Consider caching** for frequently accessed data
- ✅ **Use database indexes** on commonly queried fields

## Implementation Sequence

1. **Entity Review** → Understand data model
2. **Access Control** → Define permission logic
3. **DTOs & Adapters** → Design data contracts
4. **Service Layer** → Implement business logic
5. **Controller Layer** → Expose REST endpoints
6. **Module Registration** → Wire everything together
7. **Testing** → Validate functionality
8. **Documentation** → Update API docs

## Anti-Patterns to Avoid

❌ **Don't implement business logic in controllers**
❌ **Don't expose internal entity structure in responses**  
❌ **Don't skip access control validation**
❌ **Don't use hard deletes for user-created content**
❌ **Don't duplicate permission logic across methods**
❌ **Don't forget to handle edge cases** (empty lists, invalid IDs)

Following these guidelines ensures consistent, secure, and maintainable feature implementations across the entire application.
