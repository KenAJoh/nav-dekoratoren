import React, { useEffect, useState } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { genererLenkerTilUrl } from '../../../utils/Environment';
import BEMHelper from '../../../utils/bem';
import { GACategory } from '../../../utils/google-analytics';
import { LenkeMedGA } from '../../LenkeMedGA';
import { FooterLenke, lenkerBunn } from '../Footer-lenker';
import NavLogoFooter from '../../../ikoner/meny/NavLogoFooter';

interface Props {
    classname: string;
}

const FooterBottom = ({ classname }: Props) => {
    const cls = BEMHelper(classname);
    const [lenker, setLenker] = useState<FooterLenke[]>(lenkerBunn);

    useEffect(() => {
        setLenker(genererLenkerTilUrl(lenkerBunn));
    }, []);

    return (
        <section className={cls.element('menylinje-bottom')}>
            <div className="menylinje-bottom__innhold">
                <div className="menylinje-bottom__logo">
                    <NavLogoFooter
                        width="65"
                        height="65"
                        classname={cls.element('svg')}
                    />
                </div>
                <Normaltekst className="menylinje-bottom__tekst">
                    Arbeids- og velferdsetaten
                </Normaltekst>
                <ul>
                    {lenker.map(lenke => {
                        return (
                            <li key={lenke.lenketekst}>
                                <LenkeMedGA
                                    href={lenke.url}
                                    gaEventArgs={{
                                        category: GACategory.Footer,
                                        action: `bunn/${lenke.lenketekst}`,
                                        label: lenke.url,
                                    }}
                                >
                                    {lenke.lenketekst}
                                </LenkeMedGA>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
};

export default FooterBottom;
