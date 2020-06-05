import React from 'react';
import BEMHelper from 'utils/bem';
import Tekst from 'tekster/finn-tekst';
import { Normaltekst } from 'nav-frontend-typografi';
import Panel from 'nav-frontend-paneler';
import Lock from 'ikoner/meny/Lock';
import './MinsideLockMsg.less';

export const MinsideLockMsg = () => {
    const cls = BEMHelper('minside-lock');
    return (
        <Panel className={cls.element('panel')}>
            <div className={cls.element('ikon')}>
                <Lock />
            </div>
            <div className={cls.element('msg')}>
                <Normaltekst>
                    <Tekst id={'lock-msg-infotekst'} />
                </Normaltekst>
            </div>
        </Panel>
    );
};

export default MinsideLockMsg;
