import {getInput, debug, setFailed, setOutput} from '@actions/core'
import * as exec from '@actions/exec'

async function run(): Promise<void> {
  try {
    const workspace = getInput('workspace', {required: true})
    const from = getInput('from', {required: true})
    const to = getInput('to', {required: true})
    const workingDirectory = getInput('working-directory', {required: true})

    debug(`Inputs: ${JSON.stringify({workspace, from, to, workingDirectory})}`)

    let output = ''
    let errors = ''

    const options = {
      listeners: {
        stdout: (data: Buffer) => {
          output += data.toString()
        },
        stderr: (data: Buffer) => {
          errors += data.toString()
        }
      },
      cwd: './lib'
    }
    await exec.exec(`git diff ${from}..${to}`, [], options)

    debug(`Output from Git Diff: ${output}`)
    if (errors.length > 0) {
      setFailed(errors)
    }
  } catch (error) {
    if (error instanceof Error) setFailed(error.message)
  }
}

run()
