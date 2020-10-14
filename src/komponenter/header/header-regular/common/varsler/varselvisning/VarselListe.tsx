import React from 'react';
import { LenkeMedSporing } from 'komponenter/common/lenke-med-sporing/LenkeMedSporing';
import { AnalyticsCategory } from 'utils/analytics';
import { getKbId, KbNavGroup } from 'utils/keyboard-navigation/kb-navigation';
import { useSelector } from 'react-redux';
import { AppState } from 'store/reducers';
import { NyesteVarslerData } from 'store/reducers/varselinnboks-duck';
import { Bilde } from 'komponenter/common/bilde/Bilde';
import varselConfig from './config.json'; // Kopiert fra: https://github.com/navikt/varselinnboks/blob/master/src/main/resources/config.json

import alarmIkon from 'ikoner/varsler/alarm.svg';
import kalenderIkon from 'ikoner/varsler/calendar-3.svg';
import chatIkon from 'ikoner/varsler/bubble-chat-2.svg';
import dokumentIkon from 'ikoner/varsler/file-new-1.svg';
import plasterIkon from 'ikoner/varsler/first-aid-plaster.svg';

const ikoner: { [str: string]: string } = {
    'alarm-ikon': alarmIkon,
    'kalender-ikon': kalenderIkon,
    'snakkeboble-ikon': chatIkon,
    'dokument-ikon': dokumentIkon,
    'plaster-ikon': plasterIkon,
};

type Props = {
    varsler: NyesteVarslerData[];
    rowIndex?: number;
};

interface VarselConfig {
    ikontekst: string;
    varselType: string;
    stylingklasse: string;
    lenketekst: string;
}

const defaultConfig = {
    ikontekst: 'alarm-ikon',
    varselType: '',
    stylingklasse: '',
    lenketekst: 'Lenke',
};
const getVarselTypeConfig = (varselType: string) => {
    const data: VarselConfig[] = varselConfig;
    const config = data.find((item: VarselConfig) => item.varselType === varselType);
    return config ? config : defaultConfig;
};

const formatDato = (datoString: string) => {
    const datoObjekt = new Date(parseInt(datoString, 10));
    if (isNaN(datoObjekt.valueOf())) {
        return '';
    }

    const datoOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    const datoFormattert = new Intl.DateTimeFormat('nb', datoOptions).format(datoObjekt);
    const klokkeslettOptions = { hour: 'numeric', minute: 'numeric' };
    const klokkeslettFormattert = new Intl.DateTimeFormat('nb', klokkeslettOptions).format(datoObjekt);
    return `${datoFormattert} kl ${klokkeslettFormattert}`;
};

export const VarselListe = ({ varsler, rowIndex }: Props) => {
    const arbeidsflate = useSelector((state: AppState) => state.arbeidsflate.status);

    return (
        <ul>
            {varsler.map((varsel: NyesteVarslerData, subIndex) => {
                const currentConfig = getVarselTypeConfig(varsel.meldingsType);
                const ikon = ikoner[currentConfig.ikontekst] || alarmIkon;

                return (
                    <li key={varsel.varselId} className="dekorator-varsel-container">
                        <div className="dekorator-varsel">
                            <div className={`varsel-ikon-container ${currentConfig.ikontekst}`}>
                                <Bilde asset={ikon} altText={'varsel-ikon'} className={`varsel-ikon`} />
                            </div>
                            <div className="varsel-innhold">
                                <p className="typo-normal-liten varsel-dato">{formatDato(varsel.datoOpprettet)}</p>
                                <p className="typo-infotekst">{varsel.varseltekst}</p>
                                <LenkeMedSporing
                                    href={varsel.url || ''}
                                    id={
                                        rowIndex !== undefined && subIndex !== undefined
                                            ? getKbId(KbNavGroup.Varsler, {
                                                  col: 0,
                                                  row: rowIndex,
                                                  sub: subIndex,
                                              })
                                            : undefined
                                    }
                                    analyticsEventArgs={{
                                        context: arbeidsflate,
                                        category: AnalyticsCategory.Header,
                                        action: 'varsel-lenke',
                                        label: varsel.url,
                                    }}
                                >
                                    {currentConfig.lenketekst}
                                </LenkeMedSporing>
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};
