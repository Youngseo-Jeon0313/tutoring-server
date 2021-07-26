module.exports = function(sequelize, DataTypes){
    const contents = sequelize.define('Content',{
        imageUrl : {
            type: DataTypes.STRING(300),
            allowNull: true
        },
        date : {
            type : DataTypes.INTEGER(8),
            allowNull : false
        },
        pageandnum: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        description : {
            type: DataTypes.STRING(1000),
            allowNull: false
        },
    });
    return contents;
};

