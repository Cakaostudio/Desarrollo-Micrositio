# Footer Fields Update

## Summary
Successfully updated project detail page footers with:
1. **Sitio Web** (Website) - with Globe icon (NEW)
2. **Dirección de oficinas principales** (Physical Office Address) - with MapPin icon (NEW)
3. **X (Twitter)** - replacing LinkedIn social media field (UPDATED)

## Changes Made

### 1. Type Definition (`/types/index.ts`)
Updated Project interface footer fields:
- `footerWebsiteUrl?: string;` - Website URL (Sitio web) [NEW]
- `footerPhysicalAddress?: string;` - Physical office address (Dirección de oficinas principales) [NEW]
- `footerXUrl?: string;` - X (Twitter) URL [REPLACED footerLinkedinUrl]

### 2. Admin Data Entry (`/components/AdminDataEntry.tsx`)
Updated the admin panel form inputs:
- **Sitio Web**: URL input field [NEW]
- **Dirección de oficinas principales**: Textarea input with helper text explaining that "No tiene ubicación física" will be shown when empty [NEW]
- **X URL**: Replaced LinkedIn input field, accepts both x.com and twitter.com URLs [UPDATED]

### 3. Global Footer (`/components/GlobalFooter.tsx`)
Enhanced the footer display:
- **Website**: Shows as a clickable link with Globe icon (only when URL is provided) [NEW]
- **Physical Address**: Shows the address with MapPin icon, or displays "No tiene ubicación física" in italics when empty [NEW]
- **X (Twitter)**: Custom X icon replacing LinkedIn icon in social media section [UPDATED]

## Features
- ✅ Website link opens in new tab with proper security attributes
- ✅ Physical address displays "No tiene ubicación física" message when empty (italic, slightly transparent)
- ✅ X (Twitter) icon using custom SVG with official X logo design
- ✅ Accepts both x.com and twitter.com URLs
- ✅ Consistent styling with existing footer elements
- ✅ Proper icons from lucide-react (Globe, MapPin) and custom X icon
- ✅ Responsive layout maintained
- ✅ All data syncs automatically with Supabase backend

## Usage
1. Go to Admin Panel
2. When creating/editing a project, scroll to "Información del Footer"
3. Fill in:
   - **Sitio Web**: Enter the full website URL (e.g., https://www.ejemplo.com)
   - **Dirección de oficinas principales**: Enter the physical address or leave blank
   - **Redes Sociales**: Instagram, Facebook, and X (Twitter) URLs
4. Save the project
5. View the project detail page to see the footer with the updated fields

## Visual Layout
The footer has three columns:
- **Left Column**: Organization name, Website link, Physical address
- **Center Column**: Email, Phone
- **Right Column**: Social media icons (Instagram, Facebook, X)
