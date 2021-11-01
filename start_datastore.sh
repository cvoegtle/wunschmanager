#!/usr/bin/env bash

# wird aktuell noch nicht genutzt
gcloud beta emulators datastore start --host-port=localhost:8484
export DATASTORE_EMULATOR_HOST=localhost:8484

