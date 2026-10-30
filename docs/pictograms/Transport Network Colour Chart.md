# Transport Network Colour Chart

Reference for line colours, modal colours, and the downloaded line and mode badges in [`Lines/`](Lines/).

## Frontend use

- Use a downloaded badge only when the route label in the timetable package directly matches a known label. Keep the package's route name and identity otherwise; do not infer a branded line from the mode or operator.
- For recognized Sydney Trains and Metro labels, use the corresponding badge artwork and the official line colour below. Unknown route labels keep their package-provided colour and use the generated text badge.
- The downloaded `.svg.webp` files are WebP conversions of the SVG artwork. T6's available badge is explicitly historical (2013–2020), so the frontend does not use it as a current line badge.
- Keep `NR` (non-revenue) and `ET` (empty train) as service destination text labels. They are not route badges.

## Sydney Metro and Sydney Trains line colours

| Line | CMYK              | RGB             | HEX       | PMS / other reference               |
| ---- | ----------------- | --------------- | --------- | ----------------------------------- |
| M1   | 100 / 22 / 42 / 2 | 22 / 131 / 136  | `#168388` | PMS 321                             |
| T1   | 0 / 45 / 100 / 0  | 249 / 157 / 28  | `#F99D1C` | PMS 137C; Avery 91589A Melon Yellow |
| T2   | 100 / 17 / 9 / 0  | 0 / 152 / 205   | `#0098CD` | PMS 801C                            |
| T3   | 0 / 70 / 100 / 0  | 243 / 112 / 33  | `#F37021` | PMS 158C                            |
| T4   | 100 / 69 / 4 / 1  | 0 / 90 / 163    | `#005AA3` | PMS 2935C; Avery 841 Scuba Blue     |
| T5   | 21 / 97 / 0 / 0   | 196 / 37 / 143  | `#C4258F` | PMS 2395C; Avery 978 Light Purple   |
| T6   | 0 / 50 / 73 / 51  | 124 / 62 / 33   | `#7C3E21` | PMS 1685C                           |
| T7   | 56 / 37 / 31 / 13 | 111 / 129 / 142 | `#6F818E` | PMS 7544C                           |
| T8   | 98 / 12 / 100 / 2 | 0 / 149 / 76    | `#00954C` | PMS 355C                            |
| T9   | 11 / 100 / 91 / 3 | 209 / 31 / 47   | `#D11F2F` | PMS 186C                            |

## Other network colours

### NSW TrainLink Intercity

| Line                      | CMYK              | RGB            | HEX       | PMS   |
| ------------------------- | ----------------- | -------------- | --------- | ----- |
| Blue Mountains            | 0 / 45 / 100 / 0  | 249 / 157 / 28 | `#F99D1C` | 137C  |
| Central Coast & Newcastle | 11 / 100 / 91 / 3 | 209 / 31 / 47  | `#D11F2F` | 186C  |
| Hunter                    | 31 / 87 / 73 / 33 | 131 / 49 / 52  | `#833134` | 491C  |
| South Coast               | 100 / 69 / 4 / 1  | 0 / 90 / 163   | `#005AA3` | 2935C |
| Southern Highlands        | 98 / 12 / 100 / 2 | 0 / 149 / 76   | `#00954C` | 355C  |

### Regional Trains and Coaches Network

| Mode    | CMYK             | RGB            | HEX       | PMS   |
| ------- | ---------------- | -------------- | --------- | ----- |
| Trains  | 0 / 56 / 100 / 0 | 246 / 137 / 31 | `#F6891F` | 151C  |
| Coaches | 98 / 100 / 0 / 0 | 115 / 42 / 130 | `#732A82` | 7657C |

### Sydney Ferries and Newcastle Ferries

| Route               | CMYK               | RGB            | HEX       | PMS / note                     |
| ------------------- | ------------------ | -------------- | --------- | ------------------------------ |
| F1 Manly            | 100 / 27 / 89 / 16 | 0 / 119 / 75   | `#00774B` | 3415C                          |
| F2 Taronga Zoo      | 86 / 45 / 79 / 49  | 20 / 71 / 52   | `#144734` | 3435C                          |
| F3 Parramatta River | 66 / 26 / 92 / 9   | 100 / 140 / 60 | `#648C3C` | 375C                           |
| F4 Pyrmont Bay      | 30 / 0 / 100 / 0   | 191 / 215 / 48 | `#BFD730` | —                              |
| F5 Neutral Bay      | 83 / 38 / 82 / 31  | 40 / 97 / 66   | `#286142` | 7734C                          |
| F6 Mosman Bay       | 90 / 0 / 97 / 0    | 0 / 171 / 81   | `#00AB51` | 7481C                          |
| F7 Double Bay       | 83 / 0 / 63 / 0    | 0 / 177 / 137  | `#00B189` | 339C                           |
| F8 Cockatoo Island  | 64 / 42 / 100 / 31 | 85 / 98 / 43   | `#55622B` | 371C                           |
| F9 Watsons Bay      | 65 / 0 / 100 / 0   | 101 / 179 / 46 | `#65B32E` | —                              |
| F10 Blackwattle Bay | 68 / 0 / 100 / 0   | 90 / 176 / 49  | `#5AB031` | 361C; specification may change |
| STKN Stockton       | 68 / 0 / 100 / 0   | 90 / 176 / 49  | `#5AB031` | 361C                           |

### Sydney and Newcastle Light Rail

| Line                      | CMYK               | RGB           | HEX       | PMS   |
| ------------------------- | ------------------ | ------------- | --------- | ----- |
| L1 Dulwich Hill           | 15 / 100 / 90 / 10 | 190 / 22 / 34 | `#BE1622` | 200C  |
| L2 Randwick               | 5 / 100 / 100 / 2  | 221 / 30 / 37 | `#DD1E25` | 185C  |
| L3 Kingsford              | 36 / 100 / 50 / 36 | 120 / 17 / 64 | `#781140` | 216C  |
| L4 Westmead & Carlingford | 0 / 100 / 50 / 15  | 206 / 12 / 78 | `#BB2043` | 7636C |
| NLR Newcastle Light Rail  | 0 / 93 / 79 / 0    | 238 / 52 / 63 | `#EE343F` | 185C  |

## Modal colour palette

Transcribed from [`Modal colour palette.PNG`](Modal%20colour%20palette.PNG). These mode-level palettes are distinct from route-specific colours above.

| Mode           | Primary   | Secondary | Tertiary  |
| -------------- | --------- | --------- | --------- |
| Sydney Metro   | `#168388` | `#00ACC2` | `#BFB431` |
| Sydney Trains  | `#EC6606` | `#DF4C1D` | `#FBAA00` |
| NSW TrainLink  | `#DD3F1D` | `#BA1E2B` | `#F28E00` |
| Buses          | `#009ED7` | `#83D0F5` | `#83D0F5` |
| Sydney Ferries | `#009E4D` | `#6BBFA3` | `#6BBFA3` |
| Light rail     | `#E4022D` | `#9E082E` | `#ED6B94` |
| Cycling        | `#009681` | `#007367` | —         |
| Walking        | `#B11F8C` | `#80225F` | —         |

## Badge artwork and attribution

The downloaded WebP source copies are kept in `Lines/`; runtime copies used by the app live in `src/main/assets/` and are imported by the shared `src/main/css/lineBadge.ts` configuration. Credits identify the artwork author/source and link to the original listing. The M, T and B roundels are simple text/geometric marks; their Commons listings identify them as public domain. Brand marks may still be protected as trademarks.

| Local WebP                                                                       | Original artwork and attribution                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TfNSW_M.svg.webp`                                                               | [TfNSW M.svg](https://commons.wikimedia.org/wiki/File:TfNSW_M.svg), Philip Terry Graham, based on Transport for NSW; public-domain simple text/geometry mark.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `TfNSW_T1.svg.webp`–`TfNSW_T5.svg.webp`, `TfNSW_T7.svg.webp`–`TfNSW_T9.svg.webp` | [TfNSW T1.svg](https://commons.wikimedia.org/wiki/File:TfNSW_T1.svg) through the corresponding [T2](https://commons.wikimedia.org/wiki/File:TfNSW_T2.svg), [T3](https://commons.wikimedia.org/wiki/File:TfNSW_T3.svg), [T4](https://commons.wikimedia.org/wiki/File:TfNSW_T4.svg), [T5](https://commons.wikimedia.org/wiki/File:TfNSW_T5.svg), [T7](https://commons.wikimedia.org/wiki/File:TfNSW_T7.svg), [T8](https://commons.wikimedia.org/wiki/File:TfNSW_T8.svg), and [T9](https://commons.wikimedia.org/wiki/File:TfNSW_T9.svg) files. Credited creator: Philip Terry Graham; based on Transport for NSW; public-domain simple text/geometry marks. |
| `TfNSW_T6_(2013–2020).svg.webp`                                                  | [TfNSW T6 (2013–2020).svg](<https://commons.wikimedia.org/wiki/File:TfNSW_T6_(2013%E2%80%932020).svg>), Philip Terry Graham, based on Transport for NSW; historical mark, not used for current route badges.                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `TfNSW_B.svg.webp`                                                               | [TfNSW B.svg](https://commons.wikimedia.org/wiki/File:TfNSW_B.svg), Philip Terry Graham; recreated from Transport for NSW bus wayfinding artwork; Commons identifies the simple roundel as public domain.                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `TfNSW_B-Line.svg.webp`                                                          | B-Line project artwork: [Transport for NSW B-Line project](https://www.transport.nsw.gov.au/projects/b-line-bus). The supplied attribution identifies Transport for NSW as the source and marks the image “Fair use”; see also [the cited Wikipedia article](https://en.wikipedia.org/w/index.php?curid=63571198).                                                                                                                                                                                                                                                                                                                                        |
| `TfNSW_T.svg.webp`                                                               | [TfNSW T.svg](https://commons.wikimedia.org/wiki/File:TfNSW_T.svg), Philip Terry Graham, based on Transport for NSW; public-domain simple text/geometry mark.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `TfNSW_F.svg.webp`                                                               | [TfNSW F.svg](https://commons.wikimedia.org/wiki/File:TfNSW_F.svg), Philip Terry Graham, based on Transport for NSW; public-domain simple text/geometry mark.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `TfNSW_L.svg.webp`                                                               | [TfNSW L.svg](https://commons.wikimedia.org/wiki/File:TfNSW_L.svg), Philip Terry Graham, based on Transport for NSW; public-domain simple text/geometry mark.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
