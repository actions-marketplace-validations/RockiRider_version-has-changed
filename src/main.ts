import {getInput, setFailed} from '@actions/core'
import * as exec from '@actions/exec'

async function run(): Promise<void> {
  try {
    const from = getInput('from', {required: true})
    const to = getInput('to', {required: true})
    const path = getInput('path', {required: true})

    exec.exec(`echo Inputs: ${JSON.stringify({from, to, path})}`)

    let output = ''
    let errors = ''

    const options: exec.ExecOptions = {
      listeners: {
        stdout: (data: Buffer) => {
          output += data.toString()
        },
        stderr: (data: Buffer) => {
          errors += data.toString()
        }
      }
    }
    await exec.exec(`git diff --name-only ${from}..${to}`, [], options)

    if (output.includes('package.json')) {
      exec.exec(`echo package.json changed!`)
    }
    exec.exec(`echo Outputs: ${output}`)
    if (errors.length > 0) {
      setFailed(errors)
    }
  } catch (error) {
    if (error instanceof Error) setFailed(error.message)
  }
}

run()
