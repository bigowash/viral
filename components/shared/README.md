# Shared Translations

This directory contains common translation strings that are used across multiple components.

## Structure

- **Location**: `components/shared/translations/`
- **Files**: `en.json`, `fr.json`, `sl.json`
- **Structure**: Organized by category:
  - `common.buttons` - Common button labels (Save, Cancel, Delete, etc.)
  - `common.labels` - Common form labels (Email, Password, Name, etc.)
  - `common.placeholders` - Common input placeholders
  - `common.states` - Loading/saving states (Loading..., Saving..., etc.)
  - `common.roles` - User roles (Member, Owner)
  - `common.misc` - Other common strings (Free, Unknown User)

## How It Works

The translation loading system automatically merges shared translations with component-specific translations:

1. **Shared translations** are loaded first (base layer)
2. **Component-specific translations** override shared translations where they overlap
3. Components have access to both:
   - `t.common.buttons.save` - From shared translations
   - `t.generalSettings.saveChanges` - From component-specific translations

## Usage

Shared translations are automatically available to all components through the `useComponentTranslations` hook:

```tsx
const t = useComponentTranslations<YourTranslations>('ComponentName');

// Access shared translations
t?.common.buttons.save

// Access component-specific translations (takes precedence)
t?.generalSettings.saveChanges
```

## Adding New Common Strings

When adding a new common string that's used across multiple components:

1. Add it to `components/shared/translations/en.json` (and other locales)
2. Remove it from individual component translation files
3. Components will automatically have access via `t.common.*`

## Best Practices

- **Keep component-specific strings** for context-specific translations (e.g., "Save Changes" vs just "Save")
- **Use shared strings** for truly generic strings (e.g., "Save", "Cancel", "Delete")
- **Component translations override shared** - use this for context-specific variations

