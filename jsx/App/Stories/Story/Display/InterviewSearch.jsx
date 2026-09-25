import React from 'react';

export class InterviewSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            query: '',
            matches: [],
            currentMatch: -1
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.nextMatch = this.nextMatch.bind(this);
        this.previousMatch = this.previousMatch.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
    }

    componentWillUnmount() {
        this.removeHighlights();
    }

    getTranscriptBlocks() {
        const panel = document.getElementById('centerPanel');

        if (!panel) {
            return [];
        }

        return Array.from(
            panel.querySelectorAll('.labeledTimeBlock, .untimedBlock')
        );
    }

    removeHighlights() {
        const blocks = this.getTranscriptBlocks();

        blocks.forEach(block => {
            block.classList.remove('interviewSearchMatch');
            block.classList.remove('interviewSearchCurrent');
        });
    }

    runSearch(query) {
        this.removeHighlights();

        const normalizedQuery = query.trim().toLocaleLowerCase();

        if (!normalizedQuery) {
            this.setState({
                query: query,
                matches: [],
                currentMatch: -1
            });

            return;
        }

        const blocks = this.getTranscriptBlocks();

        const matches = blocks.filter(block => {
            const blockText = block.textContent.toLocaleLowerCase();
            return blockText.indexOf(normalizedQuery) !== -1;
        });

        matches.forEach(block => {
            block.classList.add('interviewSearchMatch');
        });

        this.setState(
            {
                query: query,
                matches: matches,
                currentMatch: matches.length > 0 ? 0 : -1
            },
            () => {
                if (matches.length > 0) {
                    this.selectMatch(0);
                }
            }
        );
    }

    handleChange(event) {
        this.runSearch(event.target.value);
    }

    selectMatch(index) {
        const matches = this.state.matches;

        if (matches.length === 0) {
            return;
        }

        matches.forEach(block => {
            block.classList.remove('interviewSearchCurrent');
        });

        const selectedBlock = matches[index];

        selectedBlock.classList.add('interviewSearchCurrent');

        selectedBlock.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }

    nextMatch() {
        const matches = this.state.matches;

        if (matches.length === 0) {
            return;
        }

        const nextIndex =
            (this.state.currentMatch + 1) % matches.length;

        this.setState(
            { currentMatch: nextIndex },
            () => this.selectMatch(nextIndex)
        );
    }

    previousMatch() {
        const matches = this.state.matches;

        if (matches.length === 0) {
            return;
        }

        const previousIndex =
            (this.state.currentMatch - 1 + matches.length) %
            matches.length;

        this.setState(
            { currentMatch: previousIndex },
            () => this.selectMatch(previousIndex)
        );
    }

    clearSearch() {
        this.removeHighlights();

        this.setState({
            query: '',
            matches: [],
            currentMatch: -1
        });
    }

    renderResultCount() {
        const query = this.state.query.trim();
        const matches = this.state.matches;
        const currentMatch = this.state.currentMatch;

        if (!query) {
            return null;
        }

        if (matches.length === 0) {
            return <span className="interviewSearchCount">No matches</span>;
        }

        return (
            <span className="interviewSearchCount">
                {currentMatch + 1} of {matches.length}
            </span>
        );
    }

    render() {
        const noMatches = this.state.matches.length === 0;

        return (
            <div className="interviewSearch">
                <label
                    className="interviewSearchLabel"
                    htmlFor="interviewSearchInput"
                >
                    Search
                </label>

                <input
                    id="interviewSearchInput"
                    className="interviewSearchInput"
                    type="search"
                    value={this.state.query}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                    placeholder=""
                    autoComplete="off"
                />

                <button
                    type="button"
                    onClick={this.previousMatch}
                    disabled={noMatches}
                    title="Previous"
                >
                    Previous
                </button>

                <button
                    type="button"
                    onClick={this.nextMatch}
                    disabled={noMatches}
                    title="Next"
                >
                    Next
                </button>

                {this.renderResultCount()}
            </div>
        );
    }
}