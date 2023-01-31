import 'hammerjs';

const events = {
    DOUBLE_TAP: 'doubletap',
    PRESS: 'press',
    SINGLE_TAP: 'singletap',
    TWO_POINTERS_TAP: 'twopointerstap'
}

const hammerManager = new Hammer.Manager(document);

hammerManager.add( new Hammer.Tap({ event: events.DOUBLE_TAP, taps: 2 }) );

hammerManager.add( new Hammer.Tap({ event: events.TWO_POINTERS, taps: 1, pointers: 2 }) );

hammerManager.add( new Hammer.Tap({ event: events.SINGLE_TAP }) );

hammerManager.add(new Hammer.Press({event: events.PRESS}));

hammerManager.get(events.DOUBLE_TAP).recognizeWith(events.SINGLE_TAP);

hammerManager.get(events.SINGLE_TAP).requireFailure(events.DOUBLE_TAP);


export default {
    listeners: hammerManager,
    events
}
