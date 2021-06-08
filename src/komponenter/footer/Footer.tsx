import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'store/reducers';
import SimpleFooter from './footer-simple/FooterSimple';
import FooterRegular from './footer-regular/FooterRegular';
import './Footer.less';
import Utloggingsvarsel from '../common/utloggingsvarsel/Utloggingsvarsel';

const Footer = () => {
    const { PARAMS } = useSelector((state: AppState) => state.environment);
    return (
        <div className={'decorator-wrapper'}>
            <Utloggingsvarsel />
            <footer className="sitefooter">
                {PARAMS.SIMPLE || PARAMS.SIMPLE_FOOTER ? <SimpleFooter /> : <FooterRegular />}
            </footer>
        </div>
    );
};

export default Footer;
