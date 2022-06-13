import _ from 'lodash';

let local_currency_formatter = new Intl.NumberFormat(undefined, {  // use browser locale
    style: 'currency',
    currency: 'CLP'
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

let local_formatter = new Intl.NumberFormat(undefined, {  // use browser locale
});

// considers that money values are stored as cents (integer) in the db
export function toCurrencyFormat(integer) {
    return local_currency_formatter.format(_.divide(integer, 100));
};

// considers that money values are stored as cents (integer) in the db
function toNumberFormat(integer) {
    return local_formatter.format(_.divide(integer, 100));
};

// TODO handle text with decimal values -> handle , and . differences across locales 
// will return money value in cents (integer)
function toInteger(text) {
    // remove all non digit characters
    let clean = text.replace(/\D/g, '');
    return _.toSafeInteger(_.multiply(clean, 100));
    
}