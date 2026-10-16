/**
 * Colección de registros de jornadas de acopio*/
const registros = [
  { codigo: 'REC-001', material: 'Plástico', pesoKg: 15.5, turno: 'Mañana', contaminado: false },
  { codigo: 'REC-002', material: 'Cartón', pesoKg: 22.0, turno: 'Tarde', contaminado: false },
  { codigo: 'REC-003', material: 'Plástico', pesoKg: 8.3, turno: 'Mañana', contaminado: true },
  { codigo: 'REC-004', material: 'Vidrio', pesoKg: 45.1, turno: 'Tarde', contaminado: false },
  { codigo: 'REC-005', material: 'Aluminio', pesoKg: 12.0, turno: 'Mañana', contaminado: false },
  { codigo: 'REC-006', material: 'Cartón', pesoKg: 18.2, turno: 'Tarde', contaminado: false },
  { codigo: 'REC-007', material: 'Plástico', pesoKg: 30.0, turno: 'Mañana', contaminado: false },

  /*Registro inválido: peso negativo y turno vacío*/
  
  { codigo: 'REC-008', material: 'Vidrio', pesoKg: -5.0, turno: '', contaminado: false }
];

module.exports = { registros };