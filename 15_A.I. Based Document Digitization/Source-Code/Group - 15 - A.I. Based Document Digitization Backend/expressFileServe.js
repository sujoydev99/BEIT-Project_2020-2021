var express = require('express');
var app = express();

app.use('/static', express.static('uploads'));
app.use('/staticRetrain', express.static('retrains'));

app.listen(3000);
