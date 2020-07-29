var toc = require('markdown-toc');
var MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();
var fs = require('fs');
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);

const parseToJSON = async () => {
  /* parse the markdown document into html */
  const markdown = await fs.readFileSync("spec.md", "utf-8");
  const document = $(md.render(markdown));

  /* parse the markdown document into JSON */
  const content = await toc(markdown).json;

  let result = parseToNested(content);

  // let res = {}
  // let chunks = markdown.split('\n#')
  // chunks.forEach((chunk) => {
  //   let line = chunk.split('\n')[0];
  //   res[line.replace('#', '')] = chunk;;
  // })

  // console.log(res);

  // let data = JSON.stringify(result);

  // fs.writeFileSync("output2.json", data);

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

/**
 * Return markdown-toc objects with nested structure
 * 
 * @param {Object} content Original markdown-toc objects
 * @returns {Array<Object>} 
 */

const parseToNested = (content) => {
  const result = [];

  const initialValue = {
    "lvl": 1,
    "parents": [],
  };

  content.reduce((acc, v) => {
    switch (v.lvl) {
      case 1:
        v.parents = [];
        break;
      case 2:
        if (acc.lvl < v.lvl) {
          v.parents = [acc.i];
        }
        else {
          v.parents = [acc.parents[0]]
        }
        break;
      case 3:
        if (acc.lvl == 1) {
          /* babelparser-babylon-v7 element */
          v.parents = [acc.i, acc.i];
        }
        else if (acc.lvl < v.lvl) {
          v.parents = [acc.parents[0], acc.i];
        }
        else {
          v.parents = [acc.parents[0], acc.parents[1]];
        }
        break;
      case 4:
        if (acc.lvl < v.lvl) {
          v.parents = [acc.parents[0], acc.parents[1], acc.i];
        }
        else {
          v.parents = acc.parents;
        }
        break;
    }
    result.push(v);
    return v;

  }, initialValue);
  return result;
}

parseToJSON();