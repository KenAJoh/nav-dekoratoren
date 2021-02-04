import React from 'react';
import { Normaltekst, Ingress } from 'nav-frontend-typografi';
import Tekst from 'tekster/finn-tekst';
import { LenkeMedSporing } from 'komponenter/common/lenke-med-sporing/LenkeMedSporing';
import { useSelector } from 'react-redux';
import { AppState } from 'store/reducers';
import { MenuValue } from 'utils/meny-storage-utils';
import './ThankYou.less';

const ThankYou = () => {
    const { environment, arbeidsflate } = useSelector((state: AppState) => state);
    const kontaktOssUrl =
        arbeidsflate.status === MenuValue.ARBEIDSGIVER
            ? 'https://arbeidsgiver.nav.no/kontakt-oss'
            : `${environment.XP_BASE_URL}/person/kontakt-oss`;

    return (
        <div className="thankyou-container">
            <Ingress>
                <Tekst id="send-undersokelse-takk" />
            </Ingress>
            <div className="mellomrom" />
            <Normaltekst>
                <Tekst id="hensikt-med-tilbakemelding" />
            </Normaltekst>
            <LenkeMedSporing href={kontaktOssUrl}>
                <Tekst id="hensikt-med-tilbakemelding-lenke" />
            </LenkeMedSporing>
        </div>
    );
};

export default ThankYou;
