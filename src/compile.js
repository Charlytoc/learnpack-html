const fs = require('fs')
const prettier = require("prettier")
const cli = require("cli-ux").default
const { Utils, CompilationError } = require('./utils/index.js')

module.exports = {
  validate: () => true,
  run: async function ({ exercise, socket, configuration }) {

    let entryPath = exercise.entry || exercise.files.map(f => './'+f.path).find(f => f.indexOf('index.html') > -1)
    if(!entryPath) throw CompilationError("Missing index.html entry file");

    let errors = exercise.files.filter(f => f.path.includes(".html") || f.path.includes(".css")).map((file)=>{
      const prettyConfig = {
          parser: file.name.split('.').pop(),
          printWidth: 150,             // Specify the length of line that the printer will wrap on.
          tabWidth: 4,                // Specify the number of spaces per indentation-level.
          useTabs: true,              // Indent lines with tabs instead of spaces.
          bracketSpacing: true,
          semi: true,                 // Print semicolons at the ends of statements.
          encoding: 'utf-8'           // Which encoding scheme to use on files
      };
      const content = fs.readFileSync(file.path, "utf8")
      try{
        const formatted = prettier.format(content, prettyConfig)
        fs.writeFileSync(file.path, formatted)
        fs.writeFileSync(`${configuration.outputPath}/${file.name}`, formatted)
      }
      catch(error){
        return error;
      }
      return null;
    });

    const foundErrors = [].concat(errors.filter(e => e !== null))
    if(foundErrors.length > 0) throw CompilationError(foundErrors.map(e => e.message).join(""))
    
    //cli.open(`${configuration.address}:${configuration.port}/preview`)
    return Utils.cleanStdout("Successfully built your HTML")
  },
}
  