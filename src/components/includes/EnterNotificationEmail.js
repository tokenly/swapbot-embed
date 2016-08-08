import React                   from 'react'
import { connect }             from 'react-redux';
import pluralize               from 'pluralize'
import actions                 from '../../actions';
import c                       from '../../constants';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const EnterNotificationEmail = ({bot, uiState, swap, setEmail, sendEmail}) => {

    let hasError = (uiState.emailSubmissionError != null && uiState.emailSubmissionError.length > 0);
    let isSubmitted = (uiState.emailSubmissionStatus == c.EMAIL_STATUS_SUBMITTED);
    let formIsActive = (uiState.emailSubmissionStatus == c.EMAIL_STATUS_NONE || uiState.emailSubmissionStatus == c.EMAIL_STATUS_ERROR);
    let formClassName = formIsActive ? '' : 'disabled'

    let completeIfValid = function() {
        if (formIsActive && uiState.isValidEmail) {
            sendEmail(uiState.email, swap.id);
        }
    }

    return <div className="enter-email-notification">
            {!isSubmitted ? /* not submitted yet */ (
                <div className={'enter-email-form '+formClassName}>
                    <h4>Want a confirmation email?</h4>
                    <p>Enter your email address below and receive an email when your swap completes.</p>

                    {hasError ? (
                        <div className="TKSB_error">
                            <span className="TKSB_errorHeader">There was an error</span><br/>
                            <span className="TKSB_errorMessage">{uiState.emailSubmissionError}</span>
                        </div>
                    ) : null}

                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" name="email" value={ uiState.email } onChange={ (e) => setEmail(e.target.value) } placeholder="me@myemailprovider.com" />
                    </div>

                    <div className="enter-email-submit">
                        <button className={ (uiState.isValidEmail && formIsActive) ? 'btn-success' : 'btn-disabled' } onClick={completeIfValid}>Send Email</button>
                    </div>
                </div>
            ) : null}


            {isSubmitted ? /* email was submitted */ (
                <div className="enter-email-form">
                    <h4>Your email address was received</h4>
                    <p>Thanks for using Swapbot, you&rsquo;ll receive an email soon with updates about your order.</p>
                </div>
            ) : null}




        </div>
}

export default EnterNotificationEmail;
