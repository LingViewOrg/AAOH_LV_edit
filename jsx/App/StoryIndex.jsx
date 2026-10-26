import React from 'react';
// import id from 'shortid';
// import { Link } from 'react-router-dom';
// import ReactDOMServer from 'react-dom/server';
import { TranslatableText } from './locale/TranslatableText.jsx';
import { indexPageTitleHeaderText, indexPageDateHeaderText, indexPageMediaHeaderText } from './locale/LocaleConstants.jsx';

require('datatables.net-dt');
import 'datatables.net-dt/css/jquery.dataTables.css';

export class StoryIndex extends React.Component {

    async componentDidMount() {
        const index = (await import('~./data/index.json')).default;
        let storyList = [];
        for (const story in index) {
            if (index.hasOwnProperty(story)) {
                /////////
                // Title
                /////////
                let mainTitle = index[story]['title']['con-Latn-EC'];
                if (index[story]['title']['_default'] != '') {
                    mainTitle = index[story]['title']['_default'];
                }

                const titleAndDate = mainTitle.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
                const displayTitle = titleAndDate ? titleAndDate[1] : mainTitle;
                const displayDate = titleAndDate ? titleAndDate[2] : '';

                let timed = '';
                if (index[story]['timed']) {
                    if (index[story]['media']['audio'] != '') {
                        timed += '🎧 &nbsp;&nbsp;'
                    }
                    if (index[story]['media']['video'] != '') {
                        const videoUrl = String(index[story]['media']['video']).trim();
                        if (videoUrl.indexOf('http') === 0) {
                            timed += `<a href="${videoUrl}" target="_blank" rel="noopener noreferrer">🎞</a> &nbsp;&nbsp;`;
                        } else {
                            timed += '🎞 &nbsp;&nbsp;';
                        }
                    }
                } else {
                    timed = '✘';
                }
                // React Router link:
                const link = `<a href='#/story/${index[story]['story ID']}'>${displayTitle}</a>`;
                const dateParts = displayDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
                const dateSort = dateParts
                    ? dateParts[3] + '-' + ('0' + dateParts[1]).slice(-2) + '-' + ('0' + dateParts[2]).slice(-2)
                    : displayDate;

                storyList.push({
                    title: link,
                    date: displayDate,
                    dateSort: dateSort,
                    media: timed
                });
            }
        }

        $(document).ready(function() {
            $('#indexTable').DataTable( {
                data: storyList,
                columns: [
                    { data: 'title' },
                    {
                        data: 'date',
                        render: function (data, type, row) {
                            if (type === 'sort' || type === 'type') {
                                return row.dateSort;
                            }
                            return data;
                        }
                    },
                    { data: 'media' }
                ],
                scrollY: '75vh',
                scrollCollapse: true,
                paging: false
            });
        });
        $('#indexTable').addClass("stripe");
    }

    render() {
        return (
            <div id="index">
                <table id="indexTable">
                  <thead>
                    <tr>
                        <th><TranslatableText dictionary={indexPageTitleHeaderText} /></th>
                        <th><TranslatableText dictionary={indexPageDateHeaderText} /></th>
                        <th><TranslatableText dictionary={indexPageMediaHeaderText} /></th>
                    </tr>
                  </thead>
                </table>
            </div>
        );
    }
}
