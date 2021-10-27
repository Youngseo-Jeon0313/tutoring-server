module.exports = function(sequelize, DataTypes){
    const homeworkcontents = sequelize.define('HomeworkContents',{
        homework: {
            type: DataTypes.STRING(1000),
            allowNull: false
        }
    })
    return homeworkcontents;
}