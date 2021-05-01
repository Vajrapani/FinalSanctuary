dbPassword = 'mongodb+srv://deep:'+ encodeURIComponent('pass1') + '@cluster0.dgmlc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

module.exports = {
    mongoURI: dbPassword
};
