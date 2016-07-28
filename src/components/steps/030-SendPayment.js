import React                  from 'react'
import currency               from '../../lib/util/currency'
import pockets                from '../../lib/util/pockets'
import indiesquare            from '../../lib/util/indiesquare'
import qrCode                 from 'qrcode-npm';
import SwapbotEmbedFooterLink from '../includes/SwapbotEmbedFooterLink'
import ShowMatchedSwaps       from '../includes/ShowMatchedSwaps'

const SendPaymentComponent = ({desiredSwap, QRModalActive, bot, showQRModal, hideQRModal, goBack}) => {
    let paymentButtonLabel = `Swapbot ${bot.name} for ${currency.formatCurrency(desiredSwap.out.quantity, desiredSwap.out.token)}`;

    return <div className="swapbot-embed">
        <div className="progress-bar">
            <div className="progress" data-progress="75%" style={ {width: '75%'} }></div>
        </div>
        <div className="embed-content">
            <div className="heading">
                Review & Redeem
            </div>
            <p className="review-text">
                <span> You are purchasing </span>
                <span className="token-text">
                    {currency.formatCurrency(desiredSwap.out.quantity, desiredSwap.out.token)}
                </span> 
                <br/>
                <span> and paying with </span>
                <span className="token-text">
                    {currency.formatCurrency(desiredSwap.in.quantity, desiredSwap.in.token)}
                </span>
            </p>

            <p className="redeem-text">
                To begin this swap send 
                <span className="token-text"> {currency.formatCurrency(desiredSwap.in.quantity, desiredSwap.in.token)}</span>
                <span> to </span>
                <span className="token-text">{bot.address}</span>.
            </p>
            <div className="buttons-container buttons-pay-container">
                { pockets.buildPaymentButton(bot.address, paymentButtonLabel, desiredSwap.in.quantity, desiredSwap.in.token) }
                { indiesquare.buildPaymentButton(bot.address, paymentButtonLabel, desiredSwap.in.quantity, desiredSwap.in.token) }
                <div className="button-divider">or</div>
                <button className="btn-qrcode" onClick={ showQRModal }><i className="icon-qrcode"></i></button>
            </div>
        </div>

        <ShowMatchedSwaps />

        <div className="embed-footer">
            <a onClick={() => { goBack(); }} className="btn-back">Go Back</a>
            <SwapbotEmbedFooterLink />
        </div>

        { (QRModalActive) ? 
            <div>
                <div className="remodal-overlay remodal-is-opened"></div>
                <div className="remodal-wrapper remodal-is-opened">
                    <div className="remodal remodal-is-initialized remodal-is-opened" aria-labelledby="modalTitle" aria-describedby="modalDesc" tabIndex="-1">
                        <button onClick={hideQRModal} className="remodal-close" aria-label="Close"></button>
                        <div>
                            <div className="qrCodeTitle">

                                <div className="indiesquare-img">
                                    <img alt="Indie Square Wallet Logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHkAAAB5CAYAAAAd+o5JAAAU7klEQVR4nO2de5QcZZmHf+9XVV19m8l1riEaAhM4BEFNIICArUmmZ4iBZHoqrCDsHl0jXliBdUXxqIVGl4MHFxQXjXsUQYRNzySRyE4mCaa5bZR1PCCGRSAJkqQvM7mQmb531ffuHz09TMLMJJmdkJiq55+kp77LW/VUffVdqrsAl9MeOtkBTDTxsLGfgOB481OxeGX91l//fiJjOtmoJzuAiYYYHhLwjDu/EGIi4zkVOO12yOWduJIdwLib60Rz5F+Yacnx5CnmBz4+65nuxHjrdBkf45ZMjHNIoQ8fXx7VN976XMaP21w7AFeyA3AlOwBXsgM47SZDThfWAMrxpF8BSAA80jZX8inInkVtS1RV+c3x5Emw/aWG7rX3jLTNba4dgCvZAbiSHYAr2QG4kh3Au9q71v2+mxPhyMETWsmIgwhnM27JtsWPA9beY65I0AIWyi10gh9GKfX3N5Eu8uPNf6ivq3ci4zkVGLfkGVvXPg7g8WNNHw+33SKA8HjrO1b69T3JubHt6RNdz98S7j3ZAbiSHYAr2QG4kh2Au0AxQextbrsZENMmoiwhbf9ElFPBlTxBENHNgqhpQspiscnm4pXHk8cuDewcbZsr+RRECio1dv/6mYkqz70nOwBXsgNwJTsAV7IDcCU7AFeyA3AlOwBXsgNwJTsAV7IDcCU7AFeyA3AlOwBXsgNwJTsAV7IDcCU7gNPuyZCp+pzPx5vnFN/tegk8cReMhC/evPzW8Wbvz/T+x7nPPTdQ+Tym5Ncva64VPntCvtdCEp7j+4GEcdZD6l10En4WlqX9xkR9A4iFrBKkfn+8+TXydQI4NsnBYFUSQkxM6JLvfXpj9IS2HFc2t3VAKMtOZB1j8D2WVmZCSmJlBhRcNCFl4V1urlcA9oksP3kiCz8KVr64eebTv3ltIsras6htiZjAZs/teDkAV7IDcCU7AFeyA3AlOwBXsgNwJTsAV7IDcCU7AFeyA3AlOwBXsgNwJTuA0+6hgdMBG3xIk+gZb36hWoc9NOFKPgV575Z1zwKYP1Hluc21A3AlOwBXsgNwJTuAMTteNtHvBCbmaU0memMiynE5fsaUPKO747J3KxCXE4fbXDsAV7IDcCU7AFeyA3AlOwBXsgNwJTsAV7IDcCU7gFNqPXnPxQunaVOnrB9vfsnMJ+H75wCAEgvfawsWVB9r+qIvLd+t1w2eUpKlJnQGXT7e/DaXjOS+PS0TGdOx0jh91gsi8J5jfpuMlNgLbD/jRMZU4ZSS/P9FQrXm9/RkT0bd8fCsk1HtMeHekx2AK9kBuJIdgCvZAbiSHYAr2QG4kh2AK9kBuJIdgCvZAbiSHYAr2QGcVgsUJ5NiTl7jR8l7rOkLivau/fC6K3mCmPX0uv892TGMxikleUCL90+RVXeMNz/li9snMh4XFxcXFxcXFxeX42LMJ1gTLe1RYswhm5fXbencyaYpyDTlRFTMABHAI30+ctuxl2kKginfbF5+vkcoXwBwDgNBYvICrDNjNxe1axtjj+6byH051RlzCEWECwOK1pThvB8AsH37hD3WTAD3Lo40WcQNGSX3AnV19e9eHGmSnvw+euKJg8crmg1DoahpJ1vaFwK0oc4f9CWzA0UC5UGo1oWCvLR9Rb2gTdQ+/K0wtmRJmYwsgW152BnPAMEwRM/OKQIA5s0+KBGNytGksGEoPTuniHmzD0r09RHmzCFavbokBa1q8AVWJHNywZ6Fy3dUebRXc7ZYDeAzMAyBaNQGADZN0bMhrsybfVACQM/OKWLe0ka7ciUOXpV2fOlSPxfph7W615fMpL/PzD+1iCxShLClJEVScVfxQB8AHHkVM0AIhcovY6qp4Uq8NBjDUDrTFDBNHusEHC3N1lBIrRqYQ/NmH5Q9O6eIgapX+SOxmDWWg5FO9iNjRV8fxQAcrawRSbYYf+prWcGJhcZ5QFkWG8aob6U6chsDtGaM9Kmw0cHLbuR4y/LLASDZ3P7jeDgSAQYP1AhlDqdS9h/mrdTK+Zd/NL/0ek6E258+9r0cuw42DIUB4qPc2oDBgz/CZzZNMVp+E6ao7OtodR/2t1HSVuobqZ6jzngxGEB5mvVlQJkbjRYBoHdxpMlSMBssiUndNWNj9C8UjdqVe93QGRiN2omWZbNYas0kuAlARoC31W3s7JbgDDODoKgAUL+p46ZKsOUymChK9l+XLJmi276wBF1IzMSMl3Qls2FaNNrPAL39I5Rqja4oAPhFAIgvXerPWJZ9NoDXB1OcvWBBafhVXG7my1drPNx+BTEWgKgK4B1aiZ6kaHRvZZ92h42zNeB7NnjbjO6Ou4diBbiS5q+txnk64y4wnqTu6H1sGAqZpg0Au1siF6iMKyCoDjYnoFhPNXSZL5vmUGv0dlyDrdNhLoaVlWyOLGCiDxOjngUlWJZ+S5vW9wCACQgTGCrruKY150ajxWTz8vNB6ipJWFrj0QUB2FfIcyLcvlGRdAeZ5gtbQyGVBpuOVEvkNoZYVe/3+yxpQyUBZkYi3P4EAdOLUsK23/nOOgYTgXhvuP0aYdEP63y+mWAgZ1soSom8DO6IhyO3U3dnJ88+SOgBhMDerGUBEJcCoMYNG975bYquLmwNhdSPxGJWRXBqUWS2VOj+KR69VVcUSMkQQiBFmYFEOHIHmeb9AKCAG+r8wWXJXGY6gLsPKzcWEwCkamNGXVXV0mR6QANwH0Wj9isfurpqStBztyaUm6Z4vLClDUVX0FfIIdnS/m8DlPkqmWahItrE4Em1MHKBpoo7JbC2sTv6MEWj9u6wMdVDfJ9f0T4R1Dwo2TYK0kaWUUq2RB7K5e0vnRlb/9bw0I5JsgVVBcpnDwnRVesLTEnm0nv2FwpPg1iCcEW9L9iaymWuTC1uC9dtXvtcOb3xtVqvf1Uqn8mmctnvgPA8M08mwvU1unfJIauErG3Bo1Ch9yqj3pZYDeanqLvjHoCQXNx2dUDV1kswUrnszwj8qAQt8ghxe63uPau3kJsDAOjrkwCwPd/3u3P16c/X+wIXJ8PGowz7J8SUFVJorMIu2cjtp0OvXbhpU6Yi+M3FVzeyEJvq/YGzkrnMs1yUjxBwAKCLiejmep//h4lwZGpDd+e3JJGVLhYAoP/IYxQb/FcILhWKBYCQBspXX/IQHqsNBK9KZdM7kvnsT2DzGyTQBKKb6vxVtyKDegDXkWlKDoVUiplWPByJCBK/rKua7E0NvKUAePi11lZdY+6s9VeFUtn0SwOl4v1MlBLAXfW+wLmpXDqkw36H07E7XgALIggpCuU/iB/Uen1TktnMA0qBvlwbi6aBcrOYymFVne6/NVnIPgDggj3h5RfqiliVzGX227AXntG97sVhRT+UaIl8z69oX2IGbC4V2RaNDYFJS5OZ9CQA9+wKLZsMRfyAAaRL1sdnbOp4bHsoFJzmrfnuVI+O3nzu7vrujn81YYo7Y6YclGbFP9r22SSy6+v9gWsP5LPX2syY5vXiYKkAoQK1XL0z2dz+NYpGHwMAj/CsqvMHzkpm0z9q6O74wrAY18TDbb9K5nOb/ap2Z6p12SMqcEgXAml79HV4W9pCJQKh3DqlDvHn6gOBq1KZ9NaBt9LLmn7fNXSCJFqNn6ay6d/Uef0fT7REuhs2dv6CYjErtSgym0EPVquaN3Xo4CobpdUAEJSBL9b5A6FUJv3EgEhHmjZ1FeLhyBerNc+5qVw2DhaLG2Mb9vG8lRr1rC4dk2QGSIDAbGX2LF72/kke7eJkLvfnZ7px8wqU778AQKaZBXBboqX9iuke7/x4szFPEDdP1n2IZwfMM7rXvfiHeSu1eVWvMmpqBEWjxXx+/9fhnf6xaR7vudmSIoUmSrliAQBnAEDXlYV1uv+9iUL2kRmbOh7j1lY9JQNb6vzBi5LZdEdDd8ftAGCifB8zo9HKfeyPfYuvvqQ3S5+SkGcTSO8t5oPE3E9EMydrnssl49G94ci+rMg+D8Z1qVxm74HCvq8AABuGp9IyUPfaPybCkW9UewL3Z7PWdTnL+s+g6hn7hdhCIUEEBhcAgIn+vr9YgAXr1qbfd/W/1tqqnx0MWq+n02pDV7Rv7+K223K29SxA/wDgFwAgVbqx3hcMJrPpHzds6vj6YFxKqh839OVzKEDe3tTVVYiHIzfV6L579xcLtgT/XeOmjl0AMFzwUSWXRTN0G7blE2d7NR0oFTeuQIfNhuGBaZYqB4ai0SIxNqlCmU8C7wPE3GypCEkY6ulW7tPlJimWT4bb/1sTyrkqbIslSFUIoPIrrgl0HoggwE8AQFIGH6kPBBckMwPP5Av7bgAAbm3V+3JB7ZAvXWrq6iqQaco1hqHURKNxAN8eaX8S4cjn672B+wdKxS/77YA5Rdf1g6VCbG4slt4aCqk02LHkeSs1IAZY1tZsqQgCzpcK1tk88sgpVFPDAKASlRMwlZLNzQEQmnK29cqMavXPAPBI14KSCVOyYQAA3iopLwqluIeYzukNGcHaWDRNTJcVrRIE4+FK+W/0ocbnxWxbylfe2925Pb4oElZJPJCzLRDLaxu7O5/5w7yVWp3noOoVBbXmuceHXpJ9TI//5LwWkVQ8gx8zABDr65MEVMaCg71AkQEYAqyDZUEhgsq2FwB8sw+WhxPDu/gEH7OExVQAq4NHZ2h7EWBIUHU83H5HvT8QSWXTO2whrzszFssDQMoOfkJ6eV+1HWgHymf7imjUXmMYCodCamVIwQBVhkn1+6atTuVzu4hoPgnU52wbzDT0REclvpcH47WFx6MQgQFVEXapIG2AaXIlfawyXk2nVQCQtqwmEgA4kysWbSofG8/LL5eb72+ag/n6+ggAGlQoxKQBEIrPIwaPQDAvbUjiQ5V69Kq8BYYkwE42RxYIVTw8XfciXSz9c113ZycANFYlJmmT+Gkr6Nk63N/xP+PF5SstNMImCQkQgSEtCf6drnkAqG1AuWfOhqH0zFupUixm9YaMeoCu6i3k+wvWwV2S4BleFhO/0F8qQmH6hkeI7/TmMock2yvO6Fq7Z1j0n6rzBnSp0J7heVdEo3al1YBpUnTYxA16VttEKDLgg7T+mpP2biK07ApdVf+RWMzCvJUqG8bQUFER8mpdVUGAIg/1vVmQcrcmxMXxcNsHgbcnIKirqwAAQlA7BAHgP58Zi+UlsH2yps+e+h7rUgDAhriyxjCUyvErCnlltabVMbjQn8sc5qPEcujCaNywYR8Tv6AKMReC1k3z6DW9+ex9jZs7v185gUn3fLTOF5hPhP3DyxlTMgFDjZMc/KUGQTzqfK9gkmCAWfEJHvhVKpvu9ynq7fFw2w0AQNGoPb9ndSkeWjrd1vlndb7AJIL8yZmxWF6R7LOZQYAFAA2XvG9z3rKfrvX6Gi1mq2Rbn27sXvtHoDwOTIQj99R5fZcmc5mNDV3RpwAA0ehhsRHAZJpyxWC9ANAbNq6frHnOAeMvjZvW9xDLh+r8wYBP9/90V2jZZOpZXaqMmxPNbe1E4ssly4YE+Wdu25Zjxs+nen0QpDyYbG27pFLX/tbW6kS4/VuTNf36ZDazj22xAQCI8YBGAoLV1X0txjnUs7pUOQnj4bYPQtC9ChGIYKm6Jt4OHdBIMAC83trqKf+R/10XCiZresO+Qr6rvrvzlspx3dvcfhmR+FF/sQC26bvDj8OY92QJUGUAqwgmEEGOMKNSaXogePDM4+qGTZsyicXt/ygFr6nR/Q8lW9o/CWAbIKYyOFLvD05PZQaeHBDZVQBgK4N5y7MvINOUuxcZX0gVst1TNb1hP+P2ZLj9MkAAxM11vsB5yVx6j2rZXwQOn9QYPEgMAIlw+41EWMzgXjDN0hTRRgRI2PcAgCayd6cy9KG6QNXHUpTengy3r0H5SrgkqHqWWFIiL22Iwf22+nFXkjPz6wP+q94qFLYlW4z/AeNQiXF+vd9fn8plJdv2ysYta98c7Aj+KhGOXF7vD342lcv+KRFu/yUBOxh0LhFumKRqOGSV+0lSzQ7ez1nazIBVlnx2LmcDQP3GzkcTLe2X1ijem4lweTJsPALCm8w8xyOUtqkeD5L53DcaNnc8NdzP0Zpr3SsU+G15jAsTxChfyhIAGjZ3RAulYmh/Ib8toGihWt331ekez2cI8CUzA3enuP+apq7ykIJtYq+igIg9FWkzt0RfKjFdeaBUXOcRYl6t13dLjVe/RQDnpXLpxwDripon1716hGAw3r63EmNZXdXkT/iEdlu15mkrSXlwfz7/ucbutQ+vMQxlWldX/1vp4tWpzMC9YNTUen231Om+b0/3eJcMlIrPZi3r65IZoPJJOHNbNHdgL5anMumv5qX9qkeIi6o0bRGAqlQ2u54ZlzZuXrtueN+jobvzc6lc+jYG+mt17yfrvL7v1Hu9NwC885BVvMNmLjJTo8xo5VU4oslTNA8swtD8tInySKZhY8c/9RUKNwOUnqbr19Xq3q9M8ehtJZavJ/KZGxu6O97R4RxT3t5mY7EQPJm1whNkeQNs8QfA9ErjluibIy0N7m9tO6PE4hyL5F/O6Fq7p3LwGaC94eUXqEJ7j8Uy6xG0vfa/oklgqKdtxUNLp7PXsxg2vzljcDJluLzdiyNNqoImhYXkUum1ut+u33FkmhH3YVHkA0KIswicByhLdmF73ZOPpyrb1wx21sr7e81MQZ4LiBGU0trbuGXds4mFxnnVPm17v1V8smFjx6Lh04/xpUv9XPLOlFbRA+k5MPO30b3A4VOUw/+/Z+HyaaqmvB9ADST1iiKer41F0/Fw5NMQoINB8WB5VrHtWiacYUH5+czu6IEjp04BYMciY1KQ6HwWcjqYk1IvvlSZ4RvvUu1hjDQJPurk/CiT/8Mn5kfLO1b+o20bLU7gnQsGYy0gpFqMS7Mfu46TLcaW4fWOtagwUhyjph9j30f7PNqiz0gLGsBRrmQ2DAV9fUSxmDW0vBULScLIi+0mTPHNUEzcGQtJc1iaytJkZUmsr6aGV5Q7SYc9NIBQSEFNDb9jeW9YfgDl5bUxljYPy2uaArGYiA1+DoVCcqSHBRigqGEIYzDGWZilnhl7MJ9oabvIJ7Tnc7bsbuiOtlTSVq6syhp7FIBxlJjYNEUsFhMhlKdBQ6GQhGlyZdmwMiIYWpLsWW2Nunw7rCzU1DDmzmWnPAThMgL/BxSXo3BCUfX0AAAAAElFTkSuQmCC" />
                                </div>

                                <h3>
                                    <span> Send {currency.formatCurrency(desiredSwap.in.quantity, desiredSwap.in.token)} </span>
                                    <br/>
                                    <span> to {bot.address} </span>
                                </h3>
                            </div>
                            <div dangerouslySetInnerHTML={ {__html: generateQRCode(bot, desiredSwap.in.quantity, desiredSwap.in.token)} } />
                        </div>
                        <div className="qrCodeFooter">
                            Read this QR Code from the <a target="_blank" href="https://wallet.indiesquare.me/">IndieSquare Wallet</a> app.
                        </div>
                        <br />
                        <button type="button" data-remodal-action="confirm" className="remodal-confirm" onClick={hideQRModal}>OK</button>
                    </div>
                </div>
            </div>
        : null}
    </div>
}

// ------------------------------------------------------------------------
function generateQRCode(bot, inQuantity, inToken) {
    let URI = 'counterparty:'+bot.address + 
          '?amount='+currency.formatCurrencyAsNumber(inQuantity) + 
          '&asset='+inToken + 
          '&label='+encodeURIComponent('Swapbot '+bot.name)
    console.log('generateQRCode URI:', URI);

    let qr = qrCode.qrcode(8, 'M');
    qr.addData(URI);
    qr.make();
    return qr.createImgTag(8);
}

// <div className="TKSB_send-payment">
//     <h1>Step 3: Send Payment</h1>
//     <p>Send {currency.formatCurrency(desiredSwap.in.quantity, desiredSwap.in.token)} to {bot.address}</p>
//     <p>This bot will send you {currency.formatCurrency(desiredSwap.out.quantity, desiredSwap.out.token)} in return.</p>
//     <div className="nav">
//         <a onClick={() => { goBack(); }} href="#back">Back</a>
//     </div>
// </div>

export default SendPaymentComponent;