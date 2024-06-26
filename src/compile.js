const fs = require('fs')
const prettier = require("prettier")
const cli = require("cli-ux").default
const { Utils, CompilationError } = require('learnpack/plugin')

module.exports = {
  validate: () => true,
  run: async function ({ exercise, socket, configuration }) {

    let entryPath = exercise.files.map(f => './'+f.path).find(f => f.includes(exercise.entry || 'index.html'))
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
    
    socket.openWindow(`${configuration.publicUrl}/preview`)

    const result = {
      starting_at: Date.now(),
      source_code: "",
      stdout: Utils.cleanStdout("Successfully built your HTML"),
      exitCode: 0,
      ended_at: new Date(),
    }
    return result
  },
}
  