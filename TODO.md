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

- [ ] Algo

## TeamSeasonStats Table

- [ ] Algo

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
