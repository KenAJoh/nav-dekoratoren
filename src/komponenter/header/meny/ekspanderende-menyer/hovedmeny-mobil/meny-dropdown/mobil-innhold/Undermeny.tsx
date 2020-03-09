import React from 'react';
import Lenke from 'nav-frontend-lenker';
import HoyreChevron from 'nav-frontend-chevron/lib/hoyre-chevron';
import { MenyNode } from '../../../../../../../reducer/menu-duck';
import BEMHelper from '../../../../../../../utils/bem';
import Lukkundermeny from './Lukkundermeny';
import Listelement from './Listelement';
import { genererUrl } from '../../../../../../../utils/Environment';
import { Systemtittel } from 'nav-frontend-typografi';

interface Props {
    className: string;
    clicked: boolean;
    lukkMeny: () => void;
    tabindex: boolean;
    lenker: MenyNode;
    arbeidsflatenavn: string;
}

const Undermeny = (props: Props) => {
    const {
        className,
        clicked,
        lukkMeny,
        tabindex,
        lenker,
        arbeidsflatenavn,
    } = props;
    const menyClass = BEMHelper(className);
    const arbeidsflate = arbeidsflatenavn
        .charAt(0)
        .toUpperCase()
        .concat(arbeidsflatenavn.slice(1).toLowerCase());
    return (
        <section
            className={menyClass.element(
                'undermeny-innhold',
                clicked ? 'active' : ''
            )}
        >
            <Lukkundermeny
                lukkundermeny={lukkMeny}
                className={menyClass.className}
                tabindex={props.tabindex}
            />
            <Systemtittel
                className={menyClass.element('undermeny-arbeidsflate')}
            >
                {arbeidsflate}
            </Systemtittel>
            <ul className={menyClass.element('meny', 'list')}>
                {lenker.children.map((lenke, index: number) => {
                    return (
                        <Lenke
                            href={genererUrl(lenke.path)}
                            key={index}
                            tabIndex={tabindex ? 0 : -1}
                        >
                            <Listelement
                                className={menyClass.className}
                                classElement="text-element-undermeny"
                            >
                                <div
                                    className={menyClass.element(
                                        'undermeny-chevron'
                                    )}
                                >
                                    <HoyreChevron />
                                </div>
                                {lenke.displayName}
                            </Listelement>
                        </Lenke>
                    );
                })}
            </ul>
            <div className={menyClass.element('blokk-divider')}>
                <Lukkundermeny
                    lukkundermeny={lukkMeny}
                    className={menyClass.className}
                    tabindex={props.tabindex}
                />
            </div>
        </section>
    );
};

export default Undermeny;
