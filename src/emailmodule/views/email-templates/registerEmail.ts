const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const rootDir = path.join(__dirname,'../', 'partials', 'header.hbs')
console.log('rootDir', rootDir);
// Load templates
const header = fs.readFileSync(path.join(__dirname,'../', 'partials', 'header.hbs'), 'utf-8');
const footer = fs.readFileSync(path.join(__dirname,'../', 'partials', 'footer.hbs'), 'utf-8');
const emailTemplate = fs.readFileSync(path.join(__dirname,'../', 'layouts', 'registerLayout.hbs'), 'utf-8');

// Register partials
handlebars.registerPartial('header', header);
handlebars.registerPartial('footer', footer);

// Compile email template
export const registerTemplate:any = handlebars.compile(emailTemplate);

