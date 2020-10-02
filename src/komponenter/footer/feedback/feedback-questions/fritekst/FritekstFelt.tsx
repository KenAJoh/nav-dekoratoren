import React, { useEffect, Dispatch } from 'react';
import { Textarea, TextareaProps } from 'nav-frontend-skjema';
import { checkForViolations, getViolationsFormatted } from './Sanitizer';
import { useDebounce } from '../../../../../utils/hooks/useDebounce';
import './FritekstFelt.less';

export const MAX_LENGTH = 1000;

export interface FritekstFeil {
    invalidInput?: string,
    maxLength?: string
}

export const initialFritekstFeil: FritekstFeil = {
    invalidInput: undefined,
    maxLength: undefined
}

export type FritekstFeilAction =
    | {type: 'invalid', message: string | undefined}
    | {type: 'maxLength', message: string | undefined}
    | {type: 'reset'};


export function fritekstFeilReducer(state: FritekstFeil, action: FritekstFeilAction) {
    switch (action.type) {
        case 'invalid':
            return {
                ...state,
                invalidInput: action.message
            };
        case 'maxLength':
            return {
                ...state,
                maxLength: action.message
            };
        case 'reset':
            return {maxLength: undefined, invalidInput: undefined};
        default:
            return state;
    }
}


interface Props extends Partial<TextareaProps> {
    feedbackMessage: string;
    setFeedbackMessage: any;
    errors: FritekstFeil;
    setErrors: Dispatch<FritekstFeilAction>;
    textareaRef?: (textarea: HTMLTextAreaElement | null) => any;
}

const FritekstFelt = (props: Props) => {

    const debouncedInputVerdier = useDebounce(props.feedbackMessage, 500);

    useEffect(() => {
        const violations = checkForViolations(debouncedInputVerdier);
        const formatted = getViolationsFormatted(violations);

        if (violations.length > 0) {
            props.setErrors({ type: 'invalid', message:  `Det ser ut som du har skrevet inn
                ${formatted}. Dette må fjernes før du kan gå videre.` });
        } else {
            props.setErrors({ type: 'invalid', message: undefined});
        }
    }, [debouncedInputVerdier])


    return (
        <Textarea
            value={props.feedbackMessage}
            onChange={(e) => props.setFeedbackMessage(e.target.value)}
            description={props.description}
            label={props.label}
            placeholder="Skriv din tilbakemelding her"
            maxLength={MAX_LENGTH}
            textareaRef={props.textareaRef}
            feil={ (props.errors.invalidInput || props.errors.maxLength) ? (
                    <>
                        { props.errors.invalidInput &&
                            <span> {props.errors.invalidInput}</span>
                        }
                        { props.errors.maxLength &&
                            <span> {props.errors.maxLength}</span>
                        }
                    </>
                ) : null
            }
        />
    );
};

export default FritekstFelt;