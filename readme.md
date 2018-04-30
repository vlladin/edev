# edev

Execute multiple scripts in parallel and show their output in a unified console.

`edev` will read a configuration file and execute the scripts defined there.

# Installation

```bash
npm install -g edev
```

# Usage

First of all you must initialize the config file.
This will create a file named `edev.json`, in which you can define your scenarios.

By default `edev init` will populate the config file with some sample scenarios.

```bash
edev init
```

To list all available scenarios run

```bash
edev ls
```

To run a scenario named **demo** run

```bash
edev run demo
```

## The config file

`edev.json` should be at the root of your project, in the folder where you run `edev`.

The configuration file looks like this:

```json
{
  "ping": [
        {
            "name": "Ping example1",
            "command": "ping www.example1.com"
        },
        {
            "name": "Ping example2",
            "command": "ping www.example2.com"
        }
    ],
    "list": [
        {
            "name": "List all files",
            "command": "ls -lah"
        }
    ]
}
```

The first level contains the **scenario** name: **ping** and **list**.
You use the scenario name in `edev run [SCENARIO NAME]`

Each scenario is an array of *commands*. These commands will be executed in parallel.
A *command* has a `name` and a `command` parameter.
Name your commands as you please.

# License

MIT [http://rem.mit-license.org](http://rem.mit-license.org)