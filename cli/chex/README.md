# Chex CLI

The `chex` CLI is a command-line tool for validating P&ID files with the essential criteria required for the XSLT and RML mappings in this repository. 

## How to install
### Prerequisites
1. [Download and install Python 3](https://www.python.org/downloads/)
2. Windows: Run `python -m ensurepip --upgrade` to install `pip`. Linux: Run `python -m pip install pip`
3. Navigate to `/cli/chex/`
4. Run `pip install -r requirements.txt` in this folder (`/cli/chex`) to install the required modules

### chex CLI
1. Navigate to `/cli/chex/`
2. Run `pip install --editable .`
3. Run `chex --help` to get help on how to use CLI
