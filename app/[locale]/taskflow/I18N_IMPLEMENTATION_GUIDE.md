# TaskFlow i18n Implementation Guide

This guide explains how to add internationalization (i18n) to TaskFlow components using next-intl.

## Translation Files

All translations are located in `/messages/` directory:
- `en.json` - English
- `vi.json` - Vietnamese
- `ja.json` - Japanese
- `zh.json` - Chinese
- `ko.json` - Korean
- `th.json` - Thai

All TaskFlow translations are under the `taskflow` key.

## Implementation Pattern

### 1. Import useTranslations

```tsx
import { useTranslations } from 'next-intl';
```

### 2. Get Translation Function

```tsx
// For a specific section
const t = useTranslations('taskflow.formatHelp');

// Or for the entire taskflow
const t = useTranslations('taskflow');
```

### 3. Use Translations

```tsx
// Simple text
<h4>{t('title')}</h4>

// Nested keys
<p>{t('task.details')}</p>

// With interpolation
<span>{t('subTasksCompleted', { completed: 5, total: 10 })}</span>
```

## Example Component (FormatHelpTooltip)

See `app/[locale]/taskflow/components/FormatHelpTooltip.tsx` for a complete example.

**Before:**
```tsx
export default function FormatHelpTooltip() {
  return <h4>Notes Formatting Guide</h4>;
}
```

**After:**
```tsx
import { useTranslations } from 'next-intl';

export default function FormatHelpTooltip() {
  const t = useTranslations('taskflow.formatHelp');
  return <h4>{t('title')}</h4>;
}
```

## Available Translation Keys

### Sidebar
- `taskflow.sidebar.myDay`
- `taskflow.sidebar.important`
- `taskflow.sidebar.planned`
- `taskflow.sidebar.tasks`
- `taskflow.sidebar.projects`
- `taskflow.sidebar.contacts`
- `taskflow.sidebar.settings`

### Task
- `taskflow.task.title`
- `taskflow.task.details`
- `taskflow.task.newTask`
- `taskflow.task.addTask`
- `taskflow.task.addStep`
- `taskflow.task.notes`
- `taskflow.task.notesPlaceholder`
- `taskflow.task.notesHint`
- `taskflow.task.subTasks`
- `taskflow.task.deleteConfirm`
- `taskflow.task.deleteTask`
- And more...

### Project
- `taskflow.project.title`
- `taskflow.project.details`
- `taskflow.project.newProject`
- And more...

### Contact
- `taskflow.contact.title`
- `taskflow.contact.details`
- `taskflow.contact.name`
- `taskflow.contact.email`
- `taskflow.contact.phone`
- `taskflow.contact.company`
- And more...

### Status
- `taskflow.status.label`
- `taskflow.status.pending`
- `taskflow.status.inProgress`
- `taskflow.status.completed`

### Actions
- `taskflow.actions.important`
- `taskflow.actions.myDay`
- `taskflow.actions.ok`
- `taskflow.actions.edit`
- `taskflow.actions.editNotes`

### Settings
- `taskflow.settings.title`
- `taskflow.settings.notifications`
- `taskflow.settings.enableNotifications`
- And more...

### Format Help
- `taskflow.formatHelp.title`
- `taskflow.formatHelp.checkboxes`
- `taskflow.formatHelp.tree`
- `taskflow.formatHelp.mentions`
- And more...

## Components To Update

The following components need i18n implementation:

1. ✅ **FormatHelpTooltip.tsx** - Complete (example)
2. **TaskDetail.tsx** - Use `taskflow.task.*` keys
3. **ContactDetail.tsx** - Use `taskflow.contact.*` keys
4. **ProjectCard.tsx** - Use `taskflow.project.*` keys
5. **Settings component** - Use `taskflow.settings.*` keys
6. **Sidebar items** - Use `taskflow.sidebar.*` keys
7. **Status dropdowns** - Use `taskflow.status.*` keys

## Best Practices

1. **Keep keys descriptive**: Use clear, hierarchical keys
2. **Reuse common translations**: Use `common.*` keys for shared text
3. **Test all languages**: Switch languages to verify translations work
4. **Use interpolation for dynamic content**: `{completed}/{total}`
5. **Maintain consistency**: Follow the same structure across all language files

## Testing

1. Run the development server: `npm run dev`
2. Navigate to TaskFlow: `/en/taskflow` or `/vi/taskflow`
3. Switch languages using the language selector
4. Verify all text changes according to selected language

## Adding New Translations

1. Add the key to all 6 language files (`en.json`, `vi.json`, `ja.json`, `zh.json`, `ko.json`, `th.json`)
2. Use the translation in your component
3. Test in all languages

Example:
```json
// In messages/en.json
{
  "taskflow": {
    "myNewFeature": {
      "title": "My New Feature",
      "description": "This is a new feature"
    }
  }
}
```

```tsx
// In component
const t = useTranslations('taskflow.myNewFeature');
return <div>{t('title')}</div>;
```
