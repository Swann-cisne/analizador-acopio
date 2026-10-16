const { registros } = require('./datos');
const {
  generarReporte,
  ordenarTarjetas,
  buscarPrimerRegistroPorMaterial,
  obtenerPosicionTarjeta,
  todosSonValidos
} = require('./analizador');

console.log('--- REPORTE DE ACOPIO DE RECICLAJE ---\n');

/*Snapshot del arreglo inicial para demostrar inmutabilidad*/

const snapshotOriginal = JSON.stringify(registros);

/*--- 1. EJECUCIÓN CON DATOS REGULARES ---*/

console.log('--- 1. RESULTADOS DE LA JORNADA PRINCIPAL ---');
const reporte = generarReporte(registros, { turnoAnalizado: 'General', responsable: 'Equipo Acopio' });

console.log(`> Responsable: ${reporte.responsable}`);
console.log(`> Registros procesados: ${reporte.validacion.totalRegistros}`);
console.log(`> ¿Todos válidos?: ${reporte.validacion.todosValidos ? 'Sí' : 'No'}`);
console.log(`> Cantidad de inválidos detectados: ${reporte.validacion.registrosInvalidosCount}`);

console.log('\n--- Pesos Acumulados por Material (Uso de Map) ---');
reporte.totalesPorMaterial.forEach((peso, material) => {
  console.log(`  • ${material.padEnd(10, ' ')}: ${peso.toFixed(1)} kg`);
});

console.log('\n--- Códigos Únicos Registrados (Uso de Set) ---');
console.log(`  • Total de códigos sin duplicados: ${reporte.codigosUnicos.size}`);
console.log(`  • Códigos: ${Array.from(reporte.codigosUnicos).join(', ')}`);

console.log('\n--- Inspección de Colección (some / every) ---');
console.log(`  • ¿Existen registros contaminados en la entrega?: ${reporte.existeContaminado ? 'Sí' : 'No'}`);
console.log(`  • ¿Toda la entrega cumple las reglas de validación?: ${todosSonValidos(registros) ? 'Sí' : 'No'}`);

console.log('\n--- Tarjetas Ordenadas por Peso Descendente (Copia con Spread) ---');
const tarjetasOrdenadas = ordenarTarjetas(reporte.tarjetas, 'pesoKg', false);
tarjetasOrdenadas.forEach((tarjeta) => console.log(`  ${tarjeta.etiqueta}`));

console.log('\n--- Consultas de Búsqueda (find / findIndex) ---');
const primeraPlastico = buscarPrimerRegistroPorMaterial(reporte.tarjetas, 'Plástico');
console.log('  • Primer registro de "Plástico" aceptado:', primeraPlastico);

const posCodigo = obtenerPosicionTarjeta(reporte.tarjetas, 'REC-001');
console.log(`  • Índice de la tarjeta 'REC-001': ${posCodigo}`);

/*--- 2. DEMOSTRACIÓN DE INMUTABILIDAD ---*/

console.log('\n--- 2. VERIFICACIÓN DE INMUTABILIDAD ---');
const inmutable = JSON.stringify(registros) === snapshotOriginal;
console.log(`> ¿La colección original permaneció intacta?: ${inmutable ? 'SÍ (Éxito)' : 'NO (Mutado)'}`);

/*--- 3. PRUEBAS DE CASOS BORDE Y DIVERGENCIAS ---*/

console.log('\n--- 3. EVALUACIÓN DE CASOS BORDE ---');

/*Caso A: Búsquedas sin coincidencia*/
console.log('\n[Caso A] Búsqueda de elemento inexistente ("Madera"):');
const resInexistente = buscarPrimerRegistroPorMaterial(reporte.tarjetas, 'Madera');
console.log(`  • Resultado de find() para material no existente: ${resInexistente}`); /*undefined*/

const posInexistente = obtenerPosicionTarjeta(reporte.tarjetas, 'REC-UNKNOWN');
console.log(`  • Resultado de findIndex() para tarjeta no existente: ${posInexistente}`); // -1

/*Caso B: Colección vacía*/

console.log('\n[Caso B] Procesamiento de arreglo vacío ([]):');
const reporteVacio = generarReporte([]);
console.log(`  • Total registros: ${reporteVacio.validacion.totalRegistros}`);
console.log(`  • ¿Todos válidos?: ${reporteVacio.validacion.todosValidos}`);
console.log(`  • Tamaño Map totales: ${reporteVacio.totalesPorMaterial.size}`);
console.log(`  • Tamaño Set códigos: ${reporteVacio.codigosUnicos.size}`);
console.log(`  • Tarjetas generadas: ${reporteVacio.tarjetas.length}`);

console.log('\n--- FIN DEL REPORTE DE ACOPIO ---');