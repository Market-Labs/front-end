# Integración con la API de MarketGo

## Entornos

- Desarrollo (`.env.development`): `VITE_API_BASE_URL=http://localhost:5262/`.
- Producción (`.env.production`): `VITE_API_BASE_URL=https://marketgo-backend.vercel.app/`.
- `VITE_API_BASE_URL` es pública en el navegador. No colocar contraseñas, JWT ni cadenas de conexión en variables `VITE_`.
- Los modos Firebase y demo ya no intervienen en las peticiones de la aplicación. `server/db.json` no se migra en esta fase.

## Sesión y datos

El inicio de sesión y el registro usan `/api/v1/auth/sign-in` y `/api/v1/auth/sign-up`. El JWT se envía como `Authorization: Bearer` y `/api/v1/auth/me` valida la sesión al cargar la aplicación. Las rutas de minimarket y proveedor se construyen con `user.organizationId` y `user.accountType`; no hay IDs de cuentas codificados.

El catálogo público de `/api/v1/products` contiene menos campos que el detalle privado. Las acciones de edición y eliminación se muestran solo para productos de la organización actual. El directorio de proveedores usa el ID de la ficha y `supplierOrganizationId` como identificadores distintos. Las solicitudes se envían a la organización proveedora; el proveedor crea órdenes desde solicitudes aceptadas. Al aceptar una recepción, el frontend envía `receivedLines` con lotes, vencimientos y cantidades y vuelve a consultar inventario. El backend calcula el stock.

Los reportes PDF/XLSX se construyen en el navegador con las fuentes que devuelve la API. No se guardan en el backend.

## Funciones pendientes de contrato

- `/api/v1/users` permite consultar usuarios, pero su POST registra una organización nueva. No existe una operación para crear o editar colaboradores dentro de una organización. La pantalla de usuarios queda en consulta.
- No hay endpoints de `retailSales`, `activityHistory`, recuperación de contraseña ni ofertas. No se usan datos ficticios para suplirlos. La salida ordinaria de stock usa la actualización de inventario disponible; el backend no registra todavía un movimiento de despacho separado.
- El registro de una organización no crea automáticamente su perfil comercial. El dueño puede crear su perfil desde la pantalla de contactos antes de que otras organizaciones lo seleccionen.
- Los datos históricos de Firebase y `server/db.json` no aparecen automáticamente en la base real. Su importación necesita una fase aparte.

## Publicación

La API publicada responde en `/api/v1/health`, pero actualmente no envía `Access-Control-Allow-Origin` para `https://front-end-tan-kappa-94.vercel.app`. El responsable del backend debe agregar ese origen exacto a CORS de producción y volver a publicar el backend. Después, configurar/verificar `VITE_API_BASE_URL` en Vercel y volver a publicar el frontend. Las pruebas de extremo a extremo con cuentas reales quedan para esa fase; no usar datos de prueba en la base de producción.
