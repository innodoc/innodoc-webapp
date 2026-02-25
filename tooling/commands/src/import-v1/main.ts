#!/usr/bin/env node

import Importer from './Importer.js'

async function importFromV1() {
  try {
    // CLI args
    if (process.argv.length !== 4) {
      throw new Error('Provide path to content as first argument')
    }
    const importFolder = process.argv[2]
    const courseSlug = process.argv[3]

    if (!importFolder) {
      throw new Error('no import folder specified')
    }

    if (!courseSlug) {
      throw new Error('no course slug specified')
    }

    // Import
    const importer = new Importer()
    const courseId = await importer.import(importFolder, courseSlug)
    if (courseId === null) {
      throw new Error('courseId is null')
    }

    console.log(`Imported course ID=${String(courseId)}`)
  } catch (error) {
    console.error(error)
    process.exit(-1)
  }
}

await importFromV1()
