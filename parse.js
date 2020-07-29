var toc = require('markdown-toc');
var MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();
var fs = require('fs');
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);

const parseToJSON = async () => {
  /* parse the markdown document into html */
  const spec = await fs.readFileSync("spec.md", "utf-8");
  const document = $(md.render(spec));

  /* parse the markdown document into JSON */
  const content = await toc(spec).json;

  const result = [];

  const initialValue = {
    "lvl": 1,
    "parents": {
      lvl_1: null,
      lvl_2: null,
      lvl_3: null,
    }
  };

  content.reduce((acc, v) => {
    switch (v.lvl) {
      case 1:
        v.parents = {
          lvl_1: null,
          lvl_2: null,
          lvl_3: null,
        }
        break;
      case 2:
        if (acc.lvl < v.lvl) {
          v.parents = {
            lvl_1: acc.i,
            lvl_2: null,
            lvl_3: null,
          }
        } else {
          v.parents = {
            lvl_1: acc.parents.lvl_1,
            lvl_2: null,
            lvl_3: null,
          }
        }
        break;
      case 3:
        if (acc.lvl == 1) {
          /* babelparser-babylon-v7 */
          v.parents = {
            lvl_1: acc.i,
            lvl_2: acc.i,
            lvl_3: null,
          }
        } else if (acc.lvl < v.lvl) {
          v.parents = {
            lvl_1: acc.parents.lvl_1,
            lvl_2: acc.i,
            lvl_3: null,
          }
        } else {
          v.parents = {
            lvl_1: acc.parents.lvl_1,
            lvl_2: acc.parents.lvl_2,
            lvl_3: null,
          }
        }
        break;
      case 4:
        if (acc.lvl < v.lvl) {
          v.parents = {
            lvl_1: acc.parents.lvl_1,
            lvl_2: acc.parents.lvl_2,
            lvl_3: acc.i,
          }
        } else {
          v.parents = acc.parents;
        }
        break;
    }
    result.push(v);
    return v;

  }, initialValue);

  let data = JSON.stringify(result);

  fs.writeFileSync("output2.json", data);


  // content.forEach(element => {
  //     const key = element.content;
  //     // const heading = $($(`:header:contains('${key}')`), document);
  //     const heading = document.find($(`:header:contains('${key}')`));
  //     console.log(heading);

  // });

  // console.log(document);

  // const data = JSON.stringify(content);
  // console.log(content);
}

// var result = toc('# AAA\n## BBB\n### CCC\nfoo');
// var str = '';

// result.json.forEach(function(heading) {
//   str += toc.linkify(heading.content);
//   console.log(str);
// });

parseToJSON();