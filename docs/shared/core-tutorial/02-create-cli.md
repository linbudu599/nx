# Core Nx Tutorial - Step 2: Create Go CLI

Great! you now have a simple blog set up.

Next, you're going to create a CLI written in Go.

## Install Go Locally

Make sure you have Go installed locally by following [these instructions](https://go.dev/doc/install).

You can verify that Go is installed correctly by running:

```bash
go version
```

## Create the CLI Project

Create a `project.json` file for your Go CLI.

`packages/cli/project.json`:

```json
{
  "root": "packages/cli",
  "sourceRoot": "packages/cli/src",
  "projectType": "application",
  "targets": {
    "build": {
      "executor": "@nrwl/workspace:run-commands",
      "options": {
        "command": "go build -o='../../dist/packages/cli/' ./src/ascii.go",
        "cwd": "packages/cli"
      }
    },
    "serve": {
      "executor": "@nrwl/workspace:run-commands",
      "options": {
        "command": "go run ./src/ascii.go",
        "cwd": "packages/cli"
      }
    }
  }
}
```

You could have the exact same functionality with a `package.json` file with a `scripts` section like this:

```json
{
  "scripts": {
    "build": "go build -o='../../dist/packages/cli/' ./src/ascii.go",
    "serve": "go run ./src/ascii.˙go"
  }
}
```

There are a few reasons to choose `project.json` for the CLI project.

1. The presence of `package.json` might cause other developers to think there is javascript code in this project.
2. As the scripts in the project get more complex, `project.json` tends to have a flatter structure - rather than a long horizontal line in `package.json` with all the cli flags.
3. The easiest method to run scripts provided in Nx plugins is to use a `project.json` file.

All of these reasons are matters of preference. After this tutorial, you should have enough of a taste of both styles to make an informed decision about which format you prefer.

### Project.json syntax

- `root`, `sourceRoot` and `application` are properties that help Nx know more about your project.
- `targets` is similar to the `scripts` property in `package.json`.
- Just as in `package.json`, `build` and `serve` can be any string you pick.
- The `executor` is the code that runs the target. In this case, [`@nrwl/workspace:run-commands`](https://nx.dev/workspace/run-commands-executor) launches a terminal process to execute whatever command you pass in.
- `options` contains whatever configuration properties the executor needs to run.

## Create the CLI

This CLI will display some ASCII art in the terminal. Create the following files:

`packages/cli/src/ascii.go`:

```go
package main

import (
  "fmt"
  "os"
)

func check(e error) {
  if e != nil {
      panic(e)
  }
}

func main() {
    fmt.Println("Hello, World!")
    dat, err := os.ReadFile("src/cow.txt")
    check(err)
    fmt.Print(string(dat))
}
```

`packages/cli/src/cow.txt`:

```bash
 _____
< moo >
 -----
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

## Run the CLI

Now if you run `nx serve cli`, you'll see a friendly message:

```bash
❯ nx serve cli

> nx run cli:serve


> cli@ serve /Users/isaac/Documents/code/myorg/packages/cli
> go run ./src/ascii.go

Hello, World!
 _____
< moo >
 -----
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||

 —————————————————————————————————————————————————————————————————————————————————————————

 >  NX   Successfully ran target serve for project cli (2s)

   See Nx Cloud run details at https://nx.app/runs/THRW7SDRL9S

```

This CLI only took 2 seconds to run, but if you run the same command again, Nx will use a cached version of the output and take about 70 milliseconds. Obviously, this performance improvement doesn't matter for such a small project, but it doesn't take long before it makes a big difference.

Also, notice that Nx is able to cache the commands even though they're entirely written in Go.