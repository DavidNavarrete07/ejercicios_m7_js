const { DataTypes } = require('sequelize');
const db = require('../Sequelize/config.js');

const Ejercicio = db.define('ejercicio', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    series: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    repeticiones: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    descanso: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    }
}, { timestamps: true });

try {
    Ejercicio.sync()
} catch (error) {
    console.log(`Error en la sicnronizacion`, error);
}
module.exports = { Ejercicio };