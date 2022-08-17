const { DataTypes } = require('sequelize');
const db = require('../Sequelize/config.js');

const Repertorio = db.define('repertorio', {
    cancion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    artista: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tono: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { timestamps: true });

try{
    Repertorio.sync();
}catch(error){
    console.error("Error en la sincronización: " + error);
}

module.exports = {Repertorio};

