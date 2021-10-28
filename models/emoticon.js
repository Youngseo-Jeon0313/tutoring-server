module.exports = function(sequelize, DataTypes) {
    const EmoticonData= sequelize.define('Emoticons', {
        emoticondata : {
            type: DataTypes.STRING(1000),
            allowull: true,
        },
    });
    return EmoticonData;
}