import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenypunkter } from 'store/reducers/menu-duck';
import { MenuValue } from 'utils/meny-storage-utils';
import { HeaderSimple } from 'komponenter/header/header-simple/HeaderSimple';
import { HeaderRegular } from 'komponenter/header/header-regular/HeaderRegular';
import { AppState } from 'store/reducers';
import { settArbeidsflate } from 'store/reducers/arbeidsflate-duck';
import { cookieOptions } from 'store/reducers/arbeidsflate-duck';
import { useCookies } from 'react-cookie';
import { Locale, languageDuck } from 'store/reducers/language-duck';
import { HeadElements } from 'komponenter/common/HeadElements';
import { hentVarsler } from 'store/reducers/varselinnboks-duck';
import { hentInnloggingsstatus } from 'store/reducers/innloggingsstatus-duck';
import { fetchDriftsmeldinger } from 'store/reducers/driftsmeldinger-duck';
import { fetchFeatureToggles, Status } from 'api/api';
import { ActionType } from 'store/actions';
import { loadVergic } from 'utils/external-scripts';
import { BrowserSupportMsg } from 'komponenter/header/header-regular/common/browser-support-msg/BrowserSupportMsg';
import { getLoginUrl } from 'utils/login';
import Driftsmeldinger from './common/driftsmeldinger/Driftsmeldinger';
import Brodsmulesti from './common/brodsmulesti/Brodsmulesti';
import { msgSafetyCheck, postMessageToApp } from '../../utils/messages';
import { SprakVelger } from './common/sprakvelger/SprakVelger';
import { validateLanguage, validateLevel } from '../../server/utils';
import { validateBreadcrumbs, validateContext } from '../../server/utils';
import { validateAvailableLanguages } from '../../server/utils';
import { Params, setParams } from '../../store/reducers/environment-duck';
import './Header.less';

export const unleashCacheCookie = 'decorator-unleash-cache';
export const decoratorContextCookie = 'decorator-context';
export const decoratorLanguageCookie = 'decorator-language';

const stateSelector = (state: AppState) => ({
    innloggingsstatus: state.innloggingsstatus,
    arbeidsflate: state.arbeidsflate.status,
    language: state.language.language,
    featureToggles: state.featureToggles,
    environment: state.environment,
});

export const Header = () => {
    const dispatch = useDispatch();
    const [sentAuthToApp, setSentAuthToApp] = useState(false);
    const { environment } = useSelector(stateSelector);
    const { arbeidsflate } = useSelector(stateSelector);
    const { innloggingsstatus } = useSelector(stateSelector);
    const { authenticated } = innloggingsstatus.data;
    const { PARAMS, APP_URL, API_UNLEASH_PROXY_URL } = environment;
    const currentFeatureToggles = useSelector(stateSelector).featureToggles;

    const [availableLanguages, setAvailableLanguages] = useState(
        PARAMS.AVAILABLE_LANGUAGES
    );

    const [breadcrumbs, setBreadcrumbs] = useState(PARAMS.BREADCRUMBS);

    const [cookies, setCookie] = useCookies([
        decoratorLanguageCookie,
        decoratorContextCookie,
        unleashCacheCookie,
    ]);

    // Handle feature toggles
    useEffect(() => {
        if (currentFeatureToggles['dekoratoren.skjermdeling']) {
            loadVergic();
        }
    }, [currentFeatureToggles]);

    // Handle enforced login
    useEffect(() => {
        const { status, data } = innloggingsstatus;
        if (PARAMS.ENFORCE_LOGIN && status === Status.OK) {
            const { authenticated, securityLevel } = data;
            const insufficientPrivileges =
                PARAMS.LEVEL === 'Level4' && securityLevel === '3';

            if (!authenticated || insufficientPrivileges) {
                window.location.href = getLoginUrl(environment, arbeidsflate);
            } else if (!sentAuthToApp) {
                postMessageToApp('auth', data);
                setSentAuthToApp(true);
            }
        }
    }, [PARAMS.ENFORCE_LOGIN, PARAMS.LEVEL, innloggingsstatus]);

    // Handle external data
    useEffect(() => {
        fetchDriftsmeldinger(APP_URL)(dispatch);
        hentInnloggingsstatus(APP_URL)(dispatch);
        fetchMenypunkter(APP_URL)(dispatch);
        if (Object.keys(currentFeatureToggles).length) {
            const togglesFromCookie = cookies[unleashCacheCookie];
            if (togglesFromCookie) {
                dispatch({
                    type: ActionType.SETT_FEATURE_TOGGLES,
                    data: togglesFromCookie,
                });
            } else {
                fetchFeatureToggles(
                    API_UNLEASH_PROXY_URL,
                    currentFeatureToggles
                )
                    .then((updatedFeatureToggles) => {
                        dispatch({
                            type: ActionType.SETT_FEATURE_TOGGLES,
                            data: updatedFeatureToggles,
                        });
                        setCookie(unleashCacheCookie, updatedFeatureToggles, {
                            maxAge: 100,
                            domain: '.nav.no',
                            path: '/',
                        });
                    })
                    .catch((error) => {
                        console.error(
                            `Failed to fetch feature-toggles: ${error}`
                        );
                    });
            }
        }
    }, []);

    // Change context
    useEffect(() => {
        if (PARAMS.CONTEXT !== MenuValue.IKKEBESTEMT) {
            // Use params if defined
            dispatch(settArbeidsflate(PARAMS.CONTEXT));
            setCookie('decorator-context', PARAMS.CONTEXT, cookieOptions);
        } else {
            // Fetch state from cookie OR default to private-person
            const context = cookies['decorator-context'];
            context ? dispatch(settArbeidsflate(context)) : defaultToPerson();
        }
    }, []);

    // Context utils
    const defaultToPerson = () => {
        dispatch(settArbeidsflate(MenuValue.PRIVATPERSON));
        setCookie('decorator-context', MenuValue.PRIVATPERSON, cookieOptions);
    };

    // Fetch notifications
    useEffect(() => {
        if (authenticated) {
            hentVarsler(APP_URL)(dispatch);
        }
    }, [authenticated]);

    // Change language
    const checkUrlForLanguage = () => {
        if (PARAMS.LANGUAGE !== Locale.IKKEBESTEMT) {
            dispatch(languageDuck.actionCreator({ language: PARAMS.LANGUAGE }));
            setCookie(decoratorLanguageCookie, PARAMS.LANGUAGE, cookieOptions);
        } else {
            const language = getLanguageFromUrl();
            dispatch(languageDuck.actionCreator({ language }));
            setCookie(decoratorLanguageCookie, language, cookieOptions);
        }
    };

    useEffect(() => {
        window.addEventListener('popstate', checkUrlForLanguage);
        checkUrlForLanguage();
    }, []);

    // Send ready message to applications
    useEffect(() => {
        const receiveMessage = (msg: MessageEvent) => {
            const { data } = msg;
            const isSafe = msgSafetyCheck(msg);
            const { source, event } = data;
            if (isSafe) {
                if (source === 'decoratorClient' && event === 'ready') {
                    window.postMessage(
                        { source: 'decorator', event: 'ready' },
                        window.location.origin
                    );
                }
            }
        };
        window.addEventListener('message', receiveMessage, false);
        return () => {
            window.removeEventListener('message', receiveMessage, false);
        };
    }, []);

    // Receive available languages from frontend-apps
    useEffect(() => {
        const receiveMessage = (msg: MessageEvent) => {
            const { data } = msg;
            const isSafe = msgSafetyCheck(msg);
            const { source, event, payload } = data;
            if (isSafe) {
                if (source === 'decoratorClient') {
                    if (event === 'availableLanguages') {
                        validateAvailableLanguages(payload);
                        setAvailableLanguages(
                            payload.length > 0 ? payload : undefined
                        );
                    }
                }
            }
        };
        window.addEventListener('message', receiveMessage, false);
        return () => {
            window.removeEventListener('message', receiveMessage, false);
        };
    }, []);

    // Receive breadcrumbs from frontend-apps
    useEffect(() => {
        const receiveMessage = (msg: MessageEvent) => {
            const { data } = msg;
            const isSafe = msgSafetyCheck(msg);
            const { source, event, payload } = data;
            if (isSafe) {
                if (source === 'decoratorClient' && event === 'breadcrumbs') {
                    validateBreadcrumbs(payload);
                    setBreadcrumbs(payload.length > 0 ? payload : undefined);
                }
            }
        };
        window.addEventListener('message', receiveMessage, false);
        return () => {
            window.removeEventListener('message', receiveMessage, false);
        };
    }, []);

    // Receive params from frontend-apps
    useEffect(() => {
        const receiveMessage = (msg: MessageEvent) => {
            const { data } = msg;
            const isSafe = msgSafetyCheck(msg);
            const { source, event, payload } = data;
            if (isSafe) {
                if (source === 'decoratorClient' && event === 'params') {
                    const { simple, context, level, language } = payload;
                    const { availableLanguages, breadcrumbs } = payload;
                    const { enforceLogin, redirectToApp } = payload;
                    const { feedback, chatbot } = payload;
                    if (context) {
                        validateContext(context);
                    }
                    if (level) {
                        validateLevel(level);
                    }
                    if (language) {
                        validateLanguage(language);
                    }
                    if (availableLanguages) {
                        validateAvailableLanguages(availableLanguages);
                        setAvailableLanguages(availableLanguages);
                    }
                    if (breadcrumbs) {
                        validateBreadcrumbs(breadcrumbs);
                        setBreadcrumbs(breadcrumbs);
                    }
                    const params = {
                        ...PARAMS,
                        ...(context && {
                            CONTEXT: context,
                        }),
                        ...(simple !== undefined && {
                            SIMPLE: simple === true,
                        }),
                        ...(enforceLogin !== undefined && {
                            ENFORCE_LOGIN: enforceLogin === true,
                        }),
                        ...(redirectToApp !== undefined && {
                            REDIRECT_TO_APP: redirectToApp === true,
                        }),
                        ...(level && {
                            LEVEL: level,
                        }),
                        ...(language && {
                            LANGUAGE: language,
                        }),
                        ...(availableLanguages && {
                            AVAILABLE_LANGUAGES: availableLanguages,
                        }),
                        ...(breadcrumbs && {
                            BREADCRUMBS: breadcrumbs,
                        }),
                        ...(feedback !== undefined && {
                            FEEDBACK: feedback !== false,
                        }),
                        ...(chatbot !== undefined && {
                            CHATBOT: chatbot === true,
                        }),
                    };
                    console.log(params);
                    dispatch(setParams(params));
                }
            }
        };
        window.addEventListener('message', receiveMessage, false);
        return () => {
            window.removeEventListener('message', receiveMessage, false);
        };
    }, []);

    return (
        <div className={'decorator-wrapper'}>
            <HeadElements />
            <span id={'top-element'} tabIndex={-1} />
            <BrowserSupportMsg />
            <header className="siteheader">
                {PARAMS.SIMPLE || PARAMS.SIMPLE_HEADER ? (
                    <HeaderSimple />
                ) : (
                    <HeaderRegular />
                )}
            </header>
            <Driftsmeldinger />
            {(breadcrumbs || availableLanguages) && (
                // Klassen "decorator-utils-container" brukes av appene til å sette bakgrunn
                <div className={'decorator-utils-container'}>
                    <div className={'decorator-utils-content'}>
                        {breadcrumbs && (
                            <Brodsmulesti breadcrumbs={breadcrumbs} />
                        )}
                        {availableLanguages && (
                            <SprakVelger
                                availableLanguages={availableLanguages}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const getLanguageFromUrl = (): Locale => {
    const locationPath = window.location.pathname;
    if (locationPath.includes('/nb/')) {
        return Locale.BOKMAL;
    }
    if (locationPath.includes('/nn/')) {
        return Locale.NYNORSK;
    }
    if (locationPath.includes('/en/')) {
        return Locale.ENGELSK;
    }
    if (locationPath.includes('/se/')) {
        return Locale.SAMISK;
    }
    return Locale.BOKMAL;
};

export default Header;
