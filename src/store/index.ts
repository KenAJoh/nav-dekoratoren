import { compose, createStore as createReduxStore } from 'redux';
import { Environment } from './reducers/environment-duck';
import reducers from './reducers';
import Cookies from 'universal-cookie';
import { Locale } from './reducers/language-duck';
import { MenuValue } from '../utils/meny-storage-utils';

export const createStore = (env?: Environment, cookies?: Cookies) => {
    const composeEnhancers = (
        (typeof window !== 'undefined' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
        compose
    )();

    const paramLanguage = env?.PARAMS.LANGUAGE !== Locale.IKKEBESTEMT && env?.PARAMS.LANGUAGE;
    const paramContext = env?.PARAMS.CONTEXT !== MenuValue.IKKEBESTEMT && env?.PARAMS.CONTEXT;

    const cookieLanguage = cookies?.get('decorator-language');
    const cookieContext = cookies?.get('decorator-context');

    const initialLanguage = paramLanguage || cookieLanguage;
    const initialContext = paramContext || cookieContext || MenuValue.PRIVATPERSON;

    return composeEnhancers(createReduxStore)(reducers, {
        ...(env && {
            environment: env,
        }),
        ...(initialLanguage && {
            language: {
                language: initialLanguage,
            },
        }),
        ...(initialContext && {
            arbeidsflate: {
                status: initialContext,
            },
        }),
    });
};
