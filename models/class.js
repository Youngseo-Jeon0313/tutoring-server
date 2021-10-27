module.exports = function(sequelize, DataTypes){
    const classcontents = sequelize.define('ClassContents',{
        description: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
    });
    return classcontents;
};

