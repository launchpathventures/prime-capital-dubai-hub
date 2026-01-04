# Vendor

External UI packages wrapped and styled for this project.

These are **not** shadcn components — those live in `../ui/`.

## Available Components

### charts.tsx
Theme-aware chart components built on recharts + shadcn/ui.

```tsx
import {
  AreaChart,
  BarChart,
  LineChart,
  PieChart,
  type ChartConfig,
} from "@/components/vendor/charts"
```

**Features:**
- `AreaChart` — Time-series with filled areas (stacked optional)
- `LineChart` — Time-series with lines
- `BarChart` — Comparative bars (horizontal optional)
- `PieChart` — Distribution/donut charts

**Source:** recharts, @shadcn/ui chart

---

### dnd-kit.tsx
Drag-and-drop primitives for sortable lists and Kanban boards.

```tsx
import {
  DndContext,
  SortableContext,
  SortableItem,
  DragOverlay,
  Droppable,
  arrayMove,
} from "@/components/vendor/dnd-kit"
```

**Features:**
- `DndContext` — Wraps your draggable area with sensible defaults
- `SortableContext` — Defines a sortable list
- `SortableItem` — Individual draggable item with built-in styles
- `Droppable` — Drop zone for Kanban-style columns
- `DragOverlay` — Visual feedback during drag

**Source:** @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities

---

## Adding New Vendor Components

1. Create a file in `components/vendor/` (e.g., `calendar.tsx`)
2. Wrap the external package with consistent styling
3. Add the header comment with source info
4. Document in this README

## Headers

All vendor components should have a source header:

```typescript
/**
 * CATALYST - Calendar Component
 *
 * @source react-day-picker v9.x
 * @customised Yes
 *   - Styled to match design system
 *   - Added range selection helper
 */
```
