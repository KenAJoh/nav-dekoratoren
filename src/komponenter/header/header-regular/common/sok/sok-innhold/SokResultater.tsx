import SokeforslagIngress from './SokeforslagIngress';
import Sokeforslagtext from './Sokeforslagtext';
import { finnTekst } from 'tekster/finn-tekst';
import React from 'react';
import { Locale } from 'store/reducers/language-duck';
import { Sokeresultat, Soketreff } from '../utils';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { getKbId } from 'utils/keyboard-navigation/kb-navigation';
import { KbNavGroup } from 'utils/keyboard-navigation/kb-navigation';
import Tekst from 'tekster/finn-tekst';
import Lenke from 'nav-frontend-lenker';
import { useSelector } from 'react-redux';
import { AppState } from 'store/reducers';
import { useDispatch } from 'react-redux';
import { lukkAlleDropdowns } from 'store/reducers/dropdown-toggle-duck';
import './SokResultater.less';

type Props = {
    writtenInput: string;
    result: Sokeresultat;
    numberOfResults: number;
    language: Locale;
    fetchError?: string | boolean;
};

const removeDuplicates = (items: Soketreff[]) =>
    items.filter(
        (itemA, index) =>
            items.findIndex((itemB) => itemA.href === itemB.href && itemA.displayName === itemB.displayName) === index
    );

export const SokResultater = (props: Props) => {
    const { language, fetchError } = props;
    const { writtenInput, result, numberOfResults } = props;
    const { XP_BASE_URL } = useSelector((state: AppState) => state.environment);
    const itemsFiltered = removeDuplicates(result.hits) || result.hits;
    const itemsSpliced = itemsFiltered.slice(0, numberOfResults);
    const dispatch = useDispatch();

    return (
        <div className="sokeresultat-container">
            {fetchError && (
                <div className={'sokeresultat-feil'}>
                    <AlertStripeFeil>
                        <Tekst id={'feil-sok-fetch'} />
                    </AlertStripeFeil>
                </div>
            )}
            {!fetchError && itemsFiltered.length ? (
                <ul className="sokeresultat-liste">
                    {itemsFiltered.slice(0, numberOfResults).map((item, index) => {
                        const style = {
                            '--index': index,
                        } as React.CSSProperties;
                        const id = getKbId(KbNavGroup.Sok, {
                            col: 0,
                            row: 1,
                            sub: index,
                        });
                        return (
                            <li key={index} style={style}>
                                <a
                                    id={id}
                                    className={'sokeresultat-lenke'}
                                    href={item.href}
                                    onClick={() => dispatch(lukkAlleDropdowns())}
                                >
                                    <SokeforslagIngress
                                        className="sok-resultat-listItem"
                                        displayName={item.displayName}
                                    />
                                    <Sokeforslagtext highlight={item.highlight} />
                                </a>
                            </li>
                        );
                    })}
                </ul>
            ) : null}

            {!fetchError && itemsFiltered.length ? (
                <div className={'sokeresultat-alle-treff'}>
                    <div>
                        {finnTekst('sok-viser', language)} {itemsSpliced.length} {finnTekst('sok-av', language)}{' '}
                        {result.total} {finnTekst('sok-resultater', language)}
                    </div>
                    {result.total > itemsFiltered.length && (
                        <Lenke className={'typo-element'} href={`${XP_BASE_URL}/sok?ord=${writtenInput}`}>{`${finnTekst(
                            'se-alle-treff',
                            language
                        )} ("${writtenInput}")`}</Lenke>
                    )}
                </div>
            ) : null}

            {!fetchError && !itemsFiltered.length && (
                <div className={'sokeresultat-ingen-treff'}>
                    <SokeforslagIngress
                        className="sok-resultat-listItem"
                        displayName={`${finnTekst('sok-ingen-treff', language)} (${writtenInput})`}
                    />
                </div>
            )}
        </div>
    );
};

export default SokResultater;
