# wunschmanager
Wunschlisten pfiffig verwalten. Der "Wünscher" stopft seine Wünsche rein und die "Schenker" können ohne, dass der Wünscher es mitbekommt koordinieren wer was schenkt.

## Technologie
Wie so üblich ist das für mich ein Projekt um für diverse Technologien auszuprobieren, wie sie sich anfühlen
- Kotlin
- Spring Boot
- App Engine
- Objectify

## Installation

```
gradle appengineDeploy
```
Vorher in der build.gradle ggf. noch die Version hochsetzen 

## Lokal testen

um die Simulation des Datastore zu starten
```
./start_datastore.sh
```
backend/configuration/configuration.json wie folgt ändern, aber *nicht* committen:
```
{
  "backendUrl" : "http://localhost:8085"
}
```
Run Configuration "Wunschmanager" starten.
