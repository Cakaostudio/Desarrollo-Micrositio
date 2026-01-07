# 🧪 URL Routing - Testing Checklist

## ✅ Testing Steps

### 1. Basic Navigation
- [ ] Load homepage `/` - map should display
- [ ] Click Admin button - should navigate to `/admin`
- [ ] Close admin - should return to `/`
- [ ] Click browser back button - should work properly

### 2. Project Deep Linking
- [ ] Click any project marker on map
- [ ] Click "Ver Proyecto Completo" in preview panel
- [ ] Verify URL changes to `/proyecto/PRJ-XXX`
- [ ] Copy URL from browser
- [ ] Open URL in new tab - project should load directly
- [ ] Click "MAPA" button - should return to map

### 3. Search Functionality
- [ ] Type search query (e.g., "educación")
- [ ] Click a project from suggestions
- [ ] Verify navigation to `/proyecto/PRJ-XXX`
- [ ] Check search query is cleared

### 4. Filter Synchronization
- [ ] Apply category filter
- [ ] Check URL updates with `?categorias=...`
- [ ] Apply thematic area filter
- [ ] Check URL updates with `&areas=...`
- [ ] Apply location filter
- [ ] Check URL updates with `&ubicaciones=...`
- [ ] Copy URL and open in new tab
- [ ] Verify filters are restored

### 5. Share Button
**On Desktop:**
- [ ] Open project detail page
- [ ] Click share button
- [ ] Verify "Enlace copiado" message
- [ ] Paste URL - should be project URL

**On Mobile:**
- [ ] Open project detail page
- [ ] Click share button
- [ ] Native share dialog should appear
- [ ] Cancel dialog
- [ ] Click share again
- [ ] Share via any app

### 6. Browser Navigation
- [ ] Navigate: Map → Project → Map
- [ ] Press browser back button
- [ ] Should return to project
- [ ] Press back again
- [ ] Should return to original map state
- [ ] Press forward button
- [ ] Should go forward through history

### 7. Invalid URLs
- [ ] Visit `/proyecto/INVALID-ID`
- [ ] Should show "Proyecto no encontrado"
- [ ] Should redirect to map after 1.5 seconds
- [ ] Visit `/random-route`
- [ ] Should show map view

### 8. Combined Filters
Test URL: `/?categorias=participacion-ciudadana&areas=educacion&ubicaciones=Jalisco`
- [ ] Paste URL in browser
- [ ] All three filters should be active
- [ ] Project count should update correctly
- [ ] Clear filters button should appear

### 9. Bookmark Test
- [ ] Apply multiple filters
- [ ] Bookmark the page
- [ ] Close browser
- [ ] Open bookmark
- [ ] Verify filters are restored

### 10. Mobile Responsiveness
- [ ] Test all routes on mobile viewport
- [ ] Admin button should be smaller on mobile
- [ ] Share button should work on mobile
- [ ] Preview panel should be full screen
- [ ] Detail page should be responsive

## 🔍 What to Look For

### URL Structure
✅ Clean URLs without hash (`#`)
✅ Readable parameters (e.g., `?categorias=cat1,cat2`)
✅ URL updates without page reload
✅ Browser history works correctly

### User Experience
✅ No page flashes or reloads
✅ Smooth transitions between routes
✅ Loading states for project lookup
✅ Error handling for invalid routes
✅ Share button provides feedback

### Performance
✅ Routes load instantly
✅ No lag when updating filters
✅ Efficient URL parameter parsing
✅ Minimal re-renders

## 📝 Example Test URLs

Copy and paste these to test:

```
# Homepage
http://localhost:5173/

# Project Detail
http://localhost:5173/proyecto/PRJ-001

# Admin Panel
http://localhost:5173/admin

# Filtered Map - Single Filter
http://localhost:5173/?categorias=participacion-ciudadana

# Filtered Map - Multiple Categories
http://localhost:5173/?categorias=participacion-ciudadana,educacion-para-la-paz

# Filtered Map - Combined Filters
http://localhost:5173/?categorias=participacion-ciudadana&areas=educacion&ubicaciones=Jalisco

# Search Query
http://localhost:5173/?busqueda=educacion

# All Filters Combined
http://localhost:5173/?categorias=participacion-ciudadana&areas=educacion,salud&ubicaciones=Jalisco,CDMX&busqueda=jovenes
```

## 🐛 Known Limitations

- Share button requires HTTPS for Web Share API (except localhost)
- Clipboard API may require user gesture in some browsers
- First load may be slower as projects data loads

## ✨ Success Criteria

All tests should pass with:
- ✅ No console errors
- ✅ Smooth navigation
- ✅ Correct URL updates
- ✅ Proper filter restoration
- ✅ Working share functionality
- ✅ Mobile-friendly experience
