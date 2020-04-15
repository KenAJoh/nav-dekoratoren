import React from 'react';
import BEMHelper from '../../../../../../utils/bem';
import { MenyNode } from '../../../../../../reducer/menu-duck';
import { MenyLenkeSeksjon } from '../../meny-lenker/MenyLenkeSeksjon';
import KbNav, {
    NodeGroup,
} from '../../../../../../utils/keyboard-navigation/kb-navigation';
import { LenkeMedGA } from '../../../../../LenkeMedGA';
import { GACategory } from '../../../../../../utils/google-analytics';
import Tekst from '../../../../../../tekster/finn-tekst';
import { Systemtittel } from 'nav-frontend-typografi';
import { KbNavigationWrapper } from '../../../../../../utils/keyboard-navigation/KbNavigationWrapper';
import { configForNodeGroup } from '../../../../../../utils/keyboard-navigation/kb-navigation-setup';

type Props = {
    classname: string;
    isOpen: boolean;
    menyLenker: MenyNode | undefined;
    dittNavUrl: string;
};

const nodeGroup = NodeGroup.MinsideMeny;

export const MinsideVisning = (props: Props) => {
    const { classname, isOpen, menyLenker, dittNavUrl } = props;

    if (!menyLenker) {
        return null;
    }

    const cls = BEMHelper(classname);

    return (
        <KbNavigationWrapper
            config={configForNodeGroup[nodeGroup]}
            isEnabled={isOpen}
        >
            <>
                <div className={cls.element('topp-seksjon')}>
                    <LenkeMedGA
                        href={dittNavUrl}
                        id={KbNav.getKbId(nodeGroup, {
                            col: 0,
                            row: 0,
                            sub: 0,
                        })}
                        gaEventArgs={{
                            category: GACategory.Header,
                            action: 'dittnav',
                            label: dittNavUrl,
                        }}
                    >
                        <Tekst id={'til-forside'} />
                    </LenkeMedGA>
                    <Systemtittel
                        className={cls.element('topp-seksjon-tittel')}
                    >
                        <Tekst id={'min-side'} />
                    </Systemtittel>
                </div>
                <div className={cls.element('lenke-seksjoner')}>
                    {menyLenker &&
                        menyLenker.children.map((menygruppe, index) => (
                            <MenyLenkeSeksjon
                                menygruppe={menygruppe}
                                isOpen={isOpen}
                                colIndex={index}
                                rowIndex={1}
                                kbNaviGroup={nodeGroup}
                                key={menygruppe.displayName}
                            />
                        ))}
                </div>
            </>
        </KbNavigationWrapper>
    );
};

export default MinsideVisning;
