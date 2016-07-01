import React    from 'react'
import currency from './currency'

var buildPromoLink, exports, pocketsImage, pocketsUrl;


exports = {};

pocketsUrl = null;

pocketsImage = null;

buildPromoLink = function() {
    var href, isChrome, isMobile;
    let browserType = getBrowserType();
    isChrome = (browserType == 'chrome');
    if (!isChrome) {
        return null;
    }
    isMobile = (browserType == 'android' || browserType == 'ios');
    if (isMobile) {
        return null;
    }
    href = "http://pockets.tokenly.com";
    return React.createElement('a', {
        href: href,
        target: '_blank',
        className: 'pocketsLink',
        title: "Learn More About Tokenly Pockets"
    }, [
        React.createElement('img', {
            src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJgAAAA4CAYAAAAB3jHPAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1RTRDMDJGRDQ2OTMxMUU1OEM0Q0NBMTRGODgxNDM1NSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1RTRDMDJGRTQ2OTMxMUU1OEM0Q0NBMTRGODgxNDM1NSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjVFNEMwMkZCNDY5MzExRTU4QzRDQ0ExNEY4ODE0MzU1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjVFNEMwMkZDNDY5MzExRTU4QzRDQ0ExNEY4ODE0MzU1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+YGmEtQAAFUVJREFUeNrsXVlsXNd5/u/sC2eGHO6buEikJEhytCbxUi+BHPQhSFGjeUhTFGkLtBDaAn1qi25AE/elQIEWCFoEKAIVTduHIA4axEBRt3asqrZl2Vog2xIliqREkeLOGQ5n3/p/Z3iGZy7vzB0OyXCYzg8czsy9Z7v3fPf7l3Puofbc5Vukk3ZOlzi9yukUpwA1pCHlJczpDqe3OH2H04p60qbL/Cuc/n4DZA1pSDUCAnphI/0ep9/h9CN50qJk/BdOP2iAqyE7EGDnDU7/qAfYX3D61cb9acguyW9tYEqoyCFOf1ou58DcKmU1xqHGP/L8wV/zucInfkvJ5/N8TKNcLk8WTRPncFp8zW98qr+L5RjlXFeW67TyJ8ojD/6Idjba3Swgv+c38hTaxScOpQNumnc7G0O8/wJMXQbAfpuTo1yumasPye2yUQbAsVlpcjpEzxzroPGHS9Tb10zRSIJiiSwN9gfo1mdzdP5UD925v0i+Jid1trhoYjpMwwNBejy9St3dflpYWqdmBkE6laVkIk2dXX4ae7BIp0900e27C3S4z09rfG5+LkKnjnfSA26nh/OsRZNMtxo5nTaKrMWprcNH009CNDLYSvceLdNhrnt+KUbW4VaiLx5pDO/+CzB1CQD7xYoWXKuXAj4n5TM5sjqsNLcco8FDLTS/uE7dPQFaW7HRaiRFA4eCNDa5QkNDQZqcWaMWLtfX7aPFUIL6GXzhtQT19jZTOpulzvYmijMoY7EUn2um6ZkwDQ610DgDpq87QAvxNIMoSUMMzKcLaMdPjhUGDzOWy2snm1XjugIUCifo0EALTS9HqZt/R/khSDvtlDnAo5Lj646/eVd8Or/QT47TPWXzxt96QJmJFbINB8n96kg9Xs6r2nOXb4UqhSKcP75FcQbC05kQORhgLh7A9WiK3B47M1CGrDaLGPg4f/cxENeY0Zq8DsoyIJOcPMw4cWYqp8tOqWSG7FxHNpNl7aaRhXUijnk4fySSZNZziHpQn4PLra8nyeNxUDKVYVAVzMVcjoHOTIpyLred4gxGB/fB43NRGwM3xQBNnxmoeNUYFAyOKlYGKAbU2u7d1xFR+4b+2I93MODuUXYxWgI4ADD6b7eK+SoBcT9DGBazONfQoWYaYFUIE8dmZ8Jje8fOgw+A2B02svLAW3iAna5CxAMqDDYRDCuoVs1ayGdBOQaXlX+jHpvdyscs4hzqEuXYsHMxEBlh4pjDtVGO8wogi2QjOwNM1oly6WyeelmNjg63CVvQnCUSW45lmUUxkPnk/vIf2AhgkQmAA7jEQ6CAH/0tPhz7/FBUUoA2sxzjE8uUSueondkBAxtlNmoLuikaSzNT2SjLg5tlVgn4XRRhxulo81KEGc/jsTEo85RieyrI9hiYqYkZKp3OMhtZxTkY9E4GHepq53JgRrThdzgpGuVjQT7G57xcLsNsyLATgI5xH4JBD7NXirxep6hzcSVKa9yuNthmzhJP1goutN/JA9oqBhADBnBlWb1jkPE9cWVSDLA6kK6LI5RmWzF1a1aU9379dAmbQFWhvJTktWmRF2U9r50U33FM/1vjB6Xpm+dEm6i/AJr+IrggsZ/cE5/IZ3Tc9eKQYLx6EotZhtHRduphO+nIkTY6fbaXb4SdXnrxCPmb3XT2wiE6MtJK7ayWXn75CGkMlosXR8nX7KEzz/TQkWOd5A646PkXhinINtk5zt/RFaATp7rpMNfbx8z43PPDZGfWevXiUXKx8d/N9t2LfMzKx1750ggFWriuM300wEAY4vS5071kcTvoxV8YJl/AQ+c/PyDssK6+FnrmZFd1DLYULVGLNnYspGhOqwBX7I1PSsAlWIMHNc8mAPIIPzaZFZ8ARKGsrQRcRiLz6n/LcpKZLG3eLUwl20DSH5dgrjcxZbB77BGmmCEcrLIW2bDXMhm6cXOGYuspund3nr3BDCWZ4W7cmGZHIE/XPnxMMban7o8vUZqZLcmsdPv2LBvtCbrL+aNcLs4eYSabY1ssL2yoDNeBckk+t8xMdZM/c3zso48es5cap7GxBbbDsiI6scheaJ7P3bw1wyyXpLufzlEikWLDXqOlxQjZhiozmGQqObjqgIORADqwCFhJgpC4PYALA4vf8hzqQcowy0OM2EOCEQK2kmWlvSV/oyy+F9tlBiv5ze3iGOrTH1evCwn9PDAAO8LsEF1P03vXpljFOclht9DDiaViuACGOuJeq8vrbHM56P6DRXYEbDTDTzpMMRjkU5PL7CDYKBSKCRUYXs0JGwu22jIDBg6AKMc2V4rV3tJCRNhv4+OynaSw3fJUiJM52Sab4EF18s1+wsCFGj5xrIOZLEifJrKVAaaolhIqZ3BB/cmBl6wClSfVn2QV5JUiwYhBdZzurpq9UAaAk+0APHqwqyzlPNNdBJOaD8dRF/JKdjtQDLawEqcU7Cf29DDYUEEe9iChiQAMKR67QxzzegufTuum9nVxfqDDZS3kh7Fe7IDdIs55vYU6gUoPH8N3j0FdxfY2+uBysaPA9YWYKdNPQqS1+7dlf0m2MFJtOA5ASraQqlQCTQUjGMhocC1sm6rARh7JNNnFApNKD1DNAzBlF2c361Ha1OdLP5zckufgAIxZJ8cq0G61FO0bIzNHRuuJNj9LdUWFRgzKqXWVa09+ZsFqzHABvuHzlN+W/VVJCjbNtIHaswmASuDhe7m6NF/prAIMcbCeVNMApvQC9faXKuuXPxafcCrK2WmqLXlgAPYCG9Vhtqne/uk4Bdhgr2RDx9jjS2WyRPld6h1CIYhxuR1UtlIGYI49WafHQc0dPpqPZ6qyvyq59hh0qb70QVAVZAzBImjKScFuKrAWQA2m1K49Fr/1wJROgwRKQSWWAhzlVEbV220HDmA/fe+RCCkgiFoJXAgjvPjcAJ1nuhfzgjvGVsHm+uSzOfrvq4+E7acZUSNngn03v7BOyysxch8vbwdpPldRHVXy9jDoBW8yW6IqAYjId69tyStto7JzJmyboS7pBOATvwXYFLUqz6uqGzbgpkq0ij5sXkOrOCZ/m/VjPwSR/IpoOD02Q2vMYFevPCR/wG0YBoDhjemb733nl+lzJ7p3tYMf356hb/7uD7kNTRj1+uaBuRjbX2eYaY8e76J3p0OUPTu4JzdLxqzUoGidTtEcHAYbu7cgApkuYVTnK2mzgtdotexqB0WAVStvwKFLbred7rGx/dnkKrXx05zdq6Chf5MByzkGDdkmwLzNbkqwXZObi5jmzuf35yLS7IT0dLqpvcNPT7N7eLMYUA1Q7XIkP+h1kN9tE4FRTauobcWc4W6LqDNf0Q8Q86RuztfstTdG9KAx2L2JZQZXXgQ+Kxr5DMCx8WVq8roMbLScWInR3uoVsbQSuyaVpbmFiJjTNFKFDydXxFo0q8VSNlxhZwcAy4iWIilyjTZWfB8ogJ091UVr7AZffW+K/H6XoR1m2VjJ+vrfvEtet30Lw4TXUzQy2EKv/8lFOn6sdDpl+skq/f4fv0krqwmy2Sx6B1FMJSH6jzbKMViSXfeRw21ivvTD5XhjVA8SwG7emWN2yQngVDLyAYBEIi3WdekBsMoADTQ5CzEyvf2UzdICu+GYMXDYLAYq0iLYr1zTItLPrPhkNswsFiXnSGfZPv7tl4fpQrev7Pl/v79M3/9kgWaZCY0EZb86GqQvDTaXHH97KiTKjVUAN8qgrL59tPnX7z8R37/90kCxbtT3Dx8/Leb73ldG6WirW3y//jRCf/CfE1Vdk+wf2viPr580BQSu/Wtv3C3+Rpu/drJjyzWjb+h7JJXdGcCOH+2g6HqSPrz+2DQWBnsJYNADDOoTy3eMWAjzmJj2acJiRAOAoT0z5yGVytDQYJAGB1rpdjRV89P2S6Ot4kb+5k/ubwEZbjQGsxx4ZDkjkGGALp3rLgtaKT5lYtyn3EfkkeCCfDS7vq3rQr1q3dUK2gSwjQTXg/v1Z+9OVXywTAE29XhVrJ8vzEOad6qcnVSprDxfqxcKYC+vxijB3qSlJ1BVmAI3BU+2BIgcQAwsACFZRcrrLw1uYR4JSjWP+vRDenyOLeBCu2j/fE8T9TaZv6DyymBpAPXtRyHTayphJTZR8MCojIh+o2+VypldM8rju/5ebQtgWEAYj6Xp6UxYRMzz+xWLqOBFIlbm9zqpq9tPk1V27x47BVBDUh2p6gk3DYMh6R/H5WBI9SDLYuAkgJAHbAMVpg6kKhgMOVCyjorsw4BX6wAQyqlw9ZqMRD0HcMtrMiqnv2a13/gE+HC+XF+qDlOssXqMsKEtlsvUF7aK7AfVG2M1uRyOm4RSyss7j0oX8B1r9ZSoCikAnToYejsEA6dXu1IAPDlI21Hbqvz4/srP5L6q1wyGU/uN32Dq5//ptulDYgowrKKwWeQ7jfWHsAKgNPGiiHMHswjXZyNbVJvRzdbnA7jUYz1NpeVUW2q7tpMeYBhYlR33UtR+g+H2LNCKtfZYaIi3hOqVwRBnc7vsYp1+rX0EUFQmUm+waicZGbSwcYp5leU5vbqlOtsFB9StCvTtst9ORG3X57DuHcBufDpPYxMrwtOrV8GLI9Nza3Tl+nThjaYaJZLMmt5sI7dcLafmVdmsHDgrCcIaartGhvheiWpbXejx1QwyU4C99MUBOnuyW6yo0DSt7sCFLmGudGQwSF/98ijlmc32SlVUYj+z/GbGsBGo1djT9+8smMac9gpguKZvvzywNwC7c2eWxscXNpZC15+ORJfw/uTM7Bp98MGUeLdyN9SCUWxqu0Axqm876rGa0MReib499EcN9lYrpmGKrv5mEaZYnI+Sp8lSf3YYwhTpHAWa3dTZE6DHNXZQzzy7zRYz68naB7tCaELvEOi9TpT983cf1cRgCMeoMTwZeFXDNDtmMFs2R1ZOeQvVp4hNdfJkyee4r9nKa/8rMUaPb0tMaTeZcCeiD6Fs68Fx1m6gA0RGQALoALRqzAdTBptgzwcepMtuqUsvUoRSbFZaZhsxnAqRc7ht2+XxZF46213CXmM7mDTfrr1lCtim6gBrFJFXPdxaBGyF8ApsMBVQuGd/+GyfKTuaAuzzz7CBH07QO1dCFAjUZyQ/kczQse52Gh3toKtz1cWajNSJalDXk6Cf1agks0h+rYLwytd+eFcASnU88B3sWsm7NVV8Vz54TDc+mRP7fdWrke9222h8aoXe/K+xsst6qhW5omI31J9qx1Uz51iOBeWc334KrgVspc5nQl4ZCOyMwZ690CferP6f/50QQdd6w5gMU5w43E6HR9roepk3t6tRJ/Cc9OqtGnVXzhZR42PbtYXAGhdoM9CKCfifZaC1kl2G6TDp5apTajUBDPtCYHcdj8tRt5F8bAs1vxARuyBqfS1VlduOOsHTK0FkZtiqgNTHx5C2452if1BLksX0E+n7Je9MhYsAM2N0UxWJTd2am93izaJ6FSy3xnRWT08z7cUzUBJ0NGAiNTakhiP07Ldd7xKMpdbxjVP1sRx8O06MKcCwFCaXLWzMW2sgHyxjZdvI7dpKmFgpW9zot0YVidAEQIadfvZirmFGWaVrtHpUnXNUb74+1GG28rQcyNTytdRRq2MBtVzO664WbKYAi7F9E8dr7tjJOV/b8GGDk0g0TfceLAlVNjMbLixx5u937s5TAsDYAXhxEel0htajyT252WrIAjdXv9Ki3A3XhztqMdT1y4H0iw/3QgBiqGbEu6SKVkVdkmQWLzRfcMhGHPZdfcRM5nRtf9Wp2CWHWSoUjtPfffd96upoEmyDarDefubpmgBxrS/sitfWcnmxl2tfT4DuJnZflcPuuUSbcTLcdLmK84+e7d/iKJT8ZkdCAhDAxMJGlAVoMJBQuZXcfLH+7M5CMaIuQxa7HWsrcVoUM0CufIX3iIcF166yqNn6NFOAzS6ukw3swoOIlzoK6+axga9WduebLTSJfFzs4dQqfXZ/qaBuafOFDY9Uk1UCSuyow4DHHq8JsZlJnsLRFN1gNvQcbt8TBgMIZAwIN/gHrx03tZnkMXV5sly/r4LXbJUEQKtO2Rgt6a4U21NfEqlG0J/z3U3FuoRq/orPMJ+Z02FKG3mxdbiLBo+0ieRkMDiwRwSzEHYrhH2mxscM9ycRpzWxi3Rb0EOtLR4Kcmrl703eyuBSzwFUcQZShh0ONzNWnpF79EQXdfQFqKPDy321UJYfgr0QDGilm4lz+hiRZCC8GLETxkFZ1RbTv+GzV9drdD0quKqZ4zTd/KTp2kNaZ3sJVAdbzO52UCeruenHq9TFHubc0xAleNDFhjr8By/JOndplz14rtipp7D1eV54s35W2ausbvsHgvSIGdHlsBQAx/3S2prINtxG6x3GdopYZ74x7YIplFrWV+nf8JHgqmZqSW3fqKx6Xr96VSzfGWguCWFI1jILnQDk+hiaWs7sXuiN/WqvtyqAWeMp0ngAPRke7JUo5VajlJpbo9BqjHr7WmhycolOnj1EK7MhWo+lyM0qFP+lA2yDve6x2hTbnOP1tLLqdEPt5bgN2GLYfx+vvwWY4XJWq9iSs4UZaoJvEna4XuW2sfO0u9NP+RYvWRlYESzTwUu/Dm7TUn/r1v6/CqgGU/VlXZMsNn/jBxYbT1qavWJDXNuJHHUwmHLMJL0uG80/CVGEwYddopv8Lgqn8nTieCd9eusJWdmQzzBIscWShvX9Nmthf1YN25gjvJAV/0UEu/d4WW0mGFznzh+iKa7TyV4rdq6emwkJJmsbCpK1w0dt3I+o3UpRMCWfz1ksjZGsTwkDYOOczlWTWzAD/mMHf095nKQFvaT1B8nB9NMZTVJuaZ3iC2tkZ/BMPpgXNlL/QCutMfjavQ6ysIpdmo+IF3Fpw4sMBv3kDDbR8swqDY220+2bMzQzuSzAp3WyyusMUP8XBinpclAcQGI2zFsbgDogMg6AvVUtwLYY79iQhG0g/N+MhJONdTDcUDthA0gtHCM/p1W21dbWEuRhUCEQevhkN2n86WPGmo+mKczqNL4UYWLM0Vw4Sf3PHyZilWdlACcAJOwN21B5B1Xegg12iL/gn+M4drt2TRhWbPQzuByxJKWfhtl+C1OcWQyQcbZ5ydnTQvZuv2DExIb6bADq50Kg6IbBYI85/RWnv9ztFhDiwP8dAhMl2PgmMNzxniKSoSjjG6lYpjEwPy8CTM1IY+ZbnP65cU8asktyeQNTJYHWX+f0DU6LjfvTkBoF2HmN02/IA3p37F85ndhA3/s67dWQhhhJfAMr39rAzo/Uk/8nwABA3krbh42EvgAAAABJRU5ErkJggg==',
        })
    ]);
};

exports.buildPaymentButton = function(address, label, amount, acceptedTokens) {
    let browserType = getBrowserType();
    let isChrome = (browserType == 'chrome');
    if (!isChrome) {
        return null;
    }

    var encodedLabel, urlAttributes;
    if (amount == null) {
        amount = null;
    }
    if (acceptedTokens == null) {
        acceptedTokens = 'btc';
    }
    if (!pocketsUrl) {
        return buildPromoLink();
    }
    encodedLabel = encodeURIComponent(label).replace(/[!'()*]/g, escape);
    urlAttributes = "?address=" + address + "&label=" + encodedLabel + "&tokens=" + acceptedTokens;
    if (amount != null) {
        urlAttributes += '&amount=' + currency.formatCurrencyAsNumber(amount);
    }
    return React.createElement('a', {
        href: pocketsUrl + urlAttributes,
        target: '_blank',
        className: 'btn-pockets',
        title: "Pay Using Tokenly Pockets"
    }, [
        React.createElement('img', {
            src: pocketsImage,
        })
    ]);
};

exports.exists = function() {
    return pocketsUrl != null;
};

(function() {
    var attempts, maxAttempts, tryToLoadURL;
    maxAttempts = 10;
    attempts = 0;

    tryToLoadURL = function() {
        var timeoutRef;
        ++attempts;

        pocketsUrl = '';
        if (document.getElementsByClassName('pockets-url')[0]) {
            pocketsUrl = document.getElementsByClassName('pockets-url')[0].textContent;
        }
        if (pocketsUrl === '') {
            pocketsUrl = null;
            if (attempts > maxAttempts) {
                return;
            }
            timeoutRef = setTimeout(tryToLoadURL, 250);
            return;
        }
        if (document.getElementsByClassName('pockets-image')[0]) {
            pocketsImage = document.getElementsByClassName('pockets-image')[0].textContent;
            return;
        }
    };

    tryToLoadURL();

})();

exports.appendPocketsMarkupToPage = function() {
    if (document == null) { return; }
    var scripts = document.getElementsByTagName('script');
    var runningScript = scripts[scripts.length - 1];
    if (runningScript == null) { return; }
    var parentDiv = runningScript.parentNode;
    if (parentDiv == null) { return; }

    var pocketsUrlNode = document.createElement("span");
    pocketsUrlNode.className = 'pockets-url';
    pocketsUrlNode.setAttribute("style", "display: none"); 
    parentDiv.insertBefore(pocketsUrlNode, runningScript);

    var pocketsImageNode = document.createElement("span");
    pocketsImageNode.className = 'pockets-image';
    pocketsImageNode.setAttribute("style", "display: none"); 
    parentDiv.insertBefore(pocketsImageNode, runningScript);
}

function getBrowserType() {
    if (navigator.userAgent.match(/(android)/i)) {
        return 'android';
    }
    if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)/i) && !window.MSStream) {
        return 'ios';
    }
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        return 'chrome';
    }
    return 'other';
};


module.exports = exports;
