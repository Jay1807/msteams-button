import xapi from 'xapi';

let meetingId = '';
let passcode = '';

function promptForMeetingPasscode() {
    xapi.command('UserInterface Message TextInput Display', {
        FeedbackId: 'microsoft_teams_passcode',
        Title: "Microsoft Teams Meeting Passcode",
        Text: 'Enter case sensitive passcode:',
        InputType: 'SingleLine',
        Placeholder: 'Passcode',
        SubmitText: 'Join',
    });
}

function promptForMeetingID() {
    xapi.command('UserInterface Message TextInput Display', {
        FeedbackId: 'microsoft_teams_meeting_id',
        Title: "Join Microsoft Teams Meeting",
        Text: 'Enter the Microsoft Teams Meeting ID:',
        InputType: 'Numeric',
        Placeholder: 'Meeting ID',
        SubmitText: 'Next',
    });
}

xapi.event.on('UserInterface Extensions Panel Clicked', (event) => {
    if (event.PanelId === 'microsoft_teams') {
        promptForMeetingID();
    }
});

xapi.event.on('UserInterface Message TextInput Response', (event) => {
    if (event.FeedbackId === 'microsoft_teams_meeting_id') {
        meetingId = event.Text.trim();
        promptForMeetingPasscode();
    } else if (event.FeedbackId === 'microsoft_teams_passcode') {
        passcode = event.Text.trim();
        const dialString = passcode ? `sips:1&${meetingId}&${passcode}&ww.nyp@m.webex.com` : `sips:1&${meetingId}&ww.nyp@m.webex.com`;
        xapi.command('Dial', { Number: dialString });
    }
});
