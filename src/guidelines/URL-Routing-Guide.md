# URL Routing & Deep Linking Guide

## Overview
The application now supports full URL routing, enabling shareable links, browser navigation, and deep linking to specific projects and filtered views.

## Routes

### 1. Main Map View - `/`
The default route showing the interactive Mexico map with all projects.

**Features:**
- Displays all projects as markers on the map
- Search and filter functionality
- URL parameters sync with active filters

**Example URLs:**
```
https://yoursite.com/
https://yoursite.com/?categorias=categoria1,categoria2
https://yoursite.com/?areas=area1&ubicaciones=Jalisco
https://yoursite.com/?busqueda=educacion
```

### 2. Project Detail Page - `/proyecto/:projectId`
Shows detailed information about a specific project.

**Features:**
- Full project details with typewriter effect
- Shareable URL for specific projects
- Back button returns to previous page
- Share button to copy URL or use Web Share API

**Example URLs:**
```
https://yoursite.com/proyecto/PRJ-001
https://yoursite.com/proyecto/PRJ-042
```

**How to Share:**
1. Click the share button in the project detail view
2. Use Web Share API (mobile) or copy link to clipboard
3. Share the URL via social media, email, or messaging

### 3. Admin Panel - `/admin`
Administrative interface for managing projects.

**Features:**
- Add new projects
- Edit/delete existing projects
- Import/export data
- Accessible via `/admin` route or Admin button

**Example URL:**
```
https://yoursite.com/admin
```

## URL Parameters

### Filter Parameters
Filters are automatically synced with URL parameters for shareable filtered views.

| Parameter | Description | Example |
|-----------|-------------|---------|
| `categorias` | Selected categories (comma-separated) | `?categorias=cat1,cat2` |
| `areas` | Selected thematic areas (comma-separated) | `?areas=educacion,salud` |
| `ubicaciones` | Selected locations (comma-separated) | `?ubicaciones=Jalisco,CDMX` |
| `busqueda` | Search query | `?busqueda=participacion` |

### Combined Filters
Multiple filters can be combined:
```
?categorias=cat1&areas=educacion&ubicaciones=Jalisco&busqueda=jovenes
```

## Browser Navigation

### Back/Forward Buttons
- Browser back button returns to previous page
- Browser forward button navigates forward
- Navigation history is preserved

### Bookmarks
- Any page can be bookmarked
- Bookmarked filters are restored when visiting the URL
- Project detail pages load directly from URL

## Implementation Details

### Core Files

1. **`/hooks/useURLSync.ts`**
   - Custom hook for URL synchronization
   - Syncs filters with URL parameters
   - Provides navigation helpers

2. **`/pages/MapView.tsx`**
   - Main map view component
   - Syncs filters to URL on change

3. **`/pages/ProjectDetailPage.tsx`**
   - Project detail page component
   - Loads project from URL parameter
   - Handles missing projects gracefully

4. **`/pages/AdminPage.tsx`**
   - Admin panel route component

5. **`/components/ShareButton.tsx`**
   - Reusable share button component
   - Web Share API with clipboard fallback

### Key Functions

```typescript
// Navigate to project detail
navigate(`/proyecto/${projectId}`);

// Navigate to map with filters
navigate(`/?categorias=cat1&areas=area1`);

// Navigate to admin
navigate('/admin');

// Go back
navigate(-1);
```

## User Workflows

### Sharing a Project
1. User clicks on a project marker
2. Preview panel opens
3. User clicks "Ver Proyecto Completo"
4. Full details page opens
5. User clicks share button
6. URL is copied or shared via Web Share API

### Sharing Filtered View
1. User applies filters on map
2. URL automatically updates with filter parameters
3. User copies URL from browser
4. Recipient opens URL and sees same filtered view

### Direct Project Access
1. User receives project link: `yoursite.com/proyecto/PRJ-001`
2. Clicking link opens project detail page directly
3. User can click "MAPA" to return to map view

## Mobile Optimizations

- Share button uses Web Share API on mobile devices
- Touch-friendly share button sizing
- Responsive layouts for all routes
- Back navigation works with mobile gestures

## Benefits

✅ **Shareable Links** - Send specific projects to stakeholders
✅ **SEO Friendly** - Each project has unique URL
✅ **Browser Integration** - Back/forward buttons work
✅ **Bookmarkable** - Save filtered searches
✅ **Deep Linking** - Direct access to any view
✅ **Collaboration** - Share findings with team

## Future Enhancements

- Add Open Graph meta tags for social media previews
- Implement canonical URLs for SEO
- Add sitemap generation for search engines
- Support for URL shortening service integration
- QR code generation for project links

## Testing URLs

### Test Filter Combinations
```bash
# Single filter
/?categorias=participacion-ciudadana

# Multiple filters
/?categorias=participacion-ciudadana&ubicaciones=Jalisco,CDMX

# Search query
/?busqueda=educacion

# Combined
/?categorias=participacion-ciudadana&areas=educacion&busqueda=jovenes
```

### Test Project Links
```bash
# Valid project
/proyecto/PRJ-001

# Invalid project (redirects to map)
/proyecto/INVALID-ID

# Admin panel
/admin
```

## Troubleshooting

### Filters Not Persisting
- Check that URL parameters are being read correctly
- Ensure `useURLSync` hook is called in MapView
- Verify filter values match option values in data

### Project Not Loading
- Confirm project ID exists in projects array
- Check browser console for errors
- Verify project data is loaded before routing

### Share Button Not Working
- Web Share API requires HTTPS (except localhost)
- Fallback to clipboard should work on all browsers
- Check browser permissions for clipboard access
