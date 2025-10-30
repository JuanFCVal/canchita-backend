# Coding Guidelines

## Code Reusability and DRY Principle

### 1. Reuse Service Methods

- **Always reuse existing service methods** instead of duplicating repository calls
- If a service has a `findOne()` method, use it in other methods instead of calling `repository.findOne()` directly
- This centralizes error handling and business logic in one place
- Exception handling for "not found" cases should be handled in the base method

**Example:**

```typescript
// ❌ Bad - Duplicating repository calls
async update(id: string, updateDto: UpdateGroupDto) {
  const group = await this.groupRepository.findOne({ where: { id } });
  if (!group) {
    throw new NotFoundException(`Group with ID ${id} not found`);
  }
  // ... update logic
}

// ✅ Good - Reusing findOne method
async update(id: string, updateDto: UpdateGroupDto) {
  const group = await this.findOne(id); // This already handles NotFoundException
  // ... update logic
}
```

## Separation of Concerns

### 2. Data Mapping and Adapters

- **Create dedicated adapter files** for data transformation logic
- Place all mappers in an `src/adapters/` directory
- Use descriptive names like `mapEntityToResponseDTO`
- Keep services focused on business logic, not data transformation

**Directory Structure:**

```
src/
  adapters/
    group.adapter.ts
    user.adapter.ts
```

### 3. Utility Functions

- **Create reusable utilities** for common operations
- Place utilities in `src/utils/` directory
- Standardize response formats across the entire application

## Standardized Responses

### 4. Success Response Utility

- All API endpoints should return consistent response structure
- Use a utility function that accepts: code, message, data
- This helps frontend handle responses uniformly

### 5 Do not use comments in the codebase

- Comments can become outdated and misleading
- Write self-explanatory code with clear naming conventions
- Use TypeScript types and interfaces to clarify data structures

### 6 Do not add logic in controllers

- Controllers should be thin layers that delegate to services
- Avoid handling response formatting or business logic in controllers

### 7 Create modules when needed

- Group related controllers and services into modules

**Structure:**

```typescript
{
  success: true,
  code: number,
  message: string,
  data: any
}
```

### 5. Error Response Utility

- Standardize error responses across the application
- Consistent error structure helps with debugging and frontend error handling

**Structure:**

```typescript
{
  success: false,
  code: number,
  message: string,
  error?: string
}
```

### 4. Controller Thin Layer Principle

- **Controllers should be thin** - only call service methods and return their results
- **Never handle response formatting in controllers** - let interceptors handle this automatically
- Controllers should follow the pattern: `return this.service.method()`

**Example:**

```typescript
// ✅ Good - Thin controller
async create(@Body() dto: CreateDto, @Request() req: any): Promise<ResponseDto> {
  const userId = req.user.profile.id;
  return this.service.create(dto, userId);
}

// ❌ Bad - Controller handling response formatting
async create(@Body() dto: CreateDto, @Request() req: any): Promise<ApiResponse> {
  const userId = req.user.profile.id;
  const result = await this.service.create(dto, userId);
  return createSuccessResponse(201, 'Created successfully', result);
}
```

### 5. Response Interceptor System

- **Use global interceptors** to automatically format all responses
- Interceptors handle both success and error response formatting
- Automatic trace ID generation for request tracking

**Success Response Structure:**

```typescript
{
  success: true,
  status: number,
  data: any,
  trace: string
}
```

**Error Response Structure:**

```typescript
{
  success: false,
  status: number,
  message: string,
  trace: string,
  error?: string
}
```

### 6. Trace ID System

- All requests automatically get a trace ID for debugging
- Trace IDs can be provided by client via `x-trace-id` header
- If no trace ID provided, system generates one automatically
- Trace ID is returned in response headers and response body

## Implementation Rules

1. **Before creating new implementations**, always check these guidelines
2. **Avoid code duplication** - if logic exists elsewhere, reuse it
3. **Separate concerns** - keep business logic, data mapping, and response formatting in different layers
4. **Keep controllers thin** - only call services, let interceptors handle response formatting
5. **Use interceptors for cross-cutting concerns** - response formatting, logging, tracing
6. **Centralize error handling** - let base methods handle common exceptions like "not found"

## Benefits

- **Maintainability**: Changes to business logic only need to be made in one place
- **Consistency**: All endpoints behave similarly for error cases and response formats
- **Developer Experience**: Frontend developers can rely on consistent API behavior
- **Debugging**: Easier to trace issues when logic is centralized
- **Testing**: Easier to test when concerns are properly separated
