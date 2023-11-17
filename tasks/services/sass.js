const fs = require('fs');
const path = require('path');
const sass = require('sass');
const log = require('grunt-ps-log');

class SassSvc {
  #fileIndex = 0;

  #compileFile(file, done) {
    log.verbose(`Compiling ${file.src}`);

    let out;
    const dir = path.dirname(file.dest);

    try {
      out = sass.compile(file.src);
    } catch(err) {
      log.error(err);
      log.fail('Sass compile failed!');
    }

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(file.dest, out.css);

    done();
  }

  compileFiles(files, done) {
    if (this.#fileIndex === files.length) {
      this.#fileIndex = 0;
      done();
    } else {
      const item = files[this.#fileIndex];
      this.#compileFile(item, () => {
        this.#fileIndex++;
        this.compileFiles(files, done);
      });
    }
  }
}

module.exports = new SassSvc();
