# Data Model: Grocery List

**Feature**: Grocery List  
**Date**: 2026-01-07  
**Purpose**: Define data structures, relationships, validation rules, and state transitions

---

## Entity Definitions

### 1. GroceryItem

Represents a single item on the grocery list.

**Attributes**:

| Field | Type | Required | Constraints | Default | Description |
|-------|------|----------|-------------|---------|-------------|
| `id` | string | Yes | UUID v4 format | Generated | Unique identifier for the item |
| `name` | string | Yes | 1-100 characters, trimmed | - | Display name of the grocery item |
| `checked` | boolean | Yes | true or false | false | Whether item has been purchased |
| `createdAt` | number | Yes | Unix timestamp (milliseconds) | Date.now() | When the item was added to the list |

**TypeScript Interface**:
```typescript
interface GroceryItem {
  id: string;           // UUID v4 (e.g., "550e8400-e29b-41d4-a716-446655440000")
  name: string;         // 1-100 chars, trimmed (e.g., "Whole milk")
  checked: boolean;     // false (unchecked) or true (checked off)
  createdAt: number;    // Unix timestamp (e.g., 1704672000000)
}
```

**Validation Rules**:
1. `id` MUST be a valid UUID v4 (generated via `crypto.randomUUID()` or uuid library)
2. `name` MUST be trimmed of leading/trailing whitespace before saving
3. `name` MUST be at least 1 character after trimming
4. `name` MUST NOT exceed 100 characters
5. `checked` MUST be a boolean (no truthy/falsy values)
6. `createdAt` MUST be a valid Unix timestamp in milliseconds

**Creation Example**:
```typescript
function createGroceryItem(name: string): GroceryItem {
  const trimmedName = name.trim();
  
  if (trimmedName.length === 0) {
    throw new Error('Item name cannot be empty');
  }
  
  if (trimmedName.length > 100) {
    throw new Error('Item name cannot exceed 100 characters');
  }
  
  return {
    id: crypto.randomUUID(),
    name: trimmedName,
    checked: false,
    createdAt: Date.now(),
  };
}
```

**State Transitions**:
```
[Created] ─────────────> [Unchecked]
                            │    ↑
              checked=true  │    │  checked=false
                            ↓    │
                          [Checked]
                            │
                            │ (user deletes or clear checked)
                            ↓
                          [Deleted]
```

---

### 2. GroceryList

Represents the complete collection of grocery items.

**Attributes**:

| Field | Type | Required | Constraints | Default | Description |
|-------|------|----------|-------------|---------|-------------|
| `items` | GroceryItem[] | Yes | Ordered array, max 500 items | [] | Array of grocery items |
| `lastModified` | number | Yes | Unix timestamp (milliseconds) | Date.now() | Last time the list was modified |

**TypeScript Interface**:
```typescript
interface GroceryList {
  items: GroceryItem[];   // Ordered array (newest at end)
  lastModified: number;   // Unix timestamp (e.g., 1704672000000)
}
```

**Validation Rules**:
1. `items` MUST be an array (can be empty)
2. `items` MUST NOT contain more than 500 elements
3. `items` MUST NOT contain duplicate `id` values
4. `items` SHOULD be ordered by `createdAt` (oldest first)
5. `lastModified` MUST be updated on any change (add, remove, toggle, clear)

**Operations**:

#### Add Item
```typescript
function addItem(list: GroceryList, name: string): GroceryList {
  if (list.items.length >= 500) {
    throw new Error('Cannot add more than 500 items');
  }
  
  const newItem = createGroceryItem(name);
  
  return {
    items: [...list.items, newItem],
    lastModified: Date.now(),
  };
}
```

#### Remove Item
```typescript
function removeItem(list: GroceryList, itemId: string): GroceryList {
  return {
    items: list.items.filter(item => item.id !== itemId),
    lastModified: Date.now(),
  };
}
```

#### Toggle Item Checked Status
```typescript
function toggleItem(list: GroceryList, itemId: string): GroceryList {
  return {
    items: list.items.map(item =>
      item.id === itemId
        ? { ...item, checked: !item.checked }
        : item
    ),
    lastModified: Date.now(),
  };
}
```

#### Clear Checked Items
```typescript
function clearCheckedItems(list: GroceryList): {
  list: GroceryList;
  removedCount: number;
} {
  const uncheckedItems = list.items.filter(item => !item.checked);
  const removedCount = list.items.length - uncheckedItems.length;
  
  return {
    list: {
      items: uncheckedItems,
      lastModified: Date.now(),
    },
    removedCount,
  };
}
```

---

## Storage Schema

### AsyncStorage Key
```
@grocery_list
```

### Stored Format (JSON)
```json
{
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Whole milk",
      "checked": false,
      "createdAt": 1704672000000
    },
    {
      "id": "660f9511-f39c-52e5-b827-557766551111",
      "name": "Eggs",
      "checked": true,
      "createdAt": 1704672030000
    }
  ],
  "lastModified": 1704672030000
}
```

**Size Estimation**:
- Per item: ~150 bytes (JSON serialized)
- 500 items: ~75 KB
- Well within AsyncStorage limits (6MB iOS, 5-10MB web)

**Serialization**:
```typescript
// Save
const jsonString = JSON.stringify(groceryList);
await AsyncStorage.setItem('@grocery_list', jsonString);

// Load
const jsonString = await AsyncStorage.getItem('@grocery_list');
const groceryList = jsonString ? JSON.parse(jsonString) : { items: [], lastModified: Date.now() };
```

---

## Relationships

### Entity Relationship Diagram
```
GroceryList (1) ─────has many────> (0..500) GroceryItem
```

- One `GroceryList` contains zero to 500 `GroceryItem` objects
- Each `GroceryItem` belongs to exactly one `GroceryList` (implied, not enforced)
- Items have no relationships with each other (no parent/child)

---

## Indexes and Queries

Since we're using an in-memory array (not a database), we don't have indexes. However, we can define common query patterns:

### Get All Items
```typescript
function getAllItems(list: GroceryList): GroceryItem[] {
  return list.items;
}
```

### Get Checked Items
```typescript
function getCheckedItems(list: GroceryList): GroceryItem[] {
  return list.items.filter(item => item.checked);
}
```

### Get Unchecked Items
```typescript
function getUncheckedItems(list: GroceryList): GroceryItem[] {
  return list.items.filter(item => !item.checked);
}
```

### Find Item by ID
```typescript
function findItemById(list: GroceryList, itemId: string): GroceryItem | undefined {
  return list.items.find(item => item.id === itemId);
}
```

### Search Items by Name
```typescript
function searchItems(list: GroceryList, query: string): GroceryItem[] {
  const lowerQuery = query.toLowerCase();
  return list.items.filter(item =>
    item.name.toLowerCase().includes(lowerQuery)
  );
}
```

---

## Data Migration Strategy

### Version 1.0 (Initial)
- No migration needed
- Empty list on first launch: `{ items: [], lastModified: Date.now() }`

### Future Versions (Example)
If we add new fields in the future (e.g., `quantity`, `category`):

```typescript
function migrateGroceryList(stored: any): GroceryList {
  // Version 1.0 -> 1.1 (add quantity field)
  if (!stored.items[0]?.quantity) {
    return {
      items: stored.items.map(item => ({
        ...item,
        quantity: 1, // Default quantity
      })),
      lastModified: stored.lastModified,
    };
  }
  
  return stored;
}
```

**Migration Pattern**:
1. Load JSON from AsyncStorage
2. Check for missing fields (version detection)
3. Apply transformation
4. Save back to AsyncStorage
5. Continue with app

---

## Data Integrity Rules

1. **No duplicate IDs**: Each item must have a unique ID
2. **No empty names**: Items with empty names after trim are invalid
3. **Checked state consistency**: `checked` must always be boolean
4. **Order preservation**: Items should maintain insertion order
5. **Timestamp accuracy**: `createdAt` and `lastModified` must be valid timestamps

**Enforcement**:
- Validation at creation (factory function)
- Type safety via TypeScript
- Unit tests for all operations

---

## Performance Considerations

### Array Operations
- **Add (push)**: O(1) amortized
- **Remove (filter)**: O(n)
- **Toggle (map)**: O(n)
- **Find by ID**: O(n) linear search

**Optimization for 500 items**:
- Linear operations (n=500) are fast enough (<1ms)
- No need for hash maps or indexes
- FlatList handles rendering optimization

### Memory Usage
- 500 items × 150 bytes = 75 KB in JSON
- In-memory objects: ~200 KB (JavaScript overhead)
- Negligible impact on modern devices (GB of RAM)

---

## Testing Data Sets

### Empty List
```typescript
const emptyList: GroceryList = {
  items: [],
  lastModified: Date.now(),
};
```

### Single Item
```typescript
const singleItemList: GroceryList = {
  items: [
    {
      id: '1',
      name: 'Milk',
      checked: false,
      createdAt: Date.now(),
    },
  ],
  lastModified: Date.now(),
};
```

### Mixed Checked/Unchecked
```typescript
const mixedList: GroceryList = {
  items: [
    { id: '1', name: 'Milk', checked: false, createdAt: Date.now() - 2000 },
    { id: '2', name: 'Eggs', checked: true, createdAt: Date.now() - 1000 },
    { id: '3', name: 'Bread', checked: false, createdAt: Date.now() },
  ],
  lastModified: Date.now(),
};
```

### Large List (500 items for performance testing)
```typescript
const largeList: GroceryList = {
  items: Array.from({ length: 500 }, (_, i) => ({
    id: `item-${i}`,
    name: `Item ${i + 1}`,
    checked: i % 3 === 0, // Every 3rd item checked
    createdAt: Date.now() - (500 - i) * 1000,
  })),
  lastModified: Date.now(),
};
```

---

## Summary

- **2 entities**: GroceryItem, GroceryList
- **Simple relationships**: One-to-many (List → Items)
- **Storage**: AsyncStorage with JSON serialization
- **Validation**: Type-safe with TypeScript, runtime checks
- **Performance**: Optimized for up to 500 items
- **Scalability**: Can handle 500 items at ~75KB storage

**Ready to proceed to Phase 1: Contract generation**
