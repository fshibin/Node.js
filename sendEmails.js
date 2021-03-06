var https = require('https');
var fs = require('fs');
var nodemailer = require('nodemailer');
var formidable = require('formidable');

var httpsOptions = {
    key: fs.readFileSync('https/ServerOfShibin.key'),
    cert: fs.readFileSync('https/ServerOfShibin.cert')
};

https.createServer(httpsOptions, function (req, res) {
  console.log(req.url);
  console.log(req.method);
  if (req.url.toLowerCase() == '/sendingemail' && req.method.toLowerCase() == 'post') {

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      if (err) throw err;

      if (fields.from == 'shibin.fan@gmail.com') {
        transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'shibin.fan@gmail.com',
            pass: fields.password
          }
        });
      } else {
        transporter = nodemailer.createTransport({
          service: 'hotmail',
          auth: {
            user: 'fshibin@hotmail.com',
            pass: fields.password
          }
        });
      }
      var mailOptions = {
        from: fields.from,
        to: fields.to,
        subject: fields.subject,
        text: fields.content
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          res.write('Error occured while sending this email!\n');
          res.write('Error code: ' + error.responseCode + "\n");
          res.write('Error text: ' + error.response + "\n");
          res.end();
          console.log(error);
        } else {
          res.end('Your email has been successfully sent!');
          console.log(info);
        }
      }); 
    });
  } else if (req.url.toLowerCase() == '/sendemail' && req.method.toLowerCase() == 'get') {
    fs.readFile('emailForm.html', function(err, data) {
      if (err) throw err;
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
  } else if (req.url.toLowerCase() == '/uploadfile' && req.method.toLowerCase() == 'get') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="uploadingfile" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  } else if (req.url.toLowerCase() == '/uploadingfile' && req.method.toLowerCase() == 'post') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      var newpath = 'C:/Users/Node.js/uploaded_files/' + decodeURIComponent(files.filetoupload.name);
      console.log('name =' + files.filetoupload.name);
      console.log('old pat=' + oldpath);
      console.log('new pat=' + newpath);
      fs.rename(oldpath, newpath, function(err) {
        if (err) throw err;
        res.write('File uploaded and moved!');
        res.end();
      });
    });
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('Sorry, we can\'t find the page you\'re looking for!');
    res.end();
  }
}).listen(443);
