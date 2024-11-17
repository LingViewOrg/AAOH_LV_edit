import { SpeakerInfo } from '../Info/SpeakerInfo.jsx';
import { Metadata } from '../Info/Metadata.jsx';
import { MoreMetadata } from '../Info/Metadata.jsx';
import { InterviewDescriptions } from './InterviewDescriptions.json'

export function Descriptions({ metadata }) {
	// I/P: metadata, in JSON format
	// O/P: description from txt file


	
	return (
		<div id="description" className="miniPage active">
			{InterviewDescriptions[metadata["title"]["_default"]]}
		</div>
	);
}

