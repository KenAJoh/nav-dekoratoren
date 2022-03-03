import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Detail, Heading } from '@navikt/ds-react';

import Tekst from 'tekster/finn-tekst';
import { Link } from '@navikt/ds-react';
import BEMHelper from 'utils/bem';
import { detect } from 'detect-browser';
import { BrowserInfo } from 'detect-browser';
import { LukkKnapp } from 'komponenter/common/lukk-knapp/LukkKnapp';
import { useCookies } from 'react-cookie';
import { erDev } from 'utils/Environment';
import './BrowserSupportMsg.less';

import ikon from 'ikoner/advarsel-sirkel-fyll.svg';
import { Bilde } from 'komponenter/common/bilde/Bilde';

const cookieKey = 'decorator-browser-warning-closed';
const linkUrl =
    'https://www.nav.no/no/nav-og-samfunn/kontakt-nav/teknisk-brukerstotte/hjelp-til-personbruker/elektronisk-innsending_kap';

const isBrowserSupported = (browser: BrowserInfo) => {
    if (!browser?.name) {
        return true;
    }

    const versionCheck = (majorReq: number, minorReq: number = 0) => {
        if (!browser.version) {
            return true;
        }
        const [majorCurrent, minorCurrent] = browser.version.split('.').map(Number);
        if (!majorCurrent) {
            return true;
        }
        return majorCurrent >= majorReq && (minorCurrent ? minorCurrent >= minorReq : true);
    };

    switch (browser.name) {
        case 'ie':
            return false;
        default:
            return true;
    }
};

const getBrowserSpecificMsg = (browser: BrowserInfo) => {
    if (!browser?.name) {
        return null;
    }

    switch (browser.name) {
        case 'ie':
            return `Microsoft Internet Explorer v.${browser.version}`;
        default:
            return null;
    }
};

export const BrowserSupportMsg = () => {
    const [meldingLukket, setMeldingLukket] = useState(true);
    const [cookies, setCookie] = useCookies([cookieKey]);

    const browser = detect() as BrowserInfo;

    useEffect(() => {
        setMeldingLukket(cookies[cookieKey] === 'true');
    }, [cookies]);

    if (isBrowserSupported(browser) || meldingLukket) {
        return null;
    }

    const cls = BEMHelper('browser-utdatert');
    const browserSpecificMsg = getBrowserSpecificMsg(browser);

    const closeWarning = () => {
        setMeldingLukket(true);
        setCookie(cookieKey, true, { domain: erDev ? undefined : 'nav.no' });
    };

    return (
        <div className={cls.element('wrapper')}>
            <div className={cls.element('innhold')}>
                <div className={cls.element('varsel-ikon')}>
                    <Bilde altText={''} asset={ikon} />
                </div>
                <div className={cls.element('tekst')}>
                    <Heading level="2" size="small">
                        <Tekst id={'browser-utdatert-msg'} />{' '}
                        <Link href={linkUrl}>
                            <Tekst id={'browser-utdatert-lenke'} />
                        </Link>
                    </Heading>
                    {browserSpecificMsg && (
                        <Detail>
                            <Tekst id={'browser-utdatert-din-nettleser'} />
                            {browserSpecificMsg}
                        </Detail>
                    )}
                </div>
                <LukkKnapp onClick={closeWarning} ariaLabel={'Lukk advarsel for nettleser'} />
            </div>
        </div>
    );
};
