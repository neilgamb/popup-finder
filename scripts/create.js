#!/usr/bin/env node

const commander = require('commander')
const fs = require('fs')

const screenTemplate = require('./templates/screen')

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

const getTemplates = (screenName, template) => {
  let component = template.replace(/\[comp\]/g, screenName)
  return { component }
}

const createFile = (output, content) => {
  if (!fs.existsSync(output)) {
    fs.writeFile(output, content, 'utf8', (err) => {
      if (err) {
        console.log(err)
      } else {
        console.log('Created: ', output)
      }
    })
  } else {
    console.log(`${output} already exists`)
  }
}

const generateFromTemplate = (screenName, component, category) => {
  let itemWeAreCreating = process.argv[2]
  const rootDir = 'src'
  const name = capitalize(screenName)
  const dir = `./${rootDir}/${itemWeAreCreating}s/${category}`
  console.log(`Creating ${category} ${itemWeAreCreating}: ${name}`)
  const fileDir = `${dir}/${name}.tsx`
  createFile(fileDir, component)

  // update index file if necessary
  if (itemWeAreCreating == 'screen') {
    const indexPath = `./${rootDir}/screens/${category}/index.ts`
    let newline = `export { default as ${name} } from "./${name}";`
    fs.appendFile(indexPath, newline, (err) => {
      if (err) return console.log(err)
      console.log('successfully appended "' + newline + '"')
    })
  }
}

commander
  .command(`screen [screenName] [category]`)
  .description(`create new screen with skeleton`)
  .action((screenName, category) => {
    if (screenName && category) {
      const { component } = getTemplates(screenName, screenTemplate)
      generateFromTemplate(screenName, component, category)
    } else if (!screenName) {
      console.log('Please provide a screen name!')
    } else if (!category) {
      console.log('Please provide a screen category — vendor, patron or auth!')
    }
  })

commander.parse(process.argv)
