/* jshint esversion: 6 */
import React from 'react';

export const randomBoolean = () => {
    return Math.floor(Math.random() * 2) === 0;
};

export const randomInt = (max) => {
    return Math.floor(Math.random() * (max + 1));
};

export const randomElement = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
};
