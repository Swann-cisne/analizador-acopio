

# Analizador de Acopio - Estación de Reciclaje Comunitario

Para este trabajo desarrollé un analizador en JavaScript que se ejecuta sobre **Node.js**.

El programa procesa los registros de las jornadas de acopio (código, material, peso, turno y estado de contaminación), valida la calidad de la información, filtra las entradas válidas, acumula los kilogramos por tipo de material y genera tarjetas formateadas para el reporte final. Todo el proceso está diseñado para garantizar en todo momento la **inmutabilidad de la colección de entrada**.

----------------------------------------------------------------

## Requisitos e instrucciones de ejecución

- Tener instalado **Node.js** (versión 14 o superior).
- Para ejecutar el proyecto, abre la terminal en la carpeta raíz (`analizador-acopio`) y ejecuta:

  bash node src/index.js

`````````````````````````
Estructura del proyecto
El proyecto respeta la estructura mínima requerida:

Plaintext
analizador-acopio
├── README.md
└── src/
    ├── datos.js
    ├── analizador.js
    └── index.js

Explicación del flujo de datos


src/datos.js: Define y exporta la colección base de registros con 8 entradas de prueba. Incluye materiales repetidos (Plástico, Cartón, Vidrio), turnos variados (Mañana, Tarde) y un registro inválido a propósito (REC-008 con peso negativo y turno vacío) para evaluar las validaciones.

src/analizador.js: Módulo que contiene las funciones lógicas puras:

validarRegistro: Comprueba que los textos no estén vacíos, el peso sea un número mayor a 0 y contaminado sea un booleano.

validarColeccion: Procesa la lista completa con .map() y .filter() devolviendo un diagnóstico detallado de los errores sin lanzar excepciones.

obtenerRegistrosAceptados: Selecciona mediante .filter() únicamente los registros válidos y no contaminados.

obtenerTotalesPorMaterial: Acumula los kilogramos por tipo de material usando .reduce() y la estructura Map.

obtenerCodigosUnicos: Obtiene la lista de identificadores con .map() y elimina duplicados utilizando Set.

transformarATarjetas: Adapta los registros a formato de tarjeta legible usando desestructuración.

ordenarTarjetas: Crea una copia previa con el operador spread ([...tarjetas]) antes de usar .sort() para evitar mutar el arreglo original.

Consultas con .find() (primer registro por material) y .findIndex() (posición por código), además de comprobaciones de estado con .some() y .every().

generarReporte: Combina todos los resultados utilizando rest (...opciones) y spread (...).

src/index.js: Punto de entrada que ejecuta el reporte principal, verifica la inmutabilidad comparando contra un snapshotOriginal en formato JSON y demuestra el comportamiento ante casos borde (búsquedas sin coincidencia y colecciones vacías).

Preguntas conceptuales y ejemplos del código


1. ¿Por qué es mejor usar Map que un arreglo u objeto plano para el total por material?
Un Map es la estructura ideal porque asocia directamente una clave (nombre del material) con su valor acumulado (kilogramos). A diferencia de los objetos planos, Map no sufre por colisión de nombres con propiedades heredadas del prototipo. Además, ofrece métodos limpios como .get() y .set(), y permite iterar sus parejas clave-valor directamente con .forEach().

Ejemplo en el código (src/analizador.js):

const obtenerTotalesPorMaterial = (registros = []) => {
  return registros.reduce((mapAcumulador, { material, pesoKg }) => {
    const pesoPrevio = mapAcumulador.get(material) || 0;
    mapAcumulador.set(material, pesoPrevio + pesoKg);
    return mapAcumulador;
  }, new Map());
};

2. ¿Qué diferencia existe entre una referencia directa y una copia creada con spread ([...]), y por qué es necesaria al ordenar?
Si hacemos una asignación directa (const copia = tarjetas), ambas variables apuntan al mismo espacio en memoria. Al aplicar un método mutable como .sort(), el arreglo original también resulta modificado (mutado).

Para garantizar la inmutabilidad de los datos, utilizamos el operador spread ([...tarjetas]) para crear un nuevo arreglo totalmente independiente antes de aplicar el ordenamiento.

Ejemplo en el código (src/analizador.js):


const ordenarTarjetas = (tarjetas = [], campo = 'pesoKg', ascendente = true) => {
  const copiaTarjetas = [...tarjetas];

  return copiaTarjetas.sort((a, b) => {
    const valA = a[campo];
    const valB = b[campo];

    if (valA < valB) return ascendente ? -1 : 1;
    if (valA > valB) return ascendente ? 1 : -1;
    return 0;
  });
};

3. ¿Qué operación justifica usar filter, find, some o every en la solución?
filter: Se justifica para seleccionar múltiples registros que cumplan las condiciones de ser válidos y no estar contaminados.

find: Se usa para obtener únicamente el primer elemento que coincida con un criterio de búsqueda (retorna undefined si no existe).

some: Permite evaluar si al menos un elemento de la colección cumple una condición (ej. saber si hay algún registro contaminado).

every: Se utiliza para comprobar si todos los registros cumplen estrictamente con las reglas de validación.

Ejemplos en el código (src/analizador.js):


// filter
const obtenerRegistrosAceptados = (registros = []) => {
  return registros.filter((reg) => validarRegistro(reg) && !reg.contaminado);
};

// find
const buscarPrimerRegistroPorMaterial = (tarjetasAceptadas = [], materialBuscado = '') => {
  return tarjetasAceptadas.find(
    ({ material }) => material.toLowerCase() === materialBuscado.toLowerCase()
  );
};

// some
const existeRegistroContaminado = (registros = []) => {
  return registros.some(({ contaminado }) => contaminado === true);
};

// every
const todosSonValidos = (registros = []) => {
  return registros.length > 0 && registros.every(validarRegistro);
};
Salida esperada en consola (node src/index.js)


--- REPORTE DE ACOPIO DE RECICLAJE ---

--- 1. RESULTADOS DE LA JORNADA PRINCIPAL ---
> Responsable: Equipo Acopio
> Registros procesados: 8
> ¿Todos válidos?: No
> Cantidad de inválidos detectados: 1

--- Pesos Acumulados por Material (Uso de Map) ---
  • Plástico  : 45.5 kg
  • Cartón    : 40.2 kg
  • Vidrio    : 45.1 kg
  • Aluminio  : 12.0 kg

--- Códigos Únicos Registrados (Uso de Set) ---
  • Total de códigos sin duplicados: 8
  • Códigos: REC-001, REC-002, REC-003, REC-004, REC-005, REC-006, REC-007, REC-008

--- Inspección de Colección (some / every) ---
  • ¿Existen registros contaminados en la entrega?: Sí
  • ¿Toda la entrega cumple las reglas de validación?: No

--- Tarjetas Ordenadas por Peso Descendente (Copia con Spread) ---
  [REC-004] Vidrio - 45.1 kg (Tarde)
  [REC-007] Plástico - 30 kg (Mañana)
  [REC-002] Cartón - 22 kg (Tarde)
  [REC-006] Cartón - 18.2 kg (Tarde)
  [REC-001] Plástico - 15.5 kg (Mañana)
  [REC-005] Aluminio - 12 kg (Mañana)

--- Consultas de Búsqueda (find / findIndex) ---
  • Primer registro de "Plástico" aceptado: { codigo: 'REC-001', material: 'Plástico', pesoKg: 15.5, turno: 'Mañana', contaminado: false }
  • Índice de la tarjeta 'REC-001': 0

--- 2. VERIFICACIÓN DE INMUTABILIDAD ---
> ¿La colección original permaneció intacta?: SÍ (Éxito)

--- 3. EVALUACIÓN DE CASOS BORDE ---

[Caso A] Búsqueda de elemento inexistente ("Madera"):
  • Resultado de find() para material no existente: undefined
  • Resultado de findIndex() para tarjeta no existente: -1

[Caso B] Procesamiento de arreglo vacío ([]):
  • Total registros: 0
  • ¿Todos válidos?: false
  • Tamaño Map totales: 0
  • Tamaño Set códigos: 0
  • Tarjetas generadas: 0

--- FIN DEL REPORTE DE ACOPIO ---
