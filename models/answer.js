module.exports = function(sequelize, DataTypes){
    const answercontents = sequelize.define('AnswerContents',{
        imageUrl : {
            type: DataTypes.STRING(90000000000),
            allowNull: true
        },
        httpnum: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        description : {
            type: DataTypes.STRING(1000),
            allowNull: false
        },
    });
    return answercontents;
};
