# Imagenes de platos

Este directorio es el lugar fijo para las imagenes del catalogo.

## Reglas generales

- Guardar una imagen principal por plato.
- Usar formato `webp`.
- Usar nombres en `kebab-case`, todo en minusculas.
- Mantener exactamente los nombres definidos en `src/catalog/plateImages.ts`.
- Resolucion sugerida: `1200px` de ancho.
- Peso sugerido: entre `120 KB` y `250 KB`.
- Mantener la misma atmosfera, la misma iluminacion y el mismo fondo en toda la serie.
- No inventar ingredientes que no esten en esta guia.
- Si un ingrediente existe solo como parte tecnica de la preparacion, no hace falta mostrarlo separado.

## Archivos esperados

- `pizza-muzzarella-clasica.webp`
- `pizza-especial-jamon-morron.webp`
- `sanguche-milanesa-completo-aji.webp`
- `sanguche-milanesa-completo-sin-aji.webp`
- `sanguche-milanesa-pollo.webp`
- `milanesa-napolitana-papas.webp`
- `hamburguesa-clasica-cheddar-bacon.webp`
- `hamburguesa-pollo-crispy.webp`
- `empanadas-carne-x3.webp`
- `empanadas-jamon-queso-x3.webp`
- `papas-fritas-clasicas.webp`

## Ruta publica

- `/assets/plates/<archivo>.webp`

## Conversion a webp

Si generaste los archivos en `png`, los podes convertir con:

- `bash apps/backend/scripts/convert-plates-to-webp.sh`

Opcionales:

- `bash apps/backend/scripts/convert-plates-to-webp.sh --force`
- `bash apps/backend/scripts/convert-plates-to-webp.sh --force --delete-png`

Tambien quedo disponible como script del backend:

- `bun run plates:webp`

## Base comun para toda la serie

Usar siempre esta misma logica visual para que Nano Banana no cambie el estilo entre platos:

- fotografia gastronomica publicitaria realista
- vista 3/4 a 45 grados
- plato centrado
- vajilla ceramica mate color grafito o negro suave
- mesa de madera oscura nogal
- fondo desenfocado de restaurante calido, neutro y elegante
- iluminacion lateral suave y calida, siempre en la misma direccion
- sin personas, sin manos, sin bebidas, sin cubiertos extra, sin texto, sin logos
- sin cambiar ni el angulo ni el fondo ni la mesa ni la vajilla entre una imagen y otra
- look de restaurante clasico argentino, no gourmet experimental

## Guia de composicion por plato

### `pizza-muzzarella-clasica.webp`

- Plato: pizza muzzarella clasica.
- Ingredientes visibles: masa de pizza, salsa de pizza, mozzarella abundante, aceitunas verdes en rodajas, oregano.
- Textura esperada: piso firme, borde suave, queso bien fundido, nada gourmet ni minimalista.
- Evitar: jamon, morron, albahaca, tomates cherry, aceite en exceso, ingredientes premium raros.

### `pizza-especial-jamon-morron.webp`

- Plato: pizza especial de jamon y morron.
- Ingredientes visibles: masa de pizza, salsa de pizza, mozzarella abundante, jamon cocido, morron asado, aceitunas verdes, oregano.
- Textura esperada: misma base visual que la muzzarella clasica, pero con mas carga arriba.
- Evitar: huevo, panceta, pepperoni, aceitunas negras, cebolla caramelizada, hojas verdes.

### `sanguche-milanesa-completo-aji.webp`

- Plato: sanguche de milanesa completo con aji.
- Ingredientes visibles: pan sanguchero, milanesa de carne vacuna empanada y frita, lechuga, tomate, cebolla en pluma, mayonesa, mostaza, aji, papas fritas al costado.
- Ingredientes de composicion: pan rallado, huevo, aceite y sal forman parte de la milanesa, pero no tienen que aparecer separados.
- Textura esperada: sanguche grande, desbordante, bien de sangucheria tucumana.
- Evitar: queso cheddar, bacon, pepinillos, huevo frito, palta, salsas raras.

### `sanguche-milanesa-completo-sin-aji.webp`

- Plato: sanguche de milanesa completo sin aji.
- Ingredientes visibles: pan sanguchero, milanesa de carne vacuna empanada y frita, lechuga, tomate, cebolla en pluma, mayonesa, mostaza, papas fritas al costado.
- Diferencia clave: no mostrar salsa picante ni aji visible.
- Ingredientes de composicion: pan rallado, huevo, aceite y sal forman parte de la milanesa.
- Evitar: cualquier indicio de picante rojo, cheddar, bacon, huevo frito, palta.

### `sanguche-milanesa-pollo.webp`

- Plato: sanguche de milanesa de pollo.
- Ingredientes visibles: pan sanguchero, milanesa de pollo empanada y frita, lechuga, tomate, cebolla en pluma, mayonesa, mostaza, aji, papas fritas al costado.
- Diferencia clave: la proteina tiene que verse claramente como pollo empanado, no como carne vacuna.
- Ingredientes de composicion: pan rallado, huevo, aceite y sal integrados en la milanesa.
- Evitar: bacon, cheddar, queso derretido, pepinillos, pan de hamburguesa.

### `milanesa-napolitana-papas.webp`

- Plato: milanesa a la napolitana con papas fritas.
- Ingredientes visibles: milanesa de carne vacuna empanada y frita, salsa de pizza, jamon cocido, mozzarella fundida, oregano, papas fritas.
- Ingredientes de composicion: pan rallado, huevo, aceite y sal dentro de la preparacion de la milanesa.
- Textura esperada: plato abundante, cobertura bien fundida, papas doradas al costado.
- Evitar: arroz, pure, ensalada, huevo frito, aceitunas, tomate cherry.

### `hamburguesa-clasica-cheddar-bacon.webp`

- Plato: hamburguesa clasica con cheddar y bacon.
- Ingredientes visibles: pan con chia, medallon de carne vacuna, cheddar fundido, bacon crocante, lechuga, tomate, cebolla, ketchup, mostaza, papas fritas.
- Textura esperada: hamburguesa alta pero comible, cheddar bien visible, bacon crocante, pan levemente tostado.
- Evitar: pepinillos, cebolla caramelizada, huevo frito, doble medallon, salsas gourmet, palta.

### `hamburguesa-pollo-crispy.webp`

- Plato: hamburguesa de pollo crispy.
- Ingredientes visibles: pan con chia, pollo crispy, cheddar fundido, lechuga, tomate, cebolla, mayonesa, papas fritas.
- Diferencia clave: no mostrar bacon. La proteina tiene que verse como pollo rebozado y crocante.
- Ingredientes de composicion: el crispy incluye pan rallado, huevo y aceite, pero no se muestran aparte.
- Evitar: carne vacuna, ketchup, mostaza dominante, bacon, pepinillos.

### `empanadas-carne-x3.webp`

- Plato: tres empanadas de carne al horno.
- Ingredientes visibles sugeridos: empanadas doradas de carne, con relleno de carne vacuna, cebolla, morron, huevo duro, aceituna y un toque opcional de aji.
- Presentacion recomendada: tres unidades juntas, una abierta o mordida visualmente para mostrar relleno consistente.
- Evitar: queso chorreando, masa frita, rellenos exagerados tipo gourmet, semillas por arriba.

### `empanadas-jamon-queso-x3.webp`

- Plato: tres empanadas de jamon y queso al horno.
- Ingredientes visibles sugeridos: empanadas doradas con relleno de jamon cocido y queso cremoso fundido, apenas oregano.
- Presentacion recomendada: tres unidades juntas, una abierta para que se vea el queso bien derretido.
- Evitar: tomate, aceitunas, cebolla, morron, carne, masa frita.

### `papas-fritas-clasicas.webp`

- Plato: porcion de papas fritas clasicas.
- Ingredientes visibles: papas fritas doradas, ketchup y mayonesa al costado.
- Textura esperada: bastones gruesos, dorados, secos por fuera, porcion real y abundante.
- Evitar: cheddar, bacon, verdeo, salsas de colores, queso rallado, toppings raros.

## Nota para prompts

Para Nano Banana conviene describir:

- plato exacto
- ingredientes visibles
- textura
- que no aparezcan ingredientes ajenos
- misma escena base para toda la serie

Ejemplo de estructura:

`[NOMBRE DEL PLATO], con [INGREDIENTES VISIBLES], textura [TEXTURA], estilo comida argentina clasica, misma vajilla grafito, misma mesa de madera oscura, mismo fondo de restaurante calido desenfocado, misma iluminacion lateral suave, sin [INGREDIENTES A EVITAR].`
