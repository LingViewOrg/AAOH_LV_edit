import { Info } from './Info/Info.jsx';
import { MoreInfo } from './Info/Info.jsx';
import { Settings } from './Settings/Settings.jsx';
import { Descriptions } from './Descriptions/Descriptions.jsx';
import { Features } from './features.jsx';

export function Minibar({ metadata, hasVideo }) {
	// I/P: metadata, in JSON format
	//      hasVideo, a boolean
	// O/P: description and tier checkboxes
	// Status: tested, working
	//console.log(metadata["title"]["_default"]);

	return (
		<div id="minibar">
    		<div id="miniPage">
	    		<Info metadata={metadata} />
				<Features/>
				<Descriptions metadata={metadata} />
				<p></p>
	    		<Settings tiers={metadata['tier IDs']} hasVideo={hasVideo} />
	    		<MoreInfo metadata={metadata} />
				
				
				
	    	</div>
		</div>
	);
}