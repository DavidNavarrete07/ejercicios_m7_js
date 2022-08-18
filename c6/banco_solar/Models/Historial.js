const { DataTypes } = require('sequelize');
const db = require('../Sequelize/config.js');

const Historial = db.define('historial', {
    estado: {
        type: DataTypes.STRING(35),
        allowNull: false,
        unique: true
    },
    votos: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ganador: {
        type: DataTypes.STRING(40),
        allowNull: false
    }
}, { timestamps: true, freezeTableName: true, tableName: 'historiales'});

try {
    Historial.sync();
} catch (error) {
    console.error("Error en la sincronización: " + error);
}

module.exports = { Historial };