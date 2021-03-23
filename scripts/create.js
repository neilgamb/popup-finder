#!/usr/bin/env node

const commander = require('commander')
const fs = require('fs')

const screenTemplate = require('./templates/screen')
const hookTemplate = require('./templates/hook')

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

const getScreenTemplate = (screenName, template) => {
  let screen = template.replace(/\[screen\]/g, screenName)
  return { screen }
}

const getHookTemplate = (hookName, template) => {
  let hook = template
    .replace(/\[hook\]/g, capitalize(hookName))
    .replace(/\[hookLower\]/g, hookName)
  return { hook }
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

const generateFromTemplate = (name, component, category) => {
  const rootDir = 'src'
  let itemWeAreCreating = process.argv[2]
  let dir
  let fileDir

  if (itemWeAreCreating === 'screen') {
    name = capitalize(name)
    dir = `./${rootDir}/${itemWeAreCreating}s/${category}`
    fileDir = `${dir}/${name}.tsx`
  } else if (itemWeAreCreating === 'hook') {
    dir = `./${rootDir}/${itemWeAreCreating}s`
    fileDir = `${dir}/use${name}.tsx`
  }
  console.log(`Creating ${category} ${itemWeAreCreating}: ${name}`)
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
  .description(`create new screen with template`)
  .action((screenName, category) => {
    if (screenName && category) {
      const { screen } = getScreenTemplate(screenName, screenTemplate)
      generateFromTemplate(screenName, screen, category)
    } else if (!screenName) {
      console.log('Please provide a screen name!')
    } else if (!category) {
      console.log('Please provide a screen category — vendor, patron or auth!')
    }
  })

commander
  .command(`hook [hookName]`)
  .description(`create new custom hook with template`)
  .action((hookName) => {
    if (hookName) {
      const { hook } = getHookTemplate(hookName, hookTemplate)
      generateFromTemplate(hookName, hook)
    } else if (!hookName) {
      console.log('Please provide a hook name!')
    }
  })

commander.parse(process.argv)
