import mongoose from 'mongoose';

const facturaSchema = new mongoose.Schema({
  cita: { type: mongoose.Schema.Types.ObjectId, ref: 'Cita', required: true },
  paciente: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
  monto: { type: Number, required: true },
  pagada: { type: Boolean, default: false },
});

const Factura = mongoose.model('Factura', facturaSchema);

export default Factura;
