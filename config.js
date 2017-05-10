require('dotenv').config();
exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL;
                      
// exports.TEST_DATABASE_URL = (
// 	process.env.TEST_DATABASE_URL
// );
exports.PORT = process.env.PORT || 8080;
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
'mongodb://foo:bar@ds129031.mlab.com:29031/test1';
exports.URL = process.env.URL || 'http://safe-earth-98661.herokuapp.com/items';