import React from 'react';
import Tekst from 'tekster/finn-tekst';
import { GACategory } from 'utils/google-analytics';
import { LenkeMedGA } from 'komponenter/common/LenkeMedGA';
import { getArbeidsflateContext } from 'komponenter/header/header-regular/common/arbeidsflate-lenker';
import { MenuValue } from 'utils/meny-storage-utils';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'store/reducers';
import { settArbeidsflate } from 'store/reducers/arbeidsflate-duck';
import { cookieOptions } from 'store/reducers/arbeidsflate-duck';
import { erNavDekoratoren } from 'utils/Environment';
import { useCookies } from 'react-cookie';
import './NavLogoRod.less';

const NavLogoRod = ({
    width,
    height,
    classname,
    id,
}: {
    width?: string;
    height?: string;
    classname?: string;
    id?: string;
}) => {
    const dispatch = useDispatch();
    const [, setCookie] = useCookies(['decorator-context']);
    const { XP_BASE_URL } = useSelector((state: AppState) => state.environment);
    const context = getArbeidsflateContext(XP_BASE_URL, MenuValue.PRIVATPERSON);
    const arbeidsflate = useSelector(
        (state: AppState) => state.arbeidsflate.status
    );

    return (
        <LenkeMedGA
            href={context.url}
            classNameOverride={classname}
            id={id}
            gaEventArgs={{
                context: arbeidsflate,
                category: GACategory.Header,
                action: 'navlogo',
            }}
            onClick={(event) => {
                event.preventDefault();
                setCookie('decorator-context', context.key, cookieOptions);
                if (erNavDekoratoren()) {
                    dispatch(settArbeidsflate(context.key));
                } else {
                    window.location.href = context.url;
                }
            }}
        >
            <svg
                width={width}
                height={height}
                viewBox="0 0 269 169"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
            >
                <title>
                    <Tekst id="logo-title" />
                </title>
                <desc>Gå til forsiden</desc>
                <defs>
                    <polygon
                        id="path-1"
                        points="22.407 43.4168 22.407 0.6878 0.5635 0.6878 0.5635 43.4168 22.407 43.4168"
                    />
                </defs>
                <g
                    id="Modul-forslag"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                >
                    <g id="NAV-logo-/-rød">
                        <g id="Page-1-Copy">
                            <path
                                d="M125.3091,168.942 C78.6681,168.942 40.8491,131.125 40.8491,84.477 C40.8491,37.824 78.6681,0 125.3091,0 C171.9671,0
                                209.7901,37.824 209.7901,84.477 C209.7901,131.125 171.9671,168.942 125.3091,168.942 Z"
                                id="Fill-1"
                                fill="#C30000"
                            />
                            <polygon
                                id="Fill-3"
                                fill="#C30000"
                                points="0 121.3588 17.265 78.6298 33.854 78.6298 16.611 121.3588"
                            />
                            <polygon
                                id="Fill-5"
                                fill="#C30000"
                                points="213.044 121.3588 230.088 78.6298 239.132 78.6298 222.089 121.3588"
                            />
                            <g
                                id="Group-9"
                                transform="translate(246.000000, 77.942000)"
                            >
                                <mask id="mask-2" fill="white">
                                    <use xlinkHref="#path-1" />
                                </mask>
                                <g id="Clip-8" />
                                <polygon
                                    id="Fill-7"
                                    fill="#C30000"
                                    mask="url(#mask-2)"
                                    points="0.5635 43.4168 17.6045 0.6878 22.4075 0.6878 5.3645 43.4168"
                                />
                            </g>
                            <path
                                d="M197.3604,78.6298 L182.3444,78.6298 C182.3444,78.6298 181.3094,78.6298 180.9434,79.5438 L172.6334,104.9828
                                L164.3304,79.5438 C163.9644,78.6298 162.9234,78.6298 162.9234,78.6298 L134.0514,78.6298 C133.4264,78.6298
                                132.9024,79.1518 132.9024,79.7728 L132.9024,88.4118 C132.9024,81.5588 125.6104,78.6298 121.3404,78.6298
                                C111.7784,78.6298 105.3774,84.9278 103.3844,94.5028 C103.2764,88.1508
                                102.7484,85.8748 101.0374,83.5438 C100.2514,82.4018 99.1154,81.4418 97.8784,80.6478 C95.3314,79.1558 93.0444,78.6298
                                88.1294,78.6298 L82.3584,78.6298 C82.3584,78.6298 81.3154,78.6298 80.9474,79.5438 L75.6964,92.5568 L75.6964,79.7728
                                C75.6964,79.1518 75.1764,78.6298 74.5524,78.6298 L61.1984,78.6298 C61.1984,78.6298 60.1674,78.6298 59.7924,79.5438
                                L54.3334,93.0748 C54.3334,93.0748 53.7884,94.4278 55.0344,94.4278 L60.1674,94.4278 L60.1674,120.2118
                                C60.1674,120.8518
                                60.6714,121.3588 61.3144,121.3588 L74.5524,121.3588 C75.1764,121.3588 75.6964,120.8518 75.6964,120.2118
                                L75.6964,94.4278 L80.8564,94.4278 C83.8174,94.4278 84.4444,94.5088 85.5964,95.0458 C86.2904,95.3078 86.9154,95.8378
                                87.2564,96.4488 C87.9544,97.7628 88.1294,99.3408 88.1294,103.9938 L88.1294,120.2118 C88.1294,120.8518 88.6434,121.3588
                                89.2784,121.3588 L101.9664,121.3588 C101.9664,121.3588 103.4004,121.3588 103.9674,119.9428 L106.7794,112.9928
                                C110.5184,118.2298 116.6724,121.3588 124.3204,121.3588 L125.9914,121.3588 C125.9914,121.3588 127.4344,121.3588
                                128.0054,119.9428 L132.9024,107.8148 L132.9024,120.2118 C132.9024,120.8518 133.4264,121.3588 134.0514,121.3588
                                L147.0034,121.3588 C147.0034,121.3588 148.4324,121.3588 149.0064,119.9428 C149.0064,119.9428 154.1864,107.0818
                                154.2064,106.9848 L154.2144,106.9848 C154.4134,105.9148 153.0614,105.9148 153.0614,105.9148 L148.4384,105.9148
                                L148.4384,83.8468 L162.9834,119.9428 C163.5514,121.3588 164.9834,121.3588 164.9834,121.3588 L180.2844,121.3588
                                C180.2844,121.3588 181.7244,121.3588 182.2924,119.9428 L198.4174,80.0138 C198.9754,78.6298 197.3604,78.6298
                                197.3604,78.6298 L197.3604,78.6298 Z M132.9024,105.9148 L124.2024,105.9148 C120.7394,105.9148 117.9224,103.1108
                                117.9224,99.6438 C117.9224,96.1828 120.7394,93.3608 124.2024,93.3608 L126.6354,93.3608 C130.0894,93.3608
                                132.9024,96.1828 132.9024,99.6438 L132.9024,105.9148 Z"
                                id="Fill-10"
                                fill="#FEFEFE"
                            />
                        </g>
                    </g>
                </g>
            </svg>
        </LenkeMedGA>
    );
};

export default NavLogoRod;
