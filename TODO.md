# ToDo List

## Transfer Table

- [x] Desarrollar endpoint para traer todas las transferencias o filtrarlas por tipo _GET /transfers_
- [x] Desarrollar endpoint para crear transferencias _POST /transfers/_
- [x] Actualizar el historial de equipos del jugador transferido.

### Validaciones

- [x] El jugador debe existir
- [x] El equipo destino debe existir
- [x] El equipo origen debe existir
- [x] Si el tipo de transferencia no es YOUTH_PROMOTION, el origen y el destino no pueden ser iguales.
- [x] La temporada debe existir
- [x] El monto no puede ser negativo

## PlayerSeasonStats Table

### Desde la tabla Player

- [x] Crear endpoint para traer las stats de la temporada. _GET /players/:playerId/stats_
- [x] Crear endpoint para traer las stats de una temporada específica _GET /players/:playerId/team/:teamId/stats/:seasonId_

### Desde la tabla Team

- [x] Crear endpoint para traer las stats de la plantilla. _GET /teams/:teamId/player-stats_
- [x] Crear endpoint para traer las stats de la plantilla en una temporada en específico. _GET /teams/:teamId/player-stats/:seasonId_

## TeamSeasonStats Table

### Desde la tabla Team

- [x] Crear endpoint para traer las stats de un equipo de todas las temporadas. _GET /teams/:teamId/stats_
- [x] Crear endpoint para traer las stats de un equipo por temporada. _GET /teams/:teamId/stats/:seasonId_

### Desde la tabla Season

- [x] Crear endpoint para traer las stats de todos los equipos. _GET /seasons/:seasonId/team-stats_

## TeamSeason Table

- [x] Renombrar leagueId -> competitionId.
- [x] Desarrollar endpoint para traer todos los equipos que participan en una competición. _GET /competitions/:competitionId/season/:seasonId/teams_
- [x] Desarrollar endpoint para actualizar la lista de equipos participantes _PUT /competitions/:competitionId/season/:seasonId/teams_
- [x] Desarrollar endpoint para asignar equipos participantes _POST /competitions/:competitionId/season/:seasonId/team/:teamId_
- [x] Desarrollar endpoint para borrar un equipo participante _DELETE /competitions/:competitionId/season/:seasonId/team/:teamId_

## Match Table

- [ ] Desarrollar endpoint para consultar un partido _GET /matches/:matchId_
- [ ] Desarrollar endpoint para consultar los partidos que jugará un equipo _GET /teams/:teamId/matches_

- [ ] Desarrollar endpoint para generar calendario. _POST /competitions/:competitionEditionId/generate-fixtures_
  - [ ] Crear los partidos con la siguiente data:
    ```ts
    {
      status = SCHEDULED;
      homeGoals = 0;
      awayGoals = 0;
      homePenaltyGoals = null;
      awayPenaltyGoals = null;
    }
    ```
  - [ ] Validar que existan suficientes equipos inscritos en TeamSeason.
    - [ ] Debe ser número par en caso de ligas.
  - [ ] Evitar generar el fixture más de una vez para una misma CompetitionEdition

- [ ] Desarrollar endpoint para consultar el calendario _GET /competitions/:competitionEditionId/matches_

- [ ] Desarrollar endpoint para jugar el partido (actualizar datos del mismo). _PATCH /matches/:id/play_
  - [ ] Validar que el partido esté en estado SCHEDULED
  - [ ] Validar el resultado
    - [ ] Los goles no pueden ser negativos
    - [ ] Si _finishType = PENALTIES_, el marcador debe ser empate
    - [ ] Si hay penales, la tanda no puede quedar en empate
    - [ ] Si _finishType = EXTRA TIME_ o _finishType = REGULAR TIME_, los penales deben ser _null_
  - [ ] Actualizar Match _(SCHEDULED -> PLAY)_
  - [ ] Crear MatchPlayerStats
  - [ ] Crear MatchTeamStats
  - [ ] Actualizar PlayerSeasonStats
  - [ ] Actualizar TeamSeasonStats
  - [ ] Actualizar futura clasificación

## MatchPlayerStats Table

- [ ] Algo

## MatchTeamStats Table

- [ ] Algo

## Competition Edition Table and Teams Table

- [x] Registrar equipos participantes de cada edición con una tabla intermedia nueva.
- [x] Validar que campeón y subcampeón pertenezcan a la competición.
- [ ] Generar automáticamente los participantes de cada temporada.

## Backend en general

- [ ] Agregar response Dto's para que lleguen respuestas personalizadas al frontend.
