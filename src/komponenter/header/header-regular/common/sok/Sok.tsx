import { AppState } from 'store/reducers';
import { useSelector } from 'react-redux';
import React, { useEffect, useState, FocusEvent } from 'react';
import { defaultData, visAlleTreff } from './sok-utils';
import debounce from 'lodash.debounce';
import { GACategory, gaEvent } from 'utils/google-analytics';
import { genererUrl } from 'utils/Environment';
import cls from 'classnames';
import { Language } from 'store/reducers/language-duck';
import { SokInput } from './sok-innhold/SokInput';
import Spinner from '../spinner/Spinner';
import SokResultater from './sok-innhold/SokResultater';
import { EnvironmentState } from 'store/reducers/environment-duck';
import BEMHelper from 'utils/bem';
import './Sok.less';

interface Props {
    id?: string;
    isOpen: boolean;
    dropdownTransitionMs?: number;
}

const mobileCls = BEMHelper('sok');
const stateSelector = (state: AppState) => ({
    environment: state.environment,
    language: state.language.language,
});

const Sok = (props: Props) => {
    const { environment, language } = useSelector(stateSelector);
    const [loading, setLoading] = useState<boolean>(false);
    const [input, setInput] = useState<string>('');
    const [result, setResult] = useState([defaultData]);
    const [focusIndex, setFocusIndex] = useState(-1);
    const [error, setError] = useState<string | undefined>();

    const numberOfResults: number = 5;
    const klassenavn = cls('sok-input', {
        engelsk: language === Language.ENGELSK,
    });

    useEffect(() => {
        if (!props.isOpen) {
            setLoading(false);
            setInput('');
        }
    }, [props.isOpen]);

    const onFocus = (e: FocusEvent<HTMLAnchorElement>) => {
        const index = e.target?.id?.split('-')[1];
        setFocusIndex(parseInt(index, 10) || -1);
    };

    const onKeyDown = (e: any) => {
        let newIndex = focusIndex;
        switch (e.key) {
            case 'ArrowDown':
                if (focusIndex < numberOfResults) {
                    newIndex = focusIndex + 1;
                }
                e.preventDefault();
                break;
            case 'ArrowUp':
                if (focusIndex > 0) {
                    newIndex = focusIndex - 1;
                }
                e.preventDefault();
                break;

            default:
                break;
        }

        if (newIndex !== focusIndex) {
            setFocusIndex(newIndex);
            console.log(result[newIndex].displayName);
            setInput(result[newIndex].displayName);
            document.getElementById(`sokeresultat-${newIndex}`)?.focus();
        }
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        gaEvent({ category: GACategory.Header, label: input, action: 'søk' });
        const { XP_BASE_URL } = environment;
        const url = `${XP_BASE_URL}/sok?ord=${input}`;
        window.location.href = genererUrl(XP_BASE_URL, url);
    };

    return (
        <form
            role="search"
            id={`search-form${props.id ? `-${props.id}` : ''}`}
            onKeyDown={onKeyDown}
            onSubmit={onSubmit}
        >
            <div className="sok-container">
                <div className="sok-input-resultat">
                    <SokInput
                        onChange={(value: string) => {
                            setInput(value);
                            if (value.length > 2) {
                                setLoading(true);
                                fetchSearchDebounced({
                                    value,
                                    environment,
                                    setLoading,
                                    setError,
                                    setResult,
                                });
                            } else {
                                setLoading(false);
                            }
                        }}
                        className={klassenavn}
                        language={language}
                        writtenInput={input}
                        onReset={() => {
                            setLoading(false);
                            setInput('');
                        }}
                        id={props.id}
                    />
                    {loading ? (
                        <Spinner tekstId={'spinner-sok'} />
                    ) : (
                        input.length > 2 && (
                            <SokResultater
                                writtenInput={input}
                                items={result}
                                onFocus={onFocus}
                                focusIndex={focusIndex}
                                numberOfResults={numberOfResults}
                                language={language}
                                fetchError={error}
                            />
                        )
                    )}
                </div>
            </div>
            {props.isOpen && (
                <div className="media-sm-mobil mobil-meny">
                    <div
                        className={mobileCls.element(
                            'bakgrunn',
                            input.length > 2 ? 'active' : ''
                        )}
                    />
                </div>
            )}
        </form>
    );
};

/* Abstraction for debounce */
interface FetchResult {
    value: string;
    environment: EnvironmentState;
    setLoading: (value: boolean) => void;
    setError: (value?: string) => void;
    setResult: (value?: any) => void;
}

const fetchSearch = (props: FetchResult) => {
    const { environment, value } = props;
    const { setLoading, setError, setResult } = props;
    const { APP_BASE_URL, XP_BASE_URL } = environment;
    const url = `${APP_BASE_URL}/api/sok`;

    fetch(`${url}?ord=${value}`)
        .then((response) => {
            if (response.ok) {
                return response;
            } else {
                throw new Error(response.statusText);
            }
        })
        .then((response) => response.json())
        .then((json) => {
            const tmp = [...json.hits];
            tmp.unshift(visAlleTreff(XP_BASE_URL, value));
            setLoading(false);
            setError(undefined);
            setResult(tmp);
        })
        .catch((err) => {
            setLoading(false);
            setError(err);
        });
};

const fetchSearchDebounced = debounce(fetchSearch, 500);
export default Sok;
