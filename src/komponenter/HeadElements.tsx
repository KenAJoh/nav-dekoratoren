import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'store/reducers';
import MetaTags from 'react-meta-tags';

// Favicons
const fileFavicon = require('ikoner/favicon/favicon.ico');
const fileAppleTouchIcon = require('ikoner/favicon/apple-touch-icon.png');
const fileFavicon16x16 = require('ikoner/favicon/favicon-16x16.png');
const fileFavicon32x32 = require('ikoner/favicon/favicon-32x32.png');
const fileMaskIcon = require('ikoner/favicon/safari-pinned-tab.svg');

export const HeadElements = () => {
    const { XP_BASE_URL } = useSelector((state: AppState) => state.environment);
    return (
        <MetaTags>
            <link
                rel="icon"
                type="image/x-icon"
                href={`${XP_BASE_URL}${fileFavicon}`}
            />
            <link
                rel="icon"
                type="image/png"
                sizes="16x16"
                href={`${XP_BASE_URL}${fileFavicon16x16}`}
            />
            <link
                rel="icon"
                type="image/png"
                sizes="32x32"
                href={`${XP_BASE_URL}${fileFavicon32x32}`}
            />
            <link
                rel="apple-touch-icon"
                sizes="180x180"
                href={`${XP_BASE_URL}${fileAppleTouchIcon}`}
            />
            <link
                rel="mask-icon"
                color="#5bbad5"
                href={`${XP_BASE_URL}${fileMaskIcon}`}
            />
        </MetaTags>
    );
};

export default HeadElements;
