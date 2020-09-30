import React from 'react';
import Tekst from 'tekster/finn-tekst';
import { Undertekst, Undertittel } from 'nav-frontend-typografi';
import { analyticsEvent } from 'utils/analytics';
import BEMHelper from 'utils/bem';
import { LenkepanelBase } from 'nav-frontend-lenkepanel/lib';
import { HoyreChevron } from 'nav-frontend-chevron';
import { useDispatch } from 'react-redux';
import { ArbeidsflateLenke } from 'komponenter/common/arbeidsflate-lenker/arbeidsflate-lenker';
import { Locale } from 'store/reducers/language-duck';
import { useCookies } from 'react-cookie';
import { cookieOptions } from 'store/reducers/arbeidsflate-duck';
import { erNavDekoratoren } from 'utils/Environment';
import { settArbeidsflate } from 'store/reducers/arbeidsflate-duck';
import { finnTekst } from 'tekster/finn-tekst';
import { AnalyticsEventArgs } from 'utils/analytics';
import './ArbeidsflateLenkepanel.less';

interface Props {
    lenke: ArbeidsflateLenke;
    language: Locale;
    analyticsEventArgs: AnalyticsEventArgs;
    enableCompactView?: boolean;
    id?: string;
}

const ArbeidsflateLenkepanel = ({
    lenke,
    language,
    analyticsEventArgs,
    enableCompactView,
    id,
}: Props) => {
    const cls = BEMHelper('arbeidsflate-lenkepanel');
    const dispatch = useDispatch();
    const [, setCookie] = useCookies();

    return (
        <LenkepanelBase
            href={lenke.url}
            className={`${cls.className} ${
                enableCompactView ? cls.element('compact') : ''
            }`}
            id={id}
            onClick={(event) => {
                setCookie('decorator-context', lenke.key, cookieOptions);
                dispatch(settArbeidsflate(lenke.key));
                if (erNavDekoratoren()) {
                    event.preventDefault();
                }
                analyticsEvent(analyticsEventArgs);
            }}
            border={true}
        >
            <div className={cls.element('innhold')}>
                <Undertittel className={'lenkepanel__heading'}>
                    {enableCompactView && (
                        <HoyreChevron
                            className={cls.element('compact-chevron')}
                        />
                    )}
                    <Tekst id={lenke.lenkeTekstId} />
                </Undertittel>
                <Undertekst className={cls.element('stikkord')}>
                    {finnTekst(lenke.stikkordId, language)}
                </Undertekst>
            </div>
        </LenkepanelBase>
    );
};

export default ArbeidsflateLenkepanel;
