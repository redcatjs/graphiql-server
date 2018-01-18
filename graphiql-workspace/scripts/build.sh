#!/bin/sh

set -e

# just in case
export PATH=node_modules/.bin/:$PATH

rm -rf graphiql-workspace/dist/ && mkdir -p graphiql-workspace/dist/
babel graphiql-workspace/src --out-dir graphiql-workspace/dist/

echo "Done"
