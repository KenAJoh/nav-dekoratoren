
# Nav-dekoratoren ![nav.no logo](src/ikoner/meny/NavLogoRod.svg)

![Deploy til prod](https://github.com/navikt/nav-dekoratoren/workflows/Deploy-to-prod/badge.svg)
![Deploy til q0](https://github.com/navikt/nav-dekoratoren/workflows/Deploy-to-q0/badge.svg)
![Deploy til q1](https://github.com/navikt/nav-dekoratoren/workflows/Deploy-to-q1/badge.svg)
![Deploy til q6](https://github.com/navikt/nav-dekoratoren/workflows/Deploy-to-q6/badge.svg)
                     
Node.js Express applikasjon med frontend-komponenter i React.<br>
Appen kjører på NAIS i en docker-container.

## Bruk av dekoratøren

:information_source: &nbsp; Dekoratøren er bakoverkompatibel; med andre ord vil eksisterende applikasjoner som benytter dekoratør:v4 (https://appres.nav.no/common-html/v4/navno) automatisk få ny dekoratør. 

Den nye dekoratøren serveres på følgende ingresser:

**Prod (prod-sbs)**
- https://www.nav.no/dekoratoren/ 
- https://appres.nav.no/common-html/v4/navno (deprecated)

**Dev (dev-gcp)**
- https://dekoratoren.dev.nav.no/

Krever følgende access policy i nais.yaml:
```
accessPolicy:
  outbound:
    external:
      - host: dekoratoren.dev.nav.no
```
**Dev (dev-sbs)**
- [https://www-{q0,q1,q6}.nav.no/dekoratoren/](https://www-q1.nav.no/dekoratoren/) (deprecated)
- [https://appres-{q0,q1,q6}.nav.no/common-html/v4/navno](https://appres-q1.nav.no/common-html/v4/navno) (deprecated)

:warning: &nbsp; Det er en del av it-strategien til NAV å flytte bort fra fra egne datasentre. Som følger vil **dev-sbs og prod-sbs skrus av på et tidspunkt** og det anbefales å deployere nye applikasjoner til Google Cloud (gcp).

## Implementasjon
Dekoratøren kan implementeres på flere ulike måter, både server-side og client-side.

### Eksempel 1
Hent dekoratøren server-side og send html til brukeren som inkluderer dekoratøren:
```
const url = `{MILJO_URL}/?{DINE_PARAMETERE}`;
const getDecorator = () =>x
    request(url, (error, response, body) => {
        // Inject fragmenter av dekoratøren med id-selectors, enten manuelt eller ved bruk av template engine
    });
```
[Eksempel i Personopplysninger](https://github.com/navikt/personopplysninger/blob/master/server/dekorator.js). <br>
:warning: &nbsp; Cache anbefales.

### Eksempel 2

Sett inn noen linjer html og last inn dekoratøren client-side:
```
<html>
  <head>
      <link href="{MILJO_URL}/css/client.css" rel="stylesheet" /> 
  </head>
  <body>
    <div id="decorator-header"></div>
    {
      DIN_APP
    }
    <div id="decorator-footer"></div>
    <div id="decorator-env" data-src="{MILJO_URL}/env?{DINE_PARAMETERE}"></div>
    <script src="{MILJO_URL}/client.js"></script>
  </body>
</html>
```

:warning: &nbsp; CSR (Client-Side-Rendering) av dekoratøren **kan påvirke ytelsen**.

### Eksempel 3
Bruk pus-decorator, les [readme](https://github.com/navikt/pus-decorator).

## Parametere
Dekoratøren kan tilpasses med følgende [URL-parametere / query-string](https://en.wikipedia.org/wiki/Query_string). <br>

| Parameter                 | Type                                                        | Default              | Forklaring                                                                          |
| ------------------------- |------------------------------------------------------------ |--------------------- | ----------------------------------------------------------------------------------- |
| context                   | privatperson \| arbeidsgiver \| samarbeidspartner           | privatperson         | Setter menyen til definert kontekst                                                 |
| simple                    | boolean                                                     | false                | Viser en forenklet header og footer                                                 |
| enforceLogin (beta)       | boolean                                                     | false                | Sørger for at brukeren er innlogget på definert sikkerhetsnivå (level) [1]          |
| redirectToApp             | boolean                                                     | false <br>(ditt-nav) | Sender brukeren tilbake til nåværende url etter innlogging via dekoratøren [2]      |
| level                     | Level3 \| Level4                                            | Level3               | Gir brukeren innloggingsvalg basert på definert sikkerhetsnivå [2]                  |            
| language                  | nb \| nn \| en \| se                                        | nb                   | Setter språket til dekoratøren for server side rendering [3]                        |
| availableLanguages (beta) | [{ locale: nb \| nn \| en \| se, url: string }]             | [ ]                  | Setter alternativene til språkvelgeren for server side rendering [4]                |
| breadcrumbs (beta)        | [{ title: string, url: string }]                            | [ ]                  | Setter brødsmulestien for server side rendering [5]                     |
| feedback                  | boolean                                                     | true                 | Skjuler eller viser tilbakemeldingskomponentet                                      |
| chatbot                   | boolean                                                     | false                | Skjuler eller viser Chatbot Frida [6]                                               |
 
:warning: &nbsp; Ta kontakt med [Team Personbruker](https://github.com/orgs/navikt/teams/team-personbruker) før beta parametere benyttes

[1] Kombineres med **level**, **redirectToApp** og [EnforceLoginLoader](https://github.com/navikt/nav-dekoratoren-moduler#readme) ved behov. <br>
[2] Gjelder både ved automatisk innlogging og ved klikk på innloggingsknappen. <br>
[3] Språk settes automatisk client-side dersom nåværende url inneholder **/nb/**, **/nn/**, **/en/**, **/se/**, uavhengig av dette parameteret. <br>
[4] Kan settes client-side med [setAvailableLanguages](https://github.com/navikt/nav-dekoratoren-moduler#readme) og [onLanguageSelect](https://github.com/navikt/nav-dekoratoren-moduler#readme) <br>
[5] Kan settes client-side med [setBreadcrumbs](https://github.com/navikt/nav-dekoratoren-moduler#readme) og [onBreadcrumbClick](https://github.com/navikt/nav-dekoratoren-moduler#readme) <br>
[6] Dersom en chat-sesjon er aktiv, så vil denne holdes i gang på alle sider på nav.no, uavhengig av dette parameteret.

### Eksempler
Eksempel 1 - Endre context:<br>
https://www.nav.no/dekoratoren/?context=arbeidsgiver

Eksempel 2 - Håndhev innlogging<br>
https://www.nav.no/dekoratoren/?enforceLogin=true&level=Level4&redirectToApp=true

Eksempel 3 - Språkvelger (beta):<br>
[https://www.nav.no/dekoratoren/?availableLanguages=\[{"locale":"nb","url":"https://www.nav.no/dekoratoren/nb/"},{"locale":"en","url":"http://localhost:8088/dekoratoren/en/"} \] ](https://www.nav.no/dekoratoren/?availableLanguages=[{"locale":"nb","url":"https://www.nav.no/dekoratoren/nb/"},{"locale":"en","url":"http://localhost:8088/dekoratoren/en/"}])

Eksempel 4 - Brødsmulesti (beta): <br>
[https://www.nav.no/dekoratoren/?breadcrumbs=\[{"url":"https://www.nav.no/person/dittnav","title":"Ditt NAV"},{"url":"https://www.nav.no/person/kontakt-oss/nb/","title":"Kontakt oss"}\] ](https://www.nav.no/dekoratoren/?breadcrumbs=[{"url":"https://www.nav.no/person/dittnav","title":"Ditt%20NAV"},%20{"url":"https://www.nav.no/person/kontakt-oss/nb/","title":"Kontakt%20oss"}])

## Oppstart via docker-compose

Start **navikt/nav-dekoratoren**, **navikt/pb-nav-mocked**, **navikt/stub-oidc-provider** og **navikt/pb-oidc-provider-gui**. Oppsettet vil replikere innlogging og eksterne avhengigheter som varselinnboks.
```
dekoratoren:
    container_name: dekoratoren
    image: 'docker.pkg.github.com/navikt/nav-dekoratoren/nav-dekoratoren:latest'
    ports:
      - "8100:8088"
    environment:
      XP_BASE_URL: 'https://www.nav.no'
      APP_BASE_URL: 'http://localhost:8100'
      APP_BASE_PATH: '/dekoratoren'
      API_XP_SERVICES_URL: 'https://www.nav.no/_/service'
      API_UNLEASH_PROXY_URL=https://www.nav.no/person/pb-unleash-proxy
      API_INNLOGGINGSLINJE_URL: 'http://mocks:8080/innloggingslinje-api/auth'
      API_VARSELINNBOKS_URL: 'http://mocks:8080/person/varselinnboks'
      MINSIDE_ARBEIDSGIVER_URL: 'https://arbeidsgiver.nav.no/min-side-arbeidsgiver/'
      DITT_NAV_URL: 'https:/www.nav.no/person/dittnav/'
      LOGIN_URL: 'http://localhost:5000'
      LOGOUT_URL: 'http://localhost:5000/?logout'
    depends_on:
      - mocks
```
[Eksempel i Enonic XP](https://github.com/navikt/nav-enonicxp/blob/master/docker-compose.yml). <br>
:information_source: &nbsp; Foreløpig krever GitHub Packages (docker.pkg.github.com) innlogging:
``` 
docker login docker.pkg.github.com -u GITHUB_USERNAME -p GITHUB_PERSONAL_ACCESS_TOKEN
```

 
## Utvikling - Kom i gang
Hent repoet fra github
```
git clone https://github.com/navikt/nav-dekoratoren.git
```
Installer nødvendige avhengigheter
```
npm install
```
Start eksterne tjenester som oidc-provider og mocks
```
docker-compose up -d
```
Kjør applikasjonen lokalt med hot-reloading
```
npm start
```
Starter en Node Express / dev - server på <br> http://localhost:8088/dekoratoren

## Manuelt bygg

```
npm run build-dev (for testing lokalt)
npm run build (for produksjon)
```

## Henvendelser

Spørsmål knyttet til koden eller prosjektet kan rettes mot https://github.com/orgs/navikt/teams/team-personbruker

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-personbruker.
