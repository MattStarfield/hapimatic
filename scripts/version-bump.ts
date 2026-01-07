#!/usr/bin/env bun
/**
 * Version bump script for HAPImatic
 *
 * Usage:
 *   bun run scripts/version-bump.ts <command>
 *
 * Commands:
 *   patch    - Bump patch version (1.0.0 -> 1.0.1)
 *   minor    - Bump minor version (1.0.0 -> 1.1.0)
 *   major    - Bump major version (1.0.0 -> 2.0.0)
 *   test     - Add/increment test identifier (1.0.0 -> 1.0.0-A, 1.0.0-A -> 1.0.0-B)
 *   release  - Strip test identifier and bump patch (1.0.0-C -> 1.0.1)
 *   show     - Show current version
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const PACKAGE_JSON_PATH = join(import.meta.dir, '..', 'package.json')

interface PackageJson {
    name: string
    version: string
    versionTimestamp: string
    [key: string]: unknown
}

function readPackageJson(): PackageJson {
    const content = readFileSync(PACKAGE_JSON_PATH, 'utf-8')
    return JSON.parse(content)
}

function writePackageJson(pkg: PackageJson): void {
    writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(pkg, null, 4) + '\n')
}

interface ParsedVersion {
    major: number
    minor: number
    patch: number
    testId: string | null
}

function parseVersion(version: string): ParsedVersion {
    // Match: 1.0.0 or 1.0.0-A
    const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-([A-Z]))?$/)
    if (!match) {
        throw new Error(`Invalid version format: ${version}. Expected semver like 1.0.0 or 1.0.0-A`)
    }
    return {
        major: parseInt(match[1], 10),
        minor: parseInt(match[2], 10),
        patch: parseInt(match[3], 10),
        testId: match[4] || null
    }
}

function formatVersion(parsed: ParsedVersion): string {
    const base = `${parsed.major}.${parsed.minor}.${parsed.patch}`
    return parsed.testId ? `${base}-${parsed.testId}` : base
}

function bumpPatch(parsed: ParsedVersion): ParsedVersion {
    return { ...parsed, patch: parsed.patch + 1, testId: null }
}

function bumpMinor(parsed: ParsedVersion): ParsedVersion {
    return { ...parsed, minor: parsed.minor + 1, patch: 0, testId: null }
}

function bumpMajor(parsed: ParsedVersion): ParsedVersion {
    return { major: parsed.major + 1, minor: 0, patch: 0, testId: null }
}

function bumpTestId(parsed: ParsedVersion): ParsedVersion {
    if (!parsed.testId) {
        return { ...parsed, testId: 'A' }
    }
    // Increment letter, wrap Z -> A
    const nextCode = parsed.testId.charCodeAt(0) + 1
    const nextId = nextCode > 90 ? 'A' : String.fromCharCode(nextCode)
    return { ...parsed, testId: nextId }
}

function stripTestId(parsed: ParsedVersion): ParsedVersion {
    if (!parsed.testId) {
        return parsed
    }
    // Strip test ID and bump patch
    return { ...parsed, patch: parsed.patch + 1, testId: null }
}

function getCurrentTimestamp(): string {
    return new Date().toISOString()
}

function main(): void {
    const command = process.argv[2]

    if (!command) {
        console.log('Usage: bun run scripts/version-bump.ts <command>')
        console.log('')
        console.log('Commands:')
        console.log('  patch    - Bump patch version (1.0.0 -> 1.0.1)')
        console.log('  minor    - Bump minor version (1.0.0 -> 1.1.0)')
        console.log('  major    - Bump major version (1.0.0 -> 2.0.0)')
        console.log('  test     - Add/increment test identifier (1.0.0 -> 1.0.0-A)')
        console.log('  release  - Strip test identifier and bump patch (1.0.0-C -> 1.0.1)')
        console.log('  show     - Show current version')
        process.exit(1)
    }

    const pkg = readPackageJson()
    const parsed = parseVersion(pkg.version)

    if (command === 'show') {
        console.log(`Current version: ${pkg.version}`)
        console.log(`Timestamp: ${pkg.versionTimestamp}`)
        return
    }

    let newParsed: ParsedVersion

    switch (command) {
        case 'patch':
            newParsed = bumpPatch(parsed)
            break
        case 'minor':
            newParsed = bumpMinor(parsed)
            break
        case 'major':
            newParsed = bumpMajor(parsed)
            break
        case 'test':
            newParsed = bumpTestId(parsed)
            break
        case 'release':
            newParsed = stripTestId(parsed)
            break
        default:
            console.error(`Unknown command: ${command}`)
            process.exit(1)
    }

    const newVersion = formatVersion(newParsed)
    const newTimestamp = getCurrentTimestamp()

    pkg.version = newVersion
    pkg.versionTimestamp = newTimestamp
    writePackageJson(pkg)

    console.log(`Version bumped: ${pkg.version} -> ${newVersion}`)
    console.log(`Timestamp: ${newTimestamp}`)
}

main()
