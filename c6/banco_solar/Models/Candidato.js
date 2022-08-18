const { DataTypes } = require('sequelize');
const db = require('../Sequelize/config.js');

const Candidato = db.define('candidato', {
    nombre: {
        type: DataTypes.STRING(50), 
        allowNull: false
    }, 
    foto: {
        type: DataTypes.STRING(200), 
        allowNull: false
    }, 
    color: {
        type: DataTypes.STRING(9), 
        allowNull: false
    }, 
    votos: {
        type: DataTypes.INTEGER, 
        allowNull: true
    }
}, {timestamps: true});

try {
    Candidato.sync();
} catch (error) {
    console.error("Error en la sincronización: " + error);
}

module.exports = {Candidato};