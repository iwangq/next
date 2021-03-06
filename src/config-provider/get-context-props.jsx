/**
 *
 * @param {Object|Boolean} input
 * @returns {Object} typeof obj.open === 'boolean'
 */
const parseBoundary = input => {
    let obj;
    if (input === undefined || input === null) {
        return {};
    } else if (typeof input === 'boolean') {
        obj = { open: input };
    } else {
        obj = { open: true, ...input };
    }

    return obj;
};

export default function getContextProps(props, context, displayName) {
    const { prefix, locale, pure, rtl, errorBoundary } = props;
    const {
        nextPrefix,
        nextLocale,
        nextPure,
        nextWarning,
        nextRtl,
        nextErrorBoundary,
    } = context;

    const newPrefix = prefix || nextPrefix;

    let localeFromContext;
    if (nextLocale) {
        localeFromContext = nextLocale[displayName];
        if (localeFromContext) {
            localeFromContext.momentLocale = nextLocale.momentLocale;
        }
    }
    let newLocale;
    if (locale) {
        newLocale = { ...(localeFromContext || {}), ...locale };
    } else if (localeFromContext) {
        newLocale = localeFromContext;
    }

    const newPure = typeof pure === 'boolean' ? pure : nextPure;
    const newRtl = typeof rtl === 'boolean' ? rtl : nextRtl;

    // ProtoType of [nextE|e]rrorBoundary can be one of [boolean, object]
    // but typeof newErrorBoundary === 'object'
    // newErrorBoundary should always have the key 'open', which indicates ErrorBoundary on or off
    const newErrorBoundary = {
        ...parseBoundary(nextErrorBoundary),
        ...parseBoundary(errorBoundary),
    };

    if (!('open' in newErrorBoundary)) {
        newErrorBoundary.open = false;
    }

    return {
        prefix: newPrefix,
        locale: newLocale,
        pure: newPure,
        rtl: newRtl,
        warning: nextWarning,
        errorBoundary: newErrorBoundary,
    };
}
