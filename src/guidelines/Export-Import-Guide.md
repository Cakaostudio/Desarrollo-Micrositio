# 📦 Guía de Exportación e Importación de Proyectos

## Descripción General

El sistema de exportación e importación te permite:
- ✅ **Respaldar** todos tus proyectos de manera segura
- ✅ **Compartir** datos con otros colaboradores
- ✅ **Migrar** proyectos entre diferentes instalaciones
- ✅ **Analizar** datos en Excel o Google Sheets (CSV)
- ✅ **Recuperar** información en caso de pérdida

---

## 🔽 Exportación de Proyectos

### Exportar a JSON (Recomendado para Respaldos)

**Uso:**
1. Abre el Panel Admin (botón "Admin" en la esquina superior izquierda)
2. En la sección "Exportar Proyectos", haz clic en **"Exportar JSON"**
3. Se descargará un archivo con nombre: `proyectos-mexico-YYYY-MM-DD-HH-MM-SS.json`

**Ventajas:**
- ✅ Formato completo con TODOS los datos
- ✅ Puede ser re-importado al 100%
- ✅ Incluye imágenes, coordenadas, footer, estados de implementación
- ✅ Estructura legible y editable

**Cuándo usar:**
- Respaldos diarios/semanales
- Antes de hacer cambios importantes
- Para compartir con otros administradores del sistema

---

### Exportar a CSV (Para Análisis en Excel)

**Uso:**
1. Abre el Panel Admin
2. En la sección "Exportar Proyectos", haz clic en **"Exportar CSV (Excel)"**
3. Se descargará un archivo: `proyectos-mexico-YYYY-MM-DD-HH-MM-SS.csv`

**Ventajas:**
- ✅ Abre directamente en Excel, Google Sheets, Numbers
- ✅ Perfecto para análisis estadístico
- ✅ Fácil de compartir con stakeholders no técnicos
- ✅ Compatible con herramientas de BI

**Incluye columnas:**
- No. Registro
- Nombre de la Propuesta
- Organización
- Categoría
- Ámbito Temático
- Estado
- Municipio
- Estados Implementación
- Objetivo Principal
- Beneficiarios
- Factores de Riesgo
- Metodología
- Resultados Principales
- Criterios Evaluación
- Puntaje Total
- Posición Final
- URL Imagen
- Coordenadas X/Y

**Cuándo usar:**
- Reportes para stakeholders
- Análisis estadístico
- Presentaciones en PowerPoint
- Documentación de impacto

---

## 🔼 Importación de Proyectos

### Formatos Soportados
- ✅ **JSON únicamente** (archivos exportados desde este sistema)
- ❌ CSV **NO** puede ser importado (solo exportación)

### Modos de Importación

#### 1️⃣ **Modo COMBINAR** (Recomendado)
- Agrega proyectos nuevos sin eliminar los existentes
- Los proyectos con ID duplicado son **omitidos**
- Seguro: no pierdes datos actuales

**Cuándo usar:**
- Agregar proyectos de otro colaborador
- Restaurar proyectos específicos
- Fusionar bases de datos

#### 2️⃣ **Modo REEMPLAZAR TODO** (⚠️ Peligroso)
- ⚠️ **ELIMINA TODOS** los proyectos actuales
- Importa únicamente los proyectos del archivo
- No hay manera de deshacer esta acción

**Cuándo usar:**
- Restaurar un respaldo completo
- Limpiar la base de datos y empezar de nuevo
- Migrar desde otra instalación

---

### Proceso de Importación

1. **Prepara tu archivo JSON**
   - Debe ser un archivo exportado desde este sistema
   - O basado en el template `project-template.json`

2. **Abre el Panel Admin**
   - Clic en botón "Admin" (esquina superior izquierda)

3. **Selecciona el Modo**
   - **Combinar**: Agregar sin eliminar
   - **Reemplazar Todo**: Eliminar todo y reemplazar

4. **Selecciona el Archivo**
   - Clic en "Seleccionar Archivo JSON"
   - Navega a tu archivo `.json`

5. **Confirma y Espera**
   - Verás notificaciones de éxito/error
   - El sistema valida cada proyecto automáticamente

---

## ✅ Validación de Datos

El sistema valida automáticamente cada proyecto importado:

### Campos Requeridos:
- `id` (No registro)
- `name` (Nombre de la propuesta)
- `organization` (Organización)
- `category` (Categoría)
- `thematicArea` (Ámbito temático)
- `state` (Estado)
- `objective` (Objetivo principal)
- `results` (Resultados principales)
- `totalScore` (Puntaje - debe ser número)

### Si un proyecto es inválido:
- ❌ Será **omitido** automáticamente
- ℹ️ Recibirás una notificación con los índices de proyectos inválidos
- ✅ Los proyectos válidos **sí** se importarán

---

## 🔐 Seguridad y Mejores Prácticas

### Respaldos Regulares
```
📅 Recomendado:
- Diario: Si agregas/editas proyectos todos los días
- Semanal: Para uso moderado
- Mensual: Como mínimo absoluto
```

### Nomenclatura de Archivos
El sistema genera nombres automáticos con timestamp:
```
proyectos-mexico-2025-10-14-15-30-45.json
                 YYYY-MM-DD-HH-MM-SS
```

**Sugerencia:** Guarda en carpetas organizadas:
```
/respaldos
  /2025
    /octubre
      proyectos-mexico-2025-10-14-15-30-45.json
      proyectos-mexico-2025-10-21-10-15-30.json
```

### Almacenamiento
- ☁️ Guarda en la nube (Google Drive, Dropbox, OneDrive)
- 💾 Respaldo local en disco externo
- 🔄 Al menos 3 copias en diferentes ubicaciones

---

## ⚠️ Advertencias Importantes

### 1. Datos en localStorage
- Los proyectos se guardan en el navegador (localStorage)
- **SE PIERDEN** si:
  - Borras el caché del navegador
  - Borras datos del sitio
  - Usas modo incógnito
  - Cambias de dispositivo

**SOLUCIÓN:** ¡Exporta regularmente!

### 2. Límites del Navegador
- localStorage tiene límite de ~5-10MB
- Con ~100-200 proyectos no hay problema
- Para más proyectos, considera respaldos frecuentes

### 3. Compatibilidad
- Los archivos JSON **solo funcionan** en este sistema
- No intentes importar JSON de otras fuentes
- Usa el template oficial si creas datos manualmente

---

## 📝 Ejemplos de Uso

### Escenario 1: Respaldo Diario
```
1. Abrir Admin panel
2. Exportar JSON
3. Guardar en Google Drive/respaldos/diarios/
4. Cerrar panel
```

### Escenario 2: Compartir con Colaborador
```
1. Exportar JSON de proyectos actuales
2. Enviar archivo por email/drive
3. Colaborador descarga
4. Colaborador: Admin > Importar > Modo COMBINAR
5. Colaborador selecciona el archivo
6. ¡Listo! Proyectos sincronizados
```

### Escenario 3: Recuperar de Desastre
```
1. Se borraron los datos del navegador 😱
2. Abrir Admin panel (estará vacío)
3. Importar > Modo REEMPLAZAR TODO
4. Seleccionar último respaldo JSON
5. ¡Datos restaurados! 🎉
```

### Escenario 4: Análisis en Excel
```
1. Exportar CSV
2. Abrir en Excel
3. Crear tabla dinámica
4. Analizar por estado, categoría, puntaje
5. Generar gráficos para presentación
```

---

## 🆘 Solución de Problemas

### "Formato de datos incorrecto"
- ✅ Verifica que el archivo sea `.json`
- ✅ No debe estar corrupto (ábrelo en un editor de texto)
- ✅ Debe ser un array `[...]` de proyectos

### "No se encontraron proyectos válidos"
- ✅ Revisa que los campos requeridos estén presentes
- ✅ Verifica que `totalScore` sea un número
- ✅ Asegúrate de usar categorías y ámbitos válidos

### "No se importaron proyectos nuevos"
- ℹ️ Estás en modo COMBINAR
- ℹ️ Todos los proyectos del archivo ya existen (mismo ID)
- ✅ Solución: Cambia los IDs o usa modo REEMPLAZAR

### El archivo descargado no abre
- ✅ Debe tener extensión `.json` o `.csv`
- ✅ Verifica permisos de descarga del navegador
- ✅ Prueba en otro navegador

---

## 📞 Soporte

¿Necesitas ayuda?
- 📖 Lee este documento completo
- 🔍 Busca el mensaje de error específico
- 💬 Contacta al administrador del sistema

---

## 🎯 Resumen Rápido

| Acción | Formato | Uso Principal |
|--------|---------|---------------|
| **Respaldo** | JSON | Guardar todos los datos |
| **Análisis** | CSV | Excel, reportes |
| **Restaurar** | JSON | Recuperar proyectos |
| **Compartir** | JSON | Colaboración |

**Regla de oro:** 
> 📅 Exporta JSON cada semana. Tu yo del futuro te lo agradecerá.

---

*Última actualización: Octubre 2025*
