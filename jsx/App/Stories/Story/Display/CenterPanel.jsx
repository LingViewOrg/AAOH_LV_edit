import { UntimedTextDisplay } from './Untimed.jsx';
import { TimedTextDisplay } from './Timed.jsx';
import { InterviewSearch } from './InterviewSearch.jsx';

export function CenterPanel({ timed, sentences, metadata }) {
    let transcript;

    if (timed) {
        transcript = (
            <TimedTextDisplay
                sentences={sentences}
                metadata={metadata}
            />
        );
    } else {
        transcript = (
            <UntimedTextDisplay
                sentences={sentences}
                metadata={metadata}
            />
        );
    }

    return (
        <div id="centerPanel">
            <InterviewSearch />
            {transcript}
        </div>
    );
}
