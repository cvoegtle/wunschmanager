#!/usr/bin/env bash

gcloud emulators firestore start --database-mode=datastore-mode --host-port=localhost:8484
export DATASTORE_EMULATOR_HOST=localhost:8484

