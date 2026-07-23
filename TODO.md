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

## Match Table

- [ ] Algo

## MatchPlayerStats Table

- [ ] Algo

## MatchTeamStats Table

- [ ] Algo

## Competition Edition Table and Teams Table

- [ ] Registrar equipos participantes de cada edición con una tabla intermedia nueva.
- [ ] Validar que campeón y subcampeón pertenezcan a la competición.
- [ ] Generar automáticamente los participantes de cada temporada.

## Backend en general

- [ ] Agregar response Dto's para que lleguen respuestas personalizadas al frontend.
