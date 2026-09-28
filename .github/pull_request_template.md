## Tipo de cambio

Elegí el prefijo correcto en el **título de esta PR**.

### 🐛 `fix:` — PATCH

Usalo para corregir un bug sin cambiar la compatibilidad de la aplicación.

Ejemplo:

`fix: corregir validación de recibos`

Versión:

`1.0.0 → 1.0.1`

---

### ✨ `feat:` — MINOR

Usalo cuando agregás una nueva funcionalidad sin romper lo que ya existía.

Ejemplo:

`feat: agregar métricas por proyecto`

Versión:

`1.0.0 → 1.1.0`

---

### 💥 `feat!:` — MAJOR

Usalo cuando el cambio rompe compatibilidad con el comportamiento anterior.

Es decir, algo que obliga a usuarios, clientes o integraciones existentes a adaptarse.

Ejemplos:

- Cambiar o eliminar una API existente.
- Cambiar el formato de datos que espera una integración.
- Cambiar una funcionalidad de forma incompatible.
- Eliminar una funcionalidad existente que otros sistemas utilizan.

Ejemplo:

`feat!: cambiar el formato de la API de facturas`

Versión:

`1.0.0 → 2.0.0`

> ⚠️ `feat!:` no significa simplemente "una feature grande".
> Significa **breaking change**: algo que rompe compatibilidad con lo anterior.

---

### 🔧 Otros tipos

Estos tipos también son válidos, pero normalmente **no generan una nueva versión por sí mismos**:

| Prefijo | Uso |
| --- | --- |
| `docs:` | Cambios de documentación |
| `refactor:` | Reorganización del código sin cambiar funcionalidad |
| `test:` | Agregar o modificar tests |
| `style:` | Formato/estilo del código |
| `chore:` | Mantenimiento general |
| `ci:` | Cambios de CI/CD |
| `build:` | Cambios del sistema de build o dependencias |
| `perf:` | Mejoras de rendimiento |

Ejemplos:

`docs: actualizar documentación de facturas`

`refactor: separar lógica de validación`

`chore: actualizar dependencias`

---

## ¿Qué versión generará?

| PR | Significado | Incremento |
| --- | --- | --- |
| `fix:` | Corrección de bug | PATCH |
| `feat:` | Nueva funcionalidad | MINOR |
| `feat!:` | Cambio incompatible | MAJOR |

Ejemplo:

```text
Versión actual: 1.2.0

fix: corregir email
        ↓
1.2.1

feat: agregar métricas
        ↓
1.3.0

feat!: cambiar API
        ↓
2.0.0
