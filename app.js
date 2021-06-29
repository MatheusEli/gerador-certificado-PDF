// Import dependencies
const fs = require("fs");
const moment = require("moment");
const express = require("express");
var router = express.Router();
const PDFDocument = require("pdfkit");


const app = express();


const port = process.env.PORT || 4000;
app.listen(port, () => console.log("servidor rodando na porta: " + port + "com sucesso!"));


app.get('/certificado/:nome', (req, res) => {

    // Create the PDF document
    const doc = new PDFDocument({
        layout: "landscape",
        size: "A4",
        bufferPages: true
    });

    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {

        let pdfData = Buffer.concat(buffers);
        res.writeHead(200, {
            'Content-Length': Buffer.byteLength(pdfData),
            'Content-Type': 'application/pdf',
            'Content-disposition': 'attachment;filename=certificado.pdf',
        })
            .end(pdfData);

    });
    // The name
    const name = req.params.nome.replace("%20"," ");

    // Pipe the PDF into an name.pdf file
    doc.pipe(fs.createWriteStream(`${name}.pdf`));

    // Draw the certificate image
    doc.image("images/certificate.png", 0, 0, { width: 842 });

    // Remember to download the font
    // Set the font to Dancing Script
    doc.font("fonts/PinyonScript-Regular.ttf");

    // Draw the name
    doc.fontSize(75).fillColor('#b2782a').text(name, 55, 245);

    // Draw the date
    doc.fontSize(19).fillColor('#23273a').text(moment().locale('pt-br').format("Do MMMM YYYY"), 50, 489);

    // Draw the CEO
    doc.fontSize(25).fillColor('#23273a').text('Gilberto Rissato', 290, 489);

    // Finalize the PDF and end the stream
    doc.end();
});

module.exports = router;