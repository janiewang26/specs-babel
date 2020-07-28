var toc = require('markdown-toc');
var MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();
var fs = require('fs');
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require( "jquery" )( window );

const parseToJSON = async () => {
    const spec = await fs.readFileSync("spec.md", "utf-8");
    const document = $(md.render(spec));
    const content = await toc(spec).json;

    content.forEach(element => {
        const key = element.content;
        // const heading = $($(`:header:contains('${key}')`), document);
        const heading = document.find($(`:header:contains('${key}')`));
        console.log(heading);

    });

    // console.log(document);

    // const data = JSON.stringify(content);
    // console.log(content);
    // fs.writeFileSync("output.json", data);
}



// var result = toc('# AAA\n## BBB\n### CCC\nfoo');
// var str = '';

// result.json.forEach(function(heading) {
//   str += toc.linkify(heading.content);
//   console.log(str);
// });

parseToJSON();