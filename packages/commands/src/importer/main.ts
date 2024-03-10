#!/usr/bin/env tsx

import Importer from './Importer'

async function importFromV1() {
  try {
    // CLI args
    if (process.argv.length !== 4) {
      throw new Error('Provide path to content as first argument')
    }
    const importFolder = process.argv[2]
    const courseSlug = process.argv[3]

    // Import
    const importer = new Importer()
    const courseId = await importer.import(importFolder, courseSlug)
    if (courseId === null) {
      throw new Error('courseId is null')
    }

    console.log(`Imported course ID=${courseId}`)
  } catch (error) {
    console.error(error)
    process.exit(-1)
  }
}

await importFromV1()
