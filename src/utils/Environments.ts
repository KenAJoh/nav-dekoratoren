const Environments = () => {
    if (process.env.NODE_ENV === 'development') {
        return {
            miljo: 'LOCAL',
            baseUrl: 'http://localhost:3000',
            loginUrl: '#',
            logoutUrl: '#',
            menypunkter: 'http://localhost:8088/person/nav-dekoratoren/api/get/menyvalg',
        };
    }
    if (window.location.hostname.indexOf('www-q0') > -1) {
        return {
            miljo: 'DEV',
            baseUrl: 'https://www-q0.nav.no',
            loginUrl: 'https://loginservice-q.nav.no',
            logoutUrl: 'https://loginservice-q.nav.no/slo',
            menypunkter: 'https://www-q0.nav.no/person/nav-dekoratoren/api/get/menyvalg',
        };
    }
    if (window.location.hostname.indexOf('www-q1') > -1) {
        return {
            miljo: 'DEV',
            baseUrl: 'https://www-q1.nav.no',
            loginUrl: 'https://loginservice-q.nav.no',
            logoutUrl: 'https://loginservice-q.nav.no/slo',
            menypunkter: '/person/nav-dekoratoren/api/get/menyvalg',
        };
    }
    // TODO: før dekoratør skal settes i produksjon må url punkter til prod oppdateres, -
    //  kan ikke gjøres før enonic xp er i produksjon
    return {
        miljo: 'PROD',
        baseUrl: 'https://www.nav.no',
        loginUrl: 'https://loginservice.nav.no',
        logoutUrl: 'https://loginservice.nav.no/slo',
        menypunkter: '/person/nav-dekoratoren/api/get/menyvalg',
    };
};

export default Environments;
