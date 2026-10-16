/**
 * Valida si un registro cumple con los tipos de datos y condiciones requeridas.
 */
const validarRegistro = (registro) => {
  if (!registro || typeof registro !== 'object') return false;

  const { codigo, material, pesoKg, turno, contaminado } = registro;

  const esCodigoValido = typeof codigo === 'string' && codigo.trim() !== '';
  const esMaterialValido = typeof material === 'string' && material.trim() !== '';
  const esPesoValido = typeof pesoKg === 'number' && pesoKg > 0;
  const esTurnoValido = typeof turno === 'string' && turno.trim() !== '';
  const esContaminadoValido = typeof contaminado === 'boolean';

  return esCodigoValido && esMaterialValido && esPesoValido && esTurnoValido && esContaminadoValido;
};

/*Valida la colección completa e informa sobre los registros defectuosos.*/

const validarColeccion = (registros = []) => {
  const detallesInvalidez = registros
    .map((registro, index) => ({ index, registro, valido: validarRegistro(registro) }))
    .filter((item) => !item.valido);

  return {
    todosValidos: registros.length > 0 && detallesInvalidez.length === 0,
    totalRegistros: registros.length,
    registrosInvalidosCount: detallesInvalidez.length,
    errores: detallesInvalidez
  };
};


 /* Obtiene únicamente los registros que están bien formados y no están contaminados.*/
const obtenerRegistrosAceptados = (registros = []) => {
  return registros.filter((reg) => validarRegistro(reg) && !reg.contaminado);
};

/*Acumula el peso total por tipo de material utilizando Map y reduce.*/

const obtenerTotalesPorMaterial = (registros = []) => {
  return registros.reduce((mapAcumulador, { material, pesoKg }) => {
    const pesoPrevio = mapAcumulador.get(material) || 0;
    mapAcumulador.set(material, pesoPrevio + pesoKg);
    return mapAcumulador;
  }, new Map());
};

/*Retorna el conjunto de códigos de registros únicos mediante Set*/

const obtenerCodigosUnicos = (registros = []) => {
  const codigos = registros.map(({ codigo }) => codigo);
  return new Set(codigos);
};

/* Transforma los registros aceptados a un formato de tarjeta para reporte usando destructuring. */

const transformarATarjetas = (registros = []) => {
  return registros.map(({ codigo, material, turno, pesoKg }) => ({
    codigo,
    material,
    turno,
    pesoKg,
    etiqueta: `[${codigo}] ${material} - ${pesoKg} kg (${turno})`
  }));
};

/*Ordena tarjetas sin mutar la lista original, creando una copia previa mediante spread operator.*/

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

/*Busca el primer registro aceptado de un material específico mediante find */

const buscarPrimerRegistroPorMaterial = (tarjetasAceptadas = [], materialBuscado = '') => {
  return tarjetasAceptadas.find(
    ({ material }) => material.toLowerCase() === materialBuscado.toLowerCase()
  );
};

/*Encuentra el índice de una tarjeta por su código usando findIndex.*/

const obtenerPosicionTarjeta = (tarjetas = [], codigoBuscado = '') => {
  return tarjetas.findIndex(({ codigo }) => codigo === codigoBuscado);
};

/*Verifica si existe al menos un registro contaminado en la entrega usando some */

const existeRegistroContaminado = (registros = []) => {
  return registros.some(({ contaminado }) => contaminado === true);
};

/*Verifica si absolutamente todos los registros son válidos usando every.*/

const todosSonValidos = (registros = []) => {
  return registros.length > 0 && registros.every(validarRegistro);
};

/*Función integradora que compila el reporte completo utilizando rest y spread */

const generarReporte = (registros = [], ...opciones) => {
  const configuracion = opciones.reduce((acc, curr) => ({ ...acc, ...curr }), {});

  const validacion = validarColeccion(registros);
  const aceptados = obtenerRegistrosAceptados(registros);
  const totalesMap = obtenerTotalesPorMaterial(aceptados);
  const codigosSet = obtenerCodigosUnicos(registros);
  const tarjetas = transformarATarjetas(aceptados);
  const materialesDisponibles = Array.from(totalesMap.keys());
  const hayContaminados = existeRegistroContaminado(registros);

  return {
    ...configuracion,
    validacion,
    totalesPorMaterial: totalesMap,
    codigosUnicos: codigosSet,
    tarjetas,
    materialesDisponibles,
    existeContaminado: hayContaminados
  };
};

module.exports = {
  validarRegistro,
  validarColeccion,
  obtenerRegistrosAceptados,
  obtenerTotalesPorMaterial,
  obtenerCodigosUnicos,
  transformarATarjetas,
  ordenarTarjetas,
  buscarPrimerRegistroPorMaterial,
  obtenerPosicionTarjeta,
  existeRegistroContaminado,
  todosSonValidos,
  generarReporte
};