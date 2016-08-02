const constants = {
    CHOOSE_SWAP_OBJECT:                   'CHOOSE_SWAP_OBJECT',
    SET_POSSIBLE_SWAP_OBJECTS:            'SET_POSSIBLE_SWAP_OBJECTS',
    SET_QUOTES:                           'SET_QUOTES',
    UPDATE_QUOTE:                         'UPDATE_QUOTE',

    UI_GO_TO_STEP:                        'UI_GO_TO_STEP',
    UI_COMPLETE_ENTER_AMOUNT:             'UI_COMPLETE_ENTER_AMOUNT',
    UI_COMPLETE_WALLET_COMFIRMATION_STEP: 'UI_COMPLETE_WALLET_COMFIRMATION_STEP',
    UI_COMPLETE_SEND_PAYMENT_STEP:        'UI_COMPLETE_SEND_PAYMENT_STEP',

    UI_SHOW_QR_MODAL:                     'UI_SHOW_QR_MODAL',
    UI_HIDE_QR_MODAL:                     'UI_HIDE_QR_MODAL',
    UI_SET_NOTIFICATION_EMAIL:            'UI_SET_NOTIFICATION_EMAIL',
    UI_SUBMIT_NOTIFICATION_EMAIL:         'UI_SUBMIT_NOTIFICATION_EMAIL',
    UI_COMPLETE_NOTIFICATION_EMAIL:       'UI_COMPLETE_NOTIFICATION_EMAIL',

    INPUT_SET_OUT_TOKEN_QUANTITY:         'INPUT_SET_OUT_TOKEN_QUANTITY',
    INPUT_SET_OUT_TOKEN:                  'INPUT_SET_OUT_TOKEN',

    INPUT_SET_IN_TOKEN_QUANTITY:          'INPUT_SET_IN_TOKEN_QUANTITY',
    INPUT_SET_IN_TOKEN:                   'INPUT_SET_IN_TOKEN',

    SWAPSTREAM_EVENT:                     'SWAPSTREAM_EVENT',
    SWAPSTREAM_SET_DESIRED_SWAP:          'SWAPSTREAM_SET_DESIRED_SWAP',
    SWAPSTREAM_CLEAR_DESIRED_SWAP:        'SWAPSTREAM_CLEAR_DESIRED_SWAP',
    SWAPSTREAM_TIME_HEARTBEAT:            'SWAPSTREAM_TIME_HEARTBEAT',

    CHOOSE_MY_SWAP:                       'CHOOSE_MY_SWAP',
    IGNORE_SWAP:                          'IGNORE_SWAP',


    // ------------------------------------------------------------------------

    RULE_TYPE_BULK_DISCOUNT:              'bulkDiscount',
    DIRECTION_SELL:                       'sell',
    DIRECTION_BUY:                        'buy',
    SATOSHI:                              100000000,

    EMAIL_STATUS_NONE:                    'none',
    EMAIL_STATUS_SUBMITTING:              'submitting',
    EMAIL_STATUS_SUBMITTED:               'submitted',
    EMAIL_STATUS_ERROR:                   'error',
}

export default constants;
