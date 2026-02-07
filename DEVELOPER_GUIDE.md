# Qubi Developer Guide

Comprehensive guide to the Qubi project architecture and component patterns.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Directory Structure](#3-directory-structure)
4. [Provider Hierarchy](#4-provider-hierarchy)
5. [API Layer](#5-api-layer)
6. [Custom Forms](#6-custom-forms)
7. [Custom Dialogs](#7-custom-dialogs)
8. [Smart Tables](#8-smart-tables)
9. [Hooks](#9-hooks)
10. [Conventions](#10-conventions)

---

## 1. Project Overview

Qubi is a cloud-based restaurant management SaaS built with **Next.js 15** (App Router) and **Supabase**. It covers food cost analysis, inventory, orders, recipes, menus, sales analytics, invoicing, and multi-location management.

The app is structured as:
- **(website)** — marketing site with blog, feature pages, pricing
- **(auth)** — Clerk-based sign-in/sign-up
- **dashboard** — the protected SaaS application

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.5 (App Router, Turbopack) |
| UI Library | React 19 + TypeScript 5.9 |
| Components | Material-UI 7 (`@mui/material`) | (IN THIS CASE LETS SSTICK WITH SHADCN)
| Styling | Emotion CSS-in-JS |
| Forms | React Hook Form 7 + Zod 4 |
| Server State | TanStack React Query 5 |
| Database | Supabase (PostgreSQL + RPC + Edge Functions) | (IN THIS CASE OF COURSE WE STICK WITH CONVEX)
| Auth | WORKS OS 
| URL State | nuqs 2 |
| Charts | ApexCharts, ECharts, Recharts |
| AI | OpenAI SDK (via Supabase Edge Functions) |
| PDF Export | jsPDF + html2canvas |
| Notifications | react-hot-toast |

---

## 3. Directory Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── (auth)/                 # Auth routes (sign-in, sign-up)
│   ├── (website)/              # Marketing site
│   └── dashboard/              # Protected SaaS routes
│       ├── analytics/
│       ├── costs/
│       ├── inventory/
│       ├── invoices/
│       ├── orders/
│       │   ├── suppliers/
│       │   ├── cart/
│       │   └── orders/
│       ├── products/
│       │   ├── articles/       # Raw materials
│       │   ├── recipes/
│       │   ├── menus/
│       │   └── service-charges/
│       ├── sales/
│       └── settings/
│
├── api/                        # API layer (React Query hooks)
│   ├── mainApi.tsx             # Central API namespace export
│   ├── products/
│   ├── orders/
│   ├── sales/
│   ├── analytics/
│   ├── inventory/
│   ├── invoices/
│   ├── organization/
│   ├── budget/
│   ├── pos/
│   └── waste/
│
├── components/                 # Shared UI components
│   ├── forms/                  # Form field components
│   ├── dialogs/                # Dialog components
│   ├── smartTable/             # Table system
│   ├── pagination/             # Pagination component
│   ├── chart/                  # Chart components
│   ├── layout/                 # Sidebar, appbar, footer
│   ├── selectors/              # Filters & selectors
│   ├── dataDisplay/            # Widget cards
│   ├── shared/                 # Misc shared components
│   └── states/                 # Loading/error states
│
├── hooks/                      # Custom React hooks
├── types/                      # TypeScript type definitions
├── schema/                     # Zod validation schemas
├── providers/                  # React Context providers
└── utils/                      # Utility functions
    └── api/usedb.ts            # Supabase abstraction layer
```

---

## 4. Provider Hierarchy

Providers are nested in the root layout:

```
ClerkProvider
 └─ ThemeRegistry (MUI theme)
    └─ QueryProvider (React Query)
       └─ SupabaseProvider (DB client with Clerk auth token)
          └─ OrganizationProvider (cache invalidation on org change)
             └─ LocationProvider (multi-location selection)
                └─ NuqsAdapter (URL state)
```

| Provider | Hook | Purpose |
|---|---|---|
| `SupabaseProvider` | `useSupabase()` | Authenticated Supabase client |
| `LocationProvider` | `useLocation()` | Selected location ID for filtering |
| `OrganizationProvider` | — | Clears React Query cache on org switch |
| `QueryProvider` | `useQueryClient()` | React Query config (staleTime: 0, refetchOnWindowFocus: false) |

---

## 5. API Layer

### Central Namespace

All API modules are exported from `src/api/mainApi.tsx`:

```typescript
export const API = {
  products: ProductsApi,
  orders: OrdersMainApi,
  analytics: AnalyticsApi,
  organization: OrganizationSettingsApi,
  recurringCosts: RecurringCostsApi,
  locations: LocationsApi,
  sales: SalesMainApi,
  inventory: InventoryApi,
  pos: PosConnectionApi,
  invoices: { ...InvoicesApi, linking: InvoiceLinkingApi },
};
```

Usage: `API.products.articles.useGetAll()`, `API.orders.useCreate()`, etc.

### API Module Pattern

Each module exports an object with React Query hooks:

```typescript
export const ArticlesApi = {
  // Sub-modules
  allergens: ArticleAllergensApi,
  suppliers: ArticleSuppliersApi,

  // Query hooks
  useGetAll: () => {
    const { getAll } = useDb();
    return useQuery({
      queryKey: ['article_with_product'],
      queryFn: () => getAll('article_with_product', {}, DEFAULT_SELECT),
    });
  },

  // Mutation hooks
  useCreate: () => {
    const { insert } = useDb();
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (values) => insert('articles', values),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['article_with_product'] }),
    });
  },
};
```

### Database Utility (`useDb`)

`src/utils/api/usedb.ts` provides a hook wrapping Supabase:

```typescript
const { getAll, getAllPaginated, getOne, insert, update, upsert, remove, rpc, invokeEdgeFunction } = useDb();
```

`getAllPaginated` returns:
```typescript
interface PaginatedResult<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

---

## 6. Custom Forms

### Architecture

The form system is **schema-driven** and built on three layers:

1. **Zod schema** — defines shape and validation rules
2. **`CustomForm`** — wraps `react-hook-form` with `FormProvider`
3. **Custom field components** — use `useFormContext()` to integrate

### CustomForm Component

**Location:** `src/components/forms/CustomForm.tsx`

```typescript
export function CustomForm<TSchema extends ZodType<any, ZodTypeDef, any>>({
  schema,         // Zod schema for validation
  defaultValues,  // Initial form values (typed from schema)
  onSubmit,       // SubmitHandler<z.infer<TSchema>>
  children,       // Form field components
  id,             // Optional form ID (used by DialogFormActions)
}: CustomFormProps<TSchema>) {
  const methods = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onBlur",   // Validate when field loses focus
  });

  return (
    <FormProvider {...methods}>
      <form id={id} onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack spacing={2}>{children}</Stack>
      </form>
    </FormProvider>
  );
}
```

### Available Field Components

All fields live in `src/components/forms/` and accept a generic `<TValues extends FieldValues>` with a `name: Path<TValues>` prop for type-safe field binding.

| Component | Purpose | Key Props |
|---|---|---|
| `CustomInputField` | Text/textarea input | `multiline`, `rows`, `enableDictation` |
| `CustomNumberField` | Number input | `min`, `max`, `step`, `maxDecimals` |
| `CustomSelectField` | Autocomplete dropdown | `options`, `multiple`, `showImages`, `subtitle` |
| `CustomDateField` | Date picker | `minDate`, `maxDate` (Italian locale) |
| `CustomVatInputField` | Italian VAT number | Stores `"IT" + 11 digits`, displays digits only |
| `CustomPhoneField` | International phone | Country selector with flags (195+ countries) |
| `CustomLocationField` | Google Places autocomplete | `onLocationSelect` callback with lat/lng |
| `CustomImageUploadField` | Image upload to Supabase | `entityType`, `entityId`, ref-based API |
| `CustomWebsiteInputField` | URL input | Zod URL validation |
| `CustomRegionField` | Italian region selector | Static list of regions |
| `CustomDurationField` | Hours/minutes/seconds | Three dropdowns |
| `PriceVatFields` | Net + VAT% + Gross | Bidirectional calculation, `vatLocked` |
| `StandaloneInputField` | Text input (no form context) | Works outside `CustomForm` |
| `StandaloneNumberField` | Number input (no form context) | Works outside `CustomForm` |

### Defining a Zod Schema

Schemas live in `src/schema/` organized by domain:

```typescript
// src/schema/organization/organizationSettings.ts
export const createRecurringCostSchema = z.object({
  name: z.string().min(1, "Il nome è richiesto").max(255),
  amount: z.preprocess(
    (val) => Number(val),
    z.number({ message: "Campo obbligatorio" })
      .min(0, "L'importo deve essere almeno 0")
      .refine((val) => hasMaxDecimals(val, 2), "Massimo 2 decimali")
  ),
  category: z.string().min(1, "La categoria è richiesta"),
  repetition_frequency: z.enum(["monthly", "quarterly", "annually", "custom", "one_off"]),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data non valida"),
  location_ids: z.array(z.number()).nullable().optional(),
});

export type CreateRecurringCostSchema = z.infer<typeof createRecurringCostSchema>;
```

### Building a Form (Complete Example)

**Step 1 — Define schema** (as above)

**Step 2 — Create form content component:**

```typescript
function RecurringCostFormContent() {
  const form = useFormContext<CreateRecurringCostSchema>();
  const frequency = form.watch("repetition_frequency");

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField name="name" placeholder="Nome (Es. Affitto)" autoFocus />
      </Grid>

      <Grid size={12}>
        <PriceVatFields
          netName="amount"
          vatName="vat_percentage"
          grossName="total_preview"
        />
      </Grid>

      <Grid size={12}>
        <CustomSelectField
          name="repetition_frequency"
          placeholder="Frequenza"
          options={[
            { value: "monthly", label: "Mensile" },
            { value: "quarterly", label: "Trimestrale" },
          ]}
        />
      </Grid>

      {/* Conditional fields based on form state */}
      {frequency === "custom" && (
        <Grid size={12}>
          <CustomSelectField name="repeating_months" placeholder="Mesi" multiple />
        </Grid>
      )}
    </Grid>
  );
}
```

**Step 3 — Use in dialog/page:**

```typescript
<CustomForm<typeof createRecurringCostSchema>
  schema={createRecurringCostSchema}
  defaultValues={{ name: "", amount: 0, category: "", ... }}
  onSubmit={async (data) => {
    await addMutation.mutateAsync(data);
    toast.success("Costo aggiunto!");
    onClose();
  }}
  id="cost-form"
>
  <RecurringCostFormContent />
</CustomForm>
```

### Advanced Form Patterns

#### Nested Array Fields
```typescript
// Schema
items: z.array(z.object({
  quantity_received: z.number(),
  expiration_date: z.string(),
}))

// Field component
<CustomNumberField
  name={`items.${index}.quantity_received` as any}
  placeholder="Quantita"
/>
```

#### Async Validation
```typescript
const schema = baseSchema.extend({
  sku: z.string().optional().refine(async (val) => {
    if (!val) return true;
    const existing = await getAll<Product>("products", { sku: val });
    return !existing.some((p) => p.id !== currentProductId);
  }, "SKU gia esistente"),
});
```

#### Imperative Image Upload
```typescript
const imageUploadRef = useRef<CustomImageUploadRef>(null);

const onSubmit = async (data) => {
  let imageUrl = data.image;
  if (imageUploadRef.current?.hasFile()) {
    imageUrl = await imageUploadRef.current.uploadFile();
  }
  await mutation.mutateAsync({ ...data, image: imageUrl });
};

<CustomImageUploadField ref={imageUploadRef} name="image" entityType="articles" entityId="123" />
```

#### PriceVatFields (Synchronized Fields)
```typescript
// Three fields that auto-calculate each other:
// - Change net → gross recalculates
// - Change gross → net recalculates
// - Change VAT% → dependent field recalculates
<PriceVatFields
  netName="price_net"
  vatName="vat_percentage"
  grossName="price_gross"
  vatLocked={false}  // Set true to disable VAT editing
/>
```

---

## 7. Custom Dialogs

### Architecture

The dialog system is built on three components:

1. **`ResponsiveDialog`** — base responsive wrapper
2. **`DialogFormActions`** — standardized Cancel/Submit buttons
3. **`ConfirmDeleteDialog`** — reusable delete confirmation

### ResponsiveDialog

**Location:** `src/components/dialogs/ResponsiveDialog.tsx`

Renders differently based on screen size and configuration:

| Condition | Renders As |
|---|---|
| Mobile (`< sm` breakpoint) | `SwipeableDrawer` (bottom sheet, max 90dvh) |
| Desktop + `isSideSheet={true}` | `Drawer` (right-sided, configurable width) |
| Desktop (default) | MUI `Dialog` (centered modal, max-width `sm`) |

```typescript
interface ResponsiveDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  actions?: ReactNode;    // Rendered in footer
  children: ReactNode;    // Scrollable content area
  isSideSheet?: boolean;  // Use right drawer instead of modal
  sidesheetWidth?: number; // Default: 550, max: 85vw
}
```

### DialogFormActions

**Location:** `src/components/dialogs/DialogFormActions.tsx`

Standardized action buttons that integrate with React Query mutations:

```typescript
interface DialogFormActionsProps {
  onClose: () => void;
  mutation: UseMutationResult<any, any, any, any>;
  formId?: string;         // Links to CustomForm's id prop
  onSubmit?: () => void;   // Alternative to form submission
  submitText?: string;     // Default: "Aggiungi"
  cancelText?: string;     // Default: "Annulla"
  loadingText?: string;    // Default: "Aggiungendo..."
}
```

The Cancel button is disabled during loading. The Submit button shows `loadingText` and is disabled when `mutation.isPending` is true. When `formId` is provided, the submit button uses `type="submit"` with `form={formId}` to trigger the linked `CustomForm`.

### ConfirmDeleteDialog

**Location:** `src/components/dialogs/ConfirmDeleteDialog.tsx`

```typescript
interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: ReactNode;
  isLoading?: boolean;
}
```

Auto-focuses the confirm button after 100ms. Prevents closing during deletion (`onClose` becomes a no-op while loading).

### Building a Create/Edit Dialog (Complete Example)

```typescript
// src/app/dashboard/products/articles/components/AddArticleDialog.tsx

interface Props {
  open: boolean;
  onClose: () => void;
}

export const AddArticleDialog = ({ open, onClose }: Props) => {
  const mutation = API.products.articles.useCreate();

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      title="Aggiungi Articolo"
      actions={
        <DialogFormActions
          onClose={onClose}
          mutation={mutation}
          formId="add-article-form"
          submitText="Aggiungi"
        />
      }
    >
      <CustomForm<typeof addArticleSchema>
        schema={addArticleSchema}
        defaultValues={{ name: "", category: "" }}
        onSubmit={async (data) => {
          await mutation.mutateAsync(data);
          toast.success("Articolo aggiunto!");
          onClose();
        }}
        id="add-article-form"
      >
        <CustomInputField name="name" placeholder="Nome" autoFocus />
        <CustomSelectField name="category" placeholder="Categoria" options={categoryOptions} />
      </CustomForm>
    </ResponsiveDialog>
  );
};
```

### Building a Delete Dialog

```typescript
export const DeleteArticleDialog = ({ open, onClose, article }: Props) => {
  const deleteMutation = API.products.articles.useDelete();

  const handleConfirm = async () => {
    await deleteMutation.mutateAsync(article.id);
    toast.success("Articolo eliminato");
    onClose();
  };

  return (
    <ConfirmDeleteDialog
      open={open}
      onClose={onClose}
      onConfirm={handleConfirm}
      message={<>Sei sicuro di voler eliminare <b>{article.name}</b>?</>}
      isLoading={deleteMutation.isPending}
    />
  );
};
```

### Dialog State Management (Parent Component)

Dialogs are always controlled by the parent component. No global dialog state or context is used.

```typescript
export default function ArticlesPage() {
  // Dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

  return (
    <PageLayout title="Articoli">
      <Button onClick={() => setAddDialogOpen(true)}>Aggiungi</Button>

      <ArticlesTable
        onDelete={(article) => setDeleteTarget(article)}
      />

      {/* Dialogs rendered at bottom of component */}
      <AddArticleDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
      />
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget!)}
        message={`Eliminare ${deleteTarget?.name}?`}
      />
    </PageLayout>
  );
}
```

### Dialog Variants

| Type | Pattern | Example |
|---|---|---|
| **Create** | Form + mutation + toast on success | `AddArticleDialog`, `AddRecipeDialog` |
| **Edit** | Prefilled form + update mutation | `EditArticleDetailsDialog`, `EditBasicInfoDialog` |
| **Delete** | `ConfirmDeleteDialog` + delete mutation | Reused across all entities |
| **Side Sheet** | `isSideSheet={true}` for wide content | `EditBasicInfoDialog` (850px), `InvoiceViewDialog` (1200px) |
| **Multi-Step** | Internal step state (1, 2, 3) with conditional rendering | `CreateRecipeWithAIDialog` |
| **AI-Powered** | Async data fetch + preview + selection | `CompileArticleWithAIDialog` |

### Dialog Lifecycle

```
1. Open     → Parent sets state: setDialogOpen(true)
2. Render   → ResponsiveDialog renders (mobile/desktop/sidesheet)
3. Form     → CustomForm initializes with defaultValues + schema
4. Input    → Fields validate on blur via Zod
5. Submit   → onSubmit handler calls mutation.mutateAsync()
6. Loading  → DialogFormActions shows loading state
7. Success  → toast.success() + onClose()
8. Error    → toast.error(), dialog stays open for retry
9. Close    → Parent resets state, dialog unmounts
```

---

## 8. Smart Tables

### Architecture

The SmartTable system provides responsive, type-safe tables with automatic data formatting, pagination, and row actions.

**Location:** `src/components/smartTable/`

```
smartTable/
├── SmartTable.tsx          # Main entry point (responsive switch)
├── DesktopView.tsx         # HTML <Table> with sticky header
├── MobileView.tsx          # Card-based layout
├── SmartTableActions.tsx   # Standard row action buttons
├── types.ts                # Column<T> interface
└── utils.ts                # Date formatting, nested value access
```

### Column Definition

```typescript
interface Column<T> {
  header: string;                              // Column header text
  accessor?: keyof T | string;                 // Property path (supports dot notation: "supplier.name")
  width?: string | number;                     // Column width
  align?: "left" | "right" | "center";        // Text alignment
  render?: (value: any, row: T) => ReactNode;  // Custom cell renderer
  hideOnMobile?: boolean;                      // Hide on mobile cards
}
```

### SmartTable Props

```typescript
interface SmartTableProps<T> {
  // Data
  data: T[];
  columns: Column<T>[];
  getRowKey?: (item: T) => string | number;

  // Loading
  isLoading: boolean;
  skeletonRows?: number;            // Default: 8
  noDataMessage?: string;           // Default: "Nessun dato disponibile"

  // Images
  imageAccessor?: keyof T | string; // Path to image field (renders avatar)

  // Row interaction
  rowClickable?: boolean;           // Default: true
  onRowClick?: (item: T) => void;

  // Actions
  mobileActions?: (item: T) => ReactNode; // Action buttons (used on both mobile & desktop)
  disableDesktopActions?: boolean;
  actionColumnWidth?: string | number;

  // Footer
  showFooter?: boolean;
  footerData?: Record<string, string | number>;

  // Pagination
  showPagination?: boolean;
  paginationData?: PaginatedResult<T>;
  onPageChange?: (page: number) => void;

  // Layout
  maxHeight?: number;               // Enables sticky header
  disableMobileView?: boolean;      // Force desktop view on all screens

  // Custom renderers (overrides)
  renderRow?: (item: T) => ReactNode;     // Custom desktop row
  mobileRender?: (item: T) => ReactNode;  // Custom mobile card
}
```

### Automatic Data Type Handling

SmartTable auto-formats cell values when no `render` function is provided:

| Type | Rendered As |
|---|---|
| `boolean` | Green "Si" or Red "No" `<Chip>` |
| `Array` | Up to 2 `<Chip>`s + "+N" overflow chip |
| Date string (ISO) | Formatted as "15 Mag" or "Oggi"/"Ieri" |
| Default | `<Typography>` with text truncation and title tooltip |

### Row Actions

**Location:** `src/components/smartTable/SmartTableActions.tsx`

```typescript
type SmartTableActionType = "open" | "edit" | "delete";

interface SmartTableActionHandlers<T> {
  open?: (item: T, target: HTMLElement) => void;
  edit?: (item: T, target: HTMLElement) => void;
  delete?: (item: T, target: HTMLElement) => void;
}

// Renders icon buttons for each action
renderStandardActions<T>(item, actions, handlers)
```

Icons: `open` = OpenInNewRounded, `edit` = EditRounded, `delete` = DeleteRounded

### Pagination

Uses the `usePagination` hook from `src/hooks/usePagination.ts`:

```typescript
const { paginationOptions, handlePageChange, handleSearchChange, handleSortChange } = usePagination({
  initialSortBy: "id",
  initialSortOrder: "desc",
  searchField: "name",
});
```

`paginationOptions` is passed to API hooks. The API returns `PaginatedResult<T>` which feeds back into `SmartTable`.

### Building a Table (Complete Example)

**Step 1 — Define the table component:**

```typescript
// src/app/dashboard/products/recipes/components/RecipesTable.tsx

interface Props {
  recipes: RecipeWithProduct[];
  isLoading: boolean;
  onDelete?: (recipe: RecipeWithProduct) => void;
  paginationData?: PaginatedResult<RecipeWithProduct>;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
}

export function RecipesTable({ recipes, isLoading, onDelete, paginationData, onPageChange, showPagination = false }: Props) {
  const router = useRouter();

  const columns: Column<RecipeWithProduct>[] = [
    { header: "Nome", accessor: "name" },
    {
      header: "Categoria",
      accessor: "category",
      render: (value) => <RecipeCategoryChip category={value} />,
    },
    {
      header: "Prezzo vendita",
      accessor: "selling_price",
      align: "right",
      render: (value) => formatCurrency(value),
    },
    {
      header: "Food Cost %",
      accessor: "food_cost_percentage",
      align: "right",
      render: (value) => `${value?.toFixed(1)}%`,
      hideOnMobile: true,
    },
  ];

  const openAction = (recipe: RecipeWithProduct) =>
    router.push(`/dashboard/products/recipes/${recipe.recipe_id}`);

  const handlers: SmartTableActionHandlers<RecipeWithProduct> = {
    open: openAction,
    delete: onDelete ? (recipe) => onDelete(recipe) : undefined,
  };

  const actions: SmartTableActionType[] = onDelete ? ["open", "delete"] : ["open"];

  return (
    <SmartTable
      data={recipes}
      columns={columns}
      isLoading={isLoading}
      noDataMessage="Nessuna ricetta disponibile"
      imageAccessor="image"
      getRowKey={(item) => item.recipe_id}
      onRowClick={openAction}
      mobileActions={(recipe) => renderStandardActions(recipe, actions, handlers)}
      paginationData={paginationData}
      onPageChange={onPageChange}
      showPagination={showPagination}
    />
  );
}
```

**Step 2 — Use in a page:**

```typescript
// src/app/dashboard/products/recipes/page.tsx

export default function RecipesPage() {
  const { paginationOptions, handlePageChange, handleSearchChange } = usePagination({
    initialSortBy: "name",
    initialSortOrder: "asc",
    searchField: "name",
  });

  const { data: paginatedData, isLoading } = API.products.recipes.useGetAllPaginated(paginationOptions);

  const [deleteTarget, setDeleteTarget] = useState<RecipeWithProduct | null>(null);

  return (
    <PageLayout title="Ricette">
      <SearchBar
        value={paginationOptions.search || ""}
        onChange={handleSearchChange}
        placeholder="Cerca ricette..."
      />

      <RecipesTable
        recipes={paginatedData?.data || []}
        isLoading={isLoading}
        onDelete={(recipe) => setDeleteTarget(recipe)}
        paginationData={paginatedData}
        onPageChange={handlePageChange}
        showPagination
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget!)}
        message={`Eliminare ${deleteTarget?.name}?`}
      />
    </PageLayout>
  );
}
```

### Table with Footer Totals

```typescript
<SmartTable
  data={components}
  columns={columns}
  isLoading={isLoading}
  showFooter={true}
  footerData={{
    component_name: "Totale",
    raw_quantity: formatGrams(totalGross),
    processed_quantity: formatGrams(totalNet),
    component_cost: formatCurrency(totalCost),
  }}
/>
```

### Custom Action Menus

For more than open/edit/delete, build a custom menu:

```typescript
const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
const [selected, setSelected] = useState<Invoice | null>(null);

<SmartTable
  mobileActions={(invoice) => (
    <IconButton onClick={(e) => { setMenuAnchor(e.currentTarget); setSelected(invoice); }}>
      <MoreVertIcon />
    </IconButton>
  )}
/>

<Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
  <MenuItem onClick={() => onView(selected!)}>Dettaglio</MenuItem>
  <MenuItem onClick={() => onEdit(selected!)}>Modifica</MenuItem>
  <MenuItem onClick={() => onDelete(selected!)}>Elimina</MenuItem>
</Menu>
```

### Responsive Behavior

| Screen | Rendering |
|---|---|
| Desktop (>= 600px) | HTML `<Table>` with sticky header, action column |
| Mobile (< 600px) | Card-based layout, one card per row, label-value pairs |

Columns with `hideOnMobile: true` are excluded from mobile cards. The mobile view shows images at the top of each card.

---

## 9. Hooks

| Hook | Purpose |
|---|---|
| `usePagination` | Manages page, pageSize, sortBy, sortOrder, search state |
| `useUrlPagination` | Same as usePagination but persisted in URL via nuqs |
| `useLocationFilter` | Returns selected location ID (null for "All") |
| `useRequiredLocation` | Forces location selection |
| `useDebounce` | Debounces a value |
| `useGeneratePDF` | Exports HTML element to PDF via jsPDF + html2canvas |
| `useGenerateMultiSectionPDF` | Multi-section PDF export |
| `useChart` | ApexCharts theme configuration |
| `useGooglePlaces` | Google Places API autocomplete |
| `useDictation` | Speech-to-text for form fields |
| `useAiCompilationAccess` | Checks if user's plan includes AI features |

---

## 10. Conventions

### File Naming
- **Components:** PascalCase (`AddArticleDialog.tsx`, `RecipesTable.tsx`)
- **API modules:** camelCase with `Api` suffix (`articlesApi.tsx`, `ordersApi.tsx`)
- **Hooks:** camelCase with `use` prefix (`usePagination.ts`)
- **Types:** camelCase, plural (`articles.ts`, `recipes.ts`)
- **Schemas:** camelCase with `Schema` suffix (`budgetSchema.ts`)

### Component Organization
- Page-specific components go in `src/app/dashboard/[feature]/components/`
- Detail page dialogs go in `src/app/dashboard/[feature]/[id]/components/dialogs/`
- Shared components go in `src/components/`

### API Hook Naming
- `useGetAll` / `useGetAllPaginated` — fetch all / paginated
- `useGetOne` — fetch single item
- `useCreate` / `useInsert` — create new record
- `useUpdate` — update existing record
- `useDelete` — delete record

### Mutation Pattern
```typescript
try {
  await mutation.mutateAsync(data);
  toast.success("Success message");
  onClose(); // or router.push()
} catch (error) {
  toast.error("Error message");
}
```

### Query Key Convention
```typescript
['table_name']                        // All items
['table_name', filters]               // Filtered
['table_name', filters, pagination]   // Paginated
```

### Language
All UI text is in Italian. Error messages, labels, and placeholders use Italian.
